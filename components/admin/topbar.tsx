'use client'

import { Bell, Search } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">

      <div>

        <h2 className="text-2xl font-bold text-slate-800">
          Admin Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Bangladesh Government AI Portal
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            placeholder="Search..."
            className="w-72 rounded-lg border pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          />

        </div>

        <button className="rounded-lg border p-2 hover:bg-slate-100">

          <Bell size={20} />

        </button>

      </div>

    </header>
  )
}