import { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ recipeId, token, onCommentAdded }) => {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Komentar ne može biti prazan.');
      return;
    }

    try {
      await axios.post('/comments', {
        recipe_id: recipeId,
        sadrzaj: text,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setText('');
      onCommentAdded(); // osveži komentare
    } catch (error) {
      alert('Greška pri dodavanju komentara.');
    }
  };

  return (
    <div className="comment-form">
      <h4>Dodaj komentar</h4>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Unesite komentar..."
      />
      <br />
      <button onClick={handleSubmit}>Pošalji komentar</button>
    </div>
  );
};

export default CommentForm;
