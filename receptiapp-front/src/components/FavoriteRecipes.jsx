import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';

const FavoriteRecipes = () => {
  //promenljiva koja cuva omiljeni recept
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/user/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data || [];
        setFavorites(data);
      } catch {
        setError('Greška pri dohvatanju omiljenih recepata.');
      }
    };

    fetchFavorites();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="favorites">
      <h2>Omiljeni recepti</h2>

      {favorites.length === 0 ? (
        <p>Nemate nijedan omiljeni recept.</p>
      ) : (
        <div className="recipe-list">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} isFavorited={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteRecipes;
