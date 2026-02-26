"use client"

import { useState, useMemo } from "react"
import {
  Search,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
  History,
  ArchiveRestore,
  Save,
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
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"

// ---- Types ----
type RuleStatus = "active" | "review" | "disabled"

interface RuleRecord {
  id: string
  ruleId: string
  ruleName: string
  industry: string
  ruleType: string
  invoiceType: string
  status: RuleStatus
  debitSubject: string
  creditSubject: string
  description: string
  createdDate: string
  updatedDate: string
  operator: string
}

// ---- Mock Data ----
const allRules: RuleRecord[] = [
  { id: "1", ruleId: "R2602001", ruleName: "小规模商贸-办公费发票分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-办公费", creditSubject: "银行存款", description: "适用于小规模纳税人商贸企业的办公费发票自动分录规则", createdDate: "2026-01-10", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "2", ruleId: "R2602002", ruleName: "小规模商贸-差旅费发票分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "管理费用-差旅费", creditSubject: "库存现金", description: "适用于小规模纳税人商贸企业的差旅费发票自动分录规则", createdDate: "2026-01-10", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "3", ruleId: "R2602003", ruleName: "一般纳税人-服务费发票分录", industry: "服务行业", ruleType: "收入类", invoiceType: "增值税专票", status: "review", debitSubject: "应收账款", creditSubject: "主营业务收入", description: "适用于一般纳税人服务行业的服务费收入确认规则", createdDate: "2026-01-15", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "4", ruleId: "R2602004", ruleName: "建筑行业-工程款发票分录", industry: "建筑行业", ruleType: "成本类", invoiceType: "增值税专票", status: "disabled", debitSubject: "工程施工-合同成本", creditSubject: "应付账款", description: "适用于建筑行业工程款进项发票的成本确认规则", createdDate: "2026-01-20", updatedDate: "2026-02-15", operator: "张会计" },
  { id: "5", ruleId: "R2602005", ruleName: "商贸行业-采购入库分录", industry: "商贸行业", ruleType: "成本类", invoiceType: "增值税专票", status: "active", debitSubject: "库存商品", creditSubject: "应付账款", description: "适用于商贸行业采购商品入库的自动分录规则", createdDate: "2026-01-12", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "6", ruleId: "R2602006", ruleName: "服务行业-咨询收入分录", industry: "服务行业", ruleType: "收入类", invoiceType: "增值税普票", status: "active", debitSubject: "银行存款", creditSubject: "主营业务收入", description: "适用于服务行业咨询收入的自动分录规则", createdDate: "2026-01-13", updatedDate: "2026-02-17", operator: "李会计" },
  { id: "7", ruleId: "R2602007", ruleName: "商贸行业-租赁费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-租赁费", creditSubject: "银行存款", description: "适用于商贸行业经营场所租赁费的分录规则", createdDate: "2026-01-14", updatedDate: "2026-02-16", operator: "张会计" },
  { id: "8", ruleId: "R2602008", ruleName: "服务行业-外包成本分录", industry: "服务行业", ruleType: "成本类", invoiceType: "增值税专票", status: "active", debitSubject: "主营业务成本", creditSubject: "应付账款", description: "适用于服务行业外包项目成本的确认规则", createdDate: "2026-01-16", updatedDate: "2026-02-18", operator: "李会计" },
  { id: "9", ruleId: "R2602009", ruleName: "建筑行业-材料采购分录", industry: "建筑行业", ruleType: "成本类", invoiceType: "增值税专票", status: "active", debitSubject: "原材料", creditSubject: "应付账款", description: "适用于建筑行业原材料采购的自动分录规则", createdDate: "2026-01-18", updatedDate: "2026-02-19", operator: "张会计" },
  { id: "10", ruleId: "R2602010", ruleName: "商贸行业-运费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "销售费用-运费", creditSubject: "银行存款", description: "适用于商贸行业物流运输费的分录规则", createdDate: "2026-01-19", updatedDate: "2026-02-15", operator: "张会计" },
  { id: "11", ruleId: "R2602011", ruleName: "服务行业-广告宣传费分录", industry: "服务行业", ruleType: "费用类", invoiceType: "增值税普票", status: "review", debitSubject: "销售费用-广告费", creditSubject: "银行存款", description: "适用于服务行业广告宣传费用的分录规则", createdDate: "2026-01-20", updatedDate: "2026-02-14", operator: "李会计" },
  { id: "12", ruleId: "R2602012", ruleName: "建筑行业-设备租赁分录", industry: "建筑行业", ruleType: "费用类", invoiceType: "增值税专票", status: "active", debitSubject: "工程施工-机械费", creditSubject: "应付账款", description: "适用于建筑行业施工设备租赁的分录规则", createdDate: "2026-01-21", updatedDate: "2026-02-13", operator: "张会计" },
  { id: "13", ruleId: "R2602013", ruleName: "商贸行业-水电费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-水电费", creditSubject: "银行存款", description: "适用于商贸行业水电费的自动分录规则", createdDate: "2026-01-22", updatedDate: "2026-02-12", operator: "张会计" },
  { id: "14", ruleId: "R2602014", ruleName: "服务行业-工资薪酬分录", industry: "服务行业", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "管理费用-工资", creditSubject: "应付职工薪酬", description: "适用于服务行业员工薪酬的计提与分录规则", createdDate: "2026-01-23", updatedDate: "2026-02-11", operator: "李会计" },
  { id: "15", ruleId: "R2602015", ruleName: "商贸行业-销售退回分录", industry: "商贸行业", ruleType: "收入类", invoiceType: "增值税专票", status: "review", debitSubject: "主营业务收入", creditSubject: "应收账款", description: "适用于商贸行业商品销售退回的冲减分录规则", createdDate: "2026-01-24", updatedDate: "2026-02-10", operator: "张会计" },
  { id: "16", ruleId: "R2602016", ruleName: "建筑行业-劳务费分录", industry: "建筑行业", ruleType: "成本类", invoiceType: "增值税普票", status: "active", debitSubject: "工程施工-人工费", creditSubject: "应付账款", description: "适用于建筑行业劳务分包费的分录规则", createdDate: "2026-01-25", updatedDate: "2026-02-09", operator: "张会计" },
  { id: "17", ruleId: "R2602017", ruleName: "商贸行业-通讯费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-通讯费", creditSubject: "银行存款", description: "适用于商贸行业通讯费的自动分录规则", createdDate: "2026-01-26", updatedDate: "2026-02-08", operator: "李会计" },
  { id: "18", ruleId: "R2602018", ruleName: "服务行业-培训费分录", industry: "服务行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-培训费", creditSubject: "银行存款", description: "适用于服务行业员工培训费的分录规则", createdDate: "2026-01-27", updatedDate: "2026-02-07", operator: "李会计" },
  { id: "19", ruleId: "R2602019", ruleName: "建筑行业-安全生产费分录", industry: "建筑行业", ruleType: "费用类", invoiceType: "增值税普票", status: "review", debitSubject: "管理费用-安全费", creditSubject: "银行存款", description: "适用于建筑行业安全生产费用的分录规则", createdDate: "2026-01-28", updatedDate: "2026-02-06", operator: "张会计" },
  { id: "20", ruleId: "R2602020", ruleName: "通用-业务招待费分录", industry: "其他", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "管理费用-业务招待费", creditSubject: "库存现金", description: "适用于所有行业的业务招待费分录规则", createdDate: "2026-01-29", updatedDate: "2026-02-05", operator: "张会计" },
  { id: "21", ruleId: "R2602021", ruleName: "商贸行业-交通费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "销售费用-交通费", creditSubject: "库存现金", description: "适用于商贸行业员工交通费报销的分录规则", createdDate: "2026-01-30", updatedDate: "2026-02-04", operator: "张会计" },
  { id: "22", ruleId: "R2602022", ruleName: "服务行业-技术服务费分录", industry: "服务行业", ruleType: "收入类", invoiceType: "增值税专票", status: "active", debitSubject: "应收账款", creditSubject: "主营业务收入", description: "适用于服务行业技术服务收入的确认规则", createdDate: "2026-01-31", updatedDate: "2026-02-03", operator: "李会计" },
  { id: "23", ruleId: "R2602023", ruleName: "建筑行业-检测费分录", industry: "建筑行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "工程施工-检测费", creditSubject: "银行存款", description: "适用于建筑行业工程检测费的分录规则", createdDate: "2026-02-01", updatedDate: "2026-02-02", operator: "张会计" },
  { id: "24", ruleId: "R2602024", ruleName: "通用-银行手续费分录", industry: "其他", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "财务费用-手续费", creditSubject: "银行存款", description: "适用于所有行业银行手续费的自动分录规则", createdDate: "2026-02-01", updatedDate: "2026-02-02", operator: "李会计" },
  { id: "25", ruleId: "R2602025", ruleName: "商贸行业-销售收入分录", industry: "商贸行业", ruleType: "收入类", invoiceType: "增值税专票", status: "active", debitSubject: "应收账款", creditSubject: "主营业务收入", description: "适用于商贸行业主营商品销售收入的确认规则", createdDate: "2026-02-02", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "26", ruleId: "R2602026", ruleName: "服务行业-差旅费分录", industry: "服务行业", ruleType: "费用类", invoiceType: "通用发票", status: "review", debitSubject: "管理费用-差旅费", creditSubject: "库存现金", description: "适用于服务行业员工差旅费报销的分录规则", createdDate: "2026-02-03", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "27", ruleId: "R2602027", ruleName: "建筑行业-管理费分录", industry: "建筑行业", ruleType: "费用类", invoiceType: "增值税普票", status: "disabled", debitSubject: "管理费用-其他", creditSubject: "银行存款", description: "适用于建筑行业项目管理费的分录规则", createdDate: "2026-02-04", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "28", ruleId: "R2602028", ruleName: "商贸行业-仓储费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-仓储费", creditSubject: "银行存款", description: "适用于商贸行业仓库仓储费的分录规则", createdDate: "2026-02-05", updatedDate: "2026-02-17", operator: "张会计" },
  { id: "29", ruleId: "R2602029", ruleName: "通用-利息收入分录", industry: "其他", ruleType: "收入类", invoiceType: "通用发票", status: "disabled", debitSubject: "银行存款", creditSubject: "财务费用-利息收入", description: "适用于所有行业银行存款利息收入的分录规则", createdDate: "2026-02-06", updatedDate: "2026-02-16", operator: "李会计" },
  { id: "30", ruleId: "R2602030", ruleName: "服务行业-物业费分录", industry: "服务行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-物业费", creditSubject: "银行存款", description: "适用于服务行业办公场所物业费的分录规则", createdDate: "2026-02-07", updatedDate: "2026-02-15", operator: "李会计" },
  { id: "31", ruleId: "R2602031", ruleName: "建筑行业-保险费分录", industry: "建筑行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-保险费", creditSubject: "银行存款", description: "适用于建筑行业工程保险费的分录规则", createdDate: "2026-02-08", updatedDate: "2026-02-14", operator: "张会计" },
  { id: "32", ruleId: "R2602032", ruleName: "商贸行业-包装费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "review", debitSubject: "销售费用-包装费", creditSubject: "银行存款", description: "适用于商贸行业商品包装费的分录规则", createdDate: "2026-02-09", updatedDate: "2026-02-13", operator: "张会计" },
  { id: "33", ruleId: "R2602033", ruleName: "服务行业-会议费分录", industry: "服务行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-会议费", creditSubject: "银行存款", description: "适用于服务行业会议场地及餐饮费的分录规则", createdDate: "2026-02-10", updatedDate: "2026-02-12", operator: "李会计" },
  { id: "34", ruleId: "R2602034", ruleName: "建筑行业-设计费分录", industry: "建筑行业", ruleType: "费用类", invoiceType: "增值税专票", status: "disabled", debitSubject: "工程施工-设计费", creditSubject: "应付账款", description: "适用于建筑行业工程设计费的分录规则", createdDate: "2026-02-11", updatedDate: "2026-02-11", operator: "张会计" },
  { id: "35", ruleId: "R2602035", ruleName: "商贸行业-维修费分录", industry: "商贸行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-维修费", creditSubject: "银行存款", description: "适用于商贸行业设备维修费的分录规则", createdDate: "2026-02-12", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "36", ruleId: "R2602036", ruleName: "服务行业-印刷费分录", industry: "服务行业", ruleType: "费用类", invoiceType: "增值税普票", status: "active", debitSubject: "管理费用-印刷费", creditSubject: "银行存款", description: "适用于服务行业文件印刷费的分录规则", createdDate: "2026-02-13", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "37", ruleId: "R2602037", ruleName: "建筑行业-临时设施费分录", industry: "建筑行业", ruleType: "成本类", invoiceType: "增值税普票", status: "active", debitSubject: "工程施工-临时设施", creditSubject: "银行存款", description: "适用于建筑行业工地临时设施搭建费的分录规则", createdDate: "2026-02-14", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "38", ruleId: "R2602038", ruleName: "通用-税费缴纳分录", industry: "其他", ruleType: "费用类", invoiceType: "通用发票", status: "active", debitSubject: "应交税费", creditSubject: "银行存款", description: "适用于所有行业各类税费缴纳的分录规则", createdDate: "2026-02-15", updatedDate: "2026-02-20", operator: "张会计" },
]

const PAGE_SIZE = 20

const statusConfig: Record<RuleStatus, { label: string; className: string }> = {
  active: { label: "启用", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  review: { label: "待审核", className: "bg-amber-50 text-amber-700 border-amber-200" },
  disabled: { label: "禁用", className: "bg-red-50 text-red-700 border-red-200" },
}

const PIE_COLORS = ["var(--color-chart-2)", "var(--color-chart-4)", "var(--color-chart-5)"]
const BAR_COLORS = ["var(--color-chart-1)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

// ---- Component ----
export function JournalRules() {
  // Filter state
  const [industryFilter, setIndustryFilter] = useState("all")
  const [ruleTypeFilter, setRuleTypeFilter] = useState("all")
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [keyword, setKeyword] = useState("")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<RuleRecord | null>(null)
  const [rules, setRules] = useState<RuleRecord[]>(allRules)

  // Unique values for filters
  const industries = [...new Set(allRules.map((r) => r.industry))]
  const ruleTypes = [...new Set(allRules.map((r) => r.ruleType))]
  const invoiceTypes = [...new Set(allRules.map((r) => r.invoiceType))]

  // Computed filtered data
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      if (industryFilter !== "all" && r.industry !== industryFilter) return false
      if (ruleTypeFilter !== "all" && r.ruleType !== ruleTypeFilter) return false
      if (invoiceTypeFilter !== "all" && r.invoiceType !== invoiceTypeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (keyword) {
        const q = keyword.toLowerCase()
        if (
          !r.ruleId.toLowerCase().includes(q) &&
          !r.ruleName.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [rules, industryFilter, ruleTypeFilter, invoiceTypeFilter, statusFilter, keyword])

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE))
  const paged = filteredRules.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const active = rules.filter((r) => r.status === "active").length
    const review = rules.filter((r) => r.status === "review").length
    const disabled = rules.filter((r) => r.status === "disabled").length

    const industryMap: Record<string, number> = {}
    rules.forEach((r) => {
      industryMap[r.industry] = (industryMap[r.industry] || 0) + 1
    })

    return { active, review, disabled, industryMap }
  }, [rules])

  // Chart data
  const statusPieData = [
    { name: "启用", value: stats.active },
    { name: "待审核", value: stats.review },
    { name: "禁用", value: stats.disabled },
  ].filter((d) => d.value > 0)

  const industryBarData = useMemo(() => {
    return Object.entries(stats.industryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
  }, [stats.industryMap])

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
    setIndustryFilter("all")
    setRuleTypeFilter("all")
    setInvoiceTypeFilter("all")
    setStatusFilter("all")
    setKeyword("")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  // Batch status update
  function batchSetStatus(newStatus: RuleStatus) {
    setRules((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: newStatus } : r))
    )
    setSelectedIds(new Set())
  }

  // Single status update
  function setRuleStatus(id: string, newStatus: RuleStatus) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  // Delete
  function batchDelete() {
    setRules((prev) => prev.filter((r) => !selectedIds.has(r.id)))
    setSelectedIds(new Set())
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-5">
      {/* ---- Rule Status Overview ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground" suppressHydrationWarning>
          规则生效状态概览（可视化，直观掌控规则库）
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Status summary badges */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">规则状态分布</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-foreground" suppressHydrationWarning>
                  {"启用"} <strong className="font-mono">{stats.active}</strong> {"条"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-sm text-foreground" suppressHydrationWarning>
                  {"待审核"} <strong className="font-mono">{stats.review}</strong> {"条"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-foreground" suppressHydrationWarning>
                  {"禁用"} <strong className="font-mono">{stats.disabled}</strong> {"条"}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">行业规则分布</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {Object.entries(stats.industryMap).map(([industry, count]) => (
                <span key={industry} className="rounded-md border border-border bg-muted/40 px-3 py-1.5" suppressHydrationWarning>
                  {industry}{"("}<strong className="font-mono">{count}</strong>{"条)"}
                </span>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="mb-1 text-center text-xs font-medium text-muted-foreground">状态分布</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={3} dataKey="value">
                    {statusPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="mb-1 text-center text-xs font-medium text-muted-foreground">行业分布</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={industryBarData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {industryBarData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Filter Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground" suppressHydrationWarning>
          规则筛选与快速操作区（精准定位，高效管理）
        </h3>

        {/* Basic filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">基础筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs">规则适用行业</Label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {industries.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">规则类型</Label>
              <Select value={ruleTypeFilter} onValueChange={setRuleTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {ruleTypes.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">发票类型</Label>
              <Select value={invoiceTypeFilter} onValueChange={setInvoiceTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {invoiceTypes.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">规则状态</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="review">待审核</SelectItem>
                  <SelectItem value="disabled">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">关键词模糊查询</Label>
              <Input
                placeholder="输入规则ID/名称/描述"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleQuery}>
            <Search className="mr-1.5 h-3.5 w-3.5" />
            查询
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            重置
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <p className="text-xs font-medium text-muted-foreground">快捷操作：</p>
          <Button size="sm" variant="outline">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            新增分录规则
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            导入规则模板
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            导出规则库
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            同步规则至账套
          </Button>
        </div>
      </section>

      {/* ---- Core Rule Table ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground" suppressHydrationWarning>
          分录规则核心列表（结构化展示，支持行级操作）
        </h3>

        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={toggleAll}
                    aria-label="全选当前页"
                  />
                </TableHead>
                <TableHead className="text-xs">规则ID</TableHead>
                <TableHead className="text-xs">规则名称</TableHead>
                <TableHead className="text-xs">适用行业</TableHead>
                <TableHead className="text-xs">规则类型</TableHead>
                <TableHead className="text-xs">发票类型</TableHead>
                <TableHead className="text-xs">规则状态</TableHead>
                <TableHead className="text-right text-xs">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    未找到匹配的规则记录
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((rule) => (
                  <TableRow key={rule.id} className="group hover:bg-muted/20">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(rule.id)}
                        onCheckedChange={() => toggleOne(rule.id)}
                        aria-label={`选择规则 ${rule.ruleId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{rule.ruleId}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs">{rule.ruleName}</TableCell>
                    <TableCell className="text-xs">{rule.industry}</TableCell>
                    <TableCell className="text-xs">{rule.ruleType}</TableCell>
                    <TableCell className="text-xs">{rule.invoiceType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[rule.status].className}>
                        {statusConfig[rule.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="查看详情"
                          onClick={() => setDetailRecord(rule)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="编辑"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {rule.status !== "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-emerald-600"
                            title="启用"
                            onClick={() => setRuleStatus(rule.id, "active")}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {rule.status !== "review" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-amber-600"
                            title="设为待审核"
                            onClick={() => setRuleStatus(rule.id, "review")}
                          >
                            <span className="text-xs font-bold">?</span>
                          </Button>
                        )}
                        {rule.status !== "disabled" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600"
                            title="禁用"
                            onClick={() => setRuleStatus(rule.id, "disabled")}
                          >
                            <span className="text-xs font-bold">x</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          title="删除"
                          onClick={() => deleteRule(rule.id)}
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

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {"共 "}{filteredRules.length}{" 条记录，第 "}{currentPage}{" / "}{totalPages}{" 页"}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="h-8 w-8"
              >
                {page}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Batch Operations ---- */}
      <section
        className={`rounded-xl border p-4 transition-all ${
          selectedIds.size > 0
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-card opacity-60"
        }`}
      >
        <h3 className="mb-3 text-sm font-semibold text-foreground" suppressHydrationWarning>
          批量操作区（勾选后激活，批量管控规则）
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground" suppressHydrationWarning>
            {"已勾选："}<strong className="text-foreground">{selectedIds.size}</strong>{" 条记录"}
          </span>
          <div className="mx-1 h-5 w-px bg-border" />
          <span className="text-xs text-muted-foreground">可执行操作：</span>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.size === 0}
            onClick={() => batchSetStatus("active")}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            批量启用
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.size === 0}
            onClick={() => batchSetStatus("review")}
            className="border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            批量设为待审核
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.size === 0}
            onClick={() => batchSetStatus("disabled")}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            批量禁用
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.size === 0}
            onClick={batchDelete}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            批量删除
          </Button>
        </div>
      </section>

      {/* ---- Version Management ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground" suppressHydrationWarning>
          规则版本管理区（防止误改，支持回滚）
        </h3>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"规则版本记录：当前规则库版本"}<strong className="text-foreground">V2.1</strong>
            </span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"最近更新："}<strong className="text-foreground">2026-02-20 15:30</strong>
            </span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"操作人："}<strong className="text-foreground">张会计</strong>
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">版本操作：</span>
            <Button size="sm" variant="outline">
              <History className="mr-1.5 h-3.5 w-3.5" />
              查看版本日志
            </Button>
            <Button size="sm" variant="outline">
              <ArchiveRestore className="mr-1.5 h-3.5 w-3.5" />
              回滚至历史版本
            </Button>
            <Button size="sm" variant="outline">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              备份当前规则库
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Bottom Bar ---- */}
      <section className="rounded-xl border border-border bg-card px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
              规则帮助中心
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              刷新规则库
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            <Phone className="mr-1.5 h-3.5 w-3.5" />
            技术支持
          </Button>
        </div>
      </section>

      {/* ---- Detail Dialog ---- */}
      <Dialog open={!!detailRecord} onOpenChange={(open) => !open && setDetailRecord(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              规则详情 - {detailRecord?.ruleId}
            </DialogTitle>
            <DialogDescription>
              查看分录规则的完整配置信息
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">规则ID</span>
                <span className="font-mono">{detailRecord.ruleId}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">规则名称</span>
                <span>{detailRecord.ruleName}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">适用行业</span>
                <span>{detailRecord.industry}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">规则类型</span>
                <span>{detailRecord.ruleType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">发票类型</span>
                <span>{detailRecord.invoiceType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">借方科目</span>
                <span className="font-medium text-emerald-700">{detailRecord.debitSubject}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">贷方科目</span>
                <span className="font-medium text-sky-700">{detailRecord.creditSubject}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">规则状态</span>
                <Badge variant="outline" className={statusConfig[detailRecord.status].className}>
                  {statusConfig[detailRecord.status].label}
                </Badge>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">规则描述</span>
                <span className="leading-relaxed text-muted-foreground">{detailRecord.description}</span>
              </div>
              <div className="mt-1 border-t border-border pt-3">
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-muted-foreground">创建日期</span>
                  <span>{detailRecord.createdDate}</span>
                </div>
                <div className="mt-2 grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-muted-foreground">最近更新</span>
                  <span>{detailRecord.updatedDate}</span>
                </div>
                <div className="mt-2 grid grid-cols-[120px_1fr] gap-2">
                  <span className="font-medium text-muted-foreground">操作人</span>
                  <span>{detailRecord.operator}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
