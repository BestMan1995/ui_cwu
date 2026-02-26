"use client"

import { useState, useEffect } from "react"
import { Clock, Hash } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface EntryRow {
  debitAccount: string
  creditAccount: string
  amount: string
  summary: string
}

const mockEntries: EntryRow[] = [
  {
    debitAccount: "管理费用-办公费",
    creditAccount: "银行存款-基本户",
    amount: "1,000.00",
    summary: "2月办公耗材",
  },
]

interface JournalEntryResultsProps {
  generated: boolean
}

export function JournalEntryResults({ generated }: JournalEntryResultsProps) {
  const [entries, setEntries] = useState<EntryRow[]>([])
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (generated) {
      setAnimating(true)
      const timer = setTimeout(() => {
        setEntries(mockEntries)
        setAnimating(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [generated])

  if (!generated && entries.length === 0) {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      {/* 头部信息 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          {"📊"} 会计分录结果
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            借贷方智能校验
          </span>
        </h2>
      </div>

      {/* 分录编号和时间 */}
      <div className="flex flex-wrap items-center gap-5 border-b border-border bg-muted/30 px-5 py-2.5">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Hash className="h-3.5 w-3.5" />
          分录编号：
          <span className="font-mono font-medium text-foreground">FL-20260220-001</span>
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          生成时间：
          <span className="font-mono text-foreground">2026-02-20 14:30</span>
        </span>
      </div>

      {/* 生成动画 */}
      {animating ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">AI正在匹配分录规则，生成会计分录...</p>
        </div>
      ) : (
        /* 分录表格 */
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-56">借方科目</TableHead>
                <TableHead className="w-56">贷方科目</TableHead>
                <TableHead className="w-32 text-right">金额(元)</TableHead>
                <TableHead>摘要</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[11px] font-semibold text-primary">
                        借
                      </span>
                      <span className="font-medium text-foreground">{row.debitAccount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 items-center rounded bg-emerald-500/10 px-1.5 text-[11px] font-semibold text-emerald-700">
                        贷
                      </span>
                      <span className="font-medium text-foreground">{row.creditAccount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums font-semibold text-foreground">
                    {row.amount}
                  </TableCell>
                  <TableCell>
                    <span className="cursor-pointer text-sm text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-primary/80">
                      {row.summary}
                    </span>
                    <span className="ml-2 text-[11px] text-muted-foreground">(可点击追溯)</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 借贷平衡校验 */}
          {entries.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-emerald-50/50 px-5 py-2.5">
              <span className="text-sm font-medium text-emerald-700">
                {"✅"} 借贷平衡校验通过
              </span>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-muted-foreground">
                  借方合计：<span className="font-mono font-semibold text-foreground">1,000.00</span>
                </span>
                <span className="text-muted-foreground">
                  贷方合计：<span className="font-mono font-semibold text-foreground">1,000.00</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
