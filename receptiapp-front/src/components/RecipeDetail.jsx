import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const RecipeDetail = ({ user }) => {
  const { id } = useParams();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('token');

  //Ucitavanje odredjenog recepta iz baze
  const fetchRecipe = () => {
    axios.get(`/recipes/${id}`)
      .then(res => {
        const data = res.data.recipes || res.data;
        setRecipe(data);
      })
      .catch(() => setError('Greška pri učitavanju recepta.'));
  };

  //Provera da li je recept u omiljenim
  const checkIfFavorited = () => {
    //Korisnik nije prijavljen
    if (!token) {
      setIsFavorited(false);
      return;
    }

    //Vraca da li je korisnik vec smestio recept u omiljene
    axios.get(`/recipes/${id}/is-favorited`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setIsFavorited(res.data.is_favorited);
    })
    .catch(() => {
      setIsFavorited(false);
    });
  };

  useEffect(() => {
    fetchRecipe();

    if (location.state?.isFavorited) {
      setIsFavorited(true); // došao iz FavoriteRecipes
    } else {
      checkIfFavorited(); // standardna provera
    }
  }, [id]);

  //Dodavanje recepta u omiljene
  const handleFavorite = async () => {
    try {
      await axios.post(`/recipes/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorited(true); // odmah ažuriraj lokalno stanje
    } catch {
      alert('Greška pri dodavanju u omiljene');
    }
  };

  //Uklanjanje recepta iz omiljenih
  const handleUnfavorite = async () => {
    try {
      await axios.delete(`/recipes/${id}/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorited(false); // odmah ažuriraj lokalno stanje
    } catch {
      alert('Greška pri uklanjanju iz omiljenih');
    }
  };

  //Funkcija za ocenjivanje recepta
  const handleRating = async () => {
    try {
      await axios.post(`/recipes/${id}/rate`, { ocena: rating }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Ocena uspešno poslata.');
      fetchRecipe();
    } catch {
      alert('Greška pri ocenjivanju.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Učitavanje...</p>;

  return (
    <div className="recipe-detail">
      <h2>{recipe.naziv}</h2>
      <p>{recipe.opis}</p>
      <p><strong>Težina:</strong> {recipe.tezina}</p>
      <p><strong>Vreme pripreme:</strong> {recipe.vreme_pripreme}</p>

      <h4>Sastojci</h4>
      <ul>
        {recipe.sastojci?.map((ing, i) => (
          <li key={i}>
            {ing.naziv} – {ing.kolicina} {ing.mera}
          </li>
        ))}
      </ul>

      <h4>Kategorije</h4>
      <ul>
        {recipe.kategorije?.map((cat, i) => (
          <li key={i}>{cat.naziv}</li>
        ))}
      </ul>

      <p><strong>Prosečna ocena:</strong> {recipe.prosecna_ocena || 'N/A'}</p>
      <p><strong>Omiljen kod:</strong> {recipe.omiljeno_korisnicima || 0} korisnika</p>

      {user && (
        <>
          <hr />
          <h4>Akcije</h4>

          {isFavorited ? (
            <button onClick={handleUnfavorite}>Ukloni iz omiljenih</button>
          ) : (
            <button onClick={handleFavorite}>Dodaj u omiljene</button>
          )}

          <div>
            <label>Ocenite recept (1–5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating || ''}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <button onClick={handleRating}>Pošalji ocenu</button>
          </div>

          <CommentForm
            recipeId={recipe.id}
            token={token}
            onCommentAdded={fetchRecipe}
          />
        </>
      )}

      <hr />
      <CommentList
        comments={recipe.komentari}
        user={user}
        onRefresh={fetchRecipe}
        recipeId={recipe.id}
      />
    </div>
  );
};

export default RecipeDetail;



