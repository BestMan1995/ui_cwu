"use client"

import { useState } from "react"
import {
  Search,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Clock,
  Loader2,
  CheckCircle2,
  BookOpen,
  Bot,
  Send,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RiskDetailPanelProps {
  expandedId: string | null
}

export function RiskDetailPanel({ expandedId }: RiskDetailPanelProps) {
  const [showChat, setShowChat] = useState(false)

  if (expandedId !== "R-001") return null

  return (
    <section className="overflow-hidden rounded-xl border-2 border-amber-200 bg-card shadow-sm">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50/80 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-sm">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-50" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              中风险 - 税负风险
            </h2>
            <p className="text-xs text-muted-foreground">展开详情（可视化溯源+AI整改方案）</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-amber-200 bg-card text-primary shadow-sm hover:bg-amber-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          穿透至报表生成（2026年01月利润表）
        </Button>
      </div>

      <div className="space-y-5 p-5">
        {/* ===== Trend visualization ===== */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                税负率趋势可视化（1-2月）
              </h3>
            </div>
            <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
              行业均值：0.3%-0.5%
            </span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-10 rounded-lg border border-border bg-muted/10 px-6 py-5">
            {/* Y axis labels */}
            <div className="flex flex-col items-end gap-3 text-[10px] text-muted-foreground/70">
              <span>1.0%</span>
              <span>0.8%</span>
              <span>0.5%</span>
              <span>0.3%</span>
              <span>0.0%</span>
            </div>

            {/* Chart area */}
            <div className="flex flex-1 items-end gap-12">
              {/* Jan bar */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  0.8%
                  <TrendingUp className="h-3.5 w-3.5" />
                </span>
                <div className="relative w-full max-w-24">
                  <div className="h-24 rounded-t-lg bg-gradient-to-t from-amber-500/80 to-amber-400/60 shadow-inner" />
                  {/* Industry upper line */}
                  <div className="absolute bottom-[15px] -left-4 -right-4 border-t-2 border-dashed border-red-400/50" />
                  {/* Industry lower line */}
                  <div className="absolute bottom-[9px] -left-4 -right-4 border-t border-dotted border-red-300/40" />
                </div>
                <span className="mt-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">1月</span>
              </div>

              {/* Feb bar */}
              <div className="flex flex-1 flex-col items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  0.35%
                  <TrendingDown className="h-3.5 w-3.5" />
                </span>
                <div className="relative w-full max-w-24">
                  <div className="h-10 rounded-t-lg bg-gradient-to-t from-primary/70 to-primary/40 shadow-inner" />
                  {/* Industry upper line */}
                  <div className="absolute bottom-[15px] -left-4 -right-4 border-t-2 border-dashed border-red-400/50" />
                  {/* Industry lower line */}
                  <div className="absolute bottom-[9px] -left-4 -right-4 border-t border-dotted border-red-300/40" />
                </div>
                <span className="mt-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">2月</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 text-xs shadow-sm">
              <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">图例</span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-0.5 w-5 border-t-2 border-dashed border-red-400/60" />
                行业均值上限 0.5%
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-3.5 w-5 rounded bg-amber-400/70" />
                超出区间
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-3.5 w-5 rounded bg-primary/60" />
                正常区间
              </span>
            </div>
          </div>

          {/* Deviation note */}
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-700">
              偏离程度：1月高于行业上限0.3%，触发中风险预警
            </p>
          </div>
        </div>

        {/* ===== Risk details ===== */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            风险详情
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            1月税负率0.8%（行业均值0.3%-0.5%），因开具10万增值税专票无法享受免税政策导致；2月税负率0.35%已回归正常区间。
          </p>
          <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground/70">
            <span>数据来源：税种计算模块2026年01-02月税负数据</span>
            <span className="text-border">|</span>
            <button className="flex items-center gap-1 text-primary transition-colors hover:underline">
              规则依据
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ===== AI remediation suggestions ===== */}
        <div className="overflow-hidden rounded-lg border border-blue-200 shadow-sm">
          <div className="border-b border-blue-200 bg-blue-50/80 px-5 py-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-800">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              AI整改建议（可落地步骤）
            </h3>
          </div>
          <div className="bg-blue-50/30 px-5 py-4">
            <div className="space-y-3">
              {[
                { step: 1, title: "资料留存", desc: "整理1月专票对应销售合同/发货单/收款凭证；" },
                { step: 2, title: "开票规划", desc: "3月控制专票开具<=5万，平衡整体税负率；" },
                { step: 3, title: "台账建立", desc: "新增专票开具台账，提前测算税负率避免偏离。" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-blue-50">
                    {item.step}
                  </span>
                  <div className="text-sm leading-relaxed text-blue-800">
                    <span className="font-semibold">{item.title}：</span>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Chat toggle */}
            <div className="mt-4 border-t border-blue-200 pt-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-blue-200 bg-card text-blue-700 shadow-sm hover:bg-blue-50"
                onClick={() => setShowChat(!showChat)}
              >
                <Bot className="h-3.5 w-3.5" />
                {showChat ? "收起AI对话" : "追问AI详细整改方案"}
                {showChat ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            </div>

            {showChat && (
              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/20 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Bot className="h-4 w-4 text-primary" />
                    AI 整改方案助手
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      针对1月税负率偏高问题，以下为详细整改方案：
                    </p>
                    <ol className="list-inside list-decimal space-y-1.5 pl-1">
                      <li>立即整理1月专票对应的三流一致证明材料（合同+发货+收款）</li>
                      <li>2-3月合理控制专票开具额度，建议单月专票不超过5万元</li>
                      <li>建立月度税负率预测模型：每月20日前预估当月税负率</li>
                      <li>如收到税务局风险提示函，准备好相关说明材料及佐证</li>
                    </ol>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                    <input
                      type="text"
                      placeholder="追问...例如：如何准备税务说明材料？"
                      className="flex-1 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button size="sm" className="shrink-0 gap-1.5 shadow-sm">
                      <Send className="h-3.5 w-3.5" />
                      发送
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== Risk disposition actions ===== */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            风险处置操作
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5" />
              设置整改提醒
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm">
              <Loader2 className="h-3.5 w-3.5" />
              标记处理中
            </Button>
            <Button size="sm" className="gap-1.5 bg-emerald-600 shadow-sm hover:bg-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              标记已闭环
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
