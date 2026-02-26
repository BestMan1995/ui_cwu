"use client"

import {
  Search,
  FileText,
  ExternalLink,
  BookOpen,
} from "lucide-react"

interface ReportTracePanelProps {
  visible: boolean
}

interface TraceItem {
  id: number
  label: string
  amount: string
  source: string
  entryIds: string
  clickable: boolean
}

const traceData: TraceItem[] = [
  {
    id: 1,
    label: "营业收入",
    amount: "85,000元",
    source: "主营业务收入合计",
    entryIds: "FL-20260201-001至012",
    clickable: true,
  },
  {
    id: 2,
    label: "营业成本",
    amount: "55,250元",
    source: "主营业务成本合计",
    entryIds: "FL-20260205-003至008",
    clickable: true,
  },
  {
    id: 3,
    label: "所得税费用",
    amount: "4,512.50元",
    source: "企业所得税预缴结果",
    entryIds: "税种计算模块",
    clickable: false,
  },
]

export function ReportTracePanel({ visible }: ReportTracePanelProps) {
  if (!visible) return null

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <Search className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          数据溯源
        </h2>
        <span className="ml-1 text-xs text-muted-foreground">
          — 净利润13,537.50元（2026年02月）
        </span>
      </div>

      <div className="space-y-3 px-5 py-5">
        {traceData.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {item.id}
            </span>
            <div className="flex-1 text-sm">
              <p className="text-foreground">
                <span className="font-semibold">{item.label}</span>
                <span className="mx-1.5 text-muted-foreground">{item.amount}：</span>
                <span className="text-muted-foreground">来自</span>
                {item.clickable ? (
                  <button className="ml-1 inline-flex items-center gap-1 font-medium text-primary hover:underline">
                    分录ID {item.entryIds}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                ) : (
                  <span className="ml-1 font-medium text-primary">
                    {item.entryIds}
                  </span>
                )}
                <span className="ml-1 text-muted-foreground">（{item.source}）</span>
              </p>
            </div>
          </div>
        ))}

        {/* Footer hints */}
        <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/10 px-4 py-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            可点击分录ID查看原始发票/凭证
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            溯源记录已保存至账套审计日志
          </span>
        </div>
      </div>
    </section>
  )
}
