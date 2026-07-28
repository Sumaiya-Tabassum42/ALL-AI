"use client";

import { Users, Coins, TrendingUp, Activity } from "lucide-react";

type Props = {
  totalUsers: number;
  totalAssignedTokens: number;
  totalUsedTokens: number;
  averageUsage: number;
};

export default function AnalyticsCards({
  totalUsers,
  totalAssignedTokens,
  totalUsedTokens,
  averageUsage,
}: Props) {
  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Assigned Tokens",
      value: totalAssignedTokens.toLocaleString(),
      icon: Coins,
    },
    {
      title: "Tokens Used",
      value: totalUsedTokens.toLocaleString(),
      icon: Activity,
    },
    {
      title: "Average Usage",
      value: `${averageUsage}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>
              </div>

              <div className="rounded-xl bg-[#006A4E]/10 p-3">
                <Icon size={24} className="text-[#006A4E]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
