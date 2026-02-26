"use client"

import { useState } from "react"
import {
  BarChart3,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  Link2,
  Bot,
  FileText,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportPreviewProps {
  generated: boolean
  onShowTrace: () => void
}

interface ReportRow {
  label: string
  amount: string
  isCore?: boolean
  isSeparator?: boolean
  indent?: number
}

const profitData: ReportRow[] = [
  { label: "一、营业收入", amount: "85,000.00" },
  { label: "减：营业成本", amount: "55,250.00", indent: 1 },
  { label: "营业税金及附加", amount: "0.00", indent: 2 },
  { label: "销售费用", amount: "3,500.00", indent: 2 },
  { label: "管理费用", amount: "8,200.00", indent: 2 },
  { label: "", amount: "", isSeparator: true },
  { label: "二、营业利润", amount: "18,050.00" },
  { label: "减：所得税费用", amount: "4,512.50", indent: 1 },
  { label: "", amount: "", isSeparator: true },
  { label: "三、净利润", amount: "13,537.50", isCore: true },
]

export function ReportPreview({ generated, onShowTrace }: ReportPreviewProps) {
  const [showAiChat, setShowAiChat] = useState(false)

  if (!generated) return null

  return (
    <section className="space-y-5">
      {/* Report Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            报表预览区
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            AI合规校验+核心数据醒目
          </span>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Report title */}
          <div className="rounded-lg border border-border bg-muted/20 p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                2026年02月 利润表（A商贸公司-小规模）
              </h3>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">项目</th>
                    <th className="py-2.5 px-4 text-right font-medium text-muted-foreground">本期金额</th>
                  </tr>
                </thead>
                <tbody>
                  {profitData.map((row, idx) => {
                    if (row.isSeparator) {
                      return (
                        <tr key={`sep-${idx}`}>
                          <td colSpan={2} className="py-0">
                            <div className="border-t border-dashed border-border" />
                          </td>
                        </tr>
                      )
                    }
                    return (
                      <tr
                        key={row.label}
                        className={
                          row.isCore
                            ? "bg-primary/5 border-t-2 border-primary/20"
                            : idx % 2 === 0
                            ? "bg-card"
                            : "bg-muted/20"
                        }
                      >
                        <td className="py-2.5 px-4">
                          <span
                            className={`flex items-center gap-2 ${
                              row.isCore
                                ? "font-bold text-foreground"
                                : row.indent
                                ? "text-muted-foreground"
                                : "font-medium text-foreground"
                            }`}
                            style={{ paddingLeft: row.indent ? `${row.indent * 16}px` : undefined }}
                          >
                            {row.label}
                            {row.isCore && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                                核心数据
                              </span>
                            )}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 px-4 text-right tabular-nums ${
                            row.isCore
                              ? "text-lg font-bold text-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {row.amount} 元
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation status */}
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-sm text-emerald-800">
              <span className="font-semibold">报表校验通过：</span>
              勾稽关系无异常，核心数据符合行业区间
            </p>
          </div>

          {/* AI analysis summary */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">AI分析：</span>
                2月净利润率15.9%，较1月提升2.3%（成本占比下降）
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setShowAiChat(!showAiChat)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  问问AI怎么解读报表
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-blue-600 hover:text-blue-700"
                  onClick={onShowTrace}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  查看数据溯源
                </Button>
              </div>
            </div>
          </div>

          {/* AI Chat */}
          {showAiChat && (
            <AiInterpretation />
          )}
        </div>
      </div>
    </section>
  )
}

function AiInterpretation() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <Bot className="h-4 w-4 text-primary" />
        AI报表解读助手 - 针对【A商贸公司2月利润表】
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {/* Core conclusion */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 text-primary">{">"}</span>
          <p>
            <span className="font-semibold text-foreground">核心结论：</span>
            2月净利润13,537.50元，净利润率15.9%（小规模商贸行业均值12%-18%），经营状况良好
          </p>
        </div>

        {/* Key analysis */}
        <div>
          <p className="mb-2 font-semibold text-foreground">关键分析：</p>
          <ol className="list-inside list-decimal space-y-2 pl-1">
            <li>
              <span className="font-medium text-foreground">成本控制：</span>
              营业成本占比65%，较1月（70%）下降5%，成本管控效果显著
            </li>
            <li>
              <span className="font-medium text-foreground">费用结构：</span>
              管理费用8,200元（占营收9.6%），建议优化办公费支出（占比过高）
            </li>
            <li>
              <span className="font-medium text-foreground">税负影响：</span>
              增值税免税，所得税预缴300元（实际报表中所得税费用为汇算调整后金额）
            </li>
          </ol>
        </div>

        {/* Business advice */}
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">经营建议：</span>
            3月可适当增加销售费用投入，提升营收规模，保持净利润率稳定
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            生成详细分析报告
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            对比同行业报表
          </Button>
        </div>
      </div>

      {/* Chat input */}
      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <input
          type="text"
          placeholder="输入追问内容...例如：利润率下降的主要原因是什么？"
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button size="sm" className="shrink-0">发送</Button>
      </div>
    </div>
  )
}
