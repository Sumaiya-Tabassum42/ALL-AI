'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, AlertTriangle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm sm:px-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 z-10 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-100 px-8 py-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Secure Access
          </p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Bangladesh Government AI service portal
          </p>
        </div>

        <div className="px-8 pt-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          {activeTab === 'signup' && (
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
                  className="auth-custom-input h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

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
                className="auth-custom-input h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                className="auth-custom-input h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {activeTab === 'signup' && (
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
                  className="auth-custom-input h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
                />
                Remember me
              </label>

              <a
                href="#"
                className="text-sm font-semibold text-emerald-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="h-11 w-full cursor-pointer rounded-lg bg-[#006A4E] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#00543e] hover:shadow-lg active:scale-[0.98]"
          >
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            {activeTab === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
              className="cursor-pointer font-semibold text-emerald-700 hover:underline"
            >
              {activeTab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>

        <div className="border-t border-gray-100 bg-slate-50 px-8 py-5">
          <div className="flex items-start justify-center gap-2 text-center text-xs font-medium leading-normal text-gray-500">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
            <span>
              This is a secure government service. Use only authorized credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
