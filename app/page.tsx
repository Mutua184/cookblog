'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      router.push(`/recipes?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Two-tone background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>

      {/* Top Right Buttons - FIXED with higher z-index and aligned sizing */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        <Link href="/login">
          <button className="relative bg-white text-[#800000] border border-[#800000] px-6 py-3 rounded-xl hover:bg-[#800000] hover:text-white transition font-semibold shadow cursor-pointer">
            🔐 Login
          </button>
        </Link>
        <Link href="/recipes">
          <button className="relative bg-[#800000] text-white px-6 py-3 rounded-xl hover:bg-red-800 transition font-semibold shadow-lg cursor-pointer">
            🍽 View Recipes
          </button>
        </Link>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-xl w-full text-white">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Welcome to CookBlog</h1>
          <p className="text-lg mb-6 drop-shadow-md">
            Discover, create, and share your favorite recipes from all over!
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow p-3 rounded-lg border text-black"
              aria-label="Search recipes"
            />
            <button
              type="submit"
              className="bg-[#800000] text-white px-6 py-3 rounded-xl hover:bg-red-800 transition font-semibold"
            >
              🔍 Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


