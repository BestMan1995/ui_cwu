"use client"

import { useState } from "react"
import {
  CheckCircle2,
  BarChart3,
  MessageCircle,
  PenLine,
  Save,
  Download,
  FileText,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface JournalAiPanelProps {
  generated: boolean
}

export function JournalAiPanel({ generated }: JournalAiPanelProps) {
  const [showAiChat, setShowAiChat] = useState(false)

  if (!generated) return null

  return (
    <section className="space-y-5">
      {/* AI 智能校验与联调区 */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            {"📌"} AI智能校验与联调区
          </h2>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* 校验通过提示 */}
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-800">
                分录校验通过：匹配A商贸公司「小规模-商贸」税种规则
              </p>
              <p className="flex items-center gap-1.5 text-sm text-emerald-700">
                <BarChart3 className="h-3.5 w-3.5" />
                税负率预估：该分录会使3月税负率降低0.2%
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowAiChat(!showAiChat)}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              问问AI怎么优化
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <PenLine className="h-3.5 w-3.5" />
              手动调整分录
            </Button>
          </div>

          {/* AI 对话区 */}
          {showAiChat && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Bot className="h-4 w-4 text-primary" />
                AI 优化建议
              </div>
              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <p>
                  基于当前分录分析，以下为优化建议：
                </p>
                <ol className="list-inside list-decimal space-y-1 pl-1">
                  <li>当前分录「管理费用-办公费」归类正确，符合小企业会计准则（2024版）</li>
                  <li>建议关注本季度管理费用占比，当前累计占营收比例为12.3%，处于合理区间</li>
                  <li>如采购金额超过5000元，建议考虑资本化处理（计入固定资产科目）</li>
                  <li>该笔分录对应的进项税不可抵扣（小规模纳税人），无需进行税额拆分</li>
                </ol>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <input
                  type="text"
                  placeholder="输入追问内容..."
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" className="shrink-0">发送</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 批量操作 */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex items-center gap-2 pb-3">
          <span className="text-sm font-semibold text-foreground">{"⚙️"} 批量操作</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            保存分录到账套
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            导出分录Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            生成记账凭证
          </Button>
        </div>
      </div>
    </section>
  )
}
