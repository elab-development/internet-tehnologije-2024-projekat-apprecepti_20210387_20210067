import { useState } from 'react';
import axios from 'axios';

const CommentEditForm = ({ comment, onCancel, onUpdated }) => {
  const [text, setText] = useState(comment.sadrzaj);
  const token = sessionStorage.getItem('token');

  //Izmena komentara
  const handleUpdate = async () => {
    if (!text.trim()) return alert('Komentar ne može biti prazan.');

    try {
      await axios.put(`/comments/${comment.id}`, {
        sadrzaj: text,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onUpdated(); // obavesti roditelja da osveži komentare
    } catch {
      alert('Greška pri izmeni komentara');
    }
  };

  return (
    <div className="comment-edit-form">
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleUpdate}>Sačuvaj</button>
      <button onClick={onCancel}>Otkaži</button>
    </div>
  );
};

export default CommentEditForm;
