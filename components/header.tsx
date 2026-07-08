'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Shield } from 'lucide-react'

export default function Header() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        try {
          const res = await fetch(
            `/api/profile?user_id=${encodeURIComponent(user.id)}`
          )

          if (res.ok) {
            const profile = await res.json()
            setIsAdmin(profile?.is_admin === true)
          }
        } catch (err) {
          console.error(err)
        }
      }

      setLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          ALL AI BD
        </h1>

        <p className="text-sm text-slate-500">
          Multi AI Service Platform
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">
          Loading...
        </div>
      ) : !user ? (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-[#006A4E] px-4 py-2 font-medium text-white hover:bg-[#00543E]"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="rounded-lg border border-[#006A4E] px-4 py-2 font-medium text-[#006A4E] hover:bg-[#E8F3EF]"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">

          {isAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 rounded-lg bg-[#006A4E] px-4 py-2 text-sm font-medium text-white hover:bg-[#00543E]"
            >
              <Shield size={18} />
              Admin Panel
            </button>
          )}

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              {user.user_metadata.full_name || 'User'}
            </p>

            <p className="text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

        </div>
      )}
    </header>
  )
}