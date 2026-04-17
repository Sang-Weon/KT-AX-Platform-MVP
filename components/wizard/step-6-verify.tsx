"use client";

import { ShieldCheck, Check, AlertTriangle, Play, FileText, Lock, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ComplianceCheck {
  id: string;
  name: string;
  category: string;
  status: "passed" | "warning" | "failed" | "pending";
  description: string;
}

const COMPLIANCE_CHECKS: ComplianceCheck[] = [
  {
    id: "1",
    name: "PII 필드 토큰화",
    category: "개인정보보호",
    status: "passed",
    description: "모든 PII 필드가 토큰화 처리되었습니다",
  },
  {
    id: "2",
    name: "데이터 잔류 정책",
    category: "데이터 주권",
    status: "passed",
    description: "모든 데이터가 KR_SOVEREIGN 영역에 저장됩니다",
  },
  {
    id: "3",
    name: "소버린 LLM 라우팅",
    category: "AI 거버넌스",
    status: "passed",
    description: "금융 핵심 데이터는 소버린 LLM으로 라우팅됩니다",
  },
  {
    id: "4",
    name: "감사 로그 설정",
    category: "규제 준수",
    status: "passed",
    description: "7년 보존 정책으로 감사 로그가 설정되었습니다",
  },
  {
    id: "5",
    name: "동의 확인 로직",
    category: "개인정보보호",
    status: "warning",
    description: "마케팅 동의 확인 로직이 포함되어야 합니다",
  },
  {
    id: "6",
    name: "Write-back 거버넌스",
    category: "운영 안전성",
    status: "passed",
    description: "L2 거버넌스 레벨로 Saga 패턴이 적용됩니다",
  },
];

export function Step6Verify() {
  const { nextStep, prevStep } = usePlatformStore();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const passedCount = COMPLIANCE_CHECKS.filter((c) => c.status === "passed").length;
  const warningCount = COMPLIANCE_CHECKS.filter((c) => c.status === "warning").length;
  const failedCount = COMPLIANCE_CHECKS.filter((c) => c.status === "failed").length;

  const runDryRun = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">검증 및 테스트를 진행합니다</h2>
        <p className="text-muted-foreground mt-1">
          규제 준수 체크리스트를 확인하고 Dry Run 테스트를 수행합니다
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{COMPLIANCE_CHECKS.length}</div>
            <div className="text-xs text-muted-foreground">Total Checks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{passedCount}</div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{warningCount}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{failedCount}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            규제 준수 체크리스트
          </CardTitle>
          <CardDescription>
            금융 산업 규제 팩 기반 자동 검증 결과입니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {COMPLIANCE_CHECKS.map((check) => (
            <div
              key={check.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg",
                check.status === "passed" && "bg-success/5",
                check.status === "warning" && "bg-warning/5",
                check.status === "failed" && "bg-destructive/5"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                check.status === "passed" && "bg-success/10 text-success",
                check.status === "warning" && "bg-warning/10 text-warning",
                check.status === "failed" && "bg-destructive/10 text-destructive"
              )}>
                {check.status === "passed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{check.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {check.category}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {check.description}
                </div>
              </div>
              <Badge variant={
                check.status === "passed" ? "success" :
                check.status === "warning" ? "warning" : "destructive"
              }>
                {check.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dry Run */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Dry Run 테스트
          </CardTitle>
          <CardDescription>
            실제 데이터를 사용하지 않고 파이프라인을 시뮬레이션합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={runDryRun} 
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "실행 중..." : "Dry Run 실행"}
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              PII 처리 경로 보기
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              검증 리포트
            </Button>
          </div>

          {(isRunning || progress > 0) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>테스트 진행률</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {progress === 100 && (
                <div className="p-3 rounded-lg bg-success/10 text-success text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Dry Run 테스트가 성공적으로 완료되었습니다
                </div>
              )}
            </div>
          )}

          {/* PII Flow Preview */}
          <div className="p-4 rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-sovereign" />
              PII 데이터 처리 경로
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline">Customer.name</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="sovereign">토큰화</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline">SOTA K</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="sovereign">복원</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline">CRM API</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          이전 단계
        </Button>
        <Button onClick={nextStep} size="lg" disabled={failedCount > 0}>
          다음 단계로
        </Button>
      </div>
    </div>
  );
}
