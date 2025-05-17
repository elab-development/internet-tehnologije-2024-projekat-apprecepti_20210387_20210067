import { useEffect, useState } from 'react';
import axios from 'axios';

const IngredientAdmin = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState('');
  const token = sessionStorage.getItem('token');

  const fetchIngredients = async () => {
    try {
      const res = await axios.get('/ingredients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(res.data.data || res.data);
    } catch {
      alert('Greška pri učitavanju sastojaka.');
    }
  };

  const addIngredient = async () => {
    if (!newName.trim()) return;
    try {
      await axios.post('/ingredients', { naziv: newName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewName('');
      fetchIngredients();
    } catch {
      alert('Greška pri dodavanju sastojka.');
    }
  };

  const updateIngredient = async (id, naziv) => {
    const newNaziv = prompt('Novi naziv sastojka:', naziv);
    if (!newNaziv || newNaziv === naziv) return;
    try {
      await axios.put(`/ingredients/${id}`, { naziv: newNaziv }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIngredients();
    } catch {
      alert('Greška pri izmeni sastojka.');
    }
  };

  const deleteIngredient = async (id) => {
    if (!window.confirm('Da li želiš da obrišeš ovaj sastojak?')) return;
    try {
      await axios.delete(`/ingredients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIngredients();
    } catch {
      alert('Greška pri brisanju sastojka.');
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div>
      <h3>Sastojci</h3>
      <ul>
        {ingredients.map(ing => (
          <li key={ing.id}>
            {ing.naziv}
            <button onClick={() => updateIngredient(ing.id, ing.naziv)}>Izmeni</button>
            <button onClick={() => deleteIngredient(ing.id)}>Obriši</button>
          </li>
        ))}
      </ul>
      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Novi sastojak"
      />
      <button onClick={addIngredient}>Dodaj</button>
    </div>
  );
};

export default IngredientAdmin;
