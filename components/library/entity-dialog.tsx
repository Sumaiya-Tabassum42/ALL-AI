'use client'

import { ReactNode } from 'react'

interface Props {
  open: boolean

  title: string
  subtitle?: string

  loading?: boolean

  onClose: () => void
  onSubmit: () => void

  submitText?: string

  children: ReactNode
}

export default function EntityDialog({
  open,
  title,
  subtitle,
  loading = false,
  onClose,
  onSubmit,
  submitText = 'Save',
  children,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-xl font-bold text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          {children}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="rounded-lg bg-[#006A4E] px-5 py-2 text-white transition hover:bg-[#00543E] disabled:opacity-50"
          >
            {loading ? 'Saving...' : submitText}
          </button>

        </div>

      </div>

    </div>
  )
}