'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('🔍 LOGIN PAGE IS RENDERING!');
    console.log('Current URL:', window.location.href);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });

    if (email === 'admin@example.com' && password === 'password') {
      alert('Login successful!');
      router.push('/recipes');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Two-tone background matching homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>
      
      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <button className="bg-white text-[#800000] border border-[#800000] px-4 py-2 rounded-xl hover:bg-[#800000] hover:text-white transition font-semibold shadow cursor-pointer">
            ← Back to Home
          </button>
        </Link>
      </div>

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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block font-semibold mb-1 text-[#800000]">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#800000] text-white py-3 rounded-xl font-semibold hover:bg-red-800 transition shadow-lg"
            >
              🔐 Login
            </button>
          </form>
          
          {/* Test credentials info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm font-semibold text-[#800000] mb-2">Test Credentials:</p>
            <p className="text-sm text-[#800000]">Email: admin@example.com</p>
            <p className="text-sm text-[#800000]">Password: password</p>
          </div>
          

        </div>
      </div>
    </div>
  );
}