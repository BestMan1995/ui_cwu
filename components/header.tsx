"use client"

import { Bell, ChevronDown, Shield, Cpu, Lock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const accounts = [
  "A商贸公司（小规模）",
  "B科技公司（一般纳税人）",
  "C餐饮公司（小规模）",
]

interface HeaderProps {
  ruleVersion?: string
}

export function Header({ ruleVersion = "V1.0" }: HeaderProps) {
  return (
    <header className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* 主标题行 */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-sidebar-primary" suppressHydrationWarning>
            {"📊"} 财务代账AI Agent
          </span>
          <span className="rounded-full bg-sidebar-accent px-2.5 py-0.5 text-xs text-sidebar-accent-foreground" suppressHydrationWarning>
            私有化版
          </span>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                当前账套：A商贸公司（小规模）
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {accounts.map((a) => (
                <DropdownMenuItem key={a}>{a}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            <span className="sr-only">通知中心</span>
          </Button>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex flex-wrap items-center gap-4 border-t border-sidebar-border px-5 py-2 text-xs">
        <StatusBadge icon={<Shield className="h-3.5 w-3.5" />} text="本地加密环境" variant="green" />
        <StatusBadge icon={<Cpu className="h-3.5 w-3.5" />} text="模型运行中（Qwen2-7B）" variant="blue" />
        <StatusBadge icon={<Lock className="h-3.5 w-3.5" />} text="数据未上传公网" variant="green" />
        <StatusBadge icon={<BookOpen className="h-3.5 w-3.5" />} text={`模板/规则库版本：${ruleVersion}`} variant="amber" />
      </div>
    </header>
  )
}

function StatusBadge({
  icon,
  text,
  variant,
}: {
  icon: React.ReactNode
  text: string
  variant: "green" | "blue" | "amber"
}) {
  const colorMap = {
    green: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
  }
  return (
    <span className={`flex items-center gap-1.5 ${colorMap[variant]}`}>
      {icon}
      <span suppressHydrationWarning>{text}</span>
    </span>
  )
}
