"use client"

import { useState, useMemo } from "react"
import {
  Search,
  RotateCcw,
  Download,
  FileText,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  Link2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  Phone,
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
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"

// ---- Types ----
type ParseStatus = "saved" | "failed" | "warning"

interface InvoiceRecord {
  id: string
  batchNo: string
  invoiceId: string
  invoiceType: string
  invoiceDate: string
  amount: number | null
  taxRate: number | null
  status: ParseStatus
  operator: string
  parseDate: string
}

// ---- Mock Data ----
const allRecords: InvoiceRecord[] = [
  { id: "1", batchNo: "B26022001", invoiceId: "INV26022001", invoiceType: "增值税普通发票", invoiceDate: "2026-02-20", amount: 1000.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-20" },
  { id: "2", batchNo: "B26022001", invoiceId: "INV26021902", invoiceType: "餐饮发票", invoiceDate: "2026-02-19", amount: 500.0, taxRate: 6.0, status: "saved", operator: "张会计", parseDate: "2026-02-20" },
  { id: "3", batchNo: "B26021801", invoiceId: "", invoiceType: "PDF加密件", invoiceDate: "2026-02-18", amount: null, taxRate: null, status: "failed", operator: "张会计", parseDate: "2026-02-18" },
  { id: "4", batchNo: "B26021701", invoiceId: "INV26021701", invoiceType: "增值税专票", invoiceDate: "2026-02-17", amount: 2000.0, taxRate: 13.0, status: "warning", operator: "李会计", parseDate: "2026-02-17" },
  { id: "5", batchNo: "B26021601", invoiceId: "INV26021601", invoiceType: "增值税普通发票", invoiceDate: "2026-02-16", amount: 3500.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-16" },
  { id: "6", batchNo: "B26021601", invoiceId: "INV26021602", invoiceType: "交通费发票", invoiceDate: "2026-02-16", amount: 150.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-16" },
  { id: "7", batchNo: "B26021501", invoiceId: "INV26021501", invoiceType: "办公用品发票", invoiceDate: "2026-02-15", amount: 880.0, taxRate: 13.0, status: "saved", operator: "李会计", parseDate: "2026-02-15" },
  { id: "8", batchNo: "B26021501", invoiceId: "INV26021502", invoiceType: "增值税专用发票", invoiceDate: "2026-02-15", amount: 5600.0, taxRate: 13.0, status: "saved", operator: "张会计", parseDate: "2026-02-15" },
  { id: "9", batchNo: "B26021401", invoiceId: "INV26021401", invoiceType: "通讯费发票", invoiceDate: "2026-02-14", amount: 200.0, taxRate: 6.0, status: "saved", operator: "张会计", parseDate: "2026-02-14" },
  { id: "10", batchNo: "B26021301", invoiceId: "INV26021301", invoiceType: "增值税普通发票", invoiceDate: "2026-02-13", amount: 1350.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-13" },
  { id: "11", batchNo: "B26021301", invoiceId: "", invoiceType: "模糊扫描件", invoiceDate: "2026-02-13", amount: null, taxRate: null, status: "failed", operator: "张会计", parseDate: "2026-02-13" },
  { id: "12", batchNo: "B26021201", invoiceId: "INV26021201", invoiceType: "增值税普通发票", invoiceDate: "2026-02-12", amount: 2100.0, taxRate: 3.0, status: "saved", operator: "李会计", parseDate: "2026-02-12" },
  { id: "13", batchNo: "B26021101", invoiceId: "INV26021101", invoiceType: "餐饮发票", invoiceDate: "2026-02-11", amount: 320.0, taxRate: 6.0, status: "saved", operator: "张会计", parseDate: "2026-02-11" },
  { id: "14", batchNo: "B26021101", invoiceId: "INV26021102", invoiceType: "增值税专票", invoiceDate: "2026-02-11", amount: 4200.0, taxRate: 13.0, status: "warning", operator: "李会计", parseDate: "2026-02-11" },
  { id: "15", batchNo: "B26021001", invoiceId: "INV26021001", invoiceType: "增值税普通发票", invoiceDate: "2026-02-10", amount: 1500.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-10" },
  { id: "16", batchNo: "B26020901", invoiceId: "INV26020901", invoiceType: "交通费发票", invoiceDate: "2026-02-09", amount: 80.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-09" },
  { id: "17", batchNo: "B26020901", invoiceId: "INV26020902", invoiceType: "办公用品发票", invoiceDate: "2026-02-09", amount: 560.0, taxRate: 13.0, status: "saved", operator: "李会计", parseDate: "2026-02-09" },
  { id: "18", batchNo: "B26020801", invoiceId: "", invoiceType: "图片损坏文件", invoiceDate: "2026-02-08", amount: null, taxRate: null, status: "failed", operator: "张会计", parseDate: "2026-02-08" },
  { id: "19", batchNo: "B26020701", invoiceId: "INV26020701", invoiceType: "增值税普通发票", invoiceDate: "2026-02-07", amount: 900.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-07" },
  { id: "20", batchNo: "B26020701", invoiceId: "INV26020702", invoiceType: "增值税专用发票", invoiceDate: "2026-02-07", amount: 6800.0, taxRate: 13.0, status: "saved", operator: "张会计", parseDate: "2026-02-07" },
  { id: "21", batchNo: "B26020601", invoiceId: "INV26020601", invoiceType: "通讯费发票", invoiceDate: "2026-02-06", amount: 180.0, taxRate: 6.0, status: "saved", operator: "李会计", parseDate: "2026-02-06" },
  { id: "22", batchNo: "B26020501", invoiceId: "INV26020501", invoiceType: "增值税普通发票", invoiceDate: "2026-02-05", amount: 750.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-05" },
  { id: "23", batchNo: "B26020501", invoiceId: "INV26020502", invoiceType: "餐饮发票", invoiceDate: "2026-02-05", amount: 420.0, taxRate: 6.0, status: "saved", operator: "张会计", parseDate: "2026-02-05" },
  { id: "24", batchNo: "B26020401", invoiceId: "", invoiceType: "PDF加密件", invoiceDate: "2026-02-04", amount: null, taxRate: null, status: "failed", operator: "李会计", parseDate: "2026-02-04" },
  { id: "25", batchNo: "B26020301", invoiceId: "INV26020301", invoiceType: "增值税专票", invoiceDate: "2026-02-03", amount: 3200.0, taxRate: 13.0, status: "saved", operator: "张会计", parseDate: "2026-02-03" },
  { id: "26", batchNo: "B26020301", invoiceId: "INV26020302", invoiceType: "交通费发票", invoiceDate: "2026-02-03", amount: 120.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-03" },
  { id: "27", batchNo: "B26020201", invoiceId: "INV26020201", invoiceType: "增值税普通发票", invoiceDate: "2026-02-02", amount: 1800.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-02" },
  { id: "28", batchNo: "B26020201", invoiceId: "", invoiceType: "格式损坏文件", invoiceDate: "2026-02-02", amount: null, taxRate: null, status: "failed", operator: "李会计", parseDate: "2026-02-02" },
  { id: "29", batchNo: "B26020101", invoiceId: "INV26020101", invoiceType: "增值税普通发票", invoiceDate: "2026-02-01", amount: 2200.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-01" },
  { id: "30", batchNo: "B26020101", invoiceId: "INV26020102", invoiceType: "办公用品发票", invoiceDate: "2026-02-01", amount: 640.0, taxRate: 13.0, status: "saved", operator: "李会计", parseDate: "2026-02-01" },
  { id: "31", batchNo: "B26020101", invoiceId: "INV26020103", invoiceType: "增值税专用发票", invoiceDate: "2026-02-01", amount: 4500.0, taxRate: 13.0, status: "saved", operator: "张会计", parseDate: "2026-02-01" },
  { id: "32", batchNo: "B26020101", invoiceId: "INV26020104", invoiceType: "餐饮发票", invoiceDate: "2026-02-01", amount: 260.0, taxRate: 6.0, status: "saved", operator: "张会计", parseDate: "2026-02-01" },
  { id: "33", batchNo: "B26020101", invoiceId: "INV26020105", invoiceType: "通讯费发票", invoiceDate: "2026-02-01", amount: 150.0, taxRate: 6.0, status: "saved", operator: "李会计", parseDate: "2026-02-01" },
  { id: "34", batchNo: "B26020101", invoiceId: "INV26020106", invoiceType: "交通费发票", invoiceDate: "2026-02-01", amount: 95.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-01" },
  { id: "35", batchNo: "B26020101", invoiceId: "INV26020107", invoiceType: "增值税普通发票", invoiceDate: "2026-02-01", amount: 1100.0, taxRate: 3.0, status: "warning", operator: "李会计", parseDate: "2026-02-01" },
  { id: "36", batchNo: "B26020101", invoiceId: "INV26020108", invoiceType: "增值税普通发票", invoiceDate: "2026-02-01", amount: 650.0, taxRate: 3.0, status: "saved", operator: "张会计", parseDate: "2026-02-01" },
]

const PAGE_SIZE = 20

/** Deterministic number formatting to avoid hydration mismatch from toLocaleString */
function formatCurrency(n: number): string {
  const fixed = n.toFixed(2)
  const [intPart, decPart] = fixed.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `${withCommas}.${decPart}`
}

const statusConfig: Record<ParseStatus, { label: string; className: string }> = {
  saved: { label: "已保存", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "解析失败", className: "bg-red-50 text-red-700 border-red-200" },
  warning: { label: "字段异常", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

const PIE_COLORS = ["var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"]

// ---- Component ----
export function InvoiceHistory() {
  // Filter state
  const [dateFrom, setDateFrom] = useState("2026-02-01")
  const [dateTo, setDateTo] = useState("2026-02-28")
  const [batchSearch, setBatchSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")
  const [savedFilter, setSavedFilter] = useState("all")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<InvoiceRecord | null>(null)

  // Computed filtered data
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (dateFrom && r.parseDate < dateFrom) return false
      if (dateTo && r.parseDate > dateTo) return false
      if (batchSearch && !r.batchNo.toLowerCase().includes(batchSearch.toLowerCase())) return false
      if (typeFilter !== "all" && r.invoiceType !== typeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (operatorFilter !== "all" && r.operator !== operatorFilter) return false
      if (savedFilter === "yes" && r.status !== "saved") return false
      if (savedFilter === "no" && r.status === "saved") return false
      return true
    })
  }, [dateFrom, dateTo, batchSearch, typeFilter, statusFilter, operatorFilter, savedFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const paged = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const saved = filteredRecords.filter((r) => r.status === "saved").length
    const failed = filteredRecords.filter((r) => r.status === "failed").length
    const warning = filteredRecords.filter((r) => r.status === "warning").length
    const totalAmount = filteredRecords.reduce((sum, r) => sum + (r.amount ?? 0), 0)
    const totalTax = filteredRecords.reduce((sum, r) => {
      if (r.amount && r.taxRate) return sum + (r.amount * r.taxRate) / (100 + r.taxRate)
      return sum
    }, 0)
    const operators: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      operators[r.operator] = (operators[r.operator] || 0) + 1
    })
    return { saved, failed, warning, totalAmount, totalTax, operators }
  }, [filteredRecords])

  const pieData = [
    { name: "已保存", value: stats.saved },
    { name: "解析失败", value: stats.failed },
    { name: "字段异常", value: stats.warning },
  ].filter((d) => d.value > 0)

  // Unique values for filters
  const invoiceTypes = [...new Set(allRecords.map((r) => r.invoiceType))]
  const operators = [...new Set(allRecords.map((r) => r.operator))]

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
    setBatchSearch("")
    setTypeFilter("all")
    setStatusFilter("all")
    setOperatorFilter("all")
    setSavedFilter("all")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-5">
      {/* ---- Filter Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          多维度精准筛选区（支持组合查询）
        </h3>

        {/* Basic filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">基础筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs">解析日期（起）</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">解析日期（止）</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">解析批次号</Label>
              <Input
                placeholder="输入批次号（支持模糊查询）"
                value={batchSearch}
                onChange={(e) => setBatchSearch(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">发票类型</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {invoiceTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">高级筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">解析状态</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="saved">已保存</SelectItem>
                  <SelectItem value="failed">解析失败</SelectItem>
                  <SelectItem value="warning">字段异常</SelectItem>
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
              <Label className="text-xs">是否保存至账套</Label>
              <Select value={savedFilter} onValueChange={setSavedFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="yes">已保存</SelectItem>
                  <SelectItem value="no">未保存</SelectItem>
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
            导出台账Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            导出PDF
          </Button>
        </div>
      </section>

      {/* ---- Data Table ---- */}
      <section className="rounded-xl border border-border bg-card">
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            解析结果列表（共 {filteredRecords.length} 条）
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
                <TableHead className="text-xs">解析批次号</TableHead>
                <TableHead className="text-xs">发票ID</TableHead>
                <TableHead className="text-xs">发票类型</TableHead>
                <TableHead className="text-xs">开票日期</TableHead>
                <TableHead className="text-right text-xs">金额(元)</TableHead>
                <TableHead className="text-right text-xs">税率(%)</TableHead>
                <TableHead className="text-center text-xs">解析状态</TableHead>
                <TableHead className="text-xs">操作人</TableHead>
                <TableHead className="text-center text-xs">操作</TableHead>
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
                      record.status === "failed"
                        ? "bg-red-50/40"
                        : record.status === "warning"
                          ? "bg-amber-50/40"
                          : ""
                    }
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => toggleOne(record.id)}
                        aria-label={`选中 ${record.batchNo}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.batchNo}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {record.invoiceId || "----"}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {record.invoiceType}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {record.invoiceDate}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {record.amount !== null ? formatCurrency(record.amount) : "----"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {record.taxRate !== null ? record.taxRate.toFixed(1) : "----"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${statusConfig[record.status].className}`}
                      >
                        {statusConfig[record.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {record.operator}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {record.status === "saved" && (
                          <>
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
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              title="关联分录"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {record.status === "failed" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              title="重试解析"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => setDetailRecord(record)}
                              title="查看详情"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {record.status === "warning" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              title="编辑修正"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => setDetailRecord(record)}
                              title="查看详情"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="删除记录"
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
              已勾选：<strong>{selectedIds.size}</strong> 条记录
            </span>
            <span className="text-xs text-muted-foreground">可执行操作：</span>
            <Button size="sm" variant="outline" className="gap-2">
              <Save className="h-3.5 w-3.5" />
              批量保存至账套
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              批量重试解析
            </Button>
            <Button size="sm" variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              批量删除记录
            </Button>
          </div>
        </section>
      )}

      {/* ---- Pagination & Stats ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        {/* Pagination */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
            <span className="text-xs">| 每页 {PAGE_SIZE} 条</span>
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
            {/* Page numbers */}
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
          <h4 className="mb-3 text-xs font-semibold text-muted-foreground">台账统计（本次查询）</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="总记录数" value={`${filteredRecords.length} 条`} />
            <StatCard label="已保存至账套" value={`${stats.saved} 条`} variant="success" />
            <StatCard label="解析失败" value={`${stats.failed} 条`} variant="danger" />
            <StatCard label="字段异常" value={`${stats.warning} 条`} variant="warning" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">含税金额合计</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(stats.totalAmount)} 元
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">税额合计</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(stats.totalTax)} 元
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

      {/* ---- Pie Chart ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">解析状态可视化</h3>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          <div className="h-52 w-full max-w-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
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
          <div className="flex flex-1 flex-col gap-2">
            {pieData.map((d, i) => {
              const pct = filteredRecords.length > 0
                ? ((d.value / filteredRecords.length) * 100).toFixed(1)
                : "0"
              return (
                <div
                  key={d.name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="flex-1 text-sm text-foreground">{d.name}</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                    {d.value} 条
                  </span>
                  <span className="text-xs text-muted-foreground">({pct}%)</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---- Bottom Bar ---- */}
      <section className="flex flex-wrap items-center justify-between rounded-xl border border-border bg-card px-5 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回发票上传解析
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            帮助中心
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
            <DialogTitle>发票解析详情</DialogTitle>
            <DialogDescription>
              批次号：{detailRecord?.batchNo}
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-3 text-sm">
              <DetailRow label="发票ID" value={detailRecord.invoiceId || "----"} />
              <DetailRow label="发票类型" value={detailRecord.invoiceType} />
              <DetailRow label="开票日期" value={detailRecord.invoiceDate} />
              <DetailRow
                label="金额(元)"
                value={
                  detailRecord.amount !== null
                    ? formatCurrency(detailRecord.amount)
                    : "----"
                }
              />
              <DetailRow
                label="税率(%)"
                value={detailRecord.taxRate !== null ? detailRecord.taxRate.toFixed(1) : "----"}
              />
              <DetailRow label="操作人" value={detailRecord.operator} />
              <DetailRow label="解析日期" value={detailRecord.parseDate} />
              <div className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-muted-foreground">解析状态</span>
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
  variant?: "success" | "danger" | "warning"
}) {
  const colorMap = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
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
