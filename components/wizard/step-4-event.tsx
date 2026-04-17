"use client";

import { Zap, Plus, Trash2, ArrowRight, Shield, AlertTriangle } from "lucide-react";
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

interface EventRule {
  id: string;
  name: string;
  objectType: string;
  trigger: string;
  conditions: { field: string; operator: string; value: string }[];
  action: string;
  governanceLevel: "L1" | "L2" | "L3";
}

const SAMPLE_RULES: EventRule[] = [
  {
    id: "1",
    name: "고위험 이탈 고객 리텐션",
    objectType: "Customer",
    trigger: "state_transition",
    conditions: [
      { field: "churnRisk", operator: ">=", value: "0.8" },
      { field: "segment", operator: "IN", value: "PREMIUM, VIP" },
    ],
    action: "TriggerRetentionCampaign",
    governanceLevel: "L2",
  },
];

export function Step4Event() {
  const { nextStep, prevStep } = usePlatformStore();
  const [rules] = useState<EventRule[]>(SAMPLE_RULES);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">이벤트와 조건을 설정합니다</h2>
        <p className="text-muted-foreground mt-1">
          Write-back 룰을 정의하여 자동화 트리거를 설정합니다
        </p>
      </div>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Write-back Rules
            </CardTitle>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              새 룰 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="bg-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{rule.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="sovereign" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {rule.governanceLevel}
                    </Badge>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Source */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Object Type</Label>
                    <Select defaultValue={rule.objectType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Transaction">Transaction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Trigger</Label>
                    <Select defaultValue={rule.trigger}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="state_transition">State Transition</SelectItem>
                        <SelectItem value="property_change">Property Change</SelectItem>
                        <SelectItem value="schedule">Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Action</Label>
                    <Select defaultValue={rule.action}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TriggerRetentionCampaign">Trigger Retention Campaign</SelectItem>
                        <SelectItem value="SendNotification">Send Notification</SelectItem>
                        <SelectItem value="UpdateStatus">Update Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Conditions</Label>
                  <div className="space-y-2">
                    {rule.conditions.map((cond, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input value={cond.field} className="w-32" readOnly />
                        <Select defaultValue={cond.operator}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=">=">{"≥"}</SelectItem>
                            <SelectItem value="<=">{"≤"}</SelectItem>
                            <SelectItem value="==">{"="}</SelectItem>
                            <SelectItem value="IN">IN</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input value={cond.value} className="flex-1" readOnly />
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="gap-1">
                      <Plus className="h-4 w-4" />
                      조건 추가
                    </Button>
                  </div>
                </div>

                {/* Sovereign Notice */}
                <div className="p-3 rounded-lg bg-sovereign/10 border border-sovereign/20">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-sovereign mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-sovereign">Sovereign Gate 적용</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        이 룰의 데이터는 소버린 LLM(SOTA K, Mi:dm)으로 자동 라우팅됩니다. PII 필드는 토큰화되어 처리됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
