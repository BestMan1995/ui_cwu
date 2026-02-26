"use client"

import {
  Save,
  FileText,
  FileCheck2,
  ClipboardList,
  Download,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaxOperationsProps {
  calculated: boolean
}

export function TaxOperations({ calculated }: TaxOperationsProps) {
  if (!calculated) return null

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          {"⚙️"} 操作区
          <span className="text-xs font-normal text-muted-foreground">（按流程分组）</span>
        </h2>
      </div>

      <div className="px-5 py-5">
        <div className="grid grid-cols-3 gap-4">
          {/* Save category */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Save className="h-4 w-4 text-primary" />
              保存类
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Save className="h-3.5 w-3.5" />
                保存至账套
              </Button>
            </div>
          </div>

          {/* Declaration category */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ClipboardList className="h-4 w-4 text-primary" />
              申报类
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <FileText className="h-3.5 w-3.5" />
                生成纳税申报表
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <FileCheck2 className="h-3.5 w-3.5" />
                模拟申报
              </Button>
            </div>
          </div>

          {/* Export category */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Download className="h-4 w-4 text-primary" />
              导出类
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Download className="h-3.5 w-3.5" />
                导出算税表
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <TrendingUp className="h-3.5 w-3.5" />
                导出趋势图
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
