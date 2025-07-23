'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      router.push('/'); // ✅ send to homepage
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-[#800000] mb-6">
            Login to CookBlog
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-semibold mb-1 text-[#800000]">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold mb-1 text-[#800000]">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#800000] text-white py-3 rounded-xl font-semibold hover:bg-red-800 transition"
            >
              🔐 Login
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-[#800000]">
            Don’t have an account?{' '}
            <a href="/signup" className="font-semibold underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

