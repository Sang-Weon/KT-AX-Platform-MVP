"use client";

import { PlatformHeader } from "@/components/platform/header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col">
      <PlatformHeader />
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </div>
  );
}
