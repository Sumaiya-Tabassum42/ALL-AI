import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Sidebar from '@/components/admin/sidebar'
import Topbar from '@/components/admin/topbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Temporary debug
  console.log('ADMIN USER:', user)

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  console.log('ADMIN PROFILE:', profile)
  console.log('PROFILE ERROR:', error)

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
  <div className="flex h-screen bg-slate-100">

    <Sidebar />

    <div className="flex flex-1 flex-col overflow-hidden">

      <Topbar />

      <main className="flex-1 overflow-auto p-8">

        {children}

      </main>

    </div>

  </div>
)
}