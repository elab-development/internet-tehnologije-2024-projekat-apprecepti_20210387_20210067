import { useState } from 'react';
import axios from 'axios';
import CommentEditForm from './CommentEditForm';

const CommentList = ({ comments, user, onRefresh, recipeId }) => {

  const [editingId, setEditingId] = useState(null);
  const token = sessionStorage.getItem('token');

  //Brisanje svog komentara
  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete komentar?')) return;

    try {
      await axios.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch {
      alert('Greška pri brisanju komentara');
    }
  };

  return (
    <ul>
      {comments.map((k) => (
        <li key={k.id}>
          {editingId === k.id ? (
            <CommentEditForm
              comment={k}
              onCancel={() => setEditingId(null)}
              onUpdated={() => {
                setEditingId(null);
                onRefresh();
              }}
            />
          ) : (
            <>
              <p>
                <strong>{k.autor?.name || 'User'}:</strong> {k.sadrzaj}
              </p>
  
              {user && k.autor && user.id === k.autor.id && (
                <>
                  <button onClick={() => setEditingId(k.id)}>Izmeni</button>
                  <button onClick={() => handleDelete(k.id)}>Obriši</button>
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
  
};

export default CommentList;

