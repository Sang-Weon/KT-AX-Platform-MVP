import { create } from "zustand";

export type Mode = "wizard" | "pro-code";
export type Industry = "financial" | "public" | "healthcare" | "manufacturing" | "retail" | "defense" | "general";
export type OntologyEngine = "neo4j" | "databricks" | "tigergraph" | "janusgraph" | "palantir_foundry";
export type LLMProvider = "claude_sonnet" | "claude_opus" | "claude_haiku" | "gpt_4o" | "gpt_4o_mini" | "sota_k" | "midm_2" | "llama_k";
export type CloudProvider = "kt_spc" | "azure_kr" | "aws_seoul" | "gcp_seoul" | "on_premise" | "hybrid";

export interface WizardStep {
  id: number;
  name: string;
  nameKr: string;
  icon: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 0, name: "environment", nameKr: "환경 설정", icon: "building", description: "플랫폼 환경을 설정합니다" },
  { id: 1, name: "goal", nameKr: "목표 정의", icon: "target", description: "자동화 목표를 정의합니다" },
  { id: 2, name: "data", nameKr: "데이터 연결", icon: "database", description: "데이터 소스를 연결합니다" },
  { id: 3, name: "relation", nameKr: "관계 설정", icon: "network", description: "온톨로지 관계를 설정합니다" },
  { id: 4, name: "event", nameKr: "이벤트 & 조건", icon: "zap", description: "트리거와 조건을 설정합니다" },
  { id: 5, name: "agent", nameKr: "Agent 구성", icon: "bot", description: "AI Agent를 구성합니다" },
  { id: 6, name: "verify", nameKr: "검증 & 테스트", icon: "shield-check", description: "규제 준수와 테스트를 진행합니다" },
  { id: 7, name: "deploy", nameKr: "배포 & 모니터", icon: "rocket", description: "배포하고 모니터링합니다" },
];

export interface EnvironmentConfig {
  industry: Industry;
  ontologyEngine: OntologyEngine;
  llmDefault: LLMProvider;
  llmComplex: LLMProvider;
  llmBatch: LLMProvider;
  llmRegulatory: LLMProvider;
  cloudProvider: CloudProvider;
  compliancePacks: string[];
}

export interface ProjectConfig {
  name: string;
  description: string;
  version: string;
}

interface PlatformState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  environment: EnvironmentConfig;
  setEnvironment: (config: Partial<EnvironmentConfig>) => void;
  
  project: ProjectConfig;
  setProject: (config: Partial<ProjectConfig>) => void;
  
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DEFAULT_ENVIRONMENT: EnvironmentConfig = {
  industry: "financial",
  ontologyEngine: "neo4j",
  llmDefault: "claude_sonnet",
  llmComplex: "claude_opus",
  llmBatch: "claude_haiku",
  llmRegulatory: "sota_k",
  cloudProvider: "kt_spc",
  compliancePacks: ["CRP-FINANCIAL-KR-v2.0", "CRP-PIPA-KR-v1.0"],
};

const DEFAULT_PROJECT: ProjectConfig = {
  name: "",
  description: "",
  version: "1.0.0",
};

export const usePlatformStore = create<PlatformState>((set, get) => ({
  mode: "wizard",
  setMode: (mode) => set({ mode }),
  
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < WIZARD_STEPS.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  environment: DEFAULT_ENVIRONMENT,
  setEnvironment: (config) =>
    set((state) => ({
      environment: { ...state.environment, ...config },
    })),
  
  project: DEFAULT_PROJECT,
  setProject: (config) =>
    set((state) => ({
      project: { ...state.project, ...config },
    })),
  
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
