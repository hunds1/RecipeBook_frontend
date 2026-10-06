export interface RecipeIngredient {
  id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  quantityText: string | null;
}

export interface CookingStep {
  id: number;
  stepNumber: number;
  instruction: string;
  duration: string | null;
  temperature: string | null;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  baseServings: number;
  cookingTime: string;
  category: string;
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
}
