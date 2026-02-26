"use client"

import {
  Save,
  Download,
  FileArchive,
  FileSpreadsheet,
  Image,
  FileText,
  Printer,
  Cloud,
  Replace,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportOperationsProps {
  generated: boolean
}

export function ReportOperations({ generated }: ReportOperationsProps) {
  if (!generated) return null

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Settings2 className="h-5 w-5 text-primary" />
          操作区
          <span className="text-xs font-normal text-muted-foreground">（按用途分组）</span>
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
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Replace className="h-3.5 w-3.5" />
                覆盖历史报表
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
                <FileSpreadsheet className="h-3.5 w-3.5" />
                导出Excel（标准）
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                导出Excel（税务导入版）
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Image className="h-3.5 w-3.5" />
                导出图片
              </Button>
            </div>
          </div>

          {/* Archive category */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileArchive className="h-4 w-4 text-primary" />
              归档类
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <FileText className="h-3.5 w-3.5" />
                生成归档PDF
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Printer className="h-3.5 w-3.5" />
                打印报表
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Cloud className="h-3.5 w-3.5" />
                同步至电子档案
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
