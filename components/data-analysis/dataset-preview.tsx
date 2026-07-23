'use client'

interface Props {
  data: any[]
}

export default function DatasetPreview({ data }: Props) {
  if (!data || data.length === 0) return null

  const columns = Object.keys(data[0])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Dataset Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {data.length} Rows • {columns.length} Columns
        </p>
      </div>

      <div className="max-h-[450px] overflow-auto">

        <table className="min-w-full border-collapse">

          <thead className="sticky top-0 bg-slate-100">

            <tr>

              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap"
                >
                  {column}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700 whitespace-nowrap"
                  >
                    {row[column]?.toString() ?? '-'}
                  </td>
                ))}
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}