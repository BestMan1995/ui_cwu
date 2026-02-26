"use client"

import { useState } from "react"
import {
  Search,
  ClipboardList,
  Trash2,
  Shield,
  FileText,
  Coins,
  PenLine,
  FileCheck,
  Wallet,
  Scale,
  TrendingUp,
  ChevronRight,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface RiskConditionFormProps {
  onDetect: () => void
}

const riskTypes = [
  { id: "invoice", label: "发票风险", icon: FileText, desc: "重复/虚开/异常" },
  { id: "tax", label: "税负风险", icon: Coins, desc: "税负偏离预警" },
  { id: "journal", label: "分录风险", icon: PenLine, desc: "借贷/科目异常" },
  { id: "declare", label: "申报风险", icon: FileCheck, desc: "逾期/差异检测" },
  { id: "capital", label: "资金风险", icon: Wallet, desc: "往来/资金异常" },
  { id: "compliance", label: "合规风险", icon: Scale, desc: "附件/合规缺失" },
  { id: "operation", label: "经营风险", icon: TrendingUp, desc: "利润/经营异常" },
]

export function RiskConditionForm({ onDetect }: RiskConditionFormProps) {
  const [selectedRisks, setSelectedRisks] = useState<string[]>(
    riskTypes.map((r) => r.id)
  )

  function toggleRisk(id: string) {
    setSelectedRisks((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectedRisks.length === riskTypes.length) {
      setSelectedRisks([])
    } else {
      setSelectedRisks(riskTypes.map((r) => r.id))
    }
  }

  const allSelected = selectedRisks.length === riskTypes.length

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          风险检测条件
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          AI智能覆盖全维度
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Detection scope header */}
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          检测范围
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Top row: Period + Data source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              检测周期
            </label>
            <select className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>2026年02月（月度）</option>
              <option>2026年Q1（季度）</option>
              <option>2026年度</option>
              <option>自定义</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground/70">支持：季度/年度/自定义</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              数据来源
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground shadow-sm">
              <Database className="h-4 w-4 shrink-0 text-primary/60" />
              <span>自动读取发票/分录/算税/报表全模块数据</span>
              <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0" />
            </div>
          </div>
        </div>

        {/* Risk types */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              风险类型
              {allSelected && (
                <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  全选
                </span>
              )}
            </label>
            <button
              onClick={toggleAll}
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              {allSelected ? "取消全选" : "全选"}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {riskTypes.map((rt) => {
              const checked = selectedRisks.includes(rt.id)
              return (
                <label
                  key={rt.id}
                  className={`group flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-3 transition-all ${
                    checked
                      ? "border-primary/30 bg-primary/5 shadow-sm shadow-primary/5"
                      : "border-border bg-card hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleRisk(rt.id)}
                    className="mt-0.5"
                  />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <rt.icon className={`h-3.5 w-3.5 ${checked ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm leading-tight ${checked ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {rt.label}
                      </span>
                    </div>
                    <span className="text-[11px] leading-tight text-muted-foreground/60">
                      {rt.desc}
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Button className="gap-2 shadow-sm" onClick={onDetect}>
            <Search className="h-4 w-4" />
            一键重新检测
          </Button>
          <Button variant="outline" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            查看风控规则
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            清空历史预警
          </Button>
        </div>
      </div>
    </section>
  )
}
