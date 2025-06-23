import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InfoDialog from './InfoDialog';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [vremePripreme, setVremePripreme] = useState('');
  const [tezina, setTezina] = useState('Lako');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [redirectAfterMessage, setRedirectAfterMessage] = useState(false);

  const isEditMode = Boolean(id);

  const handleCloseMessage = () => {
    setShowMessage(false);
    navigate('/moji-recepti');
  };

  useEffect(() => {
    if (!token || !user) {
      alert('Morate biti ulogovani.');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    axios.get('/categories').then(res => {
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
            id: i.id,
            naziv: i.naziv,
            kolicina: i.kolicina || '',
            mera: i.mera || ''
          })) || []
        );
      });
    }
  }, [id]);

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { naziv: '', kolicina: '', mera: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const invalidIngredients = ingredients.some(ing =>
      !ing.kolicina || !ing.mera
    );
    if (invalidIngredients) {
      alert('Svaki sastojak mora imati količinu i meru.');
      return;
    }

    const formData = new FormData();
    formData.append('naziv', naziv);
    formData.append('opis', opis);
    formData.append('vreme_pripreme', parseInt(vremePripreme));
    formData.append('tezina', tezina);
    formData.append('autor_id', user?.id);

    selectedCategories.forEach((catId, index) => {
      formData.append(`categories[${index}]`, catId);
    });

    ingredients.forEach((ing, index) => {
      if (ing.id) {
        formData.append(`ingredients[${index}][id]`, ing.id);
      }
      formData.append(`ingredients[${index}][naziv]`, ing.naziv);
      formData.append(`ingredients[${index}][kolicina]`, ing.kolicina);
      formData.append(`ingredients[${index}][mera]`, ing.mera);
    });

    if (image) formData.append('image', image);

    try {
      if (isEditMode) {
        await axios.post(`/recipes/${id}?_method=PUT`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessageText('Recept uspešno izmenjen.');
        setShowMessage(true);

      } else {
        await axios.post('/recipes', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessageText('Recept uspešno dodat.');
        setShowMessage(true);

      }

    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        alert('Proverite polja - neki podaci nisu ispravni.');
      } else {
        alert('Greška pri slanju podataka.');
      }
    }
  };

  return (
   <div className="recipe-form-container">
      <h2 className="recipe-form-title">{isEditMode ? 'Izmena recepta' : 'Dodaj recept'}</h2>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={naziv}
          onChange={e => setNaziv(e.target.value)}
          placeholder="Naziv"
          required
          className="form-input"
        />
        {errors.naziv && <p className="form-error">{errors.naziv[0]}</p>}

        <textarea
          value={opis}
          onChange={e => setOpis(e.target.value)}
          placeholder="Opis"
          required
          className="form-textarea"
        />
        {errors.opis && <p className="form-error">{errors.opis[0]}</p>}

        <input
          type="number"
          value={vremePripreme}
          onChange={e => setVremePripreme(e.target.value)}
          placeholder="Vreme pripreme (min)"
          required
          className="form-input"
        />
        {errors.vreme_pripreme && <p className="form-error">{errors.vreme_pripreme[0]}</p>}

        <select
          value={tezina}
          onChange={e => setTezina(e.target.value)}
          className="form-select"
        >
          <option value="Lako">Lako</option>
          <option value="Srednje">Srednje</option>
          <option value="Teško">Teško</option>
        </select>
        {errors.tezina && <p className="form-error">{errors.tezina[0]}</p>}

        <div className="form-group">
          <p className="form-label">Kategorije:</p>
          <div className="form-categories">
            {categories.map(cat => (
              <label key={cat.id} className="category-option">
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
                  className="hidden-checkbox"
                />
                {cat.naziv}
              </label>
            ))}
          </div>
          {errors.categories && <p className="form-error">{errors.categories[0]}</p>}
        </div>

        <div className="form-group">
          <p className="form-label">Sastojci:</p>
          {ingredients.map((ing, i) => (
            <div key={i} className="ingredient-row">
              <input
                type="text"
                placeholder="Naziv"
                value={ing.naziv}
                onChange={(e) => updateIngredient(i, 'naziv', e.target.value)}
                className="ingredient-input"
              />
              <input
                type="number"
                placeholder="Količina"
                value={ing.kolicina}
                onChange={(e) => updateIngredient(i, 'kolicina', e.target.value)}
                className="ingredient-input"
              />
              <input
                type="text"
                placeholder="Mera"
                value={ing.mera}
                onChange={(e) => updateIngredient(i, 'mera', e.target.value)}
                className="ingredient-input"
              />
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="ingredient-remove-btn"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="ingredient-add-btn"
          >
            Unesi još jedan sastojak
          </button>
          {errors.ingredients && <p className="form-error">{errors.ingredients[0]}</p>}
        </div>

        <div className="form-group">
          <p className="form-label">Slika recepta:</p>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-file-input"
          />
          {errors.image && <p className="form-error">{errors.image[0]}</p>}
        </div>

        <button type="submit" className="form-submit-btn">
          {isEditMode ? 'Sačuvaj izmene' : 'Dodaj recept'}
        </button>
      </form>
      <InfoDialog
        show={showMessage}
        message={messageText}
        onClose={handleCloseMessage}
      />

    </div>
  );
};

export default RecipeForm;
