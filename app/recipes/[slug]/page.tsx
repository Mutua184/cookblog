import Image from 'next/image';
import RecipeClient from './RecipeClient';

const recipeData = {
  ugali: {
    title: 'Ugali',
    image: '/images/ugali.jpg',
    description: 'A staple Kenyan dish made from maize flour.',
    ingredients: ['2 cups maize flour', '4 cups water', 'Salt to taste'],
    instructions: ['Boil water', 'Add maize flour', 'Stir until thick', 'Let steam and serve'],
  },
  mandazi: {
    title: 'Mandazi',
    image: '/images/mandazi.jpg',
    description: 'Sweet fried bread, popular in East Africa.',
    ingredients: ['2 cups flour', '1/2 cup sugar', '1 tsp baking powder', '1 egg', '1/2 cup milk'],
    instructions: ['Mix dry ingredients', 'Add egg/milk', 'Knead, shape, and fry'],
  },
  'beef-stew': {
    title: 'Beef Stew',
    image: '/images/beef-stew.jpg',
    description: 'Rich Kenyan-style beef stew with tomatoes and spices.',
    ingredients: ['500g beef', '2 tomatoes', '1 onion', 'Garlic', 'Spices'],
    instructions: ['Brown beef', 'Add onions and tomatoes', 'Simmer until tender'],
  },
  pizza: {
    title: 'Pizza',
    image: '/images/pizza.jpg',
    description: 'Classic homemade pizza with cheese and toppings.',
    ingredients: ['Pizza dough', 'Tomato sauce', 'Cheese', 'Toppings'],
    instructions: ['Prepare dough', 'Add sauce and toppings', 'Bake at 220°C for 15 mins'],
  },
  cakes: {
    title: 'Cakes',
    image: '/images/cakes.jpg',
    description: 'Soft vanilla cakes perfect for any occasion.',
    ingredients: ['2 cups flour', '1 cup sugar', 'Eggs', 'Butter', 'Vanilla essence'],
    instructions: ['Mix ingredients', 'Pour into pan', 'Bake at 180°C for 30 mins'],
  },
  pancakes: {
    title: 'Pancakes',
    image: '/images/pancakes.jpg',
    description: 'Fluffy breakfast pancakes.',
    ingredients: ['1 cup flour', '1 egg', '1 cup milk', 'Baking powder'],
    instructions: ['Mix ingredients', 'Fry in pan until golden brown'],
  },
};

export function generateStaticParams() {
  return Object.keys(recipeData).map((slug) => ({ slug }));
}

export default function RecipePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const recipe = recipeData[slug as keyof typeof recipeData];

  if (!recipe) return <div className="text-center p-10 text-lg">Recipe not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-xl p-6">
        <Image
          src={recipe.image}
          alt={recipe.title}
          width={800}
          height={400}
          className="rounded-xl mb-6 w-full h-64 object-cover"
        />
        <h1 className="text-4xl font-bold text-[#800000] mb-2">{recipe.title}</h1>
        <p className="text-gray-800 text-base mb-6">{recipe.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#800000] mb-2">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-900 text-sm font-medium space-y-1">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#800000] mb-2">Instructions</h2>
          <ol className="list-decimal list-inside text-gray-900 text-sm font-medium space-y-1">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        <RecipeClient slug={slug} />
      </div>
    </div>
  );
}


