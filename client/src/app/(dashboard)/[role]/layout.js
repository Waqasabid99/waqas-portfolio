"use client";

import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function RoleLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      {/* Main content — offset on desktop to account for fixed sidebar */}
      <div className="flex-1 lg:ml-[250px] w-full">
        {children}
      </div>
    </div>
  );
}
