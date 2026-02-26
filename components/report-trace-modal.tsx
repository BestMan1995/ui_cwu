"use client"

import {
  X,
  Database,
  ExternalLink,
  FileCheck2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportTraceModalProps {
  open: boolean
  onClose: () => void
}

interface TraceItem {
  label: string
  amount: string
  source: string
  ids: string
}

const traceData: TraceItem[] = [
  {
    label: "营业收入",
    amount: "85,000.00 元",
    source: "主营业务收入合计",
    ids: "FL-20260201-001 至 012",
  },
  {
    label: "营业成本",
    amount: "55,250.00 元",
    source: "主营业务成本合计",
    ids: "FL-20260205-003 至 008",
  },
  {
    label: "所得税费用",
    amount: "4,512.50 元",
    source: "税种计算模块（企业所得税预缴结果）",
    ids: "TAX-20260228-CIT",
  },
]

export function ReportTraceModal({ open, onClose }: ReportTraceModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              数据溯源 - 净利润 13,537.50 元（2026年02月）
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5">
          {traceData.map((item, idx) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {item.amount}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  来自{item.source}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    分录ID：
                  </span>
                  <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    {item.ids}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Hint */}
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3">
            <ExternalLink className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="text-xs text-blue-700">
              可点击分录ID查看原始发票/凭证
            </span>
          </div>

          {/* Audit log */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <FileCheck2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              溯源记录已保存至账套审计日志
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}
