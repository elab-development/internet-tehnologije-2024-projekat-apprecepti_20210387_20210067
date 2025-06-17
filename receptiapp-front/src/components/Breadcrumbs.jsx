//generiše navigacione "breadcrumb" linkove na osnovu trenutne URL putanje (pathname)
//korisnicima omogućava da vide i kliknu na prethodne delove putanje
import { Link, useLocation, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Breadcrumbs = () => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(p => p);

  const [nazivRecepta, setNazivRecepta] = useState('');
  const recipeMatch = useMatch('/recipes/:id');

  useEffect(() => {
    if (recipeMatch) {
      const recipeId = recipeMatch.params.id;
      axios.get(`/recipes/${recipeId}`)
        .then(res => {
          setNazivRecepta(res.data.recipes?.naziv);
        })
        .catch(() => {
          setNazivRecepta('Nepoznat recept');
        });
    }
  }, [recipeMatch]);

  const nameMap = {
    recipes: 'Recepti',
    favorites: 'Omiljeni',
    create: 'Kreiraj',
    edit:'Izmeni'
  };

  let path = '';

  return (
    <nav className="breadcrumbs">
      <Link to="/">Početna</Link>
      {parts.map((part, index) => {
        path += `/${part}`;
        const isLast = index === parts.length - 1;
        const isNumeric = !isNaN(part);

        const label =
          isNumeric && nazivRecepta
            ? nazivRecepta
            : nameMap[part] || decodeURIComponent(part);

        return (
          <span key={index} className="breadcrumb-item">
            <span className="separator"> / </span>
            {isLast ? (
              <span>{label}</span>
            ) : (
              <Link to={path}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;


