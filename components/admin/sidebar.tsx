'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  Shield,
  Home,
} from 'lucide-react'

const menus = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },

    {
    title: 'Main Dashboard',
    href: '/dashboard',
    icon: Home,
  },

  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Departments',
    href: '/admin/departments',
    icon: Building2,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-[#006A4E] text-white flex flex-col">

      <div className="border-b border-white/10 p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-white p-3">

            <Shield className="h-7 w-7 text-[#006A4E]" />

          </div>

          <div>

            <h1 className="text-lg font-bold">
              AI Portal
            </h1>

            <p className="text-sm text-emerald-100">
              Administration
            </p>

          </div>

        </div>

      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menus.map((item) => {

          const Icon = item.icon

          const active =
  item.href === '/admin'
    ? pathname.startsWith('/admin')
    : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                ${
                  active
                    ? 'bg-white text-[#006A4E] shadow'
                    : 'text-white hover:bg-white/10'
                }`}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>

            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-5">

        <p className="font-semibold">
          Sumaiya Tabassum
        </p>

        <p className="text-sm text-emerald-100">
          System Administrator
        </p>

      </div>

    </aside>
  )
}