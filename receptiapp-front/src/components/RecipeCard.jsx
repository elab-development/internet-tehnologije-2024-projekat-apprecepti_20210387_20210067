import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, isFavorited = false }) => {



  return (
    <Link to={`/recipes/${recipe.id}`} state={{ isFavorited }} className="recipe-card">
      <div className="recipe-card-inner">
      {recipe.image && (
  <div className="recipe-image">
    <img src={recipe.image} alt={recipe.naziv} style={{ maxWidth: '200px', borderRadius: '8px' }} />
  </div>
)}

        <h4>{recipe.naziv}</h4>
        <p>{recipe.opis?.slice(0, 100)}...</p>
        <p><strong>Težina:</strong> {recipe.tezina}</p>
        <p><strong>Priprema:</strong> {recipe.vreme_pripreme} min</p>
        <p><strong>Ocena:</strong> {recipe.prosecna_ocena || 'N/A'}</p>
      </div>
    </Link>
  );
};

export default RecipeCard;

