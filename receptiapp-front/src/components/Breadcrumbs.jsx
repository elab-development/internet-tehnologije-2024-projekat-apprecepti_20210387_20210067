import { Link, useLocation } from 'react-router-dom';

//generiše navigacione "breadcrumb" linkove na osnovu trenutne URL putanje (pathname)
//korisnicima omogućava da vide i kliknu na prethodne delove putanje
const Breadcrumbs = () => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(p => p);

  let path = '';

  return (
    <nav className="breadcrumbs">
      <Link to="/">Početna</Link>
      {parts.map((part, index) => {
        path += `/${part}`;
        return (
          <span key={index} className="breadcrumb-item">
            <span className="separator">/</span>
            <Link to={path}>{decodeURIComponent(part)}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

