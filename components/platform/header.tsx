"use client";

import { Shield, Bell, Settings, HelpCircle, ChevronDown, Wand2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PlatformHeader() {
  const { mode, setMode, project } = usePlatformStore();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AX</span>
          </div>
          <Badge variant="outline" className="text-xs">Enterprise</Badge>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Button variant="ghost" size="sm" className="text-sm">
            Overview
          </Button>
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            Projects
          </Button>
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            Agents
          </Button>
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            Monitoring
          </Button>
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            Settings
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode Toggle */}
        <div className="mode-toggle">
          <div
            className="slider"
            style={{
              left: mode === "wizard" ? "4px" : "calc(50% + 2px)",
              width: "calc(50% - 6px)",
            }}
          />
          <button
            data-active={mode === "wizard"}
            onClick={() => setMode("wizard")}
            className="flex items-center gap-1.5"
          >
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Wizard</span>
          </button>
          <button
            data-active={mode === "pro-code"}
            onClick={() => setMode("pro-code")}
            className="flex items-center gap-1.5"
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Pro-Code</span>
          </button>
        </div>

        {/* Sovereign Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-sovereign/10 text-sovereign">
          <Shield className="h-4 w-4" />
          <span className="text-xs font-medium">Sovereign</span>
        </div>

        {/* Actions */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

        {/* User */}
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            KT
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
