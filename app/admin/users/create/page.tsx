"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Department = {
  id: number;
  name: string;
};

export default function CreateUserPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const [form, setForm] = useState({
  full_name: "",
  email: "",
  password: "",
  department_id: 0,
  token_limit: 100000,
  allowed_services: [] as string[],
});

  const services = [
    "text",
    "image",
    "document",
    "design",
    "presentation",
    "data_analysis",
    "more",
  ];

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/admin/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDepartments();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "department_id" || name === "token_limit"
          ? Number(value)
          : value,
    }));
  }

  function toggleService(service: string) {
    setForm((prev) => ({
      ...prev,
      allowed_services: prev.allowed_services.includes(service)
        ? prev.allowed_services.filter((item) => item !== service)
        : [...prev.allowed_services, service],
    }));
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);
  setMessage("");

  if (form.allowed_services.length === 0) {
    setMessage("Please select at least one AI service.");
    setLoading(false);
    return;
  }

  console.log("Submitting form:", form);
  console.log("Selected services:", form.allowed_services);

  const res = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (data.success) {
    setMessage("User created successfully.");

    setTimeout(() => {
      router.push("/admin/users");
      router.refresh();
    }, 800);
  } else {
    setMessage(data.error || "Something went wrong.");
  }

  setLoading(false);
}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Create User
        </h1>

        <p className="mt-2 text-slate-500">
          Add a new user and assign AI access.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6"
      >
        {/* Full Name */}

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border px-4 py-3 text-slate-800"
          />
        </div>

        {/* Email */}

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border px-4 py-3 text-slate-800"
          />
        </div>

        {/* Password */}

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Temporary Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border px-4 py-3 text-slate-800"
          />
        </div>

        {/* Department */}

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Department
          </label>

          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border px-4 py-3 text-slate-800"
          >
            <option value={0}>
              Select Department
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Token */}

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Daily Token Quota
          </label>

          <input
            type="number"
            name="token_limit"
            value={form.token_limit}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border px-4 py-3 text-slate-800"
          />
        </div>

        {/* Services */}

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Allowed Services
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {services.map((service) => (
              <label
                key={service}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
              >
                <input
                  type="checkbox"
                  checked={form.allowed_services.includes(service)}
                  onChange={() => toggleService(service)}
                />

                <span className="capitalize text-slate-700">
                  {service}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="rounded-xl bg-[#006A4E] px-6 py-3 font-semibold text-white hover:bg-[#00563f] disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>

        {message && (
          <p className="text-sm text-slate-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}