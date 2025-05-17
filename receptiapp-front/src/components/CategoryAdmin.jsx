import { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
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

  const updateCategory = async (id, naziv) => {
    const newNaziv = prompt('Novi naziv:', naziv);
    if (!newNaziv || newNaziv === naziv) return;
    await axios.put(`/categories/${id}`, { naziv: newNaziv }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Obrisati kategoriju?')) return;
    await axios.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h3>Kategorije</h3>
      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.naziv}
            <button onClick={() => updateCategory(c.id, c.naziv)}>Izmeni</button>
            <button onClick={() => deleteCategory(c.id)}>Obriši</button>
          </li>
        ))}
      </ul>
      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nova kategorija" />
      <button onClick={addCategory}>Dodaj</button>
    </div>
  );
};

export default CategoryAdmin;
