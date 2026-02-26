"use client"

import { useState } from "react"
import { ArrowLeft, LifeBuoy, RefreshCw, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RiskBottomBarProps {
  onBack: () => void
  onRefresh: () => void
}

export function RiskBottomBar({ onBack, onRefresh }: RiskBottomBarProps) {
  const [simpleMode, setSimpleMode] = useState(false)

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          返回税种计算
        </Button>
        <span className="mx-1 h-4 w-px bg-border" />
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <LifeBuoy className="h-4 w-4" />
          帮助
        </Button>
        <span className="mx-1 h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          刷新风险状态
        </Button>
      </div>

      <button
        onClick={() => setSimpleMode(!simpleMode)}
        className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30"
      >
        <SlidersHorizontal className="h-4 w-4" />
        简易模式
        <div
          className={`relative h-5 w-9 rounded-full transition-colors ${
            simpleMode ? "bg-primary" : "bg-border"
          }`}
        >
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${
              simpleMode ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  )
}
