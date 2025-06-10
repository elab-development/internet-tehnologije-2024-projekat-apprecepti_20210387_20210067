import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';
import { Link } from 'react-router-dom';

const RecipeAdmin = () => {
  const [recipes, setRecipes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const token = sessionStorage.getItem('token');

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('/admin/recipes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data.data || res.data);
    } catch {
      alert('Greška pri dohvatanju recepata.');
    }
  };

  const confirmDelete = (id) => {
    setSelectedRecipeId(id);
    setShowConfirm(true);
  };

  const deleteRecipe = async () => {
    try {
      await axios.delete(`/recipes/${selectedRecipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowConfirm(false);
      setSelectedRecipeId(null);
      fetchRecipes();
    } catch {
      alert('Greška pri brisanju recepta.');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="recipe-admin-container">
      <h3>Svi recepti</h3>

      {recipes.length === 0 ? (
        <p>Nema recepata za prikaz.</p>
      ) : (
        <div className="table-wrapper">
          <table className="recipe-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Naziv</th>
                <th>Autor</th>
                <th>Vreme pripreme</th>
                <th>Težina</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>
                  <td>
                    <Link className="recipe-link" to={`/recipes/${r.id}`}>
                      {r.naziv}
                    </Link>
                  </td>
                  </td>
                  <td>{r.autor?.name || 'Nepoznat'}</td>
                  <td>{r.vreme_pripreme}</td>
                  <td>{r.tezina}</td>
                  <td>
                    <button className="delete-btn" onClick={() => confirmDelete(r.id)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={deleteRecipe}
        message="Da li ste sigurni da želite da obrišete recept?"
      />
    </div>
  );
};

export default RecipeAdmin;
