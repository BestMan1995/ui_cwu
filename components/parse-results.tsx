"use client"

import { Pencil, Save, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface InvoiceRow {
  status: "success" | "fail"
  type: string
  date: string
  amount: string
  taxRate: string
  confidence: number
}

const data: InvoiceRow[] = [
  { status: "success", type: "增值税普通发票", date: "2026-02-20", amount: "1,000.00", taxRate: "3.0", confidence: 98 },
  { status: "success", type: "餐饮发票", date: "2026-02-19", amount: "500.00", taxRate: "6.0", confidence: 88 },
  { status: "success", type: "增值税普通发票", date: "2026-02-18", amount: "2,300.00", taxRate: "3.0", confidence: 95 },
  { status: "success", type: "交通费发票", date: "2026-02-17", amount: "150.00", taxRate: "3.0", confidence: 97 },
  { status: "success", type: "办公用品发票", date: "2026-02-16", amount: "880.00", taxRate: "13.0", confidence: 93 },
  { status: "success", type: "增值税专用发票", date: "2026-02-15", amount: "5,600.00", taxRate: "13.0", confidence: 96 },
  { status: "success", type: "通讯费发票", date: "2026-02-14", amount: "200.00", taxRate: "6.0", confidence: 91 },
  { status: "success", type: "增值税普通发票", date: "2026-02-13", amount: "1,350.00", taxRate: "3.0", confidence: 94 },
  { status: "fail", type: "【失败】PDF加密件", date: "2026-02-18", amount: "————", taxRate: "————", confidence: 0 },
  { status: "fail", type: "【失败】模糊扫描件", date: "2026-02-17", amount: "————", taxRate: "————", confidence: 25 },
]

function ConfidenceBadge({ value }: { value: number }) {
  if (value >= 90) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        {value}%
      </span>
    )
  }
  if (value >= 50) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        {value}% {"🟡"}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
      {value}% {"🔴"}
    </span>
  )
}

export function ParseResults() {
  const successCount = data.filter((d) => d.status === "success").length
  const failCount = data.filter((d) => d.status === "fail").length

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
        {"📊"} 解析结果区
      </h2>

      {/* 统计卡片 */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-700">{successCount}</p>
          <p className="mt-1 text-xs text-emerald-600">解析成功</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{failCount}</p>
          <p className="mt-1 text-xs text-red-600">解析失败</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">92%</p>
          <p className="mt-1 text-xs text-blue-600">平均置信度</p>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16 text-center">状态</TableHead>
              <TableHead>发票类型</TableHead>
              <TableHead>开票日期</TableHead>
              <TableHead className="text-right">金额(元)</TableHead>
              <TableHead className="text-right">税率(%)</TableHead>
              <TableHead className="text-center">AI置信度</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={i}
                className={row.status === "fail" ? "bg-red-50/50" : ""}
              >
                <TableCell className="text-center">
                  {row.status === "success" ? (
                    <span className="text-emerald-600">{"✅"}</span>
                  ) : (
                    <span className="text-red-500">{"❌"}</span>
                  )}
                </TableCell>
                <TableCell className={`font-medium ${row.status === "fail" ? "text-red-600" : "text-foreground"}`}>
                  {row.type}
                </TableCell>
                <TableCell className="text-muted-foreground">{row.date}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">
                  {row.amount}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                  {row.taxRate}
                </TableCell>
                <TableCell className="text-center">
                  <ConfidenceBadge value={row.confidence} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 操作按钮 */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-3.5 w-3.5" /> 编辑
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-3.5 w-3.5" /> 保存
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-3.5 w-3.5" /> 导出
        </Button>
        <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" /> 删除
        </Button>
      </div>
    </section>
  )
}
