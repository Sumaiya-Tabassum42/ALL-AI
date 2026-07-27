"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    name: string;
    tokensUsed: number;
  }[];
};

export default function TopTokenChart({ data }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Top Token Consumers
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Users with the highest token usage.
        </p>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              left: 40,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis dataKey="name" type="category" width={130} />

            <Tooltip />

            <Bar dataKey="tokensUsed" radius={[0, 8, 8, 0]} fill="#006A4E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
