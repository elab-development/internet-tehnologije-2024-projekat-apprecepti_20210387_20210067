import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, isFavorited = false }) => {
  return (
    <Link to={`/recipes/${recipe.id}`} state={{ isFavorited }} className="recipe-card">
      <div className="recipe-image">
        <img src={`${process.env.PUBLIC_URL}${recipe.image}`} alt={recipe.naziv} />
      </div>
      <div className="recipe-info">
        <h4>{recipe.naziv}</h4>
      </div>
    </Link>
  );
};

export default RecipeCard;

