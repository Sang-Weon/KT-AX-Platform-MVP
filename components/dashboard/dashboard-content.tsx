"use client";

import {
  Activity,
  Bot,
  Shield,
  AlertTriangle,
  Check,
  Clock,
  Database,
  Zap,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const METRICS: MetricCard[] = [
  {
    title: "Active Agents",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: <Bot className="h-4 w-4" />,
  },
  {
    title: "Events Processed",
    value: "1.2M",
    change: "+15% vs last month",
    trend: "up",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "Write-backs",
    value: "8,432",
    change: "+8% vs last month",
    trend: "up",
    icon: <Database className="h-4 w-4" />,
  },
  {
    title: "Compliance Score",
    value: "98%",
    change: "No violations",
    trend: "neutral",
    icon: <Shield className="h-4 w-4" />,
  },
];

interface AgentStatus {
  name: string;
  status: "running" | "idle" | "error";
  lastRun: string;
  executions: number;
}

const AGENT_STATUSES: AgentStatus[] = [
  { name: "ChurnPredictionAgent", status: "running", lastRun: "2 min ago", executions: 1243 },
  { name: "OfferRecommendationAgent", status: "running", lastRun: "5 min ago", executions: 892 },
  { name: "CampaignExecutionAgent", status: "idle", lastRun: "15 min ago", executions: 456 },
  { name: "FraudDetectionAgent", status: "running", lastRun: "1 min ago", executions: 3201 },
  { name: "CustomerSegmentAgent", status: "error", lastRun: "1 hour ago", executions: 78 },
];

interface RecentEvent {
  id: string;
  type: string;
  description: string;
  time: string;
  status: "success" | "warning" | "error";
}

const RECENT_EVENTS: RecentEvent[] = [
  {
    id: "1",
    type: "Write-back",
    description: "Retention campaign triggered for 23 VIP customers",
    time: "2 min ago",
    status: "success",
  },
  {
    id: "2",
    type: "Sovereign Gate",
    description: "PII data automatically routed to SOTA K",
    time: "5 min ago",
    status: "success",
  },
  {
    id: "3",
    type: "Compliance",
    description: "Audit log exported to SIEM",
    time: "10 min ago",
    status: "success",
  },
  {
    id: "4",
    type: "Agent Error",
    description: "CustomerSegmentAgent: Connection timeout",
    time: "1 hour ago",
    status: "error",
  },
  {
    id: "5",
    type: "Warning",
    description: "High churn risk detected: 156 customers",
    time: "2 hours ago",
    status: "warning",
  },
];

export function DashboardContent() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            KT AX Platform operational overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="sovereign" className="gap-1">
            <Shield className="h-3 w-3" />
            Sovereign Mode Active
          </Badge>
          <Badge variant="success" className="gap-1">
            <Activity className="h-3 w-3" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={cn(
                "text-xs flex items-center gap-1 mt-1",
                metric.trend === "up" && "text-success",
                metric.trend === "down" && "text-destructive",
                metric.trend === "neutral" && "text-muted-foreground"
              )}>
                {metric.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {metric.trend === "down" && <TrendingDown className="h-3 w-3" />}
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agent Status
            </CardTitle>
            <CardDescription>Real-time agent monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AGENT_STATUSES.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    agent.status === "running" && "bg-success animate-pulse",
                    agent.status === "idle" && "bg-muted-foreground",
                    agent.status === "error" && "bg-destructive"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm truncate">{agent.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {agent.lastRun}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{agent.executions.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">executions</div>
                  </div>
                  <Badge variant={
                    agent.status === "running" ? "success" :
                    agent.status === "error" ? "destructive" : "secondary"
                  }>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Status
            </CardTitle>
            <CardDescription>Regulatory compliance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Compliance</span>
                <span className="font-medium">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>PII Protection</span>
                <Badge variant="success" className="ml-auto">Active</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>Data Residency</span>
                <Badge variant="success" className="ml-auto">KR_SOVEREIGN</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>Audit Logging</span>
                <Badge variant="success" className="ml-auto">7yr Retention</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>Sovereign LLM</span>
                <Badge variant="sovereign" className="ml-auto">SOTA K</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <FileText className="h-4 w-4" />
              View Compliance Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Events
          </CardTitle>
          <CardDescription>Latest platform activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_EVENTS.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg",
                  event.status === "success" && "bg-success/5",
                  event.status === "warning" && "bg-warning/5",
                  event.status === "error" && "bg-destructive/5"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  event.status === "success" && "bg-success/10 text-success",
                  event.status === "warning" && "bg-warning/10 text-warning",
                  event.status === "error" && "bg-destructive/10 text-destructive"
                )}>
                  {event.status === "success" && <Check className="h-4 w-4" />}
                  {event.status === "warning" && <AlertTriangle className="h-4 w-4" />}
                  {event.status === "error" && <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  <div className="text-sm mt-1 truncate">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-muted-foreground">High Risk Customers</div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-success mb-2" />
            <div className="text-2xl font-bold">23%</div>
            <div className="text-xs text-muted-foreground">Churn Reduction</div>
          </CardContent>
        </Card>
        <Card className="bg-sovereign/5 border-sovereign/20">
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 mx-auto text-sovereign mb-2" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs text-muted-foreground">Data Sovereignty</div>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 mx-auto text-info mb-2" />
            <div className="text-2xl font-bold">42ms</div>
            <div className="text-xs text-muted-foreground">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
