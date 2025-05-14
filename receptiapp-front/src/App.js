import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RecipeDetail from './components/RecipeDetail';

function App() {
  //cuvamo korisnika i njegove podatke 
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <Router>
      {/* prosledjujemo kao parametar korisnika kako bismo odredili prikaz */}
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail user={user} />} />
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
