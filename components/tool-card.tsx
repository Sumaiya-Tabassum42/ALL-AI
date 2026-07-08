'use client'

import type { LucideIcon } from 'lucide-react'

interface ToolCardProps {
  icon: LucideIcon
  color: string
  title: string
  description: string
}

export default function ToolCard({
  icon: Icon,
  color,
  title,
  description,
}: ToolCardProps) {
  return (
    <div className="flex min-h-[160px] cursor-pointer flex-col rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-[#006A4E] hover:shadow-md">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-md ${color}`}>
        <Icon size={22} />
      </div>

      <h3 className="text-base font-semibold leading-6 text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  )
}
