import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';

export default function RecipeListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = ['Все', 'Супы', 'Десерты', 'Паста'];

  const filteredRecipes = useMemo(() => {
    return mockRecipes.filter((recipe) => {
      const matchesSearch = recipe.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Все' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-stone-900 mb-8">Книга рецептов</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
          >
            {/* Placeholder Image */}
            <img
              src={`https://via.placeholder.com/400x300?text=${encodeURIComponent(
                recipe.name
              )}`}
              alt={recipe.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              {/* Category Badge */}
              <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded mb-2">
                {recipe.category}
              </span>

              {/* Recipe Name */}
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {recipe.name}
              </h2>

              {/* Cooking Time */}
              <div className="text-sm text-gray-500">
                ⏱ {recipe.cookingTime}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone-500 text-lg">Рецепты не найдены</p>
        </div>
      )}
    </div>
  );
}
