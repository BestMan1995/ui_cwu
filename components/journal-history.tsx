"use client"

import { useState, useMemo } from "react"
import {
  Search,
  RotateCcw,
  Download,
  FileText,
  Eye,
  Pencil,
  Link2,
  BarChart3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"

// ---- Types ----
type EntryStatus = "archived" | "pending" | "modified"

interface JournalRecord {
  id: string
  entryId: string
  invoiceId: string
  entryDate: string
  primarySubject: string
  secondarySubject: string
  debit: number
  credit: number
  status: EntryStatus
  operator: string
  matchTax: boolean
}

// ---- Deterministic currency formatter ----
function formatCurrency(n: number): string {
  const fixed = n.toFixed(2)
  const [intPart, decPart] = fixed.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${withCommas}.${decPart}`
}

// ---- Mock Data ----
const allRecords: JournalRecord[] = [
  { id: "1", entryId: "FL26022001", invoiceId: "INV26022001", entryDate: "2026-02-20", primarySubject: "管理费用", secondarySubject: "办公费", debit: 1000.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "2", entryId: "FL26022002", invoiceId: "INV26022001", entryDate: "2026-02-20", primarySubject: "应付账款", secondarySubject: "XX科技公司", debit: 0, credit: 1000.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "3", entryId: "FL26021901", invoiceId: "INV26021902", entryDate: "2026-02-19", primarySubject: "管理费用", secondarySubject: "业务招待费", debit: 500.0, credit: 0, status: "pending", operator: "张会计", matchTax: false },
  { id: "4", entryId: "FL26021902", invoiceId: "INV26021902", entryDate: "2026-02-19", primarySubject: "库存现金", secondarySubject: "现金", debit: 0, credit: 500.0, status: "pending", operator: "张会计", matchTax: false },
  { id: "5", entryId: "FL26021701", invoiceId: "INV26021701", entryDate: "2026-02-17", primarySubject: "主营业务收入", secondarySubject: "商品销售收入", debit: 0, credit: 2000.0, status: "modified", operator: "李会计", matchTax: true },
  { id: "6", entryId: "FL26021702", invoiceId: "INV26021701", entryDate: "2026-02-17", primarySubject: "应收账款", secondarySubject: "A客户", debit: 2000.0, credit: 0, status: "modified", operator: "李会计", matchTax: true },
  { id: "7", entryId: "FL26021601", invoiceId: "INV26021601", entryDate: "2026-02-16", primarySubject: "销售费用", secondarySubject: "交通费", debit: 150.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "8", entryId: "FL26021602", invoiceId: "INV26021601", entryDate: "2026-02-16", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 150.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "9", entryId: "FL26021501", invoiceId: "INV26021501", entryDate: "2026-02-15", primarySubject: "管理费用", secondarySubject: "办公费", debit: 880.0, credit: 0, status: "archived", operator: "李会计", matchTax: true },
  { id: "10", entryId: "FL26021502", invoiceId: "INV26021501", entryDate: "2026-02-15", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 880.0, status: "archived", operator: "李会计", matchTax: true },
  { id: "11", entryId: "FL26021503", invoiceId: "INV26021502", entryDate: "2026-02-15", primarySubject: "库存商品", secondarySubject: "A商品", debit: 5600.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "12", entryId: "FL26021504", invoiceId: "INV26021502", entryDate: "2026-02-15", primarySubject: "应付账款", secondarySubject: "B供应商", debit: 0, credit: 5600.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "13", entryId: "FL26021401", invoiceId: "INV26021401", entryDate: "2026-02-14", primarySubject: "管理费用", secondarySubject: "通讯费", debit: 200.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "14", entryId: "FL26021402", invoiceId: "INV26021401", entryDate: "2026-02-14", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 200.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "15", entryId: "FL26021301", invoiceId: "INV26021301", entryDate: "2026-02-13", primarySubject: "主营业务成本", secondarySubject: "商品成本", debit: 1350.0, credit: 0, status: "pending", operator: "张会计", matchTax: false },
  { id: "16", entryId: "FL26021302", invoiceId: "INV26021301", entryDate: "2026-02-13", primarySubject: "库存商品", secondarySubject: "A商品", debit: 0, credit: 1350.0, status: "pending", operator: "张会计", matchTax: false },
  { id: "17", entryId: "FL26021201", invoiceId: "INV26021201", entryDate: "2026-02-12", primarySubject: "管理费用", secondarySubject: "租赁费", debit: 2100.0, credit: 0, status: "archived", operator: "李会计", matchTax: true },
  { id: "18", entryId: "FL26021202", invoiceId: "INV26021201", entryDate: "2026-02-12", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 2100.0, status: "archived", operator: "李会计", matchTax: true },
  { id: "19", entryId: "FL26021101", invoiceId: "INV26021101", entryDate: "2026-02-11", primarySubject: "管理费用", secondarySubject: "业务招待费", debit: 320.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "20", entryId: "FL26021102", invoiceId: "INV26021101", entryDate: "2026-02-11", primarySubject: "库存现金", secondarySubject: "现金", debit: 0, credit: 320.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "21", entryId: "FL26021103", invoiceId: "INV26021102", entryDate: "2026-02-11", primarySubject: "主营业务收入", secondarySubject: "商品销售收入", debit: 0, credit: 4200.0, status: "modified", operator: "李会计", matchTax: true },
  { id: "22", entryId: "FL26021104", invoiceId: "INV26021102", entryDate: "2026-02-11", primarySubject: "应收账款", secondarySubject: "B客户", debit: 4200.0, credit: 0, status: "modified", operator: "李会计", matchTax: true },
  { id: "23", entryId: "FL26021001", invoiceId: "INV26021001", entryDate: "2026-02-10", primarySubject: "管理费用", secondarySubject: "水电费", debit: 1500.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "24", entryId: "FL26021002", invoiceId: "INV26021001", entryDate: "2026-02-10", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 1500.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "25", entryId: "FL26020901", invoiceId: "INV26020901", entryDate: "2026-02-09", primarySubject: "销售费用", secondarySubject: "交通费", debit: 80.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "26", entryId: "FL26020902", invoiceId: "INV26020901", entryDate: "2026-02-09", primarySubject: "库存现金", secondarySubject: "现金", debit: 0, credit: 80.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "27", entryId: "FL26020801", invoiceId: "INV26020801", entryDate: "2026-02-08", primarySubject: "管理费用", secondarySubject: "办公费", debit: 560.0, credit: 0, status: "archived", operator: "李会计", matchTax: true },
  { id: "28", entryId: "FL26020802", invoiceId: "INV26020801", entryDate: "2026-02-08", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 560.0, status: "archived", operator: "李会计", matchTax: true },
  { id: "29", entryId: "FL26020701", invoiceId: "INV26020701", entryDate: "2026-02-07", primarySubject: "主营业务收入", secondarySubject: "商品销售收入", debit: 0, credit: 900.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "30", entryId: "FL26020702", invoiceId: "INV26020701", entryDate: "2026-02-07", primarySubject: "银行存款", secondarySubject: "基本户", debit: 900.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "31", entryId: "FL26020601", invoiceId: "INV26020601", entryDate: "2026-02-06", primarySubject: "管理费用", secondarySubject: "通讯费", debit: 180.0, credit: 0, status: "pending", operator: "李会计", matchTax: false },
  { id: "32", entryId: "FL26020602", invoiceId: "INV26020601", entryDate: "2026-02-06", primarySubject: "银行存款", secondarySubject: "基本户", debit: 0, credit: 180.0, status: "pending", operator: "李会计", matchTax: false },
  { id: "33", entryId: "FL26020501", invoiceId: "INV26020501", entryDate: "2026-02-05", primarySubject: "管理费用", secondarySubject: "差旅费", debit: 750.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "34", entryId: "FL26020502", invoiceId: "INV26020501", entryDate: "2026-02-05", primarySubject: "库存现金", secondarySubject: "现金", debit: 0, credit: 750.0, status: "archived", operator: "张会计", matchTax: true },
  { id: "35", entryId: "FL26020401", invoiceId: "INV26020401", entryDate: "2026-02-04", primarySubject: "管理费用", secondarySubject: "业务招待费", debit: 420.0, credit: 0, status: "archived", operator: "张会计", matchTax: true },
  { id: "36", entryId: "FL26020402", invoiceId: "INV26020401", entryDate: "2026-02-04", primarySubject: "库存现金", secondarySubject: "现金", debit: 0, credit: 420.0, status: "archived", operator: "张会计", matchTax: true },
]

const PAGE_SIZE = 20

const statusConfig: Record<EntryStatus, { label: string; className: string }> = {
  archived: { label: "已归档", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "待核对", className: "bg-amber-50 text-amber-700 border-amber-200" },
  modified: { label: "已修改", className: "bg-sky-50 text-sky-700 border-sky-200" },
}

const PIE_COLORS = ["var(--color-chart-2)", "var(--color-chart-4)", "var(--color-chart-1)"]
const BAR_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

// ---- Component ----
export function JournalHistory() {
  // Filter state
  const [dateFrom, setDateFrom] = useState("2026-02-01")
  const [dateTo, setDateTo] = useState("2026-02-28")
  const [idSearch, setIdSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")
  const [taxMatchFilter, setTaxMatchFilter] = useState("all")
  const [amountMin, setAmountMin] = useState("")
  const [amountMax, setAmountMax] = useState("")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<JournalRecord | null>(null)

  // Unique values for filters
  const primarySubjects = [...new Set(allRecords.map((r) => r.primarySubject))]
  const operators = [...new Set(allRecords.map((r) => r.operator))]

  // Computed filtered data
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (dateFrom && r.entryDate < dateFrom) return false
      if (dateTo && r.entryDate > dateTo) return false
      if (idSearch) {
        const q = idSearch.toLowerCase()
        if (!r.entryId.toLowerCase().includes(q) && !r.invoiceId.toLowerCase().includes(q)) return false
      }
      if (subjectFilter !== "all" && r.primarySubject !== subjectFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (operatorFilter !== "all" && r.operator !== operatorFilter) return false
      if (taxMatchFilter === "yes" && !r.matchTax) return false
      if (taxMatchFilter === "no" && r.matchTax) return false
      const rowAmount = Math.max(r.debit, r.credit)
      if (amountMin && rowAmount < Number(amountMin)) return false
      if (amountMax && rowAmount > Number(amountMax)) return false
      return true
    })
  }, [dateFrom, dateTo, idSearch, subjectFilter, statusFilter, operatorFilter, taxMatchFilter, amountMin, amountMax])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const paged = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const archived = filteredRecords.filter((r) => r.status === "archived").length
    const pending = filteredRecords.filter((r) => r.status === "pending").length
    const modified = filteredRecords.filter((r) => r.status === "modified").length
    const abnormal = 0
    const totalDebit = filteredRecords.reduce((sum, r) => sum + r.debit, 0)
    const totalCredit = filteredRecords.reduce((sum, r) => sum + r.credit, 0)
    const balanced = Math.abs(totalDebit - totalCredit) < 0.01
    const operators: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      operators[r.operator] = (operators[r.operator] || 0) + 1
    })
    return { archived, pending, modified, abnormal, totalDebit, totalCredit, balanced, operators }
  }, [filteredRecords])

  // Chart data
  const pieData = [
    { name: "已归档", value: stats.archived },
    { name: "待核对", value: stats.pending },
    { name: "已修改", value: stats.modified },
  ].filter((d) => d.value > 0)

  // Subject expenditure bar chart
  const subjectBarData = useMemo(() => {
    const map: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      if (r.debit > 0) {
        map[r.primarySubject] = (map[r.primarySubject] || 0) + r.debit
      }
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
  }, [filteredRecords])

  // Daily entry count trend
  const dailyTrendData = useMemo(() => {
    const map: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      map[r.entryDate] = (map[r.entryDate] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date: date.slice(5), count }))
  }, [filteredRecords])

  // Selection handlers
  const allPageSelected = paged.length > 0 && paged.every((r) => selectedIds.has(r.id))
  function toggleAll() {
    if (allPageSelected) {
      const next = new Set(selectedIds)
      paged.forEach((r) => next.delete(r.id))
      setSelectedIds(next)
    } else {
      const next = new Set(selectedIds)
      paged.forEach((r) => next.add(r.id))
      setSelectedIds(next)
    }
  }
  function toggleOne(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function handleReset() {
    setDateFrom("2026-02-01")
    setDateTo("2026-02-28")
    setIdSearch("")
    setSubjectFilter("all")
    setStatusFilter("all")
    setOperatorFilter("all")
    setTaxMatchFilter("all")
    setAmountMin("")
    setAmountMax("")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-5">
      {/* ---- Balance Check Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          借贷平衡实时校验区（核心财务规范，异常标红预警）
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={`rounded-lg border p-4 ${stats.balanced ? "border-emerald-200 bg-emerald-50/60" : "border-red-200 bg-red-50/60"}`}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">本次查询分录统计</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-foreground">
                {"借方合计："}
                <strong className="font-mono tabular-nums">{formatCurrency(stats.totalDebit)}</strong>
                {" 元"}
              </span>
              <span className="text-sm text-foreground">
                {"贷方合计："}
                <strong className="font-mono tabular-nums">{formatCurrency(stats.totalCredit)}</strong>
                {" 元"}
              </span>
              {stats.balanced ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  借贷平衡
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                  借贷不平衡
                </Badge>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">账套累计分录</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-foreground">
                {filteredRecords.length} 条
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-emerald-700">
                {"已归档："}{stats.archived} 条
              </span>
              <span className="text-amber-700">
                {"待核对："}{stats.pending} 条
              </span>
              <span className="text-muted-foreground">
                {"异常分录："}{stats.abnormal} 条
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Filter Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          多维度精准筛选区（支持组合查询，贴合财务对账习惯）
        </h3>

        {/* Basic filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">基础筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs">分录日期（起）</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">分录日期（止）</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">分录ID / 发票ID</Label>
              <Input
                placeholder="输入ID（支持模糊查询）"
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">科目类型</Label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {primarySubjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs">金额下限</Label>
              <Input
                type="number"
                placeholder="0"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">金额上限</Label>
              <Input
                type="number"
                placeholder="999999"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">高级筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">分录状态</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                  <SelectItem value="pending">待核对</SelectItem>
                  <SelectItem value="modified">已修改</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">操作人</Label>
              <Select value={operatorFilter} onValueChange={setOperatorFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {operators.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">是否匹配算税</Label>
              <Select value={taxMatchFilter} onValueChange={setTaxMatchFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="yes">已匹配</SelectItem>
                  <SelectItem value="no">未匹配</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button size="sm" className="gap-2" onClick={handleQuery}>
            <Search className="h-3.5 w-3.5" />
            一键查询
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            重置筛选
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            导出分录Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            导出PDF凭证
          </Button>
        </div>
      </section>

      {/* ---- Data Table ---- */}
      <section className="rounded-xl border border-border bg-card">
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            {"已生成分录核心列表（共 "}{filteredRecords.length}{" 条）"}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10 text-center">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleAll}
                    aria-label="全选当前页"
                  />
                </TableHead>
                <TableHead className="text-xs">分录ID</TableHead>
                <TableHead className="text-xs">关联发票ID</TableHead>
                <TableHead className="text-xs">分录日期</TableHead>
                <TableHead className="text-xs">一级科目</TableHead>
                <TableHead className="text-xs">二级科目</TableHead>
                <TableHead className="text-right text-xs">借方(元)</TableHead>
                <TableHead className="text-right text-xs">贷方(元)</TableHead>
                <TableHead className="text-center text-xs">分录状态</TableHead>
                <TableHead className="text-center text-xs">操作列</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                    暂无匹配记录，请调整筛选条件后重新查询
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((record) => (
                  <TableRow
                    key={record.id}
                    className={
                      record.status === "pending"
                        ? "bg-amber-50/40"
                        : record.status === "modified"
                          ? "bg-sky-50/40"
                          : ""
                    }
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => toggleOne(record.id)}
                        aria-label={`选中 ${record.entryId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.entryId}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {record.invoiceId || "----"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {record.entryDate}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {record.primarySubject}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {record.secondarySubject}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {record.debit > 0 ? (
                        <span className="font-medium text-foreground">{formatCurrency(record.debit)}</span>
                      ) : (
                        <span className="text-muted-foreground">0.00</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {record.credit > 0 ? (
                        <span className="font-medium text-foreground">{formatCurrency(record.credit)}</span>
                      ) : (
                        <span className="text-muted-foreground">0.00</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${statusConfig[record.status].className}`}
                      >
                        {statusConfig[record.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => setDetailRecord(record)}
                          title="查看详情"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          title="编辑分录"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="关联溯源"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="匹配算税"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ---- Batch Actions ---- */}
      {selectedIds.size > 0 && (
        <section className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {"已勾选："}<strong>{selectedIds.size}</strong>{" 条记录"}
            </span>
            <span className="text-xs text-muted-foreground">可执行操作：</span>
            <Button size="sm" variant="outline" className="gap-2">
              <Archive className="h-3.5 w-3.5" />
              批量归档分录
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Search className="h-3.5 w-3.5" />
              批量匹配算税
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-3.5 w-3.5" />
              批量导出凭证
            </Button>
            <Button size="sm" variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              批量删除分录
            </Button>
          </div>
        </section>
      )}

      {/* ---- Pagination & Stats ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        {/* Pagination */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{"第 "}{currentPage}{" 页 / 共 "}{totalPages}{" 页"}</span>
            <span className="text-xs">{"| 每页 "}{PAGE_SIZE}{" 条"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="mb-3 text-xs font-semibold text-muted-foreground">分录统计（本次查询）</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="总分录数" value={`${filteredRecords.length} 条`} />
            <StatCard label="已归档" value={`${stats.archived} 条`} variant="success" />
            <StatCard label="待核对" value={`${stats.pending} 条`} variant="warning" />
            <StatCard label="已修改" value={`${stats.modified} 条`} variant="info" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">借方合计</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(stats.totalDebit)} 元
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">贷方合计</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(stats.totalCredit)} 元
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">操作人分布</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {Object.entries(stats.operators)
                  .map(([name, count]) => `${name}(${count}条)`)
                  .join("、")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Charts ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">分录维度统计区（可视化辅助）</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Subject expenditure bar chart */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">科目支出占比柱状图</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectBarData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${formatCurrency(value)} 元`, "借方金额"]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {subjectBarData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Entry status pie chart */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">分录状态占比饼图</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [`${value} 条`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily entry count trend */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">每日分录数量趋势图</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value} 条`, "分录数"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-chart-1)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Bottom Bar ---- */}
      <section className="flex flex-wrap items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回待生成分录
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            分录帮助中心
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            刷新台账
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            技术支持
          </Button>
        </div>
      </section>

      {/* ---- Detail Dialog ---- */}
      <Dialog open={!!detailRecord} onOpenChange={() => setDetailRecord(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>分录详情</DialogTitle>
            <DialogDescription suppressHydrationWarning>
              {"分录ID："}{detailRecord?.entryId}
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-3 text-sm">
              <DetailRow label="分录ID" value={detailRecord.entryId} />
              <DetailRow label="关联发票ID" value={detailRecord.invoiceId || "----"} />
              <DetailRow label="分录日期" value={detailRecord.entryDate} />
              <DetailRow label="一级科目" value={detailRecord.primarySubject} />
              <DetailRow label="二级科目" value={detailRecord.secondarySubject} />
              <DetailRow
                label="借方(元)"
                value={formatCurrency(detailRecord.debit)}
              />
              <DetailRow
                label="贷方(元)"
                value={formatCurrency(detailRecord.credit)}
              />
              <DetailRow label="操作人" value={detailRecord.operator} />
              <DetailRow label="匹配算税" value={detailRecord.matchTax ? "已匹配" : "未匹配"} />
              <div className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-muted-foreground">分录状态</span>
                <Badge
                  variant="outline"
                  className={statusConfig[detailRecord.status].className}
                >
                  {statusConfig[detailRecord.status].label}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string
  value: string
  variant?: "success" | "danger" | "warning" | "info"
}) {
  const colorMap = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  }
  const cls = variant
    ? colorMap[variant]
    : "border-border bg-card text-foreground"

  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <p className={`text-xs ${variant ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
    </div>
  )
}
