"use client";

import { Shield, Lock, Sparkles, AlertTriangle, Check, Info, Building2, Cloud, Brain, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlatformStore, Industry, OntologyEngine, CloudProvider } from "@/lib/store";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  { value: "financial", label: "금융 (은행/보험/카드/증권)", icon: Building2 },
  { value: "public", label: "공공 (정부/공기업)", icon: Building2 },
  { value: "healthcare", label: "의료 (병원/제약)", icon: Building2 },
  { value: "manufacturing", label: "제조 (공장/물류)", icon: Building2 },
  { value: "retail", label: "유통 (쇼핑/이커머스)", icon: Building2 },
  { value: "defense", label: "국방 (군사/보안)", icon: Building2 },
  { value: "general", label: "일반 기업", icon: Building2 },
];

const COMPLIANCE_PACKS: Record<Industry, { id: string; name: string; required: boolean }[]> = {
  financial: [
    { id: "REG-001", name: "전자금융거래법", required: true },
    { id: "REG-002", name: "신용정보법", required: true },
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
    { id: "REG-004", name: "금융분야 클라우드 가이드", required: true },
    { id: "REG-005", name: "EU GDPR", required: false },
    { id: "REG-006", name: "PCI-DSS", required: false },
  ],
  public: [
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
    { id: "REG-007", name: "클라우드 보안 인증", required: true },
    { id: "REG-008", name: "정보보호 관리체계 (ISMS)", required: true },
  ],
  healthcare: [
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
    { id: "REG-009", name: "의료법", required: true },
    { id: "REG-010", name: "개인정보 특례법", required: true },
  ],
  manufacturing: [
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
  ],
  retail: [
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
    { id: "REG-006", name: "PCI-DSS", required: false },
  ],
  defense: [
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
    { id: "REG-011", name: "국방보안 지침", required: true },
    { id: "REG-012", name: "암호화 규정", required: true },
  ],
  general: [
    { id: "REG-003", name: "개인정보보호법 (PIPA)", required: true },
  ],
};

const ONTOLOGY_ENGINES: { value: OntologyEngine; name: string; description: string; recommended?: Industry[] }[] = [
  { value: "neo4j", name: "Neo4j", description: "그래프 관계 탐색에 최적화, GraphRAG 지원", recommended: ["financial", "public"] },
  { value: "databricks", name: "Databricks", description: "대규모 데이터 레이크 통합, ML 파이프라인", recommended: ["manufacturing", "retail"] },
  { value: "tigergraph", name: "TigerGraph", description: "실시간 대규모 그래프 분석, 이상거래 탐지", recommended: ["financial"] },
  { value: "janusgraph", name: "JanusGraph", description: "오픈소스, Cassandra/HBase 인프라 활용" },
  { value: "palantir_foundry", name: "Palantir Foundry", description: "엔터프라이즈 풀스택, FDE 지원" },
];

const LLM_MODELS = [
  { value: "claude_sonnet", name: "Claude Sonnet", description: "범용 대화, 코드 생성" },
  { value: "claude_opus", name: "Claude Opus", description: "복잡 추론, 전략 분석" },
  { value: "claude_haiku", name: "Claude Haiku", description: "대량 배치, 분류" },
  { value: "gpt_4o", name: "GPT-4o", description: "MS 생태계 통합" },
  { value: "gpt_4o_mini", name: "GPT-4o mini", description: "빠른 응답, 비용 효율" },
  { value: "sota_k", name: "SOTA K", description: "한국 법률, 규제 특화" },
  { value: "midm_2", name: "Mi:dm 2.0", description: "완전 소버린, 온프레미스" },
  { value: "llama_k", name: "Llama K", description: "오픈소스 커스텀 파인튜닝" },
];

