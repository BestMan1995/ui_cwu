"use client"

import { useState } from "react"
import {
  FileText,
  PenLine,
  Coins,
  BarChart3,
  AlertTriangle,
  Phone,
  Bot,
  Building2,
  ChevronDown,
  Upload,
  ClipboardList,
  ListChecks,
  FileEdit,
  BookOpen,
  CalendarDays,
  FileBarChart,
  Settings2,
  ShieldCheck,
  FolderArchive,
  Lock,
  Wrench,
  ScrollText,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type PageKey = "invoice" | "journal" | "tax" | "report" | "risk" | "ledger"

export interface SubItem {
  key: string
  label: string
  icon: typeof FileText
}

export interface MenuItem {
  icon: typeof FileText
  label: string
  key: PageKey
  children: SubItem[]
}

const menuItems: MenuItem[] = [
  {
    icon: FileText,
    label: "发票解析",
    key: "invoice",
    children: [
      { key: "invoice-upload", label: "发票上传解析", icon: Upload },
      { key: "invoice-history", label: "历史解析台账", icon: ClipboardList },
    ],
  },
  {
    icon: PenLine,
    label: "自动分录",
    key: "journal",
    children: [
      { key: "journal-pending", label: "待生成分录", icon: ListChecks },
      { key: "journal-done", label: "已生成分录", icon: FileEdit },
      { key: "journal-rules", label: "分录规则管理", icon: BookOpen },
    ],
  },
  {
    icon: Coins,
    label: "税种计算",
    key: "tax",
    children: [
      { key: "tax-period", label: "周期算税", icon: CalendarDays },
      { key: "tax-result", label: "算税结果", icon: ClipboardList },
      { key: "tax-rules", label: "算税规则管理", icon: BookOpen },
    ],
  },
  {
    icon: BarChart3,
    label: "报表生成",
    key: "report",
    children: [
      { key: "report-period", label: "周期报表生成", icon: CalendarDays },
      { key: "report-history", label: "历史报表台账", icon: FileBarChart },
      { key: "report-templates", label: "报表模板管理", icon: BookOpen },
    ],
  },
  {
    icon: AlertTriangle,
    label: "风险预警",
    key: "risk",
    children: [
      { key: "risk-period", label: "周期风险检测", icon: CalendarDays },
      { key: "risk-ledger", label: "风险处置台账", icon: ShieldCheck },
      { key: "risk-rules", label: "风控规则管理", icon: BookOpen },
    ],
  },
  {
    icon: Building2,
    label: "账套管理",
    key: "ledger",
    children: [
      { key: "ledger-info", label: "账套基础信息", icon: ClipboardList },
      { key: "ledger-invoice", label: "发票台账", icon: FileText },
      { key: "ledger-entry", label: "分录台账", icon: PenLine },
      { key: "ledger-tax", label: "计税台账", icon: Coins },
      { key: "ledger-report", label: "报表台账", icon: BarChart3 },
      { key: "ledger-risk", label: "风险台账", icon: AlertTriangle },
      { key: "ledger-permission", label: "权限管理", icon: Lock },
      { key: "ledger-maintenance", label: "数据维护", icon: Wrench },
      { key: "ledger-log", label: "操作日志", icon: ScrollText },
    ],
  },
]

const todos = [
  "A公司 3月报表生成",
  "B公司 税负异常检测",
  "C公司 发票分录保存",
]

interface AppSidebarProps {
  activePage: PageKey
  activeSubKey: string
  onPageChange: (page: PageKey) => void
  onSubChange: (page: PageKey, subKey: string) => void
}

export function AppSidebar({ activePage, activeSubKey, onPageChange, onSubChange }: AppSidebarProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<PageKey>>(() => new Set([activePage]))

  const invoiceTask = activeSubKey === "invoice-history"
    ? { task: "台账数据查询", detail: "逻辑校验：查询规则 18 条", progress: 100 }
    : { task: "发票解析校验", detail: "逻辑校验：匹配OCR规则 8 条", progress: 100 }

  const journalTask = activeSubKey === "journal-done"
    ? { task: "分录数据查询", detail: "逻辑校验：查询规则 22 条", progress: 100 }
    : activeSubKey === "journal-rules"
    ? { task: "规则匹配校验", detail: "逻辑校验：规则库 38 条", progress: 100 }
    : { task: "分录规则匹配", detail: "逻辑校验：匹配财税规则 15 条", progress: 70 }

  const taxTask = activeSubKey === "tax-result"
    ? { task: "算税结果查询", detail: "逻辑校验：查询规则 25 条", progress: 100 }
    : { task: "多税种核算+税负分析", detail: "逻辑校验：匹配算税规则 21 条", progress: 80 }

  const taskInfo: Record<PageKey, { task: string; detail: string; progress: number }> = {
    invoice: invoiceTask,
    journal: journalTask,
    tax: taxTask,
    report: { task: "财务报表生成+合规校验", detail: "逻辑校验：匹配报表规则 18 条", progress: 50 },
    risk: { task: "全维度风险识别+整改闭环", detail: "逻辑校验：匹配风控规则 25 条", progress: 100 },
    ledger: { task: "账套数据管理", detail: "台账汇总 / 权限配置 / 数据维护", progress: 100 },
  }

  const current = taskInfo[activePage]

  function toggleExpand(key: PageKey) {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function handleParentClick(item: MenuItem) {
    // Always expand when clicking parent
    if (!expandedKeys.has(item.key)) {
      setExpandedKeys((prev) => new Set(prev).add(item.key))
    }
    // Navigate to first child
    onSubChange(item.key, item.children[0].key)
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Agent task flow */}
      <div className="px-4 pt-5 pb-3">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          <Bot className="h-4 w-4" />
          Agent 任务流
        </h3>
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
          <p className="text-sm font-medium text-sidebar-primary">
            当前任务：{current.task}
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            {current.detail}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sidebar-border">
              <div
                className="h-full rounded-full bg-sidebar-primary transition-all duration-500"
                style={{ width: `${current.progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-sidebar-primary">{current.progress}%</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          功能菜单
        </h3>
        <nav className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const isActive = item.key === activePage
            const isExpanded = expandedKeys.has(item.key)

            return (
              <div key={item.key}>
                {/* Parent item */}
                <button
                  onClick={() => handleParentClick(item)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(item.key)
                    }}
                  />
                </button>

                {/* Children */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-4 border-l border-sidebar-border/50 py-1 pl-2">
                    {item.children.map((child) => {
                      const isChildActive = isActive && activeSubKey === child.key
                      return (
                        <button
                          key={child.key}
                          onClick={() => onSubChange(item.key, child.key)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                            isChildActive
                              ? "bg-sidebar-primary/15 text-sidebar-primary font-medium"
                              : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/80"
                          )}
                        >
                          <child.icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{child.label}</span>
                          {isChildActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Quick actions */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          快捷操作
        </h3>
        <div className="mb-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
          <p className="mb-2 text-sm font-medium text-sidebar-foreground">
            今日待办
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
              3
            </span>
          </p>
          <ul className="space-y-1.5">
            {todos.map((t, i) => (
              <li
                key={t}
                className="text-xs text-sidebar-foreground/60 leading-relaxed"
              >
                {i + 1}. {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
          <p className="flex items-center gap-1.5 text-sm font-medium text-sidebar-foreground">
            <Phone className="h-3.5 w-3.5" />
            技术支持
          </p>
          <p className="mt-1 text-xs text-sidebar-primary font-medium">400-xxxx-xxxx</p>
          <p className="text-[11px] text-sidebar-foreground/50">工作日 9:00 - 18:00</p>
        </div>
      </div>
    </aside>
  )
}
