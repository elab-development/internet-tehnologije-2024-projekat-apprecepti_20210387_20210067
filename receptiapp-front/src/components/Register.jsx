import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Register = ({ setUser }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' }); 
  };

 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setLoading(true);
  
    try {
      await axios.post('/register', {
        ...form,
        role: 'user',
      });
  
      // Samo ako uspe ide navigacija na login formu
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Greška pri registraciji.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="register-container">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label>Ime:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {validationErrors.name && (
            <div className="field-error">{validationErrors.name[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {validationErrors.email && (
            <div className="field-error">{validationErrors.email[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label>Lozinka:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {validationErrors.password && (
            <div className="field-error">{validationErrors.password[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label>Bio:</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registracija...' : 'Registruj se'}
        </button>
      </form>
    </div>
  );
};

export default Register;
