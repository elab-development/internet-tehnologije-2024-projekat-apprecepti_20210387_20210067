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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      await axios.post('/register', {
        ...form,
        role: 'user',//prilikom registracije uloga je uvek user
      });
  
      navigate('/login'); // preusmeri na login stranicu
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Greška pri registraciji.');
      }
    }
  };
  

  return (
    <div className="register-container">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label>Ime:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Lozinka:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Bio:</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="register-button">Registruj se</button>
      </form>
    </div>
  );
};

export default Register;
