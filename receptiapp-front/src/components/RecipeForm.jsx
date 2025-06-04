import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [vremePripreme, setVremePripreme] = useState('');
  const [tezina, setTezina] = useState('Lako');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(null); // dodajemo sliku

  const isEditMode = Boolean(id);

  useEffect(() => {
    axios.get('/categories')
      .then(res => {
        const data = res.data.data || res.data;
        setCategories(data);
      });
  }, []);

  useEffect(() => {
    if (isEditMode) {
      axios.get(`/recipes/${id}`).then(res => {
        const r = res.data.recipes;
        setNaziv(r.naziv);
        setOpis(r.opis);
        setVremePripreme(parseInt(r.vreme_pripreme));
        setTezina(r.tezina);
        setSelectedCategories(r.kategorije?.map(k => k.id) || []);
        setIngredients(
          r.sastojci?.map(i => ({
            naziv: i.naziv,
            kolicina: i.kolicina || '',
            mera: i.mera || ''
          })) || []
        );
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('naziv', naziv);
    formData.append('opis', opis);
    formData.append('vreme_pripreme', parseInt(vremePripreme));
    formData.append('tezina', tezina);
    formData.append('autor_id', JSON.parse(sessionStorage.getItem('user'))?.id);
    formData.append('categories', JSON.stringify(selectedCategories));
    formData.append('ingredients', JSON.stringify(ingredients));
    
    if (image) {
      formData.append('image', image);
    }

    try {
      if (isEditMode) {
        await axios.post(`/recipes/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Recept uspešno izmenjen.');
      } else {
        await axios.post('/recipes', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Recept dodat.');
      }

      navigate('/moji-recepti');
    } catch {
      alert('Greška pri slanju podataka.');
    }
  };

  return (
    <div>
      <h2>{isEditMode ? 'Izmena recepta' : 'Dodaj recept'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={naziv} onChange={e => setNaziv(e.target.value)} placeholder="Naziv" required />
        <textarea value={opis} onChange={e => setOpis(e.target.value)} placeholder="Opis" required />
        <input type="number" value={vremePripreme} onChange={e => setVremePripreme(e.target.value)} placeholder="Vreme pripreme (min)" required />

        <select value={tezina} onChange={e => setTezina(e.target.value)}>
          <option value="Lako">Lako</option>
          <option value="Srednje">Srednje</option>
          <option value="Teško">Teško</option>
        </select>

        <div>
          <p>Kategorije:</p>
          {categories.map(cat => (
            <label key={cat.id}>
              <input
                type="checkbox"
                value={cat.id}
                checked={selectedCategories.includes(cat.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, cat.id]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                  }
                }}
              />
              {cat.naziv}
            </label>
          ))}
        </div>

        <div>
          <p>Sastojci:</p>
          {ingredients.map((ing, i) => (
            <div key={i}>
              <input
                type="text"
                placeholder="Naziv"
                value={ing.naziv}
                onChange={(e) => {
                  const newIng = [...ingredients];
                  newIng[i].naziv = e.target.value;
                  setIngredients(newIng);
                }}
              />
              <input
                type="number"
                placeholder="Količina"
                value={ing.kolicina}
                onChange={(e) => {
                  const newIng = [...ingredients];
                  newIng[i].kolicina = e.target.value;
                  setIngredients(newIng);
                }}
              />
              <input
                type="text"
                placeholder="Mera"
                value={ing.mera}
                onChange={(e) => {
                  const newIng = [...ingredients];
                  newIng[i].mera = e.target.value;
                  setIngredients(newIng);
                }}
              />
              <button type="button" onClick={() => setIngredients(ingredients.filter((_, index) => index !== i))}>X</button>
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, { naziv: '', kolicina: '', mera: '' }])}>
            Unesi još jedan sastojak
          </button>
        </div>

        <div>
          <p>Slika recepta:</p>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <button type="submit">{isEditMode ? 'Sačuvaj izmene' : 'Dodaj recept'}</button>
      </form>
    </div>
  );
};

export default RecipeForm;
