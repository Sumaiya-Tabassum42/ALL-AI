'use client'

import { Plus } from 'lucide-react'
import { ReactNode } from 'react'

interface Props<T> {
  title: string
  description: string

  loading: boolean

  items: T[]

  emptyTitle: string
  emptyDescription: string

  onCreate: () => void

  renderItem: (item: T) => ReactNode
}

export default function EntityLayout<T>({
  title,
  description,

  loading,

  items,

  emptyTitle,
  emptyDescription,

  onCreate,

  renderItem,
}: Props<T>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-8">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              {title}
            </h1>

            <p className="mt-2 text-slate-500">
              {description}
            </p>

          </div>

          <button
            onClick={onCreate}
            className="flex items-center gap-2 rounded-lg bg-[#006A4E] px-5 py-3 font-medium text-white transition hover:bg-[#00543E]"
          >
            <Plus size={18} />

            New
          </button>

        </div>

        {/* Loading */}

        {loading && (

          <div className="rounded-xl bg-white p-10 text-center">

            Loading...

          </div>

        )}

        {/* Empty */}

        {!loading && items.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">

            <h2 className="text-xl font-semibold text-slate-800">
              {emptyTitle}
            </h2>

            <p className="mt-2 text-slate-500">
              {emptyDescription}
            </p>

            <button
              onClick={onCreate}
              className="mt-8 rounded-lg bg-[#006A4E] px-6 py-3 text-white transition hover:bg-[#00543E]"
            >
              Create First One
            </button>

          </div>

        )}

        {/* Grid */}

        {!loading && items.length > 0 && (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {items.map(renderItem)}

          </div>

        )}

      </div>
    </div>
  )
}