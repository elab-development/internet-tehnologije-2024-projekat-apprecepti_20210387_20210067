import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

const Navbar = ({ user, setUser }) => {
  //promenljiva koja cuva da li je korisnik ulogovan
  const isLoggedIn = !!user;
  //promenljiva koja cuva ulogu korisnika
  const role = user?.role || 'guest';
  //promenljiva za preusmeravanje u okviru sajta
  const navigate = useNavigate();

  //state koji nam omogucavaju pretragu recepta po nazivu
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    
    //funkcija za pretrazivanje recepta po nazivu
    const delayDebounce = setTimeout(() => {
        axios.get(`/recipes/search?query=${encodeURIComponent(searchQuery)}`)
          .then(response => {
            setSearchResults(response.data.data || []);
            setShowDropdown(true);
          })
          .catch(error => {
            console.error("Greška prilikom pretrage:", error);
            setSearchResults([]);
          });
      }, 400); // debounce

      return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    // Klik van dropdown-a zatvara listu pretrage
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 

  //funkcija koja obradjuje logout
  const handleLogout = () => {
    //iz Session storega uklanjamo usera i njegov token
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
  <div className="navbar-left">
    <Link to="/" className="logo-link">
      <img src="/images/receptoria.png" alt="Logo" className="navbar-logo" />
    </Link>
    <Link to="/" className="nav-link">Početna</Link>

    {isLoggedIn && (
      <>
        <Link to="/favorites" className="nav-link">Omiljeni recepti</Link>
        <div className="dropdown">
          <button className="dropdown-button">Moji recepti ▾</button>
          <div className="dropdown-content">
            <Link to="/moji-recepti">Pregledaj</Link>
            <Link to="/recipes/create">Dodaj novi</Link>
          </div>
        </div>
        {role === 'admin' && (
          <Link to="/admin" className="nav-link">Admin panel</Link>
        )}
      </>
    )}
  </div>

  <div className="navbar-right">
    <div className="search-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Pretraži recepte..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
      />
      
      <button
        className="search-button"
        onClick={() => {
          if (searchQuery.trim() !== '') {
            navigate(`/recipes/search-results?query=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
          }
        }}
      >
        <FaSearch className="search-icon" />
      </button>

      {showDropdown && searchResults.length > 0 && (
        <div className="search-dropdown">
          {searchResults.map((recipe) => (
            <div
              key={recipe.id}
              className="search-result"
              onClick={() => {
                navigate(`/recipes/${recipe.id}`);
                setSearchQuery('');
                setShowDropdown(false);
              }}
            >
              {recipe.naziv}
            </div>
          ))}
        </div>
      )}
    </div>


    {!isLoggedIn ? (
      <>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Registruj se</Link>
      </>
    ) : (
      <button onClick={handleLogout} className="logout-button">Logout</button>
    )}
  </div>
</nav>

  );
};

export default Navbar;
