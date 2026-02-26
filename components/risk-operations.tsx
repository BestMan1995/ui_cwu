"use client"

import {
  CheckSquare,
  Bell,
  Trash2,
  FileDown,
  FileText,
  ClipboardList,
  BookOpen,
  Settings2,
  Search,
  ChevronRight,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RiskOperationsProps {
  detected: boolean
}

const categories = [
  {
    title: "处置类",
    icon: CheckSquare,
    items: [
      { icon: CheckSquare, label: "批量标记状态" },
      { icon: Bell, label: "批量设置提醒" },
      { icon: Trash2, label: "清空已闭环风险", muted: true },
    ],
  },
  {
    title: "导出类",
    icon: FileDown,
    items: [
      { icon: FileText, label: "导出风险报告（简版）" },
      { icon: FileText, label: "导出风险报告（详版）" },
      { icon: ClipboardList, label: "导出整改计划表" },
    ],
  },
  {
    title: "台账/规则类",
    icon: BookOpen,
    items: [
      { icon: Search, label: "查看历史台账" },
      { icon: Settings2, label: "自定义风控规则", hasArrow: true },
      { icon: BookOpen, label: "查看规则依据库" },
    ],
  },
]

export function RiskOperations({ detected }: RiskOperationsProps) {
  if (!detected) return null

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Wrench className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          操作区
        </h2>
        <span className="text-xs text-muted-foreground">(按风控全流程分组)</span>
      </div>

      <div className="px-5 py-5">
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-lg border border-border bg-muted/10 transition-colors hover:bg-muted/20"
            >
              <div className="border-b border-border px-4 py-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <cat.icon className="h-4 w-4 text-primary" />
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-col gap-1.5 p-3">
                {cat.items.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="sm"
                    className={`justify-start gap-2 font-normal ${
                      item.muted
                        ? "text-muted-foreground hover:text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {item.label}
                    {item.hasArrow && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
