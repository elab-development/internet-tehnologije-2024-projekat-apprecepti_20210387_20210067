import { useEffect, useState } from 'react';
import axios from "axios";
import RecipeCard from './RecipeCard';
import usePagination from '../hooks/usePagination';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // PAGINACIJA+HOOK
  const {
    currentPage, setCurrentPage, lastPage, setLastPage, nextPage, prevPage
  } = usePagination();

  useEffect(() => {
    // Učitaj kategorije i sastojke
    axios.get('/categories')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setAllCategories(data || []);
      });

    axios.get('/ingredients')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setAllIngredients(data || []);
      });
  }, []);

  // Poziv na promenu filtera ili strane
  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, selectedIngredients, currentPage]);

  const fetchRecipes = async () => {
    try {
      let url = `/recipes?page=${currentPage}`;

      const hasIngredients = selectedIngredients.length > 0;
      const hasCategory = selectedCategory !== '';

      // Ako postoji filtriranje, koristi odgovarajući URL
      if (hasIngredients && hasCategory) {
        const ingredientQuery = selectedIngredients.map(i => `ingredients[]=${i}`).join('&');
        url = `/recipes/filter?category=${selectedCategory}&${ingredientQuery}&page=${currentPage}`;
      } else if (hasIngredients) {
        const ingredientQuery = selectedIngredients.map(i => `ingredients[]=${i}`).join('&');
        url = `/recipes/filter-by-ingredients?${ingredientQuery}&page=${currentPage}`;
      } else if (hasCategory) {
        url = `/categories/${selectedCategory}/recipes?page=${currentPage}`;
      }

      const res = await axios.get(url);
      let data = res.data;

      // Ako API vrati objekat koji ima .data (Laravel paginator)
      if (data && Array.isArray(data.data)) {
        setRecipes(data.data);
        setLastPage(data.meta?.last_page || 1);
      }
      // Ako backend vrati npr. { recepti: [...] }
      else if (data && Array.isArray(data.recepti)) {
        setRecipes(data.recepti);
        setLastPage(1);
      }
      // Ako backend odmah vrati niz
      else if (Array.isArray(data)) {
        setRecipes(data);
        setLastPage(1);
      }
      // Ako ništa od ovoga ne važi
      else {
        console.error('Nepoznat format odgovora za recepte:', data);
        setRecipes([]);
        setLastPage(1);
      }
    } catch {
      console.error('Greška pri dohvatanju recepata');
    }
  };

  const handleIngredientToggle = (id) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    setCurrentPage(1); // reset na prvu stranicu kad filtriraš
  };

  return (
    <div className="all-recipes">
      <h2>Svi recepti</h2>

      {/* FILTERI */}
      <div className="filters">
        <div>
          <label>Kategorija:</label>
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // reset paginacije
            }}
          >
            <option value="">Sve</option>
            {allCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.naziv}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Sastojci:</label>
          <div className="ingredients-list">
            {allIngredients.map(ing => (
              <label key={ing.id}>
                <input
                  type="checkbox"
                  value={ing.id}
                  checked={selectedIngredients.includes(ing.id)}
                  onChange={() => handleIngredientToggle(ing.id)}
                />
                {ing.naziv}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* PRIKAZ RECEPATA */}
      <div className="recipe-list">
        {recipes.length === 0 ? (
          <p>Nema recepata za prikaz.</p>
        ) : (
          recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </div>

      {/* PAGINACIJA */}
      {lastPage > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prethodna
          </button>

          <span style={{ margin: '0 10px' }}>
            Strana {currentPage} od {lastPage}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
            disabled={currentPage === lastPage}
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  );
};

export default AllRecipes;


