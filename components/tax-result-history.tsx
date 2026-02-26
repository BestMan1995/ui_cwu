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
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
  RotateCw,
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
type TaxStatus = "confirmed" | "pending" | "error"

interface TaxRecord {
  id: string
  taxId: string
  period: string
  taxType: string
  basisType: string
  basis: number
  rate: number
  amount: number
  status: TaxStatus
  operator: string
  declared: boolean
  relatedEntryId: string
  relatedInvoiceId: string
}

// ---- Deterministic currency formatter ----
function formatCurrency(n: number): string {
  const fixed = n.toFixed(2)
  const [intPart, decPart] = fixed.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${withCommas}.${decPart}`
}

// ---- Mock Data ----
const allRecords: TaxRecord[] = [
  { id: "1", taxId: "TC2602001", period: "2026-02", taxType: "增值税", basisType: "销售额", basis: 10000.0, rate: 3.0, amount: 300.0, status: "confirmed", operator: "张会计", declared: false, relatedEntryId: "FL26022001", relatedInvoiceId: "INV26022001" },
  { id: "2", taxId: "TC2602002", period: "2026-02", taxType: "附加税", basisType: "增值税额", basis: 300.0, rate: 12.0, amount: 36.0, status: "confirmed", operator: "张会计", declared: false, relatedEntryId: "FL26022002", relatedInvoiceId: "INV26022001" },
  { id: "3", taxId: "TC2602003", period: "2026-02", taxType: "企业所得税", basisType: "应纳税所得额", basis: 80000.0, rate: 1.25, amount: 1000.0, status: "pending", operator: "李会计", declared: false, relatedEntryId: "FL26021901", relatedInvoiceId: "INV26021902" },
  { id: "4", taxId: "TC2602004", period: "2026-02", taxType: "个税", basisType: "工资薪金所得", basis: 950.0, rate: 3.0, amount: 28.5, status: "error", operator: "张会计", declared: false, relatedEntryId: "FL26021902", relatedInvoiceId: "INV26021902" },
  { id: "5", taxId: "TC2602005", period: "2026-02", taxType: "增值税", basisType: "销售额", basis: 25000.0, rate: 3.0, amount: 750.0, status: "confirmed", operator: "李会计", declared: true, relatedEntryId: "FL26021701", relatedInvoiceId: "INV26021701" },
  { id: "6", taxId: "TC2602006", period: "2026-02", taxType: "附加税", basisType: "增值税额", basis: 750.0, rate: 12.0, amount: 90.0, status: "confirmed", operator: "李会计", declared: true, relatedEntryId: "FL26021702", relatedInvoiceId: "INV26021701" },
  { id: "7", taxId: "TC2602007", period: "2026-02", taxType: "增值税", basisType: "销售额", basis: 15000.0, rate: 3.0, amount: 450.0, status: "confirmed", operator: "张会计", declared: false, relatedEntryId: "FL26021601", relatedInvoiceId: "INV26021601" },
  { id: "8", taxId: "TC2602008", period: "2026-02", taxType: "企业所得税", basisType: "应纳税所得额", basis: 35000.0, rate: 2.5, amount: 875.0, status: "pending", operator: "张会计", declared: false, relatedEntryId: "FL26021501", relatedInvoiceId: "INV26021501" },
  { id: "9", taxId: "TC2602009", period: "2026-02", taxType: "个税", basisType: "工资薪金所得", basis: 1200.0, rate: 3.0, amount: 36.0, status: "confirmed", operator: "李会计", declared: false, relatedEntryId: "FL26021502", relatedInvoiceId: "INV26021501" },
  { id: "10", taxId: "TC2602010", period: "2026-02", taxType: "附加税", basisType: "增值税额", basis: 450.0, rate: 12.0, amount: 54.0, status: "confirmed", operator: "张会计", declared: false, relatedEntryId: "FL26021503", relatedInvoiceId: "INV26021502" },
  { id: "11", taxId: "TC2601001", period: "2026-01", taxType: "增值税", basisType: "销售额", basis: 18000.0, rate: 3.0, amount: 540.0, status: "confirmed", operator: "张会计", declared: true, relatedEntryId: "FL26011001", relatedInvoiceId: "INV26011001" },
  { id: "12", taxId: "TC2601002", period: "2026-01", taxType: "附加税", basisType: "增值税额", basis: 540.0, rate: 12.0, amount: 64.8, status: "confirmed", operator: "张会计", declared: true, relatedEntryId: "FL26011002", relatedInvoiceId: "INV26011001" },
  { id: "13", taxId: "TC2601003", period: "2026-01", taxType: "企业所得税", basisType: "应纳税所得额", basis: 60000.0, rate: 2.5, amount: 1500.0, status: "confirmed", operator: "李会计", declared: true, relatedEntryId: "FL26011003", relatedInvoiceId: "INV26011002" },
  { id: "14", taxId: "TC2601004", period: "2026-01", taxType: "个税", basisType: "工资薪金所得", basis: 800.0, rate: 3.0, amount: 24.0, status: "confirmed", operator: "张会计", declared: true, relatedEntryId: "FL26011004", relatedInvoiceId: "INV26011002" },
  { id: "15", taxId: "TC2601005", period: "2026-01", taxType: "增值税", basisType: "销售额", basis: 22000.0, rate: 3.0, amount: 660.0, status: "confirmed", operator: "李会计", declared: true, relatedEntryId: "FL26011005", relatedInvoiceId: "INV26011003" },
  { id: "16", taxId: "TC2601006", period: "2026-01", taxType: "附加税", basisType: "增值税额", basis: 660.0, rate: 12.0, amount: 79.2, status: "confirmed", operator: "李会计", declared: true, relatedEntryId: "FL26011006", relatedInvoiceId: "INV26011003" },
  { id: "17", taxId: "TC2602011", period: "2026-02", taxType: "印花税", basisType: "合同金额", basis: 50000.0, rate: 0.03, amount: 15.0, status: "confirmed", operator: "张会计", declared: false, relatedEntryId: "FL26021401", relatedInvoiceId: "INV26021401" },
  { id: "18", taxId: "TC2602012", period: "2026-02", taxType: "增值税", basisType: "销售额", basis: 8000.0, rate: 3.0, amount: 240.0, status: "pending", operator: "李会计", declared: false, relatedEntryId: "FL26021301", relatedInvoiceId: "INV26021301" },
  { id: "19", taxId: "TC2602013", period: "2026-02", taxType: "企业所得税", basisType: "应纳税所得额", basis: 45000.0, rate: 2.5, amount: 1125.0, status: "confirmed", operator: "张会计", declared: false, relatedEntryId: "FL26021201", relatedInvoiceId: "INV26021201" },
  { id: "20", taxId: "TC2602014", period: "2026-02", taxType: "个税", basisType: "工资薪金所得", basis: 1500.0, rate: 3.0, amount: 45.0, status: "error", operator: "李会计", declared: false, relatedEntryId: "FL26021101", relatedInvoiceId: "INV26021101" },
]

const PAGE_SIZE = 20

const statusConfig: Record<TaxStatus, { label: string; className: string }> = {
  confirmed: { label: "已确认", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "待核对", className: "bg-amber-50 text-amber-700 border-amber-200" },
  error: { label: "算税异常", className: "bg-red-50 text-red-700 border-red-200" },
}

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]
const BAR_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

// ---- Component ----
export function TaxResultHistory() {
  // Filter state
  const [periodFilter, setPeriodFilter] = useState("2026-02")
  const [taxTypeFilter, setTaxTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [idSearch, setIdSearch] = useState("")
  const [basisTypeFilter, setBasisTypeFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")
  const [declaredFilter, setDeclaredFilter] = useState("all")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<TaxRecord | null>(null)

  // Unique values for filters
  const taxTypes = [...new Set(allRecords.map((r) => r.taxType))]
  const basisTypes = [...new Set(allRecords.map((r) => r.basisType))]
  const operators = [...new Set(allRecords.map((r) => r.operator))]
  const periods = [...new Set(allRecords.map((r) => r.period))].sort().reverse()

  // Computed filtered data
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (periodFilter !== "all" && r.period !== periodFilter) return false
      if (taxTypeFilter !== "all" && r.taxType !== taxTypeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (basisTypeFilter !== "all" && r.basisType !== basisTypeFilter) return false
      if (operatorFilter !== "all" && r.operator !== operatorFilter) return false
      if (declaredFilter === "yes" && !r.declared) return false
      if (declaredFilter === "no" && r.declared) return false
      if (idSearch) {
        const q = idSearch.toLowerCase()
        if (
          !r.taxId.toLowerCase().includes(q) &&
          !r.relatedEntryId.toLowerCase().includes(q) &&
          !r.relatedInvoiceId.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [periodFilter, taxTypeFilter, statusFilter, basisTypeFilter, operatorFilter, declaredFilter, idSearch])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const paged = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const confirmed = filteredRecords.filter((r) => r.status === "confirmed").length
    const pending = filteredRecords.filter((r) => r.status === "pending").length
    const error = filteredRecords.filter((r) => r.status === "error").length
    const totalAmount = filteredRecords.reduce((sum, r) => sum + r.amount, 0)
    const paidAmount = filteredRecords.filter((r) => r.declared).reduce((sum, r) => sum + r.amount, 0)
    const unpaidAmount = totalAmount - paidAmount
    const totalBasis = filteredRecords.reduce((sum, r) => sum + r.basis, 0)
    const taxBurdenRate = totalBasis > 0 ? (totalAmount / totalBasis) * 100 : 0

    // Tax type breakdown
    const taxTypeAmounts: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      taxTypeAmounts[r.taxType] = (taxTypeAmounts[r.taxType] || 0) + r.amount
    })

    // Involved tax types
    const involvedTypes = [...new Set(filteredRecords.map((r) => r.taxType))]

    const operatorMap: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      operatorMap[r.operator] = (operatorMap[r.operator] || 0) + 1
    })

    return {
      confirmed, pending, error,
      totalAmount, paidAmount, unpaidAmount,
      taxBurdenRate, taxTypeAmounts, involvedTypes,
      operators: operatorMap,
    }
  }, [filteredRecords])

  // Chart data - Tax type pie
  const taxTypePieData = useMemo(() => {
    return Object.entries(stats.taxTypeAmounts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
  }, [stats.taxTypeAmounts])

  // Chart data - Monthly trend
  const monthlyTrendData = useMemo(() => {
    const map: Record<string, number> = {}
    allRecords.forEach((r) => {
      map[r.period] = (map[r.period] || 0) + r.amount
    })
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, amount]) => ({ period, amount: Math.round(amount * 100) / 100 }))
  }, [])

  // Chart data - Tax burden comparison bar
  const taxBurdenBarData = useMemo(() => {
    const map: Record<string, { basis: number; amount: number }> = {}
    filteredRecords.forEach((r) => {
      if (!map[r.taxType]) map[r.taxType] = { basis: 0, amount: 0 }
      map[r.taxType].basis += r.basis
      map[r.taxType].amount += r.amount
    })
    return Object.entries(map).map(([name, { basis, amount }]) => ({
      name,
      rate: basis > 0 ? Math.round((amount / basis) * 10000) / 100 : 0,
    }))
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
    setPeriodFilter("2026-02")
    setTaxTypeFilter("all")
    setStatusFilter("all")
    setIdSearch("")
    setBasisTypeFilter("all")
    setOperatorFilter("all")
    setDeclaredFilter("all")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  // Tax burden health indicator
  const isBurdenHealthy = stats.taxBurdenRate >= 1.0 && stats.taxBurdenRate <= 1.5

  return (
    <div className="space-y-5">
      {/* ---- Summary Check Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          {"算税结果汇总校验区（核心财务规范，异常标红预警）"}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={`rounded-lg border p-4 ${isBurdenHealthy ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{"本次查询算税汇总"}</p>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"算税记录数："}
                  <strong className="font-mono tabular-nums">{filteredRecords.length}</strong>
                  {" 条"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-foreground">
                  {"涉及税种："}
                  <strong>{stats.involvedTypes.join("/")}</strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"应纳税额合计："}
                  <strong className="font-mono tabular-nums">{formatCurrency(stats.totalAmount)}</strong>
                  {" 元"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-foreground">
                  {"已缴税额："}
                  <strong className="font-mono tabular-nums">{formatCurrency(stats.paidAmount)}</strong>
                  {" 元"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-foreground">
                  {"应补退税额："}
                  <strong className="font-mono tabular-nums">{formatCurrency(stats.unpaidAmount)}</strong>
                  {" 元"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground">
                  {"税负率："}
                  <strong className="font-mono tabular-nums">{stats.taxBurdenRate.toFixed(2)}%</strong>
                  {"（行业均值：1.0%-1.5%）"}
                </span>
                {isBurdenHealthy ? (
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {"税负率在合理区间"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    {"税负率偏离行业均值"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{"算税状态分布"}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-emerald-700">
                {"已确认："}{stats.confirmed}{" 条"}
              </span>
              <span className="text-amber-700">
                {"待核对："}{stats.pending}{" 条"}
              </span>
              <span className="text-red-700">
                {"算税异常："}{stats.error}{" 条"}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {"操作人分布："}
                {Object.entries(stats.operators)
                  .map(([name, count]) => `${name}(${count}条)`)
                  .join("、")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Filter Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {"多维度精准筛选区（贴合代账算税查询习惯）"}
        </h3>

        {/* Basic filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">{"基础筛选"}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{"算税周期"}</Label>
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
              <Label className="text-xs">{"税种类型"}</Label>
              <Select value={taxTypeFilter} onValueChange={setTaxTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {taxTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"算税状态"}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="confirmed">{"已确认"}</SelectItem>
                  <SelectItem value="pending">{"待核对"}</SelectItem>
                  <SelectItem value="error">{"算税异常"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"关联分录ID/发票ID"}</Label>
              <Input
                placeholder="输入ID（支持模糊查询）"
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
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
              <Label className="text-xs">{"计税依据类型"}</Label>
              <Select value={basisTypeFilter} onValueChange={setBasisTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {basisTypes.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
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
              <Label className="text-xs">{"是否申报"}</Label>
              <Select value={declaredFilter} onValueChange={setDeclaredFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="yes">{"已申报"}</SelectItem>
                  <SelectItem value="no">{"未申报"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action buttons */}
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
            <Download className="h-3.5 w-3.5" />
            {"导出算税表Excel"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            {"导出申报底稿PDF"}
          </Button>
        </div>
      </section>

      {/* ---- Data Table ---- */}
      <section className="rounded-xl border border-border bg-card">
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            {"算税结果核心列表（共 "}{filteredRecords.length}{" 条）"}
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
                <TableHead className="text-xs">{"算税ID"}</TableHead>
                <TableHead className="text-xs">{"算税周期"}</TableHead>
                <TableHead className="text-xs">{"税种类型"}</TableHead>
                <TableHead className="text-right text-xs">{"计税依据(元)"}</TableHead>
                <TableHead className="text-right text-xs">{"税率(%)"}</TableHead>
                <TableHead className="text-right text-xs">{"应纳税额(元)"}</TableHead>
                <TableHead className="text-center text-xs">{"算税状态"}</TableHead>
                <TableHead className="text-center text-xs">{"操作列"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
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
                        : record.status === "pending"
                          ? "bg-amber-50/40"
                          : ""
                    }
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => toggleOne(record.id)}
                        aria-label={`选中 ${record.taxId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.taxId}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{record.period}</TableCell>
                    <TableCell className="text-xs font-medium">{record.taxType}</TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      <span className="font-medium text-foreground">{formatCurrency(record.basis)}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {record.rate}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      <span className="font-medium text-foreground">{formatCurrency(record.amount)}</span>
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
                        {record.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            title="编辑"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {record.status === "error" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                            title="重试算税"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                        )}
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
              {"批量确认算税"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-3.5 w-3.5" />
              {"批量导出申报底稿"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <RotateCw className="h-3.5 w-3.5" />
              {"批量重试算税"}
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
          <h4 className="mb-3 text-xs font-semibold text-muted-foreground">{"算税统计（本次查询）"}</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="总记录数" value={`${filteredRecords.length} 条`} />
            <StatCard label="已确认" value={`${stats.confirmed} 条`} variant="success" />
            <StatCard label="待核对" value={`${stats.pending} 条`} variant="warning" />
            <StatCard label="算税异常" value={`${stats.error} 条`} variant="danger" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{"应纳税额合计"}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(stats.totalAmount)}{" 元"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{"已申报税额"}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(stats.paidAmount)}{" 元"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{"综合税负率"}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {stats.taxBurdenRate.toFixed(2)}{"%"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Charts ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">{"算税维度可视化分析（辅助财务税负分析）"}</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Tax type amount pie chart */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"各税种应纳税额占比饼图"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxTypePieData}
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
                    {taxTypePieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [`${formatCurrency(value)} 元`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly tax trend */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"月度算税趋势图"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${formatCurrency(value)} 元`, "应纳税额"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-chart-1)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tax burden comparison bar */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"税负率对比图"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taxBurdenBarData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value.toFixed(2)}%`, "税负率"]}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {taxBurdenBarData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
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
            {"返回周期算税"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            {"算税帮助中心"}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            {"刷新结果"}
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
            <DialogTitle>{"算税详情"}</DialogTitle>
            <DialogDescription suppressHydrationWarning>
              {"算税ID："}{detailRecord?.taxId}
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-3 text-sm">
              <DetailRow label="算税ID" value={detailRecord.taxId} />
              <DetailRow label="算税周期" value={detailRecord.period} />
              <DetailRow label="税种类型" value={detailRecord.taxType} />
              <DetailRow label="计税依据类型" value={detailRecord.basisType} />
              <DetailRow label="计税依据(元)" value={formatCurrency(detailRecord.basis)} />
              <DetailRow label="税率(%)" value={`${detailRecord.rate}`} />
              <DetailRow label="应纳税额(元)" value={formatCurrency(detailRecord.amount)} />
              <DetailRow label="操作人" value={detailRecord.operator} />
              <DetailRow label="是否申报" value={detailRecord.declared ? "已申报" : "未申报"} />
              <DetailRow label="关联分录ID" value={detailRecord.relatedEntryId} />
              <DetailRow label="关联发票ID" value={detailRecord.relatedInvoiceId} />
              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-muted-foreground">{"算税状态"}</span>
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
