"use client"

import { useState, useEffect } from "react"
import { BarChart3, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TaxRow {
  name: string
  basis: string
  basisNote?: string
  amount: string
  rate: string
}

const mockResults: TaxRow[] = [
  {
    name: "增值税",
    basis: "85,000元",
    basisNote: "月销售额＜10万，免征",
    amount: "0",
    rate: "0.0%",
  },
  {
    name: "企业所得税",
    basis: "12,000元",
    basisNote: "应纳税所得额=利润总额",
    amount: "300",
    rate: "0.35%",
  },
]

interface TaxResultsProps {
  calculated: boolean
}

export function TaxResults({ calculated }: TaxResultsProps) {
  const [rows, setRows] = useState<TaxRow[]>([])
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (calculated) {
      setAnimating(true)
      const timer = setTimeout(() => {
        setRows(mockResults)
        setAnimating(false)
      }, 900)
      return () => clearTimeout(timer)
    }
  }, [calculated])

  if (!calculated && rows.length === 0) return null

  return (
    <section className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          税种计算结果
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          AI智能校验+专业明细
        </span>
      </div>

      {/* Sub-header */}
      <div className="border-b border-border bg-muted/30 px-5 py-2.5">
        <p className="text-sm font-medium text-foreground">
          算税结果概览
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            （税负率 = 应纳税额 / 营业收入）
          </span>
        </p>
      </div>

      {/* Loading animation */}
      {animating ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            AI正在匹配算税规则，计算各税种应纳税额...
          </p>
        </div>
      ) : (
        <>
          {/* Results table */}
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-44">税种</TableHead>
                  <TableHead className="w-56">
                    <span className="flex items-center gap-1">
                      计税依据
                      <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </span>
                  </TableHead>
                  <TableHead className="w-36 text-right">应纳税额(元)</TableHead>
                  <TableHead className="w-28 text-right">税负率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium text-foreground">
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-foreground">{row.basis}</span>
                        {row.basisNote && (
                          <span className="mt-0.5 text-[11px] text-muted-foreground">
                            {row.basisNote}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold text-foreground">
                      {row.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          parseFloat(row.rate) === 0
                            ? "bg-emerald-100 text-emerald-700"
                            : parseFloat(row.rate) < 0.5
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.rate}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                {rows.length > 0 && (
                  <TableRow className="border-t-2 border-border bg-muted/30 font-semibold">
                    <TableCell className="text-foreground">合计</TableCell>
                    <TableCell className="text-muted-foreground">{"————"}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-foreground">
                      300
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        0.35%
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Industry benchmark + actions */}
          {rows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
              <p className="text-sm text-muted-foreground">
                行业均值：
                <span className="font-medium text-foreground">0.3% - 0.5%</span>
                <span className="ml-1 text-xs text-muted-foreground/70">
                  （2025年税务系统行业税负预警值）
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
                  查看详细计算明细
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  导出算税表
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
