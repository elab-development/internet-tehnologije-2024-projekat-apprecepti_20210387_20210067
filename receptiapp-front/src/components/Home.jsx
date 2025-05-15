import { useEffect, useState } from 'react';
import axios from "axios";
import RecipeCard from './RecipeCard';
import AllRecipes from './AllRecipes';

const Home = () => {
  const [popularRecipes, setPopularRecipes] = useState([]);
  //useEffect se poziva kada se komponenta renderuje
  useEffect(() => {
    // Poziv za popularne recepte
    axios.get('/recipes/popular')
      .then(res => setPopularRecipes(res.data.data || []))
      .catch(() => console.error('Greška pri dohvatanju popularnih recepata'));


  }, []);

  return (
    <div className="home-container">
      <section>
        <h2>Popularni recepti</h2>
        <div className="recipe-list">
          {popularRecipes.length === 0
            ? <p>Nema popularnih recepata.</p>
            : popularRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
      </section>

      <hr />

      <section>
      <AllRecipes />
      </section>
    </div>
  );
};

export default Home;
