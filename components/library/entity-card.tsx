'use client'

import { ReactNode } from 'react'
import { Pencil, Star, Trash2 } from 'lucide-react'

interface Props {
  id: string

  title: string
  description?: string

  badge?: string

  favorite?: boolean

  icon?: ReactNode

  children?: ReactNode

  onFavorite?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function EntityCard({
  title,
  description,
  badge,
  favorite = false,
  icon,
  children,
  onFavorite,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex flex-1 gap-3">

          {icon && (
            <div className="mt-1 text-[#006A4E]">
              {icon}
            </div>
          )}

          <div>

            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>

            {description && (
              <p className="mt-2 text-sm text-slate-500">
                {description}
              </p>
            )}

          </div>

        </div>

        {onFavorite && (
          <button
            onClick={onFavorite}
            className="transition hover:scale-110"
          >
            <Star
              size={20}
              className={
                favorite
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }
            />
          </button>
        )}

      </div>

      {/* Badge */}

      {badge && (
        <div className="mt-5">

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {badge}
          </span>

        </div>
      )}

      {/* Custom Content */}

      {children && (
        <div className="mt-5">
          {children}
        </div>
      )}

      {/* Footer */}

      <div className="mt-6 flex items-center gap-3">

        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}

      </div>

    </div>
  )
}