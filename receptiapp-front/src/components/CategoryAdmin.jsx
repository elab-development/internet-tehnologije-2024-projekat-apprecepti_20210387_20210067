import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';


const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const token = sessionStorage.getItem('token');

  const fetchCategories = async () => {
    const res = await axios.get('/categories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data.data || res.data);
  };

  const addCategory = async () => {
    if (!newName.trim()) return;
    await axios.post('/categories', { naziv: newName }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewName('');
    fetchCategories();
  };

  const openEditDialog = (id, naziv) => {
    setSelectedCategoryId(id);
    setEditName(naziv);
    setShowEditDialog(true);
  };

  const updateCategory = async () => {
    if (!editName.trim()) return;
    await axios.put(`/categories/${selectedCategoryId}`, { naziv: editName }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowEditDialog(false);
    setEditName('');
    setSelectedCategoryId(null);
    fetchCategories();
  };

  const confirmDelete = (id) => {
    setSelectedCategoryId(id);
    setShowConfirm(true);
  };

  const deleteCategory = async () => {
    await axios.delete(`/categories/${selectedCategoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowConfirm(false);
    setSelectedCategoryId(null);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-admin-container">
      <div className="category-admin-header">
        <h3>Kategorije</h3>
      </div>
        <div className="add-category">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nova kategorija"
          />
          <button className="add" onClick={addCategory}>Dodaj</button>
        </div>
      <ul className="category-list">
        {categories.map(c => (
          <li key={c.id} className="category-item">
            <span>{c.naziv}</span>
            <div className="button-group">
              <button className="edit" onClick={() => openEditDialog(c.id, c.naziv)}>Izmeni</button>
              <button className="delete" onClick={() => confirmDelete(c.id)}>Obriši</button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={deleteCategory}
        message="Da li ste sigurni da želite da obrišete kategoriju?"
      />

      {/* Modal za izmenu naziva */}
      {showEditDialog && (
        <div className="edit-overlay">
          <div className="edit-box">
            <h4>Izmeni kategoriju</h4>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Novi naziv"
            />
            <div className="edit-actions">
              <button className="save" onClick={updateCategory}>Sačuvaj</button>
              <button className="cancel" onClick={() => setShowEditDialog(false)}>Otkaži</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAdmin;
