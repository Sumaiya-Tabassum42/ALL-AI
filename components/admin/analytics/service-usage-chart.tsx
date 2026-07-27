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
    service: string;
    count: number;
  }[];
};

export default function ServiceUsageChart({ data }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          AI Service Usage
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Number of conversations by AI service.
        </p>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 5,
              left: 10,
              bottom: 10,
            }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, (dataMax: number) => dataMax * 1.05]}
            />

            <YAxis
              dataKey="service"
              type="category"
              width={120}
              tick={{
                fill: "#334155",
                fontSize: 14,
              }}
              dx={-35}
            />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#006A4E"
              radius={[0, 8, 8, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
