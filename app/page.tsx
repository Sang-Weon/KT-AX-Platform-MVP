"use client";

import { PlatformHeader } from "@/components/platform/header";
import { PlatformSidebar } from "@/components/platform/sidebar";
import { WizardContent } from "@/components/wizard/wizard-content";
import { ProCodeContent } from "@/components/pro-code/pro-code-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlatformStore } from "@/lib/store";

export default function Home() {
  const { mode } = usePlatformStore();

  return (
    <div className="h-screen flex flex-col">
      <PlatformHeader />
      <div className="flex-1 flex overflow-hidden">
        {mode === "wizard" && <PlatformSidebar />}
        <main className="flex-1 overflow-hidden">
          {mode === "wizard" ? (
            <ScrollArea className="h-full">
              <WizardContent />
            </ScrollArea>
          ) : (
            <ProCodeContent />
          )}
        </main>
      </div>
    </div>
  );
}
