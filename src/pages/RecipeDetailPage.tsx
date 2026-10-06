import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Recipe } from '../types';
import { mockRecipes } from '../data/mockRecipes';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = id ? parseInt(id, 10) : undefined;
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );

  const recipe: Recipe | undefined = mockRecipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Рецепт не найден</p>
      </div>
    );
  }

  const ratio = servings / recipe.baseServings;

  const calculatedIngredients = useMemo(() => {
    return recipe.ingredients.map((ingredient) => {
      if (ingredient.quantity === null) {
        return ingredient;
      }

      const newQuantity = ingredient.quantity * ratio;
      // Round to reasonable precision
      const roundedQuantity =
        newQuantity % 1 === 0 ? Math.round(newQuantity) : parseFloat(newQuantity.toFixed(2));

      return {
        ...ingredient,
        quantity: roundedQuantity,
      };
    });
  }, [recipe.ingredients, ratio]);

  const handleServingsChange = (delta: number) => {
    const newServings = servings + delta;
    if (newServings >= 1 && newServings <= 20) {
      setServings(newServings);
    }
  };

  const handleIngredientCheck = (ingredientId: number) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  return (
    <div className="py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 mb-4 transition-colors"
      >
        ← Назад к списку
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
            {recipe.category}
          </span>
          <div className="flex items-center text-gray-500">
            <span className="mr-2">⏱</span>
            <span>{recipe.cookingTime}</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-8">
            {/* Portion Calculator */}
            <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b">
                <button
                  onClick={() => handleServingsChange(-1)}
                  className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  disabled={servings <= 1}
                >
                  -
                </button>
                <div className="text-center">
                  <div className="text-xl font-bold">{servings}</div>
                  <div className="text-xs text-gray-500">порций</div>
                </div>
                <button
                  onClick={() => handleServingsChange(1)}
                  className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  disabled={servings >= 20}
                >
                  +
                </button>
            </div>

            {/* Ingredients List */}
            <h2 className="text-xl font-bold text-stone-900 mb-4">Ингредиенты</h2>
            <ul>
              {calculatedIngredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={checkedIngredients.has(ingredient.id)}
                    onChange={() => handleIngredientCheck(ingredient.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      checkedIngredients.has(ingredient.id)
                        ? 'line-through text-stone-400'
                        : 'text-stone-900'
                    }`}
                  >
                    {ingredient.quantity !== null ? (
                      <>
                        <span className="font-medium">
                          {ingredient.quantity} {ingredient.unit}
                        </span>{' '}
                        {ingredient.name}
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{ingredient.quantityText}</span>{' '}
                        {ingredient.name}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps Column */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Приготовление</h2>
          <div className="space-y-6">
            {recipe.steps.map((step) => (
              <div
                key={step.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">
                  {step.instruction}
                </p>
                    {(step.duration || step.temperature) && (
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                        {step.duration && <span>⏱ {step.duration}</span>}
                        {step.temperature && <span>🌡 {step.temperature}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
