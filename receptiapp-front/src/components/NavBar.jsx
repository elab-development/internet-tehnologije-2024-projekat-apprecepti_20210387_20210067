import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ user, setUser }) => {
  //promenljiva koja cuva da li je korisnik ulogovan
  const isLoggedIn = !!user;
  //promenljiva koja cuva ulogu korisnika
  const role = user?.role || 'guest';
  //promenljiva za preusmeravanje u okviru sajta
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  //funkcija koja obradjuje logout
  const handleLogout = () => {
    //iz Session storega uklanjamo usera i njegov token
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Početna</Link>

      {!isLoggedIn && (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}

      {isLoggedIn && (
        <>
          <Link to="/favorites" className="nav-link">Omiljeni recepti</Link>
          <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
              Moji recepti ▾
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <Link to="/moji-recepti" onClick={() => setShowDropdown(false)}>Pregledaj</Link>
                <Link to="/recipes/create" onClick={() => setShowDropdown(false)}>Dodaj novi</Link>
              </div>
            )}
          </div>
          {role === 'admin' && (
            <Link to="/admin" className="nav-link">Admin panel</Link>
          )}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
