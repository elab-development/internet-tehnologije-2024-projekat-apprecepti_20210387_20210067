import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('query');

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      axios.get(`/recipes/search?query=${encodeURIComponent(searchQuery)}`)
        .then(response => {
          setRecipes(response.data.data || []);
        })
        .catch(error => {
          console.error("Greška prilikom pretrage:", error);
        });
    }
  }, [searchQuery]);

  return (
    <div className="search-results-page">
      <h2>Rezultati pretrage za: "{searchQuery}"</h2>

      {recipes.length === 0 ? (
        <p>Nema pronađenih recepata.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
