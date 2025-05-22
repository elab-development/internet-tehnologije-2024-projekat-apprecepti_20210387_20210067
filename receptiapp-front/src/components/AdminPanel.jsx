import { useState } from 'react';
import UserAdmin from './UserAdmin';
import CategoryAdmin from './CategoryAdmin';
import IngredientAdmin from './IngredientAdmin';
import CommentAdmin from './CommentAdmin';
import RecipeAdmin from './RecipeAdmin';
import MonthlyRecipeStats from './MonthlyRecipeStats'; 
import MonthlyUserStats from './MonthlyUserStats';



const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users'); // default: korisnici

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'users': return <UserAdmin />;
      case 'categories': return <CategoryAdmin />;
      case 'ingredients': return <IngredientAdmin />;
      case 'comments': return <CommentAdmin />;
      case 'recipes': return <RecipeAdmin />;
      case 'stats': return <><MonthlyRecipeStats /><MonthlyUserStats/>
      </>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar meni */}
      <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h3>Admin meni</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <button onClick={() => setActiveTab('users')}>
              Korisnici
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('categories')}>
              Kategorije
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('ingredients')}>
              Sastojci
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('comments')}>
              Komentari
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('recipes')}>
              Recepti
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('stats')}>Statistika</button>
          </li>
        </ul>
      </div>

      {/* Glavni sadržaj */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AdminPanel;