const CLOUD_PROVIDERS: { value: CloudProvider; name: string; description: string; sovereign: number; suitableFor: Industry[] }[] = [
  { value: "kt_spc", name: "KT Cloud SPC", description: "소버린, 금융 최적", sovereign: 5, suitableFor: ["financial", "public", "defense", "healthcare"] },
  { value: "azure_kr", name: "Azure Korea", description: "MS 생태계, Copilot 연동", sovereign: 4, suitableFor: ["general", "manufacturing", "retail"] },
  { value: "aws_seoul", name: "AWS Seoul", description: "AWS 네이티브, 글로벌 확장", sovereign: 4, suitableFor: ["general", "retail"] },
  { value: "gcp_seoul", name: "GCP Seoul", description: "BigQuery/Vertex AI 생태계", sovereign: 4, suitableFor: ["general"] },
  { value: "on_premise", name: "On-Premise", description: "완전 통제, 폐쇄망 가능", sovereign: 5, suitableFor: ["defense", "healthcare", "financial"] },
  { value: "hybrid", name: "Hybrid", description: "핵심: 온프레미스 + AI: 클라우드", sovereign: 5, suitableFor: ["financial", "public", "defense"] },
];

export function Step0Environment() {
  const { environment, setEnvironment, nextStep } = usePlatformStore();
  const compliancePacks = COMPLIANCE_PACKS[environment.industry] || [];

  const selectedOntology = ONTOLOGY_ENGINES.find((e) => e.value === environment.ontologyEngine);
  const selectedCloud = CLOUD_PROVIDERS.find((c) => c.value === environment.cloudProvider);

  const isCloudSuitable = selectedCloud?.suitableFor.includes(environment.industry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">플랫폼 환경을 설정합니다</h2>
        <p className="text-muted-foreground mt-1">
          산업, 온톨로지 엔진, AI 모델, 클라우드 인프라를 선택합니다
        </p>
      </div>

      {/* Section 1: Industry & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            산업 및 규제 환경
          </CardTitle>
          <CardDescription>산업을 선택하면 해당 규제가 자동으로 적용됩니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>산업</Label>
            <Select
              value={environment.industry}
              onValueChange={(value: Industry) => setEnvironment({ industry: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-sovereign" />
              자동 적용될 규제 팩
            </Label>
            <div className="space-y-2">
              {compliancePacks.map((pack) => (
                <div
                  key={pack.id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg border",
                    pack.required ? "bg-sovereign/5 border-sovereign/20" : "bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={pack.required || environment.compliancePacks?.includes(pack.id)}
                    disabled={pack.required}
                    onCheckedChange={(checked) => {
                      if (!pack.required) {
                        const current = environment.compliancePacks || [];
                        setEnvironment({
                          compliancePacks: checked
                            ? [...current, pack.id]
                            : current.filter((id) => id !== pack.id),
                        });
                      }
                    }}
                  />
                  <div className="flex-1">
                    <span className="text-sm">{pack.name}</span>
                  </div>
                  {pack.required && (
                    <Badge variant="sovereign" className="gap-1">
                      <Lock className="h-3 w-3" />
                      필수
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              규제 팩은 비활성화할 수 없으며, 추가만 가능합니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Ontology Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            온톨로지 엔진
          </CardTitle>
          <CardDescription>데이터 그래프를 관리할 엔진을 선택합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ONTOLOGY_ENGINES.map((engine) => {
              const isRecommended = engine.recommended?.includes(environment.industry);
              const isSelected = environment.ontologyEngine === engine.value;

              return (
                <button
                  key={engine.value}
                  onClick={() => setEnvironment({ ontologyEngine: engine.value })}
                  className={cn(
                    "relative p-4 rounded-lg border text-left transition-all",
                    isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
                    !isSelected && "hover:border-muted-foreground/50 hover:bg-muted/50"
                  )}
                >
                  {isRecommended && (
                    <Badge className="absolute -top-2 -right-2 gap-1" variant="default">
                      <Sparkles className="h-3 w-3" />
                      AI 추천
                    </Badge>
                  )}
                  <div className="font-medium">{engine.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {engine.description}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedOntology?.recommended?.includes(environment.industry) && (
            <div className="mt-4 p-3 rounded-lg bg-info/10 text-sm text-info flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                AI 추천 이유: {environment.industry === "financial" ? "금융 이탈방지에는 Neo4j의 관계 탐색이 최적입니다. 고객 관계 그래프를 직관적으로 구성할 수 있고, Text2Cypher로 자연어 쿼리가 가능합니다." : "이 산업에 최적화된 엔진입니다."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: AI Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI 모델
          </CardTitle>
          <CardDescription>Agent 추론에 사용할 LLM을 선택합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>기본 모델 (Agent 추론 / 대화)</Label>
              <Select
                value={environment.llmDefault}
                onValueChange={(value) => setEnvironment({ llmDefault: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.value === "claude_sonnet" && (
                          <Badge variant="secondary" className="text-xs">추천</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>복잡 추론 (Fallback)</Label>
              <Select
                value={environment.llmComplex}
                onValueChange={(value) => setEnvironment({ llmComplex: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>배치 처리</Label>
              <Select
                value={environment.llmBatch}
                onValueChange={(value) => setEnvironment({ llmBatch: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                한국어 규제 특화
                <Lock className="h-3 w-3 text-sovereign" />
              </Label>
              <Select value={environment.llmRegulatory} disabled>
                <SelectTrigger className="opacity-75">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sota_k">SOTA K (자동설정)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                금융 산업을 선택하셨으므로 자동 고정됩니다
              </p>
            </div>
          </div>

          {environment.industry === "financial" && (
            <div className="p-3 rounded-lg bg-warning/10 text-sm text-warning flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                금융 핵심 데이터 처리 시 GPT-4o 사용이 제한됩니다 (해외 API - 금융위 가이드라인). 해당 작업은 SOTA K 또는 Mi:dm으로 자동 라우팅됩니다.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Cloud Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            클라우드 인프라
          </CardTitle>
          <CardDescription>플랫폼을 배포할 클라우드를 선택합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CLOUD_PROVIDERS.map((cloud) => {
              const isSuitable = cloud.suitableFor.includes(environment.industry);
              const isSelected = environment.cloudProvider === cloud.value;

              return (
                <button
                  key={cloud.value}
                  onClick={() => setEnvironment({ cloudProvider: cloud.value })}
                  className={cn(
                    "relative p-4 rounded-lg border text-left transition-all",
                    isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
                    !isSelected && "hover:border-muted-foreground/50 hover:bg-muted/50"
                  )}
                >
                  {isSuitable && cloud.value === "kt_spc" && (
                    <Badge className="absolute -top-2 -right-2 gap-1" variant="sovereign">
                      <Shield className="h-3 w-3" />
                      추천
                    </Badge>
                  )}
                  <div className="font-medium">{cloud.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {cloud.description}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Shield
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < cloud.sovereign ? "text-sovereign" : "text-muted"
                        )}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      소버린
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedCloud && (
            <div className={cn(
              "mt-4 p-3 rounded-lg text-sm flex items-start gap-2",
              isCloudSuitable ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            )}>
              {isCloudSuitable ? (
                <>
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    {selectedCloud.name}은(는) {environment.industry === "financial" ? "금융 핵심업무에 적합합니다" : "선택하신 산업에 적합합니다"}
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    {selectedCloud.name}은(는) {environment.industry === "financial" ? "금융 핵심업무에 부적합합니다 (가이드라인 미충족)" : "선택하신 산업에 권장되지 않습니다"}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">환경 설정 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">산업</dt>
              <dd className="font-medium mt-1">
                {INDUSTRIES.find((i) => i.value === environment.industry)?.label.split(" ")[0]}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">온톨로지</dt>
              <dd className="font-medium mt-1">
                {ONTOLOGY_ENGINES.find((e) => e.value === environment.ontologyEngine)?.name}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">AI 모델</dt>
              <dd className="font-medium mt-1">
                {LLM_MODELS.find((m) => m.value === environment.llmDefault)?.name}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">클라우드</dt>
              <dd className="font-medium mt-1">
                {CLOUD_PROVIDERS.find((c) => c.value === environment.cloudProvider)?.name}
              </dd>
            </div>
          </dl>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">보안 수준:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Shield key={i} className="h-4 w-4 text-sovereign" />
              ))}
            </div>
            <span className="text-sm font-medium text-sovereign">(최고)</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={nextStep} size="lg">
          다음 단계로
        </Button>
      </div>
    </div>
  );
}
