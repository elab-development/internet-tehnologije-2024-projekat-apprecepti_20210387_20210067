import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RecipeDetail from './components/RecipeDetail';
import FavoriteRecipes from './components/FavoriteRecipes';
import RecipeForm from './components/RecipeForm';
import MyRecipes from './components/MyRecipes';
import AdminPanel from './components/AdminPanel';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer'
import SearchResults from './components/SearchResults';

function AppWrapper() {
  //cuvamo korisnika i njegove podatke
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const location = useLocation();

  return (
    <div className="app-wrapper">
    {/* prosledjujemo korisnika kako bismo odredili prikaz */}
      <Navbar user={user} setUser={setUser} />
      {location.pathname !== '/' && <Breadcrumbs />}
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/moji-recepti" element={<MyRecipes />} />
        <Route path="/recipes/create" element={<RecipeForm />} />
        <Route path="/recipes/edit/:id" element={<RecipeForm />} />
        <Route path="/recipes/:id" element={<RecipeDetail user={user} />} />
        <Route path="/favorites" element={<FavoriteRecipes />} />
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/recipes/search-results" element={<SearchResults />} />
      </Routes>
    <Footer/>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
