import { useEffect, useState } from 'react';
import axios from "axios";
import RecipeCard from './RecipeCard';
import AllRecipes from './AllRecipes';
import CookingTip from './CookingTip';

const Home = () => {
  const [popularRecipes, setPopularRecipes] = useState([]);

  useEffect(() => {
    axios.get('/recipes/popular')
      .then(res => setPopularRecipes(res.data.data || []))
      .catch(() => console.error('Greška pri dohvatanju popularnih recepata'));
  }, []);

  return (
    <div className="home-container">
      <CookingTip />
      
      <section className="popular-recipes-section">
        <h2 className='popular-recipes-title'>Popularni recepti</h2>
        <div className="popular-recipe-list">
          {popularRecipes.length === 0
            ? <p>Nema popularnih recepata.</p>
            : popularRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
      </section>

      <section>
        <AllRecipes />
      </section>
    </div>
  );
};

export default Home;
