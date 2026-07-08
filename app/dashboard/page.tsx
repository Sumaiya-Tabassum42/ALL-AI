'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import MainContent from '@/components/main-content'

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [allowedServices, setAllowedServices] = useState<string[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace('/login')
      return
    }

    try {
      const response = await fetch(
        `/api/profile?user_id=${encodeURIComponent(session.user.id)}`
      )

      if (response.ok) {
        const profile = await response.json()

        console.log("PROFILE:", profile);
console.log("PROFILE SERVICES:", profile.allowed_services);

        console.log('PROFILE FROM API:', profile)

        setRole(profile?.role ?? '')

        setAllowedServices(profile?.allowed_services ?? [])

        console.log("SETTING:", profile.allowed_services);
      }
    } catch (error) {
      console.error('PROFILE FETCH ERROR:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <MainContent allowedServices={allowedServices} />
        </div>
      </div>
    </div>
  )
}