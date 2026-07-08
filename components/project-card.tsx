'use client'

import { FileText, MoreVertical } from 'lucide-react'

interface ProjectCardProps {
  title: string
  edited: string
}

export default function ProjectCard({ title, edited }: ProjectCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="min-h-[160px] rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-[#006A4E] hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#E8F3EF] text-[#006A4E]">
            <FileText size={20} />
          </div>

          <button
            type="button"
            className="text-slate-400 opacity-0 transition-opacity hover:text-slate-700 group-hover:opacity-100"
            aria-label="Project actions"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        <h3 className="text-sm font-semibold leading-6 text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-xs text-slate-500">
          {edited}
        </p>
      </div>
    </div>
  )
}
