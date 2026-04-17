"use client";

import { Network, Plus, Trash2, ArrowRight, Circle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlatformStore } from "@/lib/store";
import { useState } from "react";

interface OntologyObject {
  id: string;
  name: string;
  type: string;
  properties: string[];
}

interface OntologyLink {
  id: string;
  from: string;
  to: string;
  type: string;
}

const SAMPLE_OBJECTS: OntologyObject[] = [
  { id: "customer", name: "Customer", type: "Entity", properties: ["id", "name", "segment", "churnRisk", "ltv"] },
  { id: "account", name: "Account", type: "Entity", properties: ["id", "type", "balance", "status"] },
  { id: "transaction", name: "Transaction", type: "Event", properties: ["id", "amount", "date", "type"] },
  { id: "campaign", name: "Campaign", type: "Action", properties: ["id", "name", "channel", "status"] },
];

const SAMPLE_LINKS: OntologyLink[] = [
  { id: "1", from: "customer", to: "account", type: "OWNS" },
  { id: "2", from: "account", to: "transaction", type: "HAS_TRANSACTION" },
  { id: "3", from: "campaign", to: "customer", type: "TARGETS" },
];

export function Step3Relation() {
  const { environment, nextStep, prevStep } = usePlatformStore();
  const [objects] = useState<OntologyObject[]>(SAMPLE_OBJECTS);
  const [links] = useState<OntologyLink[]>(SAMPLE_LINKS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">온톨로지 관계를 설정합니다</h2>
        <p className="text-muted-foreground mt-1">
          OLAS 온톨로지의 Object와 Link를 정의합니다
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{objects.length}</div>
            <div className="text-xs text-muted-foreground">Objects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{links.length}</div>
            <div className="text-xs text-muted-foreground">Links</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {objects.reduce((acc, o) => acc + o.properties.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Properties</div>
          </CardContent>
        </Card>
      </div>

      {/* Graph Visualization (Simplified) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            온톨로지 그래프
          </CardTitle>
          <CardDescription>
            {environment.ontologyEngine === "neo4j" ? "Neo4j Property Graph" : "Graph Model"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-muted/30 rounded-lg overflow-hidden">
            {/* Simplified Graph Visualization */}
            <svg className="w-full h-full">
              {/* Customer Node */}
              <g transform="translate(100, 80)">
                <circle r="35" fill="hsl(var(--primary))" opacity="0.1" />
                <circle r="30" fill="hsl(var(--primary))" opacity="0.2" />
                <circle r="25" className="fill-primary" />
                <text className="fill-primary-foreground text-xs font-medium" textAnchor="middle" dy="4">Customer</text>
              </g>

              {/* Account Node */}
              <g transform="translate(280, 80)">
                <circle r="25" className="fill-sovereign" />
                <text className="fill-white text-xs font-medium" textAnchor="middle" dy="4">Account</text>
              </g>

              {/* Transaction Node */}
              <g transform="translate(460, 80)">
                <circle r="25" className="fill-info" />
                <text className="fill-white text-xs font-medium" textAnchor="middle" dy="4">Transaction</text>
              </g>

              {/* Campaign Node */}
              <g transform="translate(100, 200)">
                <circle r="25" className="fill-warning" />
                <text className="fill-white text-xs font-medium" textAnchor="middle" dy="4">Campaign</text>
              </g>

              {/* Links */}
              <line x1="125" y1="80" x2="255" y2="80" className="stroke-muted-foreground" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="305" y1="80" x2="435" y2="80" className="stroke-muted-foreground" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="100" y1="175" x2="100" y2="105" className="stroke-muted-foreground" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="5,5" />

              {/* Link Labels */}
              <text x="190" y="70" className="fill-muted-foreground text-xs">OWNS</text>
              <text x="370" y="70" className="fill-muted-foreground text-xs">HAS_TX</text>
              <text x="110" y="145" className="fill-muted-foreground text-xs">TARGETS</text>

              {/* Arrow Marker */}
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground" />
                </marker>
              </defs>
            </svg>

            {/* AI Suggestion */}
            <div className="absolute bottom-3 right-3">
              <Badge variant="default" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI 자동 생성
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objects List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Objects</CardTitle>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Circle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{obj.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {obj.properties.join(", ")}
                  </div>
                </div>
                <Badge variant="secondary">{obj.type}</Badge>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Links</CardTitle>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <Badge variant="outline">{link.from}</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">{link.type}</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{link.to}</Badge>
                <div className="flex-1" />
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
