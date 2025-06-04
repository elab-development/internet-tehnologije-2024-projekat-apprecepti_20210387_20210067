import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Dodajemo loading state


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const res = await axios.post('/login', { email, password });
      const { access_token, user } = res.data;
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', access_token);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        const data = err.response.data;
        if (data.message) {
          setError(data.message);
        } else {
          setError('Neuspešno logovanje. Proverite podatke.');
        }
      } else {
        setError('Greška u mreži ili serveru.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="login-container">
      <h2>Prijava</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Lozinka:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message animated-error">
            {error}
          </div>
        )}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Učitavanje...' : 'Uloguj se'}
        </button>
      </form>
    </div>
  );
};

export default Login;



