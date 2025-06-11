import { useState } from 'react';
import axios from 'axios';
import CommentEditForm from './CommentEditForm';
import ConfirmDialog from './ConfirmDialog';


const CommentList = ({ comments, user, onRefresh, recipeId }) => {
  const [editingId, setEditingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const token = sessionStorage.getItem('token');

  const confirmDelete = (id) => {
    setSelectedCommentId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/comments/${selectedCommentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch {
      alert('Greška pri brisanju komentara');
    } finally {
      setConfirmOpen(false);
      setSelectedCommentId(null);
    }
  };

  return (
    <div className="comment-list">
      {comments.map((k) => (
        <div key={k.id} className="comment-item">
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
              <div className="comment-text">
                <span className="comment-author">{k.autor?.name || 'Korisnik'}:</span> {k.sadrzaj}
              </div>

              {user && k.autor && user.id === k.autor.id && (
                <div className="comment-buttons">
                  <button onClick={() => setEditingId(k.id)}>Izmeni</button>
                  <button onClick={() => confirmDelete(k.id)}>Obriši</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <ConfirmDialog
        show={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Da li ste sigurni da želite da obrišete komentar?"
      />
    </div>
  );
};

export default CommentList;
