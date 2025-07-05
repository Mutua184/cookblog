'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([
    {
      slug: 'ugali',
      title: 'Ugali',
      image: '/images/ugali.jpg',
      description: 'A staple Kenyan dish made from maize flour.',
      ingredients: ['2 cups maize flour', '4 cups water'],
      steps: ['Boil water', 'Add maize flour', 'Stir until thick'],
    },
    {
      slug: 'mandazi',
      title: 'Mandazi',
      image: '/images/mandazi.jpg',
      description: 'Fluffy fried dough, great with chai.',
      ingredients: ['2 cups flour', '1/2 cup sugar', '1 egg', 'Milk'],
      steps: ['Mix ingredients', 'Let dough rest', 'Fry until golden'],
    },
    {
      slug: 'cakes',
      title: 'Cakes',
      image: '/images/cakes.jpg',
      description: 'Soft sponge cakes for dessert or tea time.',
      ingredients: ['Flour', 'Eggs', 'Butter', 'Sugar'],
      steps: ['Mix ingredients', 'Bake at 180°C for 30 min'],
    },
    {
      slug: 'pizza',
      title: 'Pizza',
      image: '/images/pizza.jpg',
      description: 'Cheesy homemade pizza with your choice of toppings.',
      ingredients: ['Dough', 'Tomato sauce', 'Cheese'],
      steps: ['Prepare dough', 'Add toppings', 'Bake in oven'],
    },
    {
      slug: 'beef-stew',
      title: 'Beef Stew',
      image: '/images/beef-stew.jpg',
      description: 'Rich beef stew with carrots and potatoes.',
      ingredients: ['Beef', 'Onions', 'Carrots', 'Potatoes'],
      steps: ['Brown beef', 'Add veggies', 'Simmer until tender'],
    },
    {
      slug: 'pancakes',
      title: 'Pancakes',
      image: '/images/pancakes.jpg',
      description: 'Light and fluffy breakfast pancakes.',
      ingredients: ['Flour', 'Milk', 'Eggs', 'Sugar'],
      steps: ['Mix ingredients', 'Cook on skillet', 'Serve with syrup'],
    },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('userRecipes');
    if (stored) {
      const userRecipes = JSON.parse(stored);
      setRecipes((prev) => [...prev, ...userRecipes]);
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Gradient same as homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>

      {/* Page Content */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🍽 Recipes</h1>
          <Link href="/recipes/add">
            <button className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-red-800 transition shadow">
              ➕ Add Recipe
            </button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <Link key={index} href={`/recipes/${recipe.slug}`}>
              <div className="cursor-pointer bg-white bg-opacity-90 p-4 rounded-xl shadow-md hover:shadow-xl transition">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-48 object-cover mb-4"
                />
                <h2 className="text-2xl font-bold text-[#800000] mb-2">{recipe.title}</h2>
                <p className="text-sm text-gray-700">{recipe.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


