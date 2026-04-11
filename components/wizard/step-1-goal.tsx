"use client";

import { Target, Sparkles, TrendingDown, Users, AlertTriangle, DollarSign, Headphones, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

const GOAL_TEMPLATES = [
  {
    id: "churn-prevention",
    name: "고객 이탈 방지",
    description: "고위험 이탈 고객을 식별하고 리텐션 캠페인을 자동화합니다",
    icon: TrendingDown,
    metrics: ["이탈률 감소", "LTV 증가", "리텐션율 향상"],
    industry: ["financial", "retail", "general"],
  },
  {
    id: "fraud-detection",
    name: "이상거래 탐지",
    description: "실시간 거래 모니터링으로 사기를 탐지하고 차단합니다",
    icon: AlertTriangle,
    metrics: ["사기율 감소", "오탐률 감소", "탐지 속도 향상"],
    industry: ["financial"],
  },
  {
    id: "customer-360",
    name: "고객 360도 뷰",
    description: "모든 접점의 고객 데이터를 통합하고 인사이트를 도출합니다",
    icon: Users,
    metrics: ["고객 만족도", "크로스셀 성과", "응대 시간 감소"],
    industry: ["financial", "retail", "healthcare", "general"],
  },
  {
    id: "revenue-optimization",
    name: "수익 최적화",
    description: "AI 기반 가격 책정과 프로모션 최적화를 수행합니다",
    icon: DollarSign,
    metrics: ["매출 증가", "마진 개선", "재고 회전율"],
    industry: ["retail", "manufacturing", "general"],
  },
  {
    id: "smart-contact-center",
    name: "스마트 컨택센터",
    description: "AI 상담원이 고객 문의를 자동으로 분류하고 응대합니다",
    icon: Headphones,
    metrics: ["응대율 향상", "처리 시간 감소", "고객 만족도"],
    industry: ["financial", "retail", "public", "general"],
  },
  {
    id: "operational-intelligence",
    name: "운영 인텔리전스",
    description: "운영 데이터를 분석하여 효율성을 개선합니다",
    icon: BarChart3,
    metrics: ["운영 효율성", "비용 절감", "생산성 향상"],
    industry: ["manufacturing", "public", "general"],
  },
];

export function Step1Goal() {
  const { environment, project, setProject, nextStep, prevStep } = usePlatformStore();
  const [selectedGoal, setSelectedGoal] = useState<string>("churn-prevention");

  const filteredTemplates = GOAL_TEMPLATES.filter((t) =>
    t.industry.includes(environment.industry)
  );

  const selectedTemplate = GOAL_TEMPLATES.find((t) => t.id === selectedGoal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">자동화 목표를 정의합니다</h2>
        <p className="text-muted-foreground mt-1">
          구현하고자 하는 비즈니스 목표를 선택하거나 직접 정의합니다
        </p>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 정보</CardTitle>
          <CardDescription>프로젝트의 기본 정보를 입력합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">프로젝트 이름</Label>
              <Input
                id="project-name"
                placeholder="예: NH-Bank-Churn-Prevention"
                value={project.name}
                onChange={(e) => setProject({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-version">버전</Label>
              <Input
                id="project-version"
                placeholder="1.0.0"
                value={project.version}
                onChange={(e) => setProject({ version: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">설명</Label>
            <Input
              id="project-description"
              placeholder="프로젝트 목적과 범위를 간략히 설명합니다"
              value={project.description}
              onChange={(e) => setProject({ description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Goal Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            목표 템플릿
          </CardTitle>
          <CardDescription>
            산업에 맞는 템플릿을 선택하거나 커스텀 목표를 정의합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedGoal === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedGoal(template.id)}
                  className={cn(
                    "relative p-4 rounded-lg border text-left transition-all",
                    isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
                    !isSelected && "hover:border-muted-foreground/50 hover:bg-muted/50"
                  )}
                >
                  {template.id === "churn-prevention" && (
                    <Badge className="absolute -top-2 -right-2 gap-1" variant="default">
                      <Sparkles className="h-3 w-3" />
                      인기
                    </Badge>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-medium">{template.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {template.description}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Goal Option */}
          <div className="mt-4 p-4 rounded-lg border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">커스텀 목표 정의</div>
                <div className="text-xs text-muted-foreground">
                  AI 어시스턴트가 목표 정의를 도와드립니다
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Goal Details */}
      {selectedTemplate && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <selectedTemplate.icon className="h-5 w-5 text-primary" />
              {selectedTemplate.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{selectedTemplate.description}</p>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">주요 성과 지표 (KPI)</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.metrics.map((metric) => (
                  <Badge key={metric} variant="outline" className="gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-background/50 text-sm">
              <div className="font-medium mb-1">AI 분석 결과</div>
              <p className="text-muted-foreground text-xs">
                {selectedGoal === "churn-prevention" 
                  ? "금융 산업에서 이탈 방지는 평균 LTV의 25% 이상 가치를 창출합니다. Neo4j 온톨로지와 결합하면 고객 관계 그래프 기반의 정교한 이탈 예측이 가능합니다."
                  : "선택하신 목표에 대한 상세 분석이 진행됩니다."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
