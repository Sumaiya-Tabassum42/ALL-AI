"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  usedTokens: number;
  remainingTokens: number;
};

export default function TokenDistribution({
  usedTokens,
  remainingTokens,
}: Props) {
  const data = [
    {
      name: "Used",
      value: usedTokens,
    },
    {
      name: "Remaining",
      value: remainingTokens,
    },
  ];

  const COLORS = [
    "#006A4E", // Used
    "#34D399", // Remaining
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Token Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Used vs remaining platform tokens.
        </p>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
