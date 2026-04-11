"use client";

import { Database, Plus, Check, AlertTriangle, Shield, Lock, Link2, Table2, FileJson } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DataSource {
  id: string;
  name: string;
  type: "database" | "api" | "file" | "streaming";
  icon: string;
  connected: boolean;
  tables?: string[];
  piiFields?: string[];
}

const SAMPLE_DATA_SOURCES: DataSource[] = [
  {
    id: "crm",
    name: "CRM 시스템",
    type: "database",
    icon: "database",
    connected: true,
    tables: ["customers", "contacts", "interactions"],
    piiFields: ["name", "phone", "email", "ssn"],
  },
  {
    id: "core-banking",
    name: "코어뱅킹",
    type: "database",
    icon: "database",
    connected: true,
    tables: ["accounts", "transactions", "loans"],
    piiFields: ["account_number", "balance", "ssn"],
  },
  {
    id: "marketing",
    name: "마케팅 플랫폼",
    type: "api",
    icon: "link",
    connected: false,
    tables: ["campaigns", "responses", "segments"],
  },
  {
    id: "call-center",
    name: "컨택센터",
    type: "api",
    icon: "link",
    connected: false,
    tables: ["calls", "tickets", "recordings"],
    piiFields: ["caller_id", "phone", "transcript"],
  },
];

export function Step2Data() {
  const { environment, nextStep, prevStep } = usePlatformStore();
  const [dataSources, setDataSources] = useState<DataSource[]>(SAMPLE_DATA_SOURCES);
  const [selectedSource, setSelectedSource] = useState<string | null>("crm");

  const selectedData = dataSources.find((d) => d.id === selectedSource);
  const connectedCount = dataSources.filter((d) => d.connected).length;

  const toggleConnection = (id: string) => {
    setDataSources((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, connected: !d.connected } : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">데이터 소스를 연결합니다</h2>
        <p className="text-muted-foreground mt-1">
          온톨로지에 포함할 데이터 소스를 선택하고 연결합니다
        </p>
      </div>

      {/* Connection Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{connectedCount}</div>
            <div className="text-xs text-muted-foreground">연결된 소스</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {dataSources.reduce((acc, d) => acc + (d.tables?.length || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">테이블</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {dataSources.reduce((acc, d) => acc + (d.piiFields?.length || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">PII 필드</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-1">
              <Shield className="h-5 w-5 text-sovereign" />
              <span className="text-lg font-bold text-sovereign">Active</span>
            </div>
            <div className="text-xs text-muted-foreground">Data Residency</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              데이터 소스
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dataSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  selectedSource === source.id && "bg-primary/10 border border-primary/20",
                  selectedSource !== source.id && "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  source.connected ? "bg-success/10" : "bg-muted"
                )}>
                  {source.type === "database" ? (
                    <Database className={cn("h-4 w-4", source.connected ? "text-success" : "text-muted-foreground")} />
                  ) : (
                    <Link2 className={cn("h-4 w-4", source.connected ? "text-success" : "text-muted-foreground")} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{source.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {source.tables?.length || 0} tables
                  </div>
                </div>
                {source.connected && (
                  <Check className="h-4 w-4 text-success shrink-0" />
                )}
              </button>
            ))}

            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">새 소스 추가</div>
            </button>
          </CardContent>
        </Card>

        {/* Source Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selectedData?.name || "소스를 선택하세요"}
              </CardTitle>
              {selectedData && (
                <Button
                  variant={selectedData.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleConnection(selectedData.id)}
                >
                  {selectedData.connected ? "연결 해제" : "연결"}
                </Button>
              )}
            </div>
            <CardDescription>
              {selectedData?.type === "database" ? "데이터베이스 연결" : "API 연결"}
            </CardDescription>
          </CardHeader>
          {selectedData && (
            <CardContent className="space-y-6">
              {/* Tables */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Table2 className="h-4 w-4" />
                  테이블
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedData.tables?.map((table) => (
                    <div
                      key={table}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      <Checkbox defaultChecked />
                      <span className="text-sm font-mono">{table}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PII Fields */}
              {selectedData.piiFields && selectedData.piiFields.length > 0 && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-warning" />
                    PII 필드 (자동 탐지됨)
                  </Label>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                      <div className="text-sm text-warning">
                        다음 필드에서 개인정보가 탐지되었습니다. 자동으로 토큰화가 적용됩니다.
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedData.piiFields.map((field) => (
                        <Badge key={field} variant="warning" className="gap-1 font-mono">
                          <Lock className="h-3 w-3" />
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Connection Config */}
              <div className="space-y-3">
                <Label>연결 설정</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Host</Label>
                    <Input
                      placeholder="db.example.com"
                      defaultValue={selectedData.connected ? "internal.kt.co.kr" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Port</Label>
                    <Input placeholder="5432" defaultValue={selectedData.connected ? "5432" : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Database</Label>
                    <Input
                      placeholder="database_name"
                      defaultValue={selectedData.connected ? selectedData.id + "_db" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Schema</Label>
                    <Input placeholder="public" defaultValue={selectedData.connected ? "public" : ""} />
                  </div>
                </div>
              </div>

              {/* Data Residency */}
              <div className="p-3 rounded-lg bg-sovereign/10 border border-sovereign/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-sovereign" />
                  <span className="text-sm font-medium text-sovereign">Data Residency 검증 완료</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  이 데이터 소스는 KR_SOVEREIGN 영역 내에 위치하며, 금융 규제 요건을 충족합니다.
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

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
