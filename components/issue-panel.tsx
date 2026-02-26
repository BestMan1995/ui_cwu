"use client"

import { useState } from "react"
import { MessageCircle, ClipboardList, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IssueItem {
  severity: "red" | "yellow"
  title: string
  description: string
  historySolution: string
  aiSuggestion: string
}

const issues: IssueItem[] = [
  {
    severity: "red",
    title: "【PDF加密件】解析失败",
    description: "文件受密码保护，无法读取发票内容",
    historySolution: "税号后六位 / 法人手机号后六位",
    aiSuggestion:
      "建议尝试以下密码组合：\n1. 企业税号后六位\n2. 法人手机号后六位\n3. 开票日期（如 20260218）\n4. 联系开票方获取密码或索要无密码版本",
  },
  {
    severity: "yellow",
    title: "【模糊扫描件】置信度低",
    description: "票面信息模糊，OCR识别准确率不足",
    historySolution: "高清重扫 / 图片增强处理",
    aiSuggestion:
      "建议处理方案：\n1. 使用 300DPI 以上分辨率重新扫描\n2. 确保扫描时发票平整，无折痕遮挡\n3. 可使用本地图像增强工具提升清晰度\n4. 手动补填关键字段后标记为「人工校验」",
  },
]

export function IssuePanel() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
        {"📌"} 问题提示与AI联调区
      </h2>

      <div className="space-y-3">
        {issues.map((issue, i) => (
          <div
            key={i}
            className={`rounded-xl border-l-4 p-4 ${
              issue.severity === "red"
                ? "border-l-red-500 bg-red-50"
                : "border-l-amber-500 bg-amber-50"
            }`}
          >
            {/* 标题行 */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`font-semibold ${issue.severity === "red" ? "text-red-700" : "text-amber-700"}`}>
                  {issue.severity === "red" ? "🔴" : "🟡"} {issue.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {issue.description}
                </p>
              </div>
            </div>

            {/* 历史解决方案 */}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5" />
              <span>历史解决方案：{issue.historySolution}</span>
            </div>

            {/* 问AI按钮 */}
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                问问AI怎么修
              </Button>
            </div>

            {/* AI 建议展开 */}
            {expanded === i && (
              <div className="mt-3 rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Bot className="h-4 w-4 text-primary" />
                  AI 建议
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {issue.aiSuggestion}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
