import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';


const IngredientAdmin = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('');
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

  const openEditDialog = (id, naziv) => {
    setSelectedIngredientId(id);
    setEditName(naziv);
    setShowEditDialog(true);
  };

  const updateIngredient = async () => {
    if (!editName.trim()) return;
    try {
      await axios.put(`/ingredients/${selectedIngredientId}`, { naziv: editName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditDialog(false);
      setEditName('');
      setSelectedIngredientId(null);
      fetchIngredients();
    } catch {
      alert('Greška pri izmeni sastojka.');
    }
  };

  const confirmDelete = (id) => {
    setSelectedIngredientId(id);
    setShowConfirm(true);
  };

  const deleteIngredient = async () => {
    try {
      await axios.delete(`/ingredients/${selectedIngredientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowConfirm(false);
      setSelectedIngredientId(null);
      fetchIngredients();
    } catch {
      alert('Greška pri brisanju sastojka.');
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="ingredient-admin-container">
      <div className="ingredient-admin-header">
        <h3>Sastojci</h3>
      </div>

      <ul className="ingredient-list">
        {ingredients.map(ing => (
          <li key={ing.id} className="ingredient-item">
            <span>{ing.naziv}</span>
            <div className="button-group">
              <button className="edit" onClick={() => openEditDialog(ing.id, ing.naziv)}>Izmeni</button>
              <button className="delete" onClick={() => confirmDelete(ing.id)}>Obriši</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="add-ingredient">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Novi sastojak"
        />
        <button className="add" onClick={addIngredient}>Dodaj</button>
      </div>

      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={deleteIngredient}
        message="Da li ste sigurni da želite da obrišete sastojak?"
      />

      {showEditDialog && (
        <div className="edit-overlay">
          <div className="edit-box">
            <h4>Izmeni sastojak</h4>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Novi naziv"
            />
            <div className="edit-actions">
              <button className="save" onClick={updateIngredient}>Sačuvaj</button>
              <button className="cancel" onClick={() => setShowEditDialog(false)}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientAdmin;

