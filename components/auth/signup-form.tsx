'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState({
    text: '',
    type: '' as 'success' | 'error' | '',
  })

   const [signupSuccess, setSignupSuccess] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setMessage({
      text: '',
      type: '',
    })

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        text: 'Passwords do not match.',
        type: 'error',
      })
      return
    }

    if (formData.password.length < 6) {
      setMessage({
        text: 'Password must be at least 6 characters.',
        type: 'error',
      })
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (!error && data?.user) {
      await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: data.user.id,
          email: data.user.email,
          full_name: formData.fullName,
        }),
      })
    }

    setLoading(false)

    if (error) {
      setMessage({
        text: error.message,
        type: 'error',
      })
      return
    }

    setMessage({
      text: 'Account created successfully! Please check your email to verify your account.',
      type: 'success',
    })

    setSignupSuccess(true)
  }

  if (signupSuccess) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

        <div className="border-b border-gray-100 px-8 py-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Check Your Email
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            We've sent a verification email to
          </p>

          <p className="mt-2 break-all font-semibold text-[#006A4E]">
            {formData.email}
          </p>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            Click the verification link in your email before signing in.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#006A4E] px-4 text-sm font-semibold text-white transition hover:bg-[#00543E]"
          >
            Go to Sign In
          </Link>
        </div>

        <div className="border-t border-gray-100 bg-slate-50 px-8 py-5">
          <div className="flex items-start justify-center gap-2 text-center text-xs text-gray-500">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
            <span>
              Didn't receive the email? Check your spam folder. You'll be able
              to resend the verification email later.
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-8 py-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Secure Access
          </p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Create Account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Bangladesh Government AI service portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative flex items-center">
              <User className="pointer-events-none absolute left-4 z-10 h-4 w-4 text-gray-400" />

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-4 z-10 h-4 w-4 text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="name@gov.bd"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-4 z-10 h-4 w-4 text-gray-400" />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-4 z-10 h-4 w-4 text-gray-400" />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {message.text && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'border border-green-200 bg-green-50 text-green-700'
                  : 'border border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full cursor-pointer rounded-lg bg-[#006A4E] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#00543e] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>

        <div className="border-t border-gray-100 bg-slate-50 px-8 py-5">
          <div className="flex items-start justify-center gap-2 text-center text-xs font-medium leading-normal text-gray-500">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />

            <span>
              This is a secure government service. Use only authorized
              credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}