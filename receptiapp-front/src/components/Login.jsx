import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //Asinhrone f-ja(omogucava koriscenje await)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      //await- Čeka da se Promise završi i vrati rezultat
      const res = await axios.post('/login', { email, password });
      const { access_token, ...userData } = res.data;
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', access_token);
      setUser(userData); 
      navigate('/');
    } catch {
      setError('Pogrešan email ili lozinka.');
    }
  };

  return (
    <div className="login-container">
      <h2>Prijava</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Lozinka:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Uloguj se</button>
      </form>
    </div>
  );
};

export default Login;


