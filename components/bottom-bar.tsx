"use client"

import { ArrowLeft, LifeBuoy, RefreshCw, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function BottomBar() {
  const [accountingMode, setAccountingMode] = useState(false)

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <LifeBuoy className="h-4 w-4" />
          帮助
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
          刷新
        </Button>
      </div>

      <button
        onClick={() => setAccountingMode(!accountingMode)}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <SlidersHorizontal className="h-4 w-4" />
        会计模式
        <div
          className={`relative h-5 w-9 rounded-full transition-colors ${
            accountingMode ? "bg-primary" : "bg-border"
          }`}
        >
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${
              accountingMode ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  )
}
