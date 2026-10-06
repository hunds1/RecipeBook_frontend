import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<RecipeListPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
