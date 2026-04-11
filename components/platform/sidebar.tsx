"use client";

import {
  Building,
  Target,
  Database,
  Network,
  Zap,
  Bot,
  ShieldCheck,
  Rocket,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlatformStore, WIZARD_STEPS } from "@/lib/store";
import { cn } from "@/lib/utils";

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Building,
  target: Target,
  database: Database,
  network: Network,
  zap: Zap,
  bot: Bot,
  "shield-check": ShieldCheck,
  rocket: Rocket,
};

export function PlatformSidebar() {
  const { currentStep, setCurrentStep, isSidebarOpen, setSidebarOpen } = usePlatformStore();

  return (
    <aside
      className={cn(
        "border-r bg-card flex flex-col transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Collapse Toggle */}
      <div className="h-12 flex items-center justify-end px-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Steps */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {WIZARD_STEPS.map((step) => {
            const Icon = stepIcons[step.icon];
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                  isCurrent && "bg-primary/10 text-primary",
                  !isCurrent && "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all shrink-0",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      Step {step.id}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {step.nameKr}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Progress */}
      {isSidebarOpen && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground mb-2">
            Progress: {Math.round((currentStep / (WIZARD_STEPS.length - 1)) * 100)}%
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
