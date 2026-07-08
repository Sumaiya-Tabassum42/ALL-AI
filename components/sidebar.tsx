'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Plus,
  Home,
  Grid,
  Zap,
  Network,
  Folder,
  MoreHorizontal,
  User,
} from 'lucide-react'

const menuItems = [
  {
    icon: Plus,
    label: 'New',
    href: '/new',
  },
  {
    icon: Home,
    label: 'Home',
    href: '/dashboard',
  },
  {
    icon: Grid,
    label: 'Skills',
    href: '/skills',
  },
  {
    icon: Zap,
    label: 'Workflows',
    href: '/workflows',
  },
  {
    icon: Network,
    label: 'Connections',
    href: '/connections',
  },
  {
    icon: Folder,
    label: 'Drive',
    href: '/drive',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-20 flex-col items-center border-r border-slate-200 bg-white py-6">

      {/* Logo */}

      <Link
        href="/dashboard"
        className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-[#006A4E] text-lg font-bold text-white"
      >
        BD
      </Link>

      {/* Navigation */}

      <nav className="flex flex-1 flex-col items-center gap-4">

        {menuItems.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all
                ${
                  active
                    ? 'bg-[#006A4E] text-white'
                    : 'text-slate-600 hover:bg-[#E8F3EF] hover:text-[#006A4E]'
                }`}
            >
              <item.icon size={24} />

              <span className="absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-slate-900 px-3 py-1 text-xs text-white group-hover:block">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}

      <div className="flex flex-col gap-3">

        <button
          className="flex h-12 w-12 items-center justify-center rounded-lg text-slate-600 transition hover:bg-[#E8F3EF] hover:text-[#006A4E]"
        >
          <MoreHorizontal size={24} />
        </button>

        <Link
          href="/profile"
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F3EF] text-slate-600 transition hover:bg-[#D4E8E2] hover:text-[#006A4E]"
        >
          <User size={24} />
        </Link>

      </div>

    </aside>
  )
}