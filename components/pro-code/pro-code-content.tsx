"use client";

import { useState } from "react";
import { Play, Save, Copy, FileCode, FolderTree, Terminal, Shield, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlatformStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const FILE_TREE = [
  { name: "platform.yaml", type: "file", active: true },
  { name: "agents/", type: "folder", children: [
    { name: "churn-prediction.yaml", type: "file" },
    { name: "offer-recommendation.yaml", type: "file" },
    { name: "campaign-execution.yaml", type: "file" },
  ]},
  { name: "rules/", type: "folder", children: [
    { name: "retention-campaign.yaml", type: "file" },
  ]},
  { name: "ontology/", type: "folder", children: [
    { name: "objects.yaml", type: "file" },
    { name: "links.yaml", type: "file" },
  ]},
];

export function ProCodeContent() {
  const { environment, project } = usePlatformStore();
  const [validationResult, setValidationResult] = useState<"success" | "error" | null>(null);

  const yamlContent = `# KT AX Platform Configuration
# Project: ${project.name || "untitled-project"}
# Version: ${project.version}

project:
  name: "${project.name || "untitled-project"}"
  version: "${project.version}"
  description: "${project.description || ""}"

# Pluggable Engine Selection
engines:
  ontology:
    provider: ${environment.ontologyEngine}
    version: "5.x"
    connection:
      uri: "\${VAULT_NEO4J_URI}"
      auth: "\${VAULT_NEO4J_AUTH}"
    config:
      apoc_enabled: true
      gds_enabled: true

  data_catalog:
    provider: databricks_unity
    workspace: "\${DATABRICKS_WORKSPACE}"
    catalog: "prod_catalog"

  llm:
    default: ${environment.llmDefault}
    complex_reasoning: ${environment.llmComplex}
    batch: ${environment.llmBatch}
    regulatory: ${environment.llmRegulatory}  # Auto-fixed for regulated industries
    sovereign: midm_2                          # Sovereign fallback
    custom: []                                 # Custom model endpoints

  cloud:
    provider: ${environment.cloudProvider}
    region: kr-central-1
    confidential_computing: true

# Sovereign Configuration (Always-On)
sovereign:
  industry: ${environment.industry}
  compliance_packs:
    - CRP-FINANCIAL-KR-v2.0    # Auto-applied (cannot disable)
    - CRP-PIPA-KR-v1.0         # Auto-applied (cannot disable)

  data_residency: KR_SOVEREIGN
  cross_border_policy: BLOCK_ALL

  pii:
    auto_detect: true          # Cannot disable
    method: TOKENIZE
    fields_override:
      - field: customer_memo
        method: MASK

  encryption:
    at_rest: AES_256           # Cannot disable
    in_transit: TLS_1_3        # Cannot disable
    in_use: CONFIDENTIAL_COMPUTING
    key_management: BYOK
    kms_ref: "\${VAULT_KMS_KEY_REF}"

  access_control:
    model: RBAC_ABAC
    object_level: true
    zero_trust: true

  audit:
    enabled: true              # Cannot disable
    retention: 7_years
    tamper_proof: true
    xai_logging: true
    export_to:
      - siem
      - compliance_dashboard

  incident_response:
    soar_enabled: true
    notification_within: 72h
    playbook: default_financial`;

  const handleValidate = () => {
    // Simulate validation
    setValidationResult("success");
  };

  return (
    <div className="flex h-full">
      {/* File Explorer */}
      <div className="w-64 border-r bg-card">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FolderTree className="h-4 w-4" />
            Project Files
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-49px)]">
          <div className="p-2">
            {FILE_TREE.map((item, idx) => (
              <div key={idx}>
                <button className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left",
                  item.active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}>
                  <FileCode className="h-4 w-4" />
                  {item.name}
                </button>
                {item.children && (
                  <div className="ml-4">
                    {item.children.map((child, childIdx) => (
                      <button
                        key={childIdx}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left hover:bg-muted text-muted-foreground"
                      >
                        <FileCode className="h-4 w-4" />
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">platform.yaml</Badge>
            <Badge variant="secondary" className="text-xs">Modified</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button size="sm" className="gap-1" onClick={handleValidate}>
              <Play className="h-4 w-4" />
              Validate
            </Button>
          </div>
        </div>

        {/* Editor + Output */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 bg-muted/20">
            <ScrollArea className="h-full">
              <pre className="p-4 text-sm font-mono leading-relaxed">
                <code>
                  {yamlContent.split("\n").map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-12 text-right pr-4 text-muted-foreground select-none">
                        {idx + 1}
                      </span>
                      <span className={cn(
                        line.startsWith("#") && "text-muted-foreground",
                        line.includes(":") && !line.startsWith("#") && "text-foreground",
                        line.includes("true") && "text-success",
                        line.includes("false") && "text-destructive",
                        (line.includes("${") || line.includes('"')) && "text-info"
                      )}>
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </ScrollArea>
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l bg-card">
            <Tabs defaultValue="validation">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 px-2">
                <TabsTrigger value="validation" className="gap-1">
                  <Shield className="h-4 w-4" />
                  Validation
                </TabsTrigger>
                <TabsTrigger value="terminal" className="gap-1">
                  <Terminal className="h-4 w-4" />
                  Output
                </TabsTrigger>
              </TabsList>

              <TabsContent value="validation" className="p-4 space-y-4">
                {validationResult === "success" ? (
                  <Card className="bg-success/10 border-success/20">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-success">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">All checks passed</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success" />
                          Engine connectivity verified
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success" />
                          Compliance packs loaded (4 packs, 23 rules)
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success" />
                          Sovereign LLM routing configured
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success" />
                          BYOK key accessible
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success" />
                          Audit pipeline connected
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Click &quot;Validate&quot; to check your configuration.
                  </div>
                )}

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sovereign Locks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-sovereign" />
                      <span>PII auto-detect: locked ON</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-sovereign" />
                      <span>Encryption at-rest: locked AES-256</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-sovereign" />
                      <span>Audit logging: locked ON</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-sovereign" />
                      <span>Compliance packs: cannot remove</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terminal" className="p-0">
                <div className="p-4 font-mono text-xs bg-background/50">
                  <div className="text-muted-foreground">{"> Loading configuration..."}</div>
                  <div className="text-success">{"> Configuration loaded successfully"}</div>
                  <div className="text-muted-foreground">{"> Ready for deployment"}</div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
