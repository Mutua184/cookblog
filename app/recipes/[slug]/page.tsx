'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Recipe = {
  slug: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookTime?: string;
  prepTime?: string;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  nutrition?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
};

export default function RecipePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showNutrition, setShowNutrition] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    allRecipes: Recipe[];
    availableSlugs: string[];
    searchingFor: string;
  } | null>(null);

  // Check if recipe is deletable (not a default recipe)
  const isUserCreatedRecipe = (recipeSlug: string): boolean => {
    const defaultSlugs = ['ugali', 'mandazi', 'cakes', 'pizza', 'beef-stew', 'pancakes'];
    return !defaultSlugs.includes(recipeSlug);
  };

  // Check if recipe is favorited
  const checkIsFavorite = (recipeSlug: string): boolean => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    return favorites.includes(recipeSlug);
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!recipe) return;
    
    const favorites: string[] = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    let updatedFavorites: string[];

    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav !== recipe.slug);
    } else {
      updatedFavorites = [...favorites, recipe.slug];
    }

    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // Share functionality
  const handleShare = async () => {
    if (!recipe) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Ingredient scaling
  const scaleIngredient = (ingredient: string): string => {
    if (servingMultiplier === 1) return ingredient;
    
    const numberPattern = /(\d+(?:\.\d+)?)\s*(\d+\/\d+)?/g;
    return ingredient.replace(numberPattern, (match, decimal, fraction) => {
      let number = parseFloat(decimal);
      if (fraction) {
        const [num, den] = fraction.split('/');
        number += parseInt(num) / parseInt(den);
      }
      const scaled = (number * servingMultiplier).toFixed(2).replace(/\.?0+$/, '');
      return scaled;
    });
  };

  // Toggle ingredient checked state
  const toggleIngredientCheck = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  // Toggle step completion
  const toggleStepCompletion = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DebugInfo = () => {
    if (!debugInfo) return <p>No debug info available</p>;

    return (
      <div className="text-sm">
        <p><strong>Searching for:</strong> "{debugInfo.searchingFor}"</p>
        <p><strong>Total recipes found:</strong> {debugInfo.allRecipes.length}</p>
        <p><strong>Available slugs:</strong></p>
        <ul className="list-disc list-inside ml-4 mt-2">
          {debugInfo.availableSlugs.length > 0 ? 
            debugInfo.availableSlugs.map((slug, index) => (
              <li key={index}>{slug}</li>
            )) : 
            <li>No recipes found in localStorage</li>
          }
        </ul>
        {debugInfo.allRecipes.length > 0 && (
          <div className="mt-2">
            <p><strong>Recipe titles:</strong></p>
            <ul className="list-disc list-inside ml-4 mt-1">
              {debugInfo.allRecipes.map((recipe, index) => (
                <li key={index}>{recipe.title} (slug: {recipe.slug})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const ShareModal = () => {
    if (!showShareModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Share Recipe</h3>
            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal || !recipe) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Recipe</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete "<strong>{recipe.title}</strong>"? This action cannot be undone.
            </p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
            
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {isDeleting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteConfirm = async () => {
    if (!recipe) return;
    
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get current user recipes
      const stored = localStorage.getItem('userRecipes');
      const userRecipes: Recipe[] = stored ? JSON.parse(stored) : [];
      
      // Filter out the recipe to delete
      const updatedRecipes = userRecipes.filter(r => r.slug !== recipe.slug);
      
      // Save back to localStorage
      localStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
      
      // Also remove from favorites if it exists
      const favorites: string[] = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
      const updatedFavorites = favorites.filter(fav => fav !== recipe.slug);
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
      
      // Redirect to home page after successful deletion
      router.push('/');
      
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setDeleteError('Failed to delete recipe. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    if (!recipe || !isUserCreatedRecipe(recipe.slug)) return;
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  useEffect(() => {
    const initializeRecipes = () => {
      const defaultRecipes: Recipe[] = [
        {
          slug: 'ugali',
          title: 'Ugali',
          image: '/images/ugali.jpg',
          description: 'A staple Kenyan dish made from maize flour.',
          ingredients: ['2 cups maize flour', '4 cups water'],
          steps: ['Boil water', 'Add maize flour', 'Stir until thick'],
          cookTime: '15 mins',
          prepTime: '5 mins',
          servings: 4,
          difficulty: 'Easy',
          tags: ['Kenyan', 'Staple', 'Vegetarian'],
        },
        {
          slug: 'mandazi',
          title: 'Mandazi',
          image: '/images/mandazi.jpg',
          description: 'Fluffy fried dough, great with chai.',
          ingredients: ['2 cups flour', '1/2 cup sugar', '1 egg', 'Milk'],
          steps: ['Mix ingredients', 'Let dough rest', 'Fry until golden'],
          cookTime: '20 mins',
          prepTime: '30 mins',
          servings: 6,
          difficulty: 'Medium',
          tags: ['Kenyan', 'Snack', 'Fried'],
        },
        {
          slug: 'cakes',
          title: 'Cakes',
          image: '/images/cakes.jpg',
          description: 'Soft sponge cakes for dessert or tea time.',
          ingredients: ['Flour', 'Eggs', 'Butter', 'Sugar'],
          steps: ['Mix ingredients', 'Bake at 180°C for 30 min'],
          cookTime: '30 mins',
          prepTime: '15 mins',
          servings: 8,
          difficulty: 'Medium',
          tags: ['Dessert', 'Baked', 'Sweet'],
        },
        {
          slug: 'pizza',
          title: 'Pizza',
          image: '/images/pizza.jpg',
          description: 'Cheesy homemade pizza with your choice of toppings.',
          ingredients: ['Dough', 'Tomato sauce', 'Cheese'],
          steps: ['Prepare dough', 'Add toppings', 'Bake in oven'],
          cookTime: '25 mins',
          prepTime: '45 mins',
          servings: 4,
          difficulty: 'Medium',
          tags: ['Italian', 'Cheese', 'Customizable'],
        },
        {
          slug: 'beef-stew',
          title: 'Beef Stew',
          image: '/images/beef-stew.jpg',
          description: 'Rich beef stew with carrots and potatoes.',
          ingredients: ['Beef', 'Onions', 'Carrots', 'Potatoes'],
          steps: ['Brown beef', 'Add veggies', 'Simmer until tender'],
          cookTime: '2 hours',
          prepTime: '20 mins',
          servings: 6,
          difficulty: 'Easy',
          tags: ['Hearty', 'Comfort Food', 'One Pot'],
        },
        {
          slug: 'pancakes',
          title: 'Pancakes',
          image: '/images/pancakes.jpg',
          description: 'Light and fluffy breakfast pancakes.',
          ingredients: ['Flour', 'Milk', 'Eggs', 'Sugar'],
          steps: ['Mix ingredients', 'Cook on skillet', 'Serve with syrup'],
          cookTime: '15 mins',
          prepTime: '10 mins',
          servings: 4,
          difficulty: 'Easy',
          tags: ['Breakfast', 'Sweet', 'Quick'],
        },
      ];

      const stored = localStorage.getItem('userRecipes');
      const userRecipes: Recipe[] = stored ? JSON.parse(stored) : [];
      const allRecipes = [...defaultRecipes, ...userRecipes];
      const found = allRecipes.find((r) => r.slug === slug);

      setDebugInfo({
        allRecipes,
        availableSlugs: allRecipes.map(r => r.slug),
        searchingFor: slug as string,
      });

      if (found) {
        setRecipe(found);
        setIsFavorite(checkIsFavorite(found.slug));
        if (found.servings) {
          setServingMultiplier(1);
        }
      }
      
      setLoading(false);
    };

    if (slug) {
      initializeRecipes();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center text-white" style={{ backgroundImage: "url('/cblog.jpg')" }}>
        <div className="p-8 rounded-xl bg-white/80 text-[#800000]">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#800000]"></div>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center text-white" style={{ backgroundImage: "url('/cblog.jpg')" }}>
        <div className="p-8 rounded-xl bg-white/90 text-[#800000] text-center">
          <h1 className="text-3xl font-bold mb-4">Recipe not found</h1>
          <p className="text-lg mb-4">The recipe "{slug}" could not be found.</p>
          <div className="bg-gray-100 text-left text-sm p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <DebugInfo />
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-8 bg-cover bg-center" style={{ backgroundImage: "url('/cblog.jpg')" }}>
        <div className="bg-white/95 backdrop-blur-sm text-[#800000] p-6 md:p-8 rounded-xl max-w-6xl mx-auto shadow-xl">
          {/* Header with title and action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
              
              {/* Recipe meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {recipe.prepTime && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Prep: {recipe.prepTime}
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    Cook: {recipe.cookTime}
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {recipe.servings} servings
                  </div>
                )}
                {recipe.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                )}
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 flex-wrap justify-end">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                ← Back
              </button>

              <button
                onClick={toggleFavorite}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                  isFavorite 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
              
              {isUserCreatedRecipe(recipe.slug) && (
                <>
                  <button
                    onClick={() => router.push(`/edit-recipe/${recipe.slug}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDeleteClick}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Recipe image */}
          <div className="mb-6">
            <img 
              src={imageError ? '/cblog.jpg' : recipe.image}
              alt={recipe.title} 
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
              onError={() => setImageError(true)}
            />
          </div>
          
          <p className="text-lg mb-8 leading-relaxed text-gray-700">{recipe.description}</p>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients section */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Ingredients</h2>
                  {recipe.servings && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Servings:</span>
                      <button
                        onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{Math.round(recipe.servings * servingMultiplier)}</span>
                      <button
                        onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-3">
                    {recipe.ingredients.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <button
                          onClick={() => toggleIngredientCheck(index)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            checkedIngredients.has(index)
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {checkedIngredients.has(index) && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span className={`leading-relaxed ${
                          checkedIngredients.has(index) 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-800'
                        }`}>
                          {scaleIngredient(item)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {recipe.nutrition && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowNutrition(!showNutrition)}
                        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <span>Nutrition Information</span>
                        <svg className={`w-4 h-4 transition-transform ${showNutrition ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showNutrition && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {recipe.nutrition.calories && (
                              <div className="flex justify-between">
                                <span>Calories:</span>
                                <span className="font-medium">{Math.round(recipe.nutrition.calories * servingMultiplier)}</span>
                              </div>
                            )}
                            {recipe.nutrition.protein && (
                              <div className="flex justify-between">
                                <span>Protein:</span>
                                <span className="font-medium">{recipe.nutrition.protein}</span>
                              </div>
                            )}
                            {recipe.nutrition.carbs && (
                              <div className="flex justify-between">
                                <span>Carbs:</span>
                                <span className="font-medium">{recipe.nutrition.carbs}</span>
                              </div>
                            )}
                            {recipe.nutrition.fat && (
                              <div className="flex justify-between">
                                <span>Fat:</span>
                                <span className="font-medium">{recipe.nutrition.fat}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Instructions section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div key={index} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    completedSteps.has(index) 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <button
                      onClick={() => toggleStepCompletion(index)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        completedSteps.has(index)
                          ? 'bg-green-600 text-white'
                          : 'bg-[#800000] text-white hover:bg-[#600000]'
                      }`}
                    >
                      {completedSteps.has(index) ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </button>
                    <span className={`leading-relaxed ${
                      completedSteps.has(index) 
                        ? 'line-through text-gray-600' 
                        : 'text-gray-800'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          {(completedSteps.size > 0 || checkedIngredients.size > 0) && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                <span className="font-medium">Cooking Progress</span>
                <button
                  onClick={() => {
                    setCompletedSteps(new Set());
                    setCheckedIngredients(new Set());
                  }}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Reset Progress
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Ingredients checked:</span>
                    <span className="font-medium">{checkedIngredients.size}/{recipe.ingredients.length}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(checkedIngredients.size / recipe.ingredients.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Steps completed:</span>
                    <span className="font-medium">{completedSteps.size}/{recipe.steps.length}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSteps.size / recipe.steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {completedSteps.size === recipe.steps.length && checkedIngredients.size === recipe.ingredients.length && (
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Recipe completed! Enjoy your meal! 🎉
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Recipe status info */}
          <div className="mt-8 flex flex-wrap gap-4">
            {!isUserCreatedRecipe(recipe.slug) && (
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Default Recipe</span>
              </div>
            )}
            
            {isUserCreatedRecipe(recipe.slug) && (
              <div className="text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Your Custom Recipe</span>
              </div>
            )}
            
            {isFavorite && (
              <div className="text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="font-medium">Favorited Recipe</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal />
      <ShareModal />
    </>
  );
}



