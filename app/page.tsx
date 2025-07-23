'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js' // ✅ ADDED THIS LINE

type Recipe = {
  slug: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null) // ✅ FIXED TYPING HERE
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [stats, setStats] = useState({ totalRecipes: 0, userRecipes: 0 })
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        loadRecipeData()
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const loadRecipeData = () => {
    const defaultRecipes: Recipe[] = [
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
        slug: 'pizza',
        title: 'Pizza',
        image: '/images/pizza.jpg',
        description: 'Cheesy homemade pizza with your choice of toppings.',
        ingredients: ['Dough', 'Tomato sauce', 'Cheese'],
        steps: ['Prepare dough', 'Add toppings', 'Bake in oven'],
      },
    ];

    const stored = localStorage.getItem('userRecipes');
    const userRecipes: Recipe[] = stored ? JSON.parse(stored) : [];

    const allRecipes = [...defaultRecipes, ...userRecipes];
    setFeaturedRecipes(allRecipes.slice(0, 3));

    setStats({
      totalRecipes: allRecipes.length,
      userRecipes: userRecipes.length
    });

    const suggestions = allRecipes.map(recipe => recipe.title).slice(0, 5);
    setSearchSuggestions(suggestions);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim() !== '') {
      router.push(`/recipes?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    router.push(`/recipes?search=${encodeURIComponent(suggestion)}`)
  }

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#60a5fa] to-[#1e3a8a]">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#1e3a8a] animate-gradient-x z-0"></div>
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      <nav className="relative z-50 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🍳</div>
          <h2 className="text-xl font-bold text-white">CookBlog</h2>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <span className="text-sm">
                {getTimeOfDayGreeting()}, {user.email?.split('@')[0]}!
              </span>
            </div>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white/90 backdrop-blur-sm text-[#1e3a8a] border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 font-medium text-sm"
            >
              🚪 Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-white/90 backdrop-blur-sm text-[#1e3a8a] border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 font-medium text-sm">
                🔐 Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="text-center max-w-4xl w-full text-white mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Welcome to CookBlog
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg text-blue-100 max-w-2xl mx-auto">
            Discover, create, and share your favorite recipes from all over the world!
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for delicious recipes..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowSuggestions(query.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full p-4 pl-12 rounded-2xl border-0 text-gray-700 bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  aria-label="Search recipes"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 overflow-hidden z-50">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
                      >
                        🍽️ {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#800000] hover:bg-red-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                🔍 Search
              </button>
            </form>
          </div>

          <div className="flex justify-center mb-12">
            <Link href="/recipes">
              <button className="bg-[#800000]/90 backdrop-blur-sm border border-red-800/30 text-white px-6 py-3 rounded-full hover:bg-[#800000] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                🍽️ Browse All Recipes
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12 max-w-md w-full">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center text-white border border-white/30">
            <div className="text-2xl font-bold">{stats.totalRecipes}</div>
            <div className="text-sm opacity-90">Total Recipes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center text-white border border-white/30">
            <div className="text-2xl font-bold">{stats.userRecipes}</div>
            <div className="text-sm opacity-90">Your Recipes</div>
          </div>
        </div>

        {featuredRecipes.length > 0 && (
          <div className="max-w-6xl w-full">
            <h2 className="text-2xl font-bold text-white text-center mb-6">🌟 Featured Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe, index) => (
                <Link key={recipe.slug} href={`/recipes/${recipe.slug}`}>
                  <div className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-white/20">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/cblog.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#800000] transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-500">
                          {recipe.ingredients.length} ingredients
                        </span>
                        <span className="text-xs text-blue-600 group-hover:text-[#800000] transition-colors">
                          View Recipe →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}


