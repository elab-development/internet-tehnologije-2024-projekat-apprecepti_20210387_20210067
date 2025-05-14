import { useEffect, useState } from 'react';
import axios from "axios";
import RecipeCard from './RecipeCard';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // ✅ Učitaj sve kategorije i sastojke samo jednom kad se komponenta učita
  useEffect(() => {
    // Kategorije
    axios.get('/categories')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        console.log('Kategorije:', data);
        setAllCategories(data || []);
      })
      .catch(() => console.error('Greška pri dohvatanju kategorija'));

    // Sastojci
    axios.get('/ingredients')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setAllIngredients(data || []);
      })
      .catch(() => console.error('Greška pri dohvatanju sastojaka'));
  }, []);

  // ✅ Funkcija za učitavanje recepata (po potrebi filtrirano)
  const fetchRecipes = async () => {
    try {
      let url = '/recipes';
  
      const hasIngredients = selectedIngredients.length > 0;
      const hasCategory = selectedCategory !== '';
  
      // Kombinovano filtriranje
      if (hasIngredients && hasCategory) {
        const ingredientQuery = selectedIngredients.map(i => `ingredients[]=${i}`).join('&');
        url = `/recipes/filter?category=${selectedCategory}&${ingredientQuery}`;
      }
  
      // Samo sastojci
      else if (hasIngredients) {
        const query = selectedIngredients.map(i => `ingredients[]=${i}`).join('&');
        url = `/recipes/filter-by-ingredients?${query}`;
      }
  
      // Samo kategorija
      else if (hasCategory) {
        url = `/categories/${selectedCategory}/recipes`;
      }
  
      const res = await axios.get(url);
  
      // Obradi različite formate odgovora
      let data;
      if (url.includes('/categories/') && url.includes('/recipes')) {
        data = res.data.recepti || [];
      } else {
        data = Array.isArray(res.data) ? res.data : res.data.data;
      }
  
      setRecipes(data || []);
    } catch {
      console.error('Greška pri dohvatanju recepata');
    }
  };
  

  // ✅ Pozovi `fetchRecipes` svaki put kad korisnik izmeni filter
  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, selectedIngredients]);

  // ✅ Dodaj/ukloni sastojak iz liste izabranih
  const handleIngredientToggle = (id) => {
    setSelectedIngredients(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
            onChange={e => setSelectedCategory(e.target.value)}
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
    </div>
  );
};

export default AllRecipes;

