import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDialog from './ConfirmDialog';

const CommentAdmin = () => {
  const [comments, setComments] = useState([]);
  // Dodajemo state za prikaz dijaloga i koji komentar brišemo
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const token = sessionStorage.getItem('token');

  const fetchComments = async () => {
    try {
      const res = await axios.get('/comments-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data || []);
    } catch {
      alert('Greška pri učitavanju komentara.');
    }
  };

  const handleDeleteClick = (id) => {
    setCommentToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/comments/${commentToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
    } catch (err) {
      console.error(err.response?.data);
      alert('Greška pri brisanju komentara.');
    }
    setShowConfirm(false);
    setCommentToDelete(null);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment-admin-container">
      <h3>Svi komentari</h3>
      <ul className="comment-list">
        {comments.map(c => (
          <li key={c.id} className="comment-item">
            <p>
              <strong>{c.autor?.name || 'Korisnik'}:</strong> {c.sadrzaj}<br />
              <em>Recept ID: {c.recipe_id}</em>
            </p>
            <button className="delete-btn" onClick={() => handleDeleteClick(c.id)}>Obriši</button>
          </li>
        ))}
      </ul>

      <ConfirmDialog 
        show={showConfirm} 
        onClose={() => setShowConfirm(false)} 
        onConfirm={confirmDelete} 
        message="Da li ste sigurni da želite da obrišete komentar?" 
      />
    </div>
  );
};

export default CommentAdmin;
