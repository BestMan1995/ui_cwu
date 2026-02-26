"use client"

import { useState, useMemo } from "react"
import {
  Search,
  RotateCcw,
  Download,
  FileText,
  Eye,
  Tag,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
  FilePlus,
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
type ReportStatus = "archived" | "unarchived" | "error"
type GenerateMethod = "ai" | "manual"

interface ReportRecord {
  id: string
  reportId: string
  name: string
  period: string
  reportType: string
  format: string
  method: GenerateMethod
  status: ReportStatus
  operator: string
  tag: string
  createdAt: string
  fileSize: string
}

// ---- Deterministic currency formatter ----
function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// ---- Mock Data ----
const allRecords: ReportRecord[] = [
  { id: "1", reportId: "RP2602001", name: "资产负债表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-25", fileSize: "128KB" },
  { id: "2", reportId: "RP2602002", name: "利润表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-25", fileSize: "96KB" },
  { id: "3", reportId: "RP2602003", name: "增值税申报表", period: "2026-02", reportType: "税务报表", format: "PDF", method: "ai", status: "unarchived", operator: "李会计", tag: "", createdAt: "2026-02-24", fileSize: "256KB" },
  { id: "4", reportId: "RP2602004", name: "企业所得税申报表", period: "2026-02", reportType: "税务报表", format: "PDF", method: "manual", status: "archived", operator: "张会计", tag: "季度", createdAt: "2026-02-23", fileSize: "312KB" },
  { id: "5", reportId: "RP2602005", name: "现金流量表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-02-22", fileSize: "108KB" },
  { id: "6", reportId: "RP2602006", name: "附加税申报表", period: "2026-02", reportType: "税务报表", format: "PDF", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-22", fileSize: "198KB" },
  { id: "7", reportId: "RP2602007", name: "个税代扣代缴表", period: "2026-02", reportType: "税务报表", format: "PDF", method: "ai", status: "unarchived", operator: "李会计", tag: "", createdAt: "2026-02-21", fileSize: "176KB" },
  { id: "8", reportId: "RP2602008", name: "印花税申报表", period: "2026-02", reportType: "税务报表", format: "PDF", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-21", fileSize: "145KB" },
  { id: "9", reportId: "RP2602009", name: "科目余额表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-02-20", fileSize: "220KB" },
  { id: "10", reportId: "RP2602010", name: "总账明细表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "manual", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-20", fileSize: "340KB" },
  { id: "11", reportId: "RP2602011", name: "税负分析报告", period: "2026-02", reportType: "分析报告", format: "PDF", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-19", fileSize: "420KB" },
  { id: "12", reportId: "RP2602012", name: "应收账款账龄表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-02-19", fileSize: "156KB" },
  { id: "13", reportId: "RP2602013", name: "增值税一般纳税人辅助表", period: "2026-02", reportType: "税务报表", format: "PDF", method: "ai", status: "unarchived", operator: "张会计", tag: "", createdAt: "2026-02-18", fileSize: "288KB" },
  { id: "14", reportId: "RP2602014", name: "固定资产折旧表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "manual", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-02-18", fileSize: "132KB" },
  { id: "15", reportId: "RP2601001", name: "资产负债表", period: "2026-01", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-01-25", fileSize: "125KB" },
  { id: "16", reportId: "RP2601002", name: "利润表", period: "2026-01", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-01-25", fileSize: "92KB" },
  { id: "17", reportId: "RP2601003", name: "增值税申报表", period: "2026-01", reportType: "税务报表", format: "PDF", method: "ai", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-01-24", fileSize: "248KB" },
  { id: "18", reportId: "RP2601004", name: "企业所得税申报表", period: "2026-01", reportType: "税务报表", format: "PDF", method: "manual", status: "archived", operator: "张会计", tag: "季度", createdAt: "2026-01-23", fileSize: "308KB" },
  { id: "19", reportId: "RP2601005", name: "现金流量表", period: "2026-01", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-01-22", fileSize: "104KB" },
  { id: "20", reportId: "RP2601006", name: "附加税申报表", period: "2026-01", reportType: "税务报表", format: "PDF", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-01-22", fileSize: "192KB" },
  { id: "21", reportId: "RP2602015", name: "利润分析报告", period: "2026-02", reportType: "分析报告", format: "PDF", method: "ai", status: "unarchived", operator: "李会计", tag: "", createdAt: "2026-02-17", fileSize: "380KB" },
  { id: "22", reportId: "RP2602016", name: "费用明细表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "manual", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-17", fileSize: "178KB" },
  { id: "23", reportId: "RP2601007", name: "科目余额表", period: "2026-01", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "李会计", tag: "月度", createdAt: "2026-01-20", fileSize: "215KB" },
  { id: "24", reportId: "RP2601008", name: "税负分析报告", period: "2026-01", reportType: "分析报告", format: "PDF", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-01-19", fileSize: "410KB" },
  { id: "25", reportId: "RP2602017", name: "往来账款对账单", period: "2026-02", reportType: "财务报表", format: "Excel", method: "manual", status: "unarchived", operator: "李会计", tag: "", createdAt: "2026-02-16", fileSize: "198KB" },
  { id: "26", reportId: "RP2602018", name: "银行存款余额调节表", period: "2026-02", reportType: "财务报表", format: "Excel", method: "ai", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-16", fileSize: "88KB" },
  { id: "27", reportId: "RP2602019", name: "财务风险评估报告", period: "2026-02", reportType: "分析报告", format: "PDF", method: "ai", status: "unarchived", operator: "李会计", tag: "", createdAt: "2026-02-15", fileSize: "520KB" },
  { id: "28", reportId: "RP2602020", name: "期末结转凭证汇总", period: "2026-02", reportType: "财务报表", format: "Excel", method: "manual", status: "archived", operator: "张会计", tag: "月度", createdAt: "2026-02-15", fileSize: "164KB" },
]

const PAGE_SIZE = 20

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
  archived: { label: "已归档", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  unarchived: { label: "未归档", className: "bg-amber-50 text-amber-700 border-amber-200" },
  error: { label: "异常", className: "bg-red-50 text-red-700 border-red-200" },
}

const methodConfig: Record<GenerateMethod, { label: string; className: string }> = {
  ai: { label: "AI自动生成", className: "bg-blue-50 text-blue-700 border-blue-200" },
  manual: { label: "人工编辑", className: "bg-slate-50 text-slate-700 border-slate-200" },
}

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]
const BAR_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

// ---- Component ----
export function ReportHistory() {
  // Filter state
  const [periodFilter, setPeriodFilter] = useState("2026-02")
  const [reportTypeFilter, setReportTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")
  const [keyword, setKeyword] = useState("")
  const [methodFilter, setMethodFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<ReportRecord | null>(null)

  // Unique values for filters
  const reportTypes = [...new Set(allRecords.map((r) => r.reportType))]
  const formats = [...new Set(allRecords.map((r) => r.format))]
  const operators = [...new Set(allRecords.map((r) => r.operator))]
  const periods = [...new Set(allRecords.map((r) => r.period))].sort().reverse()
  const tags = [...new Set(allRecords.map((r) => r.tag).filter(Boolean))]

  // Computed filtered data
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (periodFilter !== "all" && r.period !== periodFilter) return false
      if (reportTypeFilter !== "all" && r.reportType !== reportTypeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (formatFilter !== "all" && r.format !== formatFilter) return false
      if (methodFilter !== "all" && r.method !== methodFilter) return false
      if (operatorFilter !== "all" && r.operator !== operatorFilter) return false
      if (tagFilter !== "all") {
        if (tagFilter === "none" && r.tag !== "") return false
        if (tagFilter !== "none" && r.tag !== tagFilter) return false
      }
      if (keyword) {
        const q = keyword.toLowerCase()
        if (
          !r.reportId.toLowerCase().includes(q) &&
          !r.name.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [periodFilter, reportTypeFilter, statusFilter, formatFilter, methodFilter, operatorFilter, tagFilter, keyword])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const paged = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const archived = filteredRecords.filter((r) => r.status === "archived").length
    const unarchived = filteredRecords.filter((r) => r.status === "unarchived").length
    const error = filteredRecords.filter((r) => r.status === "error").length

    // Report type breakdown
    const typeBreakdown: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      typeBreakdown[r.reportType] = (typeBreakdown[r.reportType] || 0) + 1
    })

    // Method breakdown
    const aiCount = filteredRecords.filter((r) => r.method === "ai").length
    const manualCount = filteredRecords.filter((r) => r.method === "manual").length

    // Operator breakdown
    const operatorMap: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      operatorMap[r.operator] = (operatorMap[r.operator] || 0) + 1
    })

    return {
      total: filteredRecords.length,
      archived,
      unarchived,
      error,
      typeBreakdown,
      aiCount,
      manualCount,
      operators: operatorMap,
    }
  }, [filteredRecords])

  // Chart data - Report type pie
  const typePieData = useMemo(() => {
    return Object.entries(stats.typeBreakdown)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [stats.typeBreakdown])

  // Chart data - Monthly report trend
  const monthlyTrendData = useMemo(() => {
    const map: Record<string, number> = {}
    allRecords.forEach((r) => {
      map[r.period] = (map[r.period] || 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, count]) => ({ period, count }))
  }, [])

  // Chart data - Archive rate trend
  const archiveRateData = useMemo(() => {
    const periodMap: Record<string, { total: number; archived: number }> = {}
    allRecords.forEach((r) => {
      if (!periodMap[r.period]) periodMap[r.period] = { total: 0, archived: 0 }
      periodMap[r.period].total++
      if (r.status === "archived") periodMap[r.period].archived++
    })
    return Object.entries(periodMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, d]) => ({
        period,
        rate: d.total > 0 ? Math.round((d.archived / d.total) * 10000) / 100 : 0,
      }))
  }, [])

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
    setPeriodFilter("2026-02")
    setReportTypeFilter("all")
    setStatusFilter("all")
    setFormatFilter("all")
    setKeyword("")
    setMethodFilter("all")
    setOperatorFilter("all")
    setTagFilter("all")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-5">
      {/* ---- Summary Overview Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          {"报表台账汇总概览（可视化，一键掌控报表归档情况）"}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{"本次查询汇总"}</p>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"报表总数："}
                  <strong className="font-mono tabular-nums">{stats.total}</strong>
                  {" 份"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-emerald-700">
                  {"已归档："}
                  <strong>{stats.archived}</strong>
                  {" 份"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-amber-700">
                  {"未归档："}
                  <strong>{stats.unarchived}</strong>
                  {" 份"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-red-700">
                  {"异常："}
                  <strong>{stats.error}</strong>
                  {" 份"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"报表类型分布："}
                  {Object.entries(stats.typeBreakdown)
                    .map(([name, count]) => `${name}(${count}份)`)
                    .join(" | ")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"生成方式分布："}
                  {"AI自动生成("}{stats.aiCount}{"份) | 人工编辑生成("}{stats.manualCount}{"份)"}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{"归档进度与操作人分布"}</p>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{"归档率"}</span>
                  <span className="font-mono font-medium text-foreground">
                    {stats.total > 0 ? Math.round((stats.archived / stats.total) * 100) : 0}{"%"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.archived / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {"操作人分布："}
                  {Object.entries(stats.operators)
                    .map(([name, count]) => `${name}(${count}份)`)
                    .join("、")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Filter Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {"多维度精准筛选区（贴合代账报表查询/归档习惯）"}
        </h3>

        {/* Core filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">{"核心筛选"}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs">{"报表周期"}</Label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"报表类型"}</Label>
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {reportTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"报表状态"}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="archived">{"已归档"}</SelectItem>
                  <SelectItem value="unarchived">{"未归档"}</SelectItem>
                  <SelectItem value="error">{"异常"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"报表格式"}</Label>
              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {formats.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"关键词模糊查询"}</Label>
              <Input
                placeholder="报表ID/报表名称"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">{"高级筛选"}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">{"生成方式"}</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="ai">{"AI自动生成"}</SelectItem>
                  <SelectItem value="manual">{"人工编辑"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"操作人"}</Label>
              <Select value={operatorFilter} onValueChange={setOperatorFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {operators.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"归档标签"}</Label>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="none">{"未打标签"}</SelectItem>
                  {tags.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button size="sm" className="gap-2" onClick={handleQuery}>
            <Search className="h-3.5 w-3.5" />
            {"一键查询"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            {"重置筛选"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FilePlus className="h-3.5 w-3.5" />
            {"生成新报表"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            {"批量导出"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Tag className="h-3.5 w-3.5" />
            {"批量打标签"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
            {"批量删除"}
          </Button>
        </div>
      </section>

      {/* ---- Data Table ---- */}
      <section className="rounded-xl border border-border bg-card">
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            {"历史报表核心台账列表（共 "}{filteredRecords.length}{" 条）"}
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
                <TableHead className="text-xs">{"报表ID"}</TableHead>
                <TableHead className="text-xs">{"报表名称"}</TableHead>
                <TableHead className="text-xs">{"报表周期"}</TableHead>
                <TableHead className="text-xs">{"报表类型"}</TableHead>
                <TableHead className="text-center text-xs">{"生成方式"}</TableHead>
                <TableHead className="text-center text-xs">{"报表状态"}</TableHead>
                <TableHead className="text-center text-xs">{"操作列"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    {"暂无匹配记录，请调整筛选条件后重新查询"}
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((record) => (
                  <TableRow
                    key={record.id}
                    className={
                      record.status === "error"
                        ? "bg-red-50/40"
                        : record.status === "unarchived"
                          ? "bg-amber-50/30"
                          : ""
                    }
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => toggleOne(record.id)}
                        aria-label={`选中 ${record.reportId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.reportId}</TableCell>
                    <TableCell className="text-xs font-medium">{record.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{record.period}</TableCell>
                    <TableCell className="text-xs">{record.reportType}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${methodConfig[record.method].className}`}
                      >
                        {methodConfig[record.method].label}
                      </Badge>
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
                          title="预览"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="下载"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="打标签"
                        >
                          <Tag className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          title="编辑"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="删除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
            <span className="text-xs text-muted-foreground">{"可执行操作："}</span>
            <Button size="sm" variant="outline" className="gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {"批量归档"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-3.5 w-3.5" />
              {"批量导出（同格式）"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Tag className="h-3.5 w-3.5" />
              {"批量打标签"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              {"批量删除"}
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
              {"上一页"}
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
              {"下一页"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="mb-3 text-xs font-semibold text-muted-foreground">{"报表统计（本次查询）"}</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="报表总数" value={`${stats.total} 份`} />
            <StatCard label="已归档" value={`${stats.archived} 份`} variant="success" />
            <StatCard label="未归档" value={`${stats.unarchived} 份`} variant="warning" />
            <StatCard label="异常" value={`${stats.error} 份`} variant="danger" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{"AI自动生成"}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatNumber(stats.aiCount)}{" 份"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{"人工编辑生成"}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatNumber(stats.manualCount)}{" 份"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{"归档率"}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {stats.total > 0 ? Math.round((stats.archived / stats.total) * 100) : 0}{"%"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Charts ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">{"报表数据可视化分析（辅助财务分析，贴合代账客户需求）"}</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Report type pie chart */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"各类型报表占比饼图"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typePieData}
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
                    {typePieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [`${value} 份`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly report generation trend */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"月度报表生成趋势"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value} 份`, "报表数量"]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {monthlyTrendData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Archive rate trend */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"报表归档率趋势"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={archiveRateData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "归档率"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-chart-2)" }}
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
            {"返回周期报表生成"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            {"报表帮助中心"}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            {"刷新台账"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {"技术支持"}
          </Button>
        </div>
      </section>

      {/* ---- Detail Dialog ---- */}
      <Dialog open={!!detailRecord} onOpenChange={() => setDetailRecord(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{"报表详情"}</DialogTitle>
            <DialogDescription suppressHydrationWarning>
              {"报表ID："}{detailRecord?.reportId}
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-3 text-sm">
              <DetailRow label="报表ID" value={detailRecord.reportId} />
              <DetailRow label="报表名称" value={detailRecord.name} />
              <DetailRow label="报表周期" value={detailRecord.period} />
              <DetailRow label="报表类型" value={detailRecord.reportType} />
              <DetailRow label="报表格式" value={detailRecord.format} />
              <DetailRow label="文件大小" value={detailRecord.fileSize} />
              <DetailRow label="操作人" value={detailRecord.operator} />
              <DetailRow label="创建时间" value={detailRecord.createdAt} />
              <DetailRow label="归档标签" value={detailRecord.tag || "未打标签"} />
              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">{"生成方式"}</span>
                <Badge
                  variant="outline"
                  className={methodConfig[detailRecord.method].className}
                >
                  {methodConfig[detailRecord.method].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">{"报表状态"}</span>
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
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
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
  variant?: "success" | "warning" | "danger"
}) {
  const colorMap = {
    success: "border-emerald-200 bg-emerald-50/60 text-emerald-700",
    warning: "border-amber-200 bg-amber-50/60 text-amber-700",
    danger: "border-red-200 bg-red-50/60 text-red-700",
  }
  return (
    <div
      className={`rounded-lg border p-3 ${
        variant ? colorMap[variant] : "border-border bg-card text-foreground"
      }`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
    </div>
  )
}
