import { useEffect, useState } from 'react';
import axios from 'axios';

const CommentAdmin = () => {
  const [comments, setComments] = useState([]);
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

  const deleteComment = async (id) => {
    if (!window.confirm('Obrisati komentar?')) return;
    try {
      await axios.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    setComments(prev => prev.filter(c => c.id !== id));
    } catch(err) {
        console.error(err.response?.data);
      alert('Greška pri brisanju komentara.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <h3>Svi komentari</h3>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <p>
              <strong>{c.autor?.name || 'Korisnik'}:</strong> {c.sadrzaj}<br />
              <em>Recept ID: {c.recipe_id}</em>
            </p>
            <button onClick={() => deleteComment(c.id)}>Obriši</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentAdmin;
