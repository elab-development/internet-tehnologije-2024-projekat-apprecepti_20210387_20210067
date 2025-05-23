import { Link } from 'react-router-dom';

// Komponenta prima jedan recept kao prop i prikazuje osnovne informacije
const RecipeCard = ({ recipe,  isFavorited = false }) => {
  return (
    //klikom na recept otvaraju se detalji o receptu tj. komponenta RecipeDetails
    <Link to={`/recipes/${recipe.id}`} state={{ isFavorited }} className="recipe-card">
      <div className="recipe-card-inner">
        <h4>{recipe.naziv}</h4>
        <p>{recipe.opis?.slice(0, 100)}...</p>
        <p><strong>Težina:</strong> {recipe.tezina}</p>
        <p><strong>Priprema:</strong> {recipe.vreme_pripreme}</p>
        <p><strong>Ocena:</strong> {recipe.prosecna_ocena || 'N/A'}</p>
      </div>
    </Link>
  );
};

export default RecipeCard;
