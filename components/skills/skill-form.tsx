'use client'

interface Props {
  name: string
  description: string
  category: string
  systemPrompt: string
  favorite: boolean

  setName: (v: string) => void
  setDescription: (v: string) => void
  setCategory: (v: string) => void
  setSystemPrompt: (v: string) => void
  setFavorite: (v: boolean) => void
}

export default function SkillForm({
  name,
  description,
  category,
  systemPrompt,
  favorite,

  setName,
  setDescription,
  setCategory,
  setSystemPrompt,
  setFavorite,
}: Props) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Skill Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Category
        </label>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          System Prompt
        </label>

        <textarea
          rows={8}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
        />

        <span className="text-sm text-slate-700">
          Mark as Favorite
        </span>
      </label>
    </>
  )
}