"use client";

type User = {
  id: string;
  name: string;
  department: string;
  conversations: number;
  tokensUsed: number;
};

type Props = {
  users: User[];
};

export default function ActiveUsersTable({ users }: Props) {
  const maxTokens = Math.max(...users.map((u) => u.tokensUsed), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Most Active Users
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ranked by conversation activity.
        </p>
      </div>

      <div className="space-y-5">
        {users.map((user, index) => {
          const percentage = (user.tokensUsed / maxTokens) * 100;

          return (
            <div key={user.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006A4E]/10 font-bold text-[#006A4E]">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : index + 1}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>

                    <p className="text-sm text-slate-500">{user.department}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {user.conversations} Chats
                  </p>

                  <p className="text-sm text-slate-500">
                    {user.tokensUsed.toLocaleString()} tokens
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#006A4E]"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
