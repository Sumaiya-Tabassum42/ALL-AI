"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>

        <p className="text-sm text-slate-500">
          Bangladesh Government AI Portal
        </p>
      </div>
    </header>
  );
}
