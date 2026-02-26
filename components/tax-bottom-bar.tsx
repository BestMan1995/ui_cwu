"use client"

import { useState } from "react"
import { ArrowLeft, LifeBuoy, RefreshCw, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaxBottomBarProps {
  onBack: () => void
  onRecalculate: () => void
}

export function TaxBottomBar({ onBack, onRecalculate }: TaxBottomBarProps) {
  const [simpleMode, setSimpleMode] = useState(false)

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          返回自动分录
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <LifeBuoy className="h-4 w-4" />
          帮助
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={onRecalculate}
        >
          <RefreshCw className="h-4 w-4" />
          重新计算
        </Button>
      </div>

      <button
        onClick={() => setSimpleMode(!simpleMode)}
        className="flex items-center gap-2 text-sm text-muted-foreground"
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
