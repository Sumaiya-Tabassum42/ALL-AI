import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { Users, Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      daily_quota,
      remaining_tokens,
      account_status,
      department_id,
      departments!profiles_department_fk (
        id,
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("USERS FETCH ERROR:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Users Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage users, departments and AI quotas.
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 rounded-xl bg-[#006A4E] px-5 py-3 font-medium text-white transition hover:bg-[#00563f]"
        >
          <Plus size={20} />
          Create User
        </Link>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                User
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Department
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Daily Quota
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Remaining Tokens
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-center font-semibold text-slate-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {users && users.length > 0 ? (
              users.map((user: any) => (
                <tr
                  key={user.id}
                  className="border-b last:border-none hover:bg-slate-50"
                >
                  {/* User */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-[#006A4E]/10 p-3">
                        <Users
                          size={18}
                          className="text-[#006A4E]"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.full_name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}

                  <td className="px-6 py-5 text-slate-700">
                    {user.departments?.name ?? (
                      <span className="text-slate-400">
                        N/A
                      </span>
                    )}
                  </td>

                  {/* Daily Quota */}

                  <td className="px-6 py-5 font-medium text-slate-700">
                    {(user.daily_quota ?? 0).toLocaleString()}
                  </td>

                  {/* Remaining Tokens */}

                  <td className="px-6 py-5 font-medium text-slate-700">
                    {(user.remaining_tokens ?? 0).toLocaleString()}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        (user.account_status ?? "").toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.account_status ?? "Unknown"}
                    </span>
                  </td>

                  {/* Action */}

                  <td className="px-6 py-5 text-center">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}