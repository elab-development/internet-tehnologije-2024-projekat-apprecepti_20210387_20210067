import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeForm = () => {
  const { id } = useParams(); // ako postoji, koristi se za izmenu
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [vremePripreme, setVremePripreme] = useState('');
  const [tezina, setTezina] = useState('Lako');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const isEditMode = Boolean(id);

  //Dohvati sve kategorije kada se komponenta učita
  useEffect(() => {
    axios.get('/categories')
      .then(res => {
        const data = res.data.data || res.data;
        setCategories(data);
      });
  }, []);

  // Ako je u pitanju izmena, popuni polja sa podacima o receptu
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

    const payload = {
      naziv,
      opis,
      vreme_pripreme: parseInt(vremePripreme),
      tezina,
      autor_id: JSON.parse(sessionStorage.getItem('user'))?.id,
      categories: selectedCategories,
      ingredients,
    };

    try {
      if (isEditMode) {
        //izmena recepta
        await axios.put(`/recipes/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Recept uspešno izmenjen.');
      } else {
        //kreiranje novog recepta
        await axios.post('/recipes', payload, {
          headers: { Authorization: `Bearer ${token}` }
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
                  //proverava da li je checkbox trenutno čekiran
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, cat.id]);
                  } else {
                    //ukoliko odčekiramo neku kategoriju
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

        <button type="submit">{isEditMode ? 'Sačuvaj izmene' : 'Dodaj recept'}</button>
      </form>
    </div>
  );
};

export default RecipeForm;
