'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
type Recipe = {
  slug: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
};


export default function AddRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const newRecipe = {
      slug,
      title,
      image,
      description,
      ingredients: ingredients.split(',').map(i => i.trim()),
      steps: steps.split(',').map(s => s.trim()),
    };

    const stored = localStorage.getItem('userRecipes');
    const recipes = stored ? JSON.parse(stored) : [];

    const exists = (recipes as Recipe[]).find((r: Recipe) => r.slug === slug);

    if (exists) {
      alert('A recipe with this title already exists.');
      return;
    }

    recipes.push(newRecipe);
    localStorage.setItem('userRecipes', JSON.stringify(recipes));

    alert('Recipe added!');
    router.push('/recipes');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>

      {/* Form container */}
      <div className="relative z-10 bg-white text-black w-full max-w-2xl rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#800000] mb-6">Add a New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />

          <textarea
            placeholder="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />

          <textarea
            placeholder="Steps (comma separated)"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />

          <button
            type="submit"
            className="bg-[#800000] text-white px-6 py-3 rounded-xl hover:bg-red-800 transition w-full font-semibold"
          >
            ➕ Submit Recipe
          </button>
        </form>
      </div>
    </div>
  );
}
