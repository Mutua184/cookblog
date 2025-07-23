'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { Search, Plus, Share2, Trash2, Clock, Users, ChefHat, Filter, Heart, Star, Eye } from 'lucide-react'

type Recipe = {
  slug: string
  title: string
  image: string
  description: string
  ingredients: string[]
  steps: string[]
  cookTime?: number
  servings?: number
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  category?: string
  tags?: string[]
  rating?: number
  favorites?: number
  views?: number
  dateAdded?: string
  author?: string
}

export default function RecipesPage() {
  const defaultRecipes: Recipe[] = [
    {
      slug: 'ugali',
      title: 'Ugali',
      image: '/images/ugali.jpg',
      description: 'A staple Kenyan dish made from maize flour. Perfect for any meal and pairs well with vegetables or meat.',
      ingredients: ['2 cups maize flour', '4 cups water', 'Salt to taste'],
      steps: ['Boil water with salt', 'Gradually add maize flour while stirring', 'Stir continuously until thick and smooth', 'Cook for 5-7 minutes until fully set'],
      cookTime: 15,
      servings: 4,
      difficulty: 'Easy',
      category: 'Kenyan',
      tags: ['traditional', 'staple', 'vegetarian'],
      rating: 4.8,
      favorites: 245,
      views: 1250,
      dateAdded: '2024-01-01',
      author: 'Chef Mary'
    },
    {
      slug: 'mandazi',
      title: 'Mandazi',
      image: '/images/mandazi.jpg',
      description: 'Fluffy fried dough that\'s perfect with chai. A beloved East African treat that\'s crispy outside and soft inside.',
      ingredients: ['2 cups flour', '1/2 cup sugar', '1 egg', '1/2 cup milk', '2 tsp baking powder', '1/2 tsp cardamom'],
      steps: ['Mix dry ingredients', 'Add wet ingredients and knead', 'Let dough rest for 30 minutes', 'Roll and cut into triangles', 'Deep fry until golden brown'],
      cookTime: 45,
      servings: 12,
      difficulty: 'Medium',
      category: 'Kenyan',
      tags: ['fried', 'sweet', 'snack', 'traditional'],
      rating: 4.6,
      favorites: 189,
      views: 890,
      dateAdded: '2024-01-02',
      author: 'Chef John'
    },
    {
      slug: 'cakes',
      title: 'Vanilla Sponge Cake',
      image: '/images/cakes.jpg',
      description: 'Light and airy vanilla sponge cake perfect for celebrations or afternoon tea. Moist, fluffy, and delicious.',
      ingredients: ['2 cups flour', '4 eggs', '1/2 cup butter', '1 cup sugar', '1 tsp vanilla', '2 tsp baking powder'],
      steps: ['Cream butter and sugar', 'Add eggs one by one', 'Fold in flour and baking powder', 'Add vanilla', 'Bake at 180°C for 25-30 minutes'],
      cookTime: 50,
      servings: 8,
      difficulty: 'Medium',
      category: 'Dessert',
      tags: ['baked', 'sweet', 'celebration', 'vanilla'],
      rating: 4.7,
      favorites: 312,
      views: 1580,
      dateAdded: '2024-01-03',
      author: 'Chef Sarah'
    },
    {
      slug: 'pizza',
      title: 'Homemade Pizza',
      image: '/images/pizza.jpg',
      description: 'Delicious homemade pizza with crispy crust and your favorite toppings. Better than delivery!',
      ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Toppings of choice', 'Olive oil', 'Italian herbs'],
      steps: ['Roll out dough', 'Spread sauce evenly', 'Add cheese and toppings', 'Drizzle with olive oil', 'Bake at 220°C for 12-15 minutes'],
      cookTime: 35,
      servings: 4,
      difficulty: 'Hard',
      category: 'Italian',
      tags: ['baked', 'cheese', 'customizable', 'dinner'],
      rating: 4.9,
      favorites: 456,
      views: 2340,
      dateAdded: '2024-01-04',
      author: 'Chef Marco'
    },
    {
      slug: 'beef-stew',
      title: 'Hearty Beef Stew',
      image: '/images/beef-stew.jpg',
      description: 'Rich and comforting beef stew with tender vegetables. Perfect for cold days and family gatherings.',
      ingredients: ['2 lbs beef chunks', 'Onions', 'Carrots', 'Potatoes', 'Beef broth', 'Tomato paste', 'Herbs & spices'],
      steps: ['Brown beef in batches', 'Sauté onions', 'Add vegetables and broth', 'Season and bring to boil', 'Simmer for 2 hours until tender'],
      cookTime: 150,
      servings: 6,
      difficulty: 'Medium',
      category: 'Main Course',
      tags: ['beef', 'hearty', 'comfort food', 'winter'],
      rating: 4.5,
      favorites: 278,
      views: 1890,
      dateAdded: '2024-01-05',
      author: 'Chef Michael'
    },
    {
      slug: 'pancakes',
      title: 'Fluffy Pancakes',
      image: '/images/pancakes.jpg',
      description: 'Light and fluffy breakfast pancakes that melt in your mouth. Perfect start to any day!',
      ingredients: ['2 cups flour', '2 cups milk', '2 eggs', '2 tbsp sugar', '2 tsp baking powder', 'Butter for cooking'],
      steps: ['Mix dry ingredients', 'Whisk wet ingredients separately', 'Combine gently', 'Cook on medium heat', 'Serve with syrup'],
      cookTime: 20,
      servings: 4,
      difficulty: 'Easy',
      category: 'Breakfast',
      tags: ['sweet', 'breakfast', 'fluffy', 'quick'],
      rating: 4.4,
      favorites: 334,
      views: 1670,
      dateAdded: '2024-01-06',
      author: 'Chef Emma'
    },
  ]

  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const [userSlugs, setUserSlugs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'date' | 'cookTime' | 'favorites'>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' }>({ message: '', type: 'success' })

  // Initialize data from localStorage equivalent (in-memory storage)
  useEffect(() => {
    // Simulate localStorage behavior with in-memory storage
    const initializeRecipes = () => {
      // In a real app, you'd load from localStorage here
      // For now, we'll just use default recipes
      setRecipes(defaultRecipes)
      setUserSlugs([]) // No user recipes initially
      setFavorites([]) // No favorites initially
    }

    initializeRecipes()
  }, [])

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    if (!recipes) return ['All']
    const cats = new Set(recipes.map(r => r.category).filter(Boolean))
    return ['All', ...Array.from(cats)]
  }, [recipes])

  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    if (!recipes) return []

    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           recipe.author?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'date':
          return new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime()
        case 'cookTime':
          return (a.cookTime || 0) - (b.cookTime || 0)
        case 'favorites':
          return (b.favorites || 0) - (a.favorites || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, sortBy])

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: '', type: 'success' }), 4000)
  }

  const handleDelete = (slug: string) => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return

    // In a real app, you'd update localStorage here
    const updatedRecipes = recipes?.filter(r => r.slug !== slug) || []
    setRecipes(updatedRecipes)
    setUserSlugs(prev => prev.filter(s => s !== slug))
    showNotification('Recipe deleted successfully!', 'success')
  }

  const handleShare = async (recipe: Recipe) => {
    const url = `${window.location.origin}/recipes/${recipe.slug}`
    const shareData = {
      title: `${recipe.title} Recipe`,
      text: recipe.description,
      url: url
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        showNotification('Recipe shared successfully!', 'success')
      } else {
        await navigator.clipboard.writeText(url)
        showNotification('Recipe link copied to clipboard!', 'success')
      }
    } catch (err) {
      showNotification('Could not share recipe', 'error')
    }
  }

  const toggleFavorite = (slug: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(slug)
      const newFavorites = isFavorite 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
      
      showNotification(
        isFavorite ? 'Removed from favorites' : 'Added to favorites',
        'info'
      )
      return newFavorites
    })
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={12} 
            className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  if (!recipes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <ChefHat size={64} className="mx-auto text-white mb-4 animate-pulse" />
          <p className="text-white text-xl">Loading delicious recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700">
      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <ChefHat size={16} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Link href="/">
            <button className="bg-white text-[#800000] border-2 border-[#800000] px-6 py-3 rounded-xl hover:bg-[#800000] hover:text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              ← Back to Home
            </button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2 flex items-center justify-center gap-3">
              <ChefHat size={48} />
              Recipe Collection
            </h1>
            <p className="text-blue-100 text-lg">Discover, cook, and share amazing recipes</p>
          </div>
          
          <Link href="/recipes/add">
            <button className="bg-[#800000] text-white px-6 py-3 rounded-xl hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
              <Plus className="inline-block mr-2" size={20} />
              Add Recipe
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white bg-opacity-95 rounded-xl p-6 mb-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search recipes, ingredients, or chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 bg-white"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                  showFilters ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <Filter size={16} />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="cookTime">Sort by Cook Time</option>
                <option value="favorites">Sort by Popularity</option>
              </select>

              <div className="flex rounded-lg overflow-hidden border-2 border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              >
                <option value="">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              >
                <option value="">All Difficulties</option>
                {difficulties.slice(1).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-700 font-medium">
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </p>
          </div>
        </div>

        {/* Recipes */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <ChefHat size={80} className="mx-auto text-white mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No recipes found</h3>
            <p className="text-blue-100 text-lg mb-6">Try adjusting your search terms or filters</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
                setSelectedDifficulty('All')
              }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-6"
          }>
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.slug}
                className={`group bg-white bg-opacity-95 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] overflow-hidden ${
                  viewMode === 'list' ? 'flex gap-6 p-6' : 'p-0'
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0 w-32 h-32' : 'h-48'}`}>
                  <Link href={`/recipes/${recipe.slug}`}>
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      width={400}
                      height={300}
                      className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                        viewMode === 'list' ? 'rounded-lg' : 'rounded-t-2xl'
                      }`}
                    />
                  </Link>
                  
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(recipe.slug)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${
                      favorites.includes(recipe.slug) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart size={16} className={favorites.includes(recipe.slug) ? 'fill-current' : ''} />
                  </button>

                  {/* Difficulty badge */}
                  {recipe.difficulty && (
                    <span className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className={`flex-grow ${viewMode === 'list' ? '' : 'p-6'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <Link href={`/recipes/${recipe.slug}`}>
                      <h2 className="text-xl font-bold text-[#800000] hover:text-red-700 transition-colors line-clamp-1">
                        {recipe.title}
                      </h2>
                    </Link>
                  </div>

                  {/* Rating */}
                  {renderStars(recipe.rating)}
                  
                  <p className="text-gray-700 text-sm mt-2 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4">
                    {recipe.cookTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{recipe.cookTime}min</span>
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{recipe.servings} servings</span>
                      </div>
                    )}
                    {recipe.views && (
                      <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{recipe.views} views</span>
                      </div>
                    )}
                    {recipe.favorites && (
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{recipe.favorites} likes</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author & Category */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    {recipe.author && <span>by {recipe.author}</span>}
                    {recipe.category && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {recipe.category}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare(recipe)}
                      className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                    {userSlugs.includes(recipe.slug) && (
                      <button
                        onClick={() => handleDelete(recipe.slug)}
                        className="flex items-center gap-1 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}










