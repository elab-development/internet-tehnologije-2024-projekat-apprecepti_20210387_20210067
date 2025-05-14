import { useState } from 'react';
import axios from 'axios';
import CommentEditForm from './CommentEditForm';

const CommentList = ({ comments, user, onRefresh, recipeId }) => {
  const [editingId, setEditingId] = useState(null);
  const token = sessionStorage.getItem('token');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh();
    } catch {
      alert('Error deleting comment');
    }
  };

  return (
    <div className="comment-list">
      <h4>Comments</h4>

      {!Array.isArray(comments) ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
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
                  <p><strong>{k.autor?.name || 'User'}:</strong> {k.sadrzaj}</p>
                  {user && user.id === k.autor?.id && (
  <>
    <button onClick={() => setEditingId(k.id)}>Edit</button>
    <button onClick={() => handleDelete(k.id)}>Delete</button>
  </>
)}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;

