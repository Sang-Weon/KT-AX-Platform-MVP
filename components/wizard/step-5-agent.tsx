"use client";

import { Bot, Plus, Settings2, Play, Pause, Shield, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  role: string;
  llm: string;
  status: "active" | "paused" | "draft";
  tools: string[];
}

const SAMPLE_AGENTS: Agent[] = [
  {
    id: "1",
    name: "ChurnPredictionAgent",
    role: "고객 이탈 위험도를 예측하고 분석합니다",
    llm: "claude_sonnet",
    status: "active",
    tools: ["GraphQuery", "MLPredict", "DataEnrich"],
  },
  {
    id: "2",
    name: "OfferRecommendationAgent",
    role: "최적의 리텐션 오퍼를 추천합니다",
    llm: "sota_k",
    status: "active",
    tools: ["OfferCatalog", "CustomerProfile", "RuleEngine"],
  },
  {
    id: "3",
    name: "CampaignExecutionAgent",
    role: "캠페인을 실행하고 결과를 추적합니다",
    llm: "claude_haiku",
    status: "paused",
    tools: ["CRMApi", "NotificationHub", "Analytics"],
  },
];

const LLM_OPTIONS = [
  { value: "claude_sonnet", label: "Claude Sonnet", sovereign: false },
  { value: "claude_opus", label: "Claude Opus", sovereign: false },
  { value: "claude_haiku", label: "Claude Haiku", sovereign: false },
  { value: "sota_k", label: "SOTA K", sovereign: true },
  { value: "midm_2", label: "Mi:dm 2.0", sovereign: true },
];

export function Step5Agent() {
  const { nextStep, prevStep } = usePlatformStore();
  const [agents] = useState<Agent[]>(SAMPLE_AGENTS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Agent를 구성합니다</h2>
        <p className="text-muted-foreground mt-1">
          CrewAI 기반의 Agent를 구성하고 역할을 정의합니다
        </p>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{agents.length}</div>
            <div className="text-xs text-muted-foreground">Total Agents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {agents.filter((a) => a.status === "active").length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-sovereign">
              {agents.filter((a) => ["sota_k", "midm_2"].includes(a.llm)).length}
            </div>
            <div className="text-xs text-muted-foreground">Sovereign LLM</div>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agents
            </CardTitle>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              새 Agent
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {agents.map((agent) => {
            const llmOption = LLM_OPTIONS.find((l) => l.value === agent.llm);
            
            return (
              <Card key={agent.id} className={cn(
                "bg-muted/30",
                agent.status === "paused" && "opacity-60"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        agent.status === "active" ? "bg-success/10" : "bg-muted"
                      )}>
                        <Bot className={cn(
                          "h-5 w-5",
                          agent.status === "active" ? "text-success" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-mono">{agent.name}</CardTitle>
                        <CardDescription className="text-xs">{agent.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={agent.status === "active" ? "success" : "secondary"}>
                        {agent.status}
                      </Badge>
                      <Button size="icon" variant="ghost">
                        {agent.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LLM Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        LLM Model
                      </Label>
                      <Select defaultValue={agent.llm}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LLM_OPTIONS.map((llm) => (
                            <SelectItem key={llm.value} value={llm.value}>
                              <div className="flex items-center gap-2">
                                {llm.label}
                                {llm.sovereign && (
                                  <Shield className="h-3 w-3 text-sovereign" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tools */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Tools</Label>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        <Button size="sm" variant="ghost" className="h-6 px-2 gap-1">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sovereign Notice */}
                  {llmOption?.sovereign && (
                    <div className="p-2 rounded-lg bg-sovereign/10 text-xs flex items-center gap-2">
                      <Shield className="h-4 w-4 text-sovereign shrink-0" />
                      <span className="text-sovereign">
                        소버린 LLM을 사용하여 데이터가 국내에서만 처리됩니다
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* AI Workflow Suggestion */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">AI 추천 워크플로</div>
              <p className="text-sm text-muted-foreground mt-1">
                현재 구성된 Agent들로 다음 워크플로를 생성할 수 있습니다:
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <Badge variant="outline">ChurnPredictionAgent</Badge>
                <span className="text-muted-foreground">→</span>
                <Badge variant="outline">OfferRecommendationAgent</Badge>
                <span className="text-muted-foreground">→</span>
                <Badge variant="outline">CampaignExecutionAgent</Badge>
              </div>
              <Button size="sm" className="mt-3 gap-1">
                <Sparkles className="h-4 w-4" />
                워크플로 생성
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          이전 단계
        </Button>
        <Button onClick={nextStep} size="lg">
          다음 단계로
        </Button>
      </div>
    </div>
  );
}
