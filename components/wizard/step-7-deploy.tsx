"use client";

import { Rocket, Check, Cloud, Shield, Activity, AlertTriangle, ExternalLink, Copy, GitBranch } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DeploymentStatus {
  stage: string;
  status: "pending" | "running" | "completed" | "error";
}

export function Step7Deploy() {
  const { environment, project, prevStep } = usePlatformStore();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [stages, setStages] = useState<DeploymentStatus[]>([
    { stage: "설정 검증", status: "pending" },
    { stage: "YAML 생성", status: "pending" },
    { stage: "온톨로지 배포", status: "pending" },
    { stage: "Agent 배포", status: "pending" },
    { stage: "모니터링 설정", status: "pending" },
  ]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    for (let i = 0; i < stages.length; i++) {
      setStages((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx === i ? "running" : idx < i ? "completed" : "pending",
        }))
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    
    setStages((prev) => prev.map((s) => ({ ...s, status: "completed" })));
    setIsDeploying(false);
    setDeploymentComplete(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">배포 및 모니터링</h2>
        <p className="text-muted-foreground mt-1">
          파이프라인을 배포하고 실시간 모니터링을 설정합니다
        </p>
      </div>

      {/* Deployment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>배포 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">프로젝트</dt>
              <dd className="font-medium mt-1">{project.name || "Untitled Project"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">클라우드</dt>
              <dd className="font-medium mt-1 flex items-center gap-1">
                <Cloud className="h-4 w-4" />
                {environment.cloudProvider === "kt_spc" ? "KT Cloud SPC" : environment.cloudProvider}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">환경</dt>
              <dd className="font-medium mt-1">Production</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">보안 수준</dt>
              <dd className="font-medium mt-1 flex items-center gap-1">
                <Shield className="h-4 w-4 text-sovereign" />
                <span className="text-sovereign">Sovereign</span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Deployment Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            배포 단계
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stages.map((stage, idx) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                stage.status === "completed" && "bg-success text-success-foreground",
                stage.status === "running" && "bg-primary text-primary-foreground animate-pulse",
                stage.status === "pending" && "bg-muted text-muted-foreground",
                stage.status === "error" && "bg-destructive text-destructive-foreground"
              )}>
                {stage.status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : stage.status === "running" ? (
                  <Activity className="h-4 w-4" />
                ) : stage.status === "error" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <span className="text-sm">{idx + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{stage.stage}</div>
              </div>
              <Badge variant={
                stage.status === "completed" ? "success" :
                stage.status === "running" ? "default" :
                stage.status === "error" ? "destructive" : "secondary"
              }>
                {stage.status === "completed" ? "완료" :
                 stage.status === "running" ? "진행 중" :
                 stage.status === "error" ? "오류" : "대기"}
              </Badge>
            </div>
          ))}

          {!deploymentComplete && (
            <Button 
              onClick={handleDeploy} 
              disabled={isDeploying}
              className="w-full gap-2"
              size="lg"
            >
              <Rocket className="h-4 w-4" />
              {isDeploying ? "배포 중..." : "배포 시작"}
            </Button>
          )}

          {deploymentComplete && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 space-y-3">
              <div className="flex items-center gap-2 text-success font-medium">
                <Check className="h-5 w-5" />
                배포가 완료되었습니다
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  모니터링 대시보드
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <GitBranch className="h-4 w-4" />
                  Git 저장소
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  YAML 복사
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated YAML Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">생성된 YAML</CardTitle>
          <CardDescription>platform.yaml</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono overflow-auto max-h-64">
{`# KT AX Platform Configuration
project:
  name: "${project.name || "untitled-project"}"
  version: "${project.version}"

engines:
  ontology:
    provider: ${environment.ontologyEngine}
    version: "5.x"
  llm:
    default: ${environment.llmDefault}
    complex_reasoning: ${environment.llmComplex}
    batch: ${environment.llmBatch}
    regulatory: ${environment.llmRegulatory}
  cloud:
    provider: ${environment.cloudProvider}
    region: kr-central-1

sovereign:
  industry: ${environment.industry}
  compliance_packs:
    - CRP-FINANCIAL-KR-v2.0
    - CRP-PIPA-KR-v1.0
  data_residency: KR_SOVEREIGN
  pii:
    auto_detect: true
    method: TOKENIZE
  audit:
    enabled: true
    retention: 7_years
    tamper_proof: true`}
          </pre>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          이전 단계
        </Button>
        <Button size="lg" disabled={!deploymentComplete}>
          대시보드로 이동
        </Button>
      </div>
    </div>
  );
}
