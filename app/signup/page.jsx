'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Signup successful! Check your email to confirm.')
      router.push('/login') // Redirect to login page after signup
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>

      {/* Back to Login */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/login">
          <button className="bg-white text-[#800000] border border-[#800000] px-4 py-2 rounded-xl hover:bg-[#800000] hover:text-white transition font-semibold shadow cursor-pointer">
            ← Back to Login
          </button>
        </Link>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-[#800000] mb-6">
            Create an Account
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center font-medium mb-4">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-600 text-sm text-center font-medium mb-4">
              {message}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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
              📝 Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
