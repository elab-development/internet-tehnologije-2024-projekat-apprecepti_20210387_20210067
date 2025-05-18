import { useEffect, useState } from 'react';
import axios from 'axios';

const RecipeAdmin = () => {
  const [recipes, setRecipes] = useState([]);
  const token = sessionStorage.getItem('token');

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('/recipes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data.data || res.data);
    } catch {
      alert('Greška pri dohvatanju recepata.');
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm('Da li želiš da obrišeš ovaj recept?')) return;
    try {
      await axios.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecipes();
    } catch {
      alert('Greška pri brisanju recepta.');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h3>Svi recepti</h3>
      {recipes.length === 0 ? (
        <p>Nema recepata za prikaz.</p>
      ) : (
        <table border="1" cellPadding={6}>
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
                <td>{r.naziv}</td>
                <td>{r.autor?.name || 'Nepoznat'}</td>
                <td>{r.vreme_pripreme}</td>
                <td>{r.tezina}</td>
                <td>
                  <button onClick={() => deleteRecipe(r.id)}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecipeAdmin;
