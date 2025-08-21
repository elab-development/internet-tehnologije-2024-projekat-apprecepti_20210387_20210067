import { Link } from 'react-router-dom';
import { Clock, Heart, Dumbbell, Star } from 'lucide-react';

const RecipeCard = ({ recipe, isFavorited = false }) => {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      state={{ isFavorited }}
      className="recipe-card"
    >
      <div className="recipe-image">
        <img
          src={`${process.env.PUBLIC_URL}${recipe.image}`}
          alt={recipe.naziv}
        />
      </div>

      <div className="recipe-info">
        <h4>{recipe.naziv}</h4>

        <div className="recipe-info-line">
          <span className="info-badge">
            <Dumbbell size={14} /> {recipe.tezina}
          </span>
          <span className="info-badge">
            <Clock size={14} /> {recipe.vreme_pripreme}
          </span>
          <span className="info-badge">
            <Star size={14} color="#fbbf24" />{" "}
            {recipe.prosecna_ocena ? recipe.prosecna_ocena.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;


