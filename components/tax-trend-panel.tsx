"use client"

import { useState } from "react"
import {
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  ExternalLink,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaxTrendPanelProps {
  calculated: boolean
}

const months = [
  { label: "1月", rate: "0.8%", status: "warn" as const },
  { label: "2月", rate: "0.35%", status: "ok" as const },
  { label: "3月预估", rate: "0.4%", status: "ok" as const },
]

export function TaxTrendPanel({ calculated }: TaxTrendPanelProps) {
  const [showAiChat, setShowAiChat] = useState(false)

  if (!calculated) return null

  return (
    <section className="space-y-5">
      {/* Trend area */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            历史税负趋势（近3月）+ AI税负分析与风险联动
          </h2>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* Trend chart bar */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-end gap-6">
              {months.map((m) => {
                const rate = parseFloat(m.rate)
                const height = Math.max(rate * 100, 12)
                return (
                  <div key={m.label} className="flex flex-col items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        m.status === "warn" ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {m.rate}
                      <span className="ml-0.5">
                        {m.status === "warn" ? "\u{1F7E1}" : "\u{1F7E2}"}
                      </span>
                    </span>
                    <div
                      className={`w-16 rounded-t-md transition-all ${
                        m.status === "warn"
                          ? "bg-amber-400/70"
                          : "bg-primary/60"
                      }`}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                )
              })}

              {/* Mini trend arrow */}
              <div className="ml-auto flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3">
                <TrendingUp className="h-8 w-8 text-primary/60" />
                <span className="mt-1 text-[11px] text-muted-foreground">趋势图</span>
              </div>
            </div>
          </div>

          {/* AI analysis */}
          <div className="space-y-3">
            {/* Normal status */}
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">税负正常：</span>
                2月综合税负率0.35%，符合行业预警区间（0.3%-0.5%）
              </p>
            </div>

            {/* AI suggestion */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">AI优化建议：</span>
                  增值税免税额度剩余15,000元，可合理规划3月开票
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setShowAiChat(!showAiChat)}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    问问AI怎么优化税负
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    查看详细风险项
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Chat */}
            {showAiChat && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Bot className="h-4 w-4 text-primary" />
                  AI 税负优化建议
                </div>
                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    根据当前账套数据和税务政策分析，以下为优化建议：
                  </p>
                  <ol className="list-inside list-decimal space-y-1 pl-1">
                    <li>2月销售额85,000元，距免征额度100,000元还有15,000元空间，3月可适度增加开票</li>
                    <li>企业所得税预缴按季度申报，建议Q1合理控制利润总额以适用小微企业优惠税率（2.5%）</li>
                    <li>城建税及附加随增值税免征，无需额外操作，但需关注月销售额是否突破10万阈值</li>
                    <li>建议提前规划Q2发票开具节奏，避免单月销售额突增导致整月需缴纳增值税</li>
                  </ol>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <input
                    type="text"
                    placeholder="输入追问内容...例如：如何合理分配开票额度？"
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button size="sm" className="shrink-0">发送</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
