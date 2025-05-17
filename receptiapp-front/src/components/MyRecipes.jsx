import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    //dodatno smo osigurali da gost ne moze da pristupi ovoj komponenti
    if (!user) {
      setError('Morate biti prijavljeni.');
      return;
    }

    axios.get(`/users/${user.id}/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setRecipes(res.data))
      .catch(() => setError('Greška pri dohvatanju vaših recepata.'));
  }, []);

  //funkcija za brisanje recepta 
  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete recept?')) return;

    try {
      await axios.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //pravi novi niz recepata bez onog koji ima dati id (onaj koji je obrisan)
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Greška pri brisanju recepta.');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Moji recepti</h2>

      {recipes.length === 0 ? (
        <p>Nemate još nijedan recept.</p>
      ) : (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <h4>{recipe.naziv}</h4>
              <p><strong>Vreme pripreme:</strong> {recipe.vreme_pripreme} min</p>
              <p><strong>Težina:</strong> {recipe.tezina}</p>
              <p><strong>Opis:</strong> {recipe.opis}</p>

              {/* poziva se ruta koja poziva komponentu za izmenu i prosledjuje joj se id recepta */}
              <button onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>Izmeni</button>
              <button onClick={() => handleDelete(recipe.id)}>Obriši</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRecipes;
