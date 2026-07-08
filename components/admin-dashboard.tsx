'use client'

import { useMemo, useState } from 'react'
import { ALL_SERVICES } from '@/lib/constants'

const departments = [
  'Finance',
  'Health',
  'Education',
  'Transport',
]

export default function AdminDashboard() {
  const [formState, setFormState] = useState({
    email: '',
    fullName: '',
    password: '',
    department: departments[0],
    tokenLimit: 1000,
    allowedServices: ALL_SERVICES,
  })
  const [message, setMessage] = useState({ text: '', type: '' as 'success' | 'error' | '' })
  const [loading, setLoading] = useState(false)

  const selectedCount = useMemo(
    () => formState.allowedServices.length,
    [formState.allowedServices]
  )

  function handleChange(field: string, value: string | number | string[]) {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function toggleService(service: string) {
    setFormState((prev) => {
      const allowed = prev.allowedServices.includes(service)
        ? prev.allowedServices.filter((item) => item !== service)
        : [...prev.allowedServices, service]

      return {
        ...prev,
        allowedServices: allowed,
      }
    })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
          full_name: formState.fullName,
          department: formState.department,
          token_limit: formState.tokenLimit,
          allowed_services: formState.allowedServices,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create account')
      }

      setMessage({ text: 'User account created successfully.', type: 'success' })
      setFormState({
        email: '',
        fullName: '',
        password: '',
        department: departments[0],
        tokenLimit: 1000,
        allowedServices: ALL_SERVICES,
      })
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Something went wrong', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-[#F5FBF7] p-8 shadow-sm">
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Admin Dashboard
        </p>
        <h2 className="text-3xl font-bold text-slate-900">
          Create user accounts with department and services
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Configure token limits and allowed services, then share credentials with your users.
          Only the selected services will be available after login.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            value={formState.fullName}
            onChange={(event) => handleChange('fullName', event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#006A4E] focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            value={formState.email}
            onChange={(event) => handleChange('email', event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#006A4E] focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={formState.password}
            onChange={(event) => handleChange('password', event.target.value)}
            required
            minLength={6}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#006A4E] focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Department</label>
          <select
            value={formState.department}
            onChange={(event) => handleChange('department', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#006A4E] focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20"
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Token limit</label>
          <input
            type="number"
            value={formState.tokenLimit}
            min={100}
            onChange={(event) => handleChange('tokenLimit', Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-[#006A4E] focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Allowed services</label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {ALL_SERVICES.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  formState.allowedServices.includes(service)
                    ? 'border-[#006A4E] bg-[#E8F3EF] text-[#004C38]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-[#006A4E] hover:bg-[#F5FBF7]'
                }`}
              >
                <span className="font-semibold">{service}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {selectedCount} service{selectedCount === 1 ? '' : 's'} selected
          </p>
        </div>

        {message.text && (
          <div className={`sm:col-span-2 rounded-2xl px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {message.text}
          </div>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#006A4E] px-6 text-sm font-semibold text-white transition hover:bg-[#00543E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create User Account'}
          </button>
        </div>
      </form>
    </section>
  )
}
