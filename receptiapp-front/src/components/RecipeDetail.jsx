import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Clock, Heart, Dumbbell } from 'lucide-react';

const RecipeDetail = ({ user }) => {
  const { id } = useParams();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchRecipe();
    if (location.state?.isFavorited) {
      setIsFavorited(true);
    } else {
      checkIfFavorited();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data } = await axios.get(`/recipes/${id}`);
      setRecipe(data.recipes ?? data);
    } catch {
      setError('Greška pri učitavanju recepta.');
    }
  };

  const checkIfFavorited = async () => {
    if (!token) return setIsFavorited(false);
    try {
      const { data } = await axios.get(`/recipes/${id}/is-favorited`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorited(data.is_favorited);
    } catch {
      setIsFavorited(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await axios.post(`/recipes/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorited(true);
    } catch {
      alert('Greška pri dodavanju u omiljene');
    }
  };

  const handleUnfavorite = async () => {
    try {
      await axios.delete(`/recipes/${id}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorited(false);
    } catch {
      alert('Greška pri uklanjanju iz omiljenih');
    }
  };

  const handleRating = async () => {
    if (!rating || rating < 1 || rating > 5) return;
    try {
      await axios.post(`/recipes/${id}/rate`, { ocena: rating }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchRecipe();
    } catch {
      alert('Greška pri ocenjivanju.');
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p className="loading">Učitavanje…</p>;

  return (
    <div className="recipe-wrapper">
      <div className="recipe-header">
        <h1 className="recipe-title">{recipe.naziv}</h1>
        <div className="recipe-tags">
          {recipe.kategorije?.map((cat, i) => (
            <span key={i} className="tag">{cat.naziv}</span>
          ))}
        </div>
      </div>

      <div className="recipe-image-box">
        <img src={recipe.image} alt={recipe.naziv} className="recipe-image" />
      </div>

      <div className="recipe-info-pillbox">
        <span className="pill"><Dumbbell size={16} /> {recipe.tezina}</span>
        <span className="pill"><Clock size={16} /> {recipe.vreme_pripreme}</span>
        <span className="pill"><Heart size={16} color="#e60023" /> {recipe.omiljeno_korisnicima || 0}</span>
      </div>
      <div className="recipe-description-box">
        <p className="recipe-description">{recipe.opis}</p>
      </div>

      <div className="recipe-ingredients-box">
        <h2>Sastojci</h2>
        <ul>
          {recipe.sastojci?.map((ing, i) => (
            <li key={i}><span className="ingredient-name">{ing.naziv}</span> - {ing.kolicina} {ing.mera}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-rating-box">
        <div className="stars-display">Prosečna ocena: {recipe.prosecna_ocena || 'N/A'}</div>
        <div className="stars-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => setRating(star)} className={star <= rating ? 'star active' : 'star'}>
              &#9733;
            </span>
          ))}
          <button onClick={handleRating}>Pošalji ocenu</button>
        </div>
      </div>

      {user && (
        <div className="recipe-actions">
          {isFavorited ? (
            <button className="btn-unfavorite" onClick={handleUnfavorite}>Ukloni iz omiljenih</button>
          ) : (
            <button className="btn-favorite" onClick={handleFavorite}>Dodaj u omiljene</button>
          )}
        </div>
      )}

      <div className="recipe-comments">
        <CommentForm recipeId={recipe.id} token={token} onCommentAdded={fetchRecipe} />
        <br />
        <br />
        <br />
        <CommentList comments={recipe.komentari} user={user} onRefresh={fetchRecipe} recipeId={recipe.id} />
      </div>
    </div>
  );
};

export default RecipeDetail;




