'use client'

interface Props {
  name: string
  description: string
  service: string
  prompt: string

  setName: (v: string) => void
  setDescription: (v: string) => void
  setService: (v: string) => void
  setPrompt: (v: string) => void
}

export default function WorkflowForm({
  name,
  description,
  service,
  prompt,

  setName,
  setDescription,
  setService,
  setPrompt,
}: Props) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Workflow Name
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
          Service
        </label>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="document">Document</option>
          <option value="presentation">Presentation</option>
          <option value="data_analysis">Data Analysis</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Prompt
        </label>

        <textarea
          rows={8}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
        />
      </div>
    </>
  )
}