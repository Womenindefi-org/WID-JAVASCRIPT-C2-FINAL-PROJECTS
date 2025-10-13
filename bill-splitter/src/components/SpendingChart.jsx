import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function SpendingChart({ data }) {
  // sample fallback data
  const sample = [
    { name: "Jan", amt: 120 },
    { name: "Feb", amt: 200 },
    { name: "Mar", amt: 150 },
    { name: "Apr", amt: 250 }
  ];
  const chartData = data || sample;

  return (
    <div className="bg-gray-900 rounded-xl p-4 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Area type="monotone" dataKey="amt" stroke="#A78BFA" fill="url(#grad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}