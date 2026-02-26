"use client"

import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RiskOverviewProps {
  detected: boolean
  expandedId: string | null
  onToggleExpand: (id: string | null) => void
}

type RiskLevel = "high" | "medium" | "low" | "normal"
type FixStatus = "pending" | "processing" | "closed"

interface RiskItem {
  id: string
  level: RiskLevel
  type: string
  description: string
  impact: string
  status: FixStatus
}

const riskData: RiskItem[] = [
  {
    id: "R-001",
    level: "medium",
    type: "税负风险",
    description: "1月税负率偏离行业均值",
    impact: "中等",
    status: "pending",
  },
  {
    id: "R-002",
    level: "low",
    type: "发票风险",
    description: "2张餐饮发票未匹配分录",
    impact: "轻微",
    status: "closed",
  },
  {
    id: "R-003",
    level: "low",
    type: "合规风险",
    description: "3笔分录未标注附件编号",
    impact: "轻微",
    status: "processing",
  },
]

const stats: { level: RiskLevel; label: string; count: number; color: string; bg: string }[] = [
  { level: "high", label: "高风险", count: 0, color: "text-red-600", bg: "bg-red-500" },
  { level: "medium", label: "中风险", count: 1, color: "text-amber-600", bg: "bg-amber-500" },
  { level: "low", label: "低风险", count: 2, color: "text-emerald-600", bg: "bg-emerald-500" },
  { level: "normal", label: "正常", count: 18, color: "text-primary", bg: "bg-primary" },
]

const levelConfig: Record<
  RiskLevel,
  { bg: string; text: string; border: string; label: string; dot: string }
> = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "高风险", dot: "bg-red-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "中风险", dot: "bg-amber-500" },
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "低风险", dot: "bg-emerald-500" },
  normal: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "正常", dot: "bg-primary" },
}

const statusConfig: Record<FixStatus, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200", label: "待处理" },
  processing: { icon: Loader2, color: "bg-blue-50 text-blue-700 border-blue-200", label: "处理中" },
  closed: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "已闭环" },
}

export function RiskOverview({ detected, expandedId, onToggleExpand }: RiskOverviewProps) {
  if (!detected) return null

  const totalRisks = stats.reduce((sum, s) => sum + s.count, 0)

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            风险概览
          </h2>
          <span className="text-xs text-muted-foreground">(可点击展开+整改状态标注)</span>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Stats bar - horizontal colored blocks */}
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            风险统计
          </div>
          <div className="flex items-center gap-4">
            {stats.map((s) => (
              <div
                key={s.level}
                className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${s.bg}/15`}>
                  <span className={`inline-block h-3 w-3 rounded-full ${s.bg}`} />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.count}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Mini progress bar showing distribution */}
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
            {stats.filter(s => s.count > 0).map((s) => (
              <div
                key={s.level}
                className={`${s.bg} transition-all`}
                style={{ width: `${(s.count / totalRisks) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Risk table */}
        <div className="overflow-hidden rounded-lg border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-10 px-3 py-3 text-left font-medium text-muted-foreground" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">风险等级</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">风险类型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">风险描述</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">影响程度</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">整改状态</th>
              </tr>
            </thead>
            <tbody>
              {riskData.map((risk, index) => {
                const lc = levelConfig[risk.level]
                const sc = statusConfig[risk.status]
                const isExpanded = expandedId === risk.id
                const isLast = index === riskData.length - 1
                return (
                  <tr
                    key={risk.id}
                    onClick={() => onToggleExpand(isExpanded ? null : risk.id)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      !isLast && "border-b border-border",
                      isExpanded
                        ? "bg-primary/5"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <td className="px-3 py-3.5">
                      <div className={cn(
                        "flex h-5 w-5 items-center justify-center rounded transition-colors",
                        isExpanded ? "bg-primary/10" : "bg-transparent"
                      )}>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`gap-1.5 ${lc.bg} ${lc.text} ${lc.border}`}
                      >
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${lc.dot}`} />
                        {lc.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{risk.type}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{risk.description}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "text-sm",
                        risk.impact === "中等" ? "font-medium text-amber-600" : "text-muted-foreground"
                      )}>
                        {risk.impact}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${sc.color}`}>
                        <sc.icon className={cn("h-3 w-3", risk.status === "processing" && "animate-spin")} />
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            查看全部风险（25项）
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            导出风险报告
          </Button>
        </div>
      </div>
    </section>
  )
}
