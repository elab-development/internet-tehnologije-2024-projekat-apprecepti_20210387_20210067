import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';


const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);


  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      setError('Morate biti prijavljeni.');
      return;
    }

    axios.get(`/users/${user.id}/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setRecipes(res.data))
      .catch(() => setError('Greška pri dohvatanju vaših recepata.'));
  }, []);

  const handleDelete = (id) => {
    setSelectedRecipeId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/recipes/${selectedRecipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(prev => prev.filter(r => r.id !== selectedRecipeId));
    } catch {
      alert('Greška pri brisanju recepta.');
    }
    setShowConfirm(false);
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
   <div className="my-recipes-container">
  <h2 className="section-title">Moji recepti</h2>

  <div className="recipes-content">
    {recipes.length === 0 ? (
      <p className="no-recipes-message">Nemate još nijedan recept.</p>
    ) : (
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card2">
            <h3 className="recipe-title">{recipe.naziv}</h3>
            <p><strong>Vreme pripreme:</strong> {recipe.vreme_pripreme} min</p>
            <p><strong>Težina:</strong> {recipe.tezina}</p>
            <p><strong>Opis:</strong> {recipe.opis}</p>

            <div className="recipe-actions">
              <button className="action-btn orange-btn" onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>Izmeni</button>
              <button className="action-btn red-btn" onClick={() => handleDelete(recipe.id)}>Obriši</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  <ConfirmDialog
  show={showConfirm}
  message="Da li ste sigurni da želite da obrišete recept?"
  onClose={() => setShowConfirm(false)}
  onConfirm={confirmDelete}
/>

</div>

  );
};

export default MyRecipes;
