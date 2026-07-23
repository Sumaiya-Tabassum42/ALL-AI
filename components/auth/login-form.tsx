'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Mail,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("LOGIN DATA:", data)
console.log("LOGIN ERROR:", error)

const sessionResult = await supabase.auth.getSession()
console.log("SESSION AFTER LOGIN:", sessionResult)



    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', data.user.id)
  .single()

if (profile?.is_admin) {
  window.location.href = '/dashboard'
} else {
  window.location.href = '/dashboard'
}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b border-gray-100 px-8 py-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Secure Access
          </p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Bangladesh Government AI Service Portal
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">

          {/* Email */}

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative flex items-center">

              <Mail className="pointer-events-none absolute left-4 h-4 w-4 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gov.bd"
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />

            </div>
          </div>

          {/* Password */}

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative flex items-center">

              <Lock className="pointer-events-none absolute left-4 h-4 w-4 text-gray-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-12 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* Remember */}

          <div className="flex items-center justify-between">

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">

              <input
                type="checkbox"
                className="accent-[#006A4E]"
              />

              Remember me

            </label>

            <button
              type="button"
              className="text-sm font-semibold text-[#006A4E] hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Message */}

          {message && (
            <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[#006A4E] font-semibold text-white transition hover:bg-[#00543E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Footer */}

          <p className="text-center text-sm text-gray-600">

            Don't have an account?{' '}

            <Link
              href="/signup"
              className="font-semibold text-[#006A4E] hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </form>

        {/* Bottom */}

        <div className="border-t border-gray-100 bg-slate-50 px-8 py-5">

          <div className="flex items-start justify-center gap-2 text-center text-xs text-gray-500">

            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />

            <span>
              This is a secure government service.
              Use only authorized credentials.
            </span>

          </div>

        </div>

      </div>
    </div>
  )
}