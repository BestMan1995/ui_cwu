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
  ScrollText,
  GitCompareArrows,
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
type TemplateStatus = "active" | "review" | "disabled"
type TemplateSource = "system" | "custom" | "import"

interface TemplateRecord {
  id: string
  templateId: string
  templateName: string
  templateType: string
  industry: string
  taxpayerType: string
  source: TemplateSource
  version: string
  status: TemplateStatus
  description: string
  fieldCount: number
  createdDate: string
  updatedDate: string
  operator: string
}

// ---- Mock Data ----
const allTemplates: TemplateRecord[] = [
  { id: "1", templateId: "TM2602001", templateName: "小规模-资产负债表模板", templateType: "财务报表", industry: "全部行业", taxpayerType: "小规模纳税人", source: "system", version: "V2.1", status: "active", description: "适用于小规模纳税人的标准资产负债表模板，包含流动资产、非流动资产、流动负债等标准分类", fieldCount: 42, createdDate: "2026-01-10", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "2", templateId: "TM2602002", templateName: "小规模-增值税申报表模板", templateType: "税务报表", industry: "商贸行业", taxpayerType: "小规模纳税人", source: "system", version: "V2.1", status: "active", description: "适用于小规模纳税人商贸企业的增值税纳税申报表，包含应征增值税货物及劳务各栏次", fieldCount: 36, createdDate: "2026-01-11", updatedDate: "2026-02-19", operator: "张会计" },
  { id: "3", templateId: "TM2602003", templateName: "一般纳税人-利润表模板", templateType: "财务报表", industry: "服务行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "review", description: "适用于一般纳税人服务行业的利润表模板，涵盖营业收入、营业成本、管理费用等完整科目", fieldCount: 38, createdDate: "2026-01-12", updatedDate: "2026-02-18", operator: "李会计" },
  { id: "4", templateId: "TM2602004", templateName: "自定义-客户对账表模板", templateType: "自定义报表", industry: "建筑行业", taxpayerType: "全部", source: "custom", version: "C1.2", status: "disabled", description: "自定义客户对账表模板，用于建筑行业工程进度款项对账，包含合同金额、已付款、应收款等字段", fieldCount: 28, createdDate: "2026-01-13", updatedDate: "2026-02-17", operator: "王会计" },
  { id: "5", templateId: "TM2602005", templateName: "一般纳税人-资产负债表模板", templateType: "财务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于一般纳税人的标准资产负债表模板，完整呈现资产、负债和所有者权益", fieldCount: 58, createdDate: "2026-01-14", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "6", templateId: "TM2602006", templateName: "一般纳税人-增值税申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于一般纳税人的增值税纳税申报表主表及附列资料模板", fieldCount: 64, createdDate: "2026-01-15", updatedDate: "2026-02-19", operator: "张会计" },
  { id: "7", templateId: "TM2602007", templateName: "企业所得税季度申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于查账征收企业所得税季度预缴纳税申报表模板", fieldCount: 32, createdDate: "2026-01-16", updatedDate: "2026-02-18", operator: "李会计" },
  { id: "8", templateId: "TM2602008", templateName: "企业所得税年度汇算模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于企业所得税年度汇算清缴申报表模板，包含主表和各项附表", fieldCount: 86, createdDate: "2026-01-17", updatedDate: "2026-02-17", operator: "张会计" },
  { id: "9", templateId: "TM2602009", templateName: "小规模-利润表模板", templateType: "财务报表", industry: "全部行业", taxpayerType: "小规模纳税人", source: "system", version: "V2.1", status: "active", description: "适用于小规模纳税人的简化利润表模板", fieldCount: 24, createdDate: "2026-01-18", updatedDate: "2026-02-16", operator: "张会计" },
  { id: "10", templateId: "TM2602010", templateName: "现金流量表模板", templateType: "财务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于一般纳税人的现金流量表模板，包含经营、投资和筹资活动现金流", fieldCount: 46, createdDate: "2026-01-19", updatedDate: "2026-02-15", operator: "李会计" },
  { id: "11", templateId: "TM2602011", templateName: "附加税费申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于城建税、教育费附加、地方教育附加的综合申报表模板", fieldCount: 18, createdDate: "2026-01-20", updatedDate: "2026-02-14", operator: "张会计" },
  { id: "12", templateId: "TM2602012", templateName: "个人所得税扣缴申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于企业代扣代缴个人所得税的综合所得预扣预缴申报表", fieldCount: 28, createdDate: "2026-01-21", updatedDate: "2026-02-13", operator: "李会计" },
  { id: "13", templateId: "TM2602013", templateName: "自定义-内部管理报表模板", templateType: "自定义报表", industry: "商贸行业", taxpayerType: "全部", source: "custom", version: "C1.1", status: "active", description: "商贸行业自定义内部管理报表，包含销售排名、库存周转、应收账龄等管理指标", fieldCount: 35, createdDate: "2026-01-22", updatedDate: "2026-02-12", operator: "王会计" },
  { id: "14", templateId: "TM2602014", templateName: "建筑行业-项目成本报表模板", templateType: "自定义报表", industry: "建筑行业", taxpayerType: "一般纳税人", source: "custom", version: "C1.3", status: "active", description: "建筑行业项目成本分析报表，按工程项目维度展示材料、人工、机械成本构成", fieldCount: 40, createdDate: "2026-01-23", updatedDate: "2026-02-11", operator: "王会计" },
  { id: "15", templateId: "TM2602015", templateName: "印花税申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "review", description: "适用于按次或按期申报印花税的纳税申报表模板", fieldCount: 16, createdDate: "2026-01-24", updatedDate: "2026-02-10", operator: "张会计" },
  { id: "16", templateId: "TM2602016", templateName: "导入-行业对标分析模板", templateType: "自定义报表", industry: "商贸行业", taxpayerType: "全部", source: "import", version: "I1.0", status: "active", description: "从外部导入的行业对标分析报表模板，用于与同行业企业的财务指标比对", fieldCount: 22, createdDate: "2026-01-25", updatedDate: "2026-02-09", operator: "李会计" },
  { id: "17", templateId: "TM2602017", templateName: "所有者权益变动表模板", templateType: "财务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于一般纳税人的所有者权益变动表模板", fieldCount: 34, createdDate: "2026-01-26", updatedDate: "2026-02-08", operator: "张会计" },
  { id: "18", templateId: "TM2602018", templateName: "导入-银行对账模板", templateType: "自定义报表", industry: "全部行业", taxpayerType: "全部", source: "import", version: "I1.1", status: "active", description: "从银行导入的对账单模板，用于银行余额调节表的自动生成", fieldCount: 15, createdDate: "2026-01-27", updatedDate: "2026-02-07", operator: "王会计" },
  { id: "19", templateId: "TM2602019", templateName: "房产税申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.0", status: "review", description: "适用于企业从价和从租房产税的申报表模板", fieldCount: 14, createdDate: "2026-01-28", updatedDate: "2026-02-06", operator: "张会计" },
  { id: "20", templateId: "TM2602020", templateName: "自定义-税负分析报表模板", templateType: "自定义报表", industry: "全部行业", taxpayerType: "全部", source: "custom", version: "C1.0", status: "active", description: "税负率分析报表，按月度对比各税种税负率变化趋势及行业均值对标", fieldCount: 20, createdDate: "2026-01-29", updatedDate: "2026-02-05", operator: "王会计" },
  { id: "21", templateId: "TM2602021", templateName: "残保金申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.1", status: "active", description: "适用于企业残疾人就业保障金年度申报表模板", fieldCount: 12, createdDate: "2026-01-30", updatedDate: "2026-02-04", operator: "李会计" },
  { id: "22", templateId: "TM2602022", templateName: "导入-审计底稿模板", templateType: "自定义报表", industry: "全部行业", taxpayerType: "全部", source: "import", version: "I1.2", status: "review", description: "从审计机构导入的审计底稿模板，用于配合年度审计工作", fieldCount: 48, createdDate: "2026-01-31", updatedDate: "2026-02-03", operator: "李会计" },
  { id: "23", templateId: "TM2602023", templateName: "导入-税务风险指标模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "全部", source: "import", version: "I1.0", status: "active", description: "从税务局导入的纳税评估风险指标模板，用于企业自查", fieldCount: 30, createdDate: "2026-02-01", updatedDate: "2026-02-02", operator: "张会计" },
  { id: "24", templateId: "TM2602024", templateName: "自定义-应收账款账龄分析模板", templateType: "自定义报表", industry: "商贸行业", taxpayerType: "全部", source: "custom", version: "C1.1", status: "active", description: "按客户维度的应收账款账龄分析报表，自动分为30天/60天/90天/180天/一年以上", fieldCount: 18, createdDate: "2026-02-02", updatedDate: "2026-02-20", operator: "王会计" },
  { id: "25", templateId: "TM2602025", templateName: "服务行业-简易利润表模板", templateType: "财务报表", industry: "服务行业", taxpayerType: "小规模纳税人", source: "custom", version: "C1.0", status: "active", description: "服务行业小规模纳税人简化利润表，精简科目便于快速出表", fieldCount: 16, createdDate: "2026-02-03", updatedDate: "2026-02-19", operator: "王会计" },
  { id: "26", templateId: "TM2602026", templateName: "车船税申报表模板", templateType: "税务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "system", version: "V2.0", status: "disabled", description: "适用于企业车船税的年度申报表模板", fieldCount: 10, createdDate: "2026-02-04", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "27", templateId: "TM2602027", templateName: "导入-集团合并报表模板", templateType: "财务报表", industry: "全部行业", taxpayerType: "一般纳税人", source: "import", version: "I1.3", status: "disabled", description: "集团公司合并报表模板，支持母子公司之间的抵消分录自动生成", fieldCount: 72, createdDate: "2026-02-05", updatedDate: "2026-02-17", operator: "李会计" },
  { id: "28", templateId: "TM2602028", templateName: "自定义-费用预算对比模板", templateType: "自定义报表", industry: "全部行业", taxpayerType: "全部", source: "custom", version: "C1.2", status: "disabled", description: "费用预算与实际执行对比分析报表，按部门和费用科目展示差异率", fieldCount: 25, createdDate: "2026-02-06", updatedDate: "2026-02-16", operator: "王会计" },
]

const PAGE_SIZE = 20

const statusConfig: Record<TemplateStatus, { label: string; className: string }> = {
  active: { label: "启用", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  review: { label: "待审核", className: "bg-amber-50 text-amber-700 border-amber-200" },
  disabled: { label: "禁用", className: "bg-red-50 text-red-700 border-red-200" },
}

const sourceLabels: Record<TemplateSource, string> = {
  system: "系统内置",
  custom: "自定义创建",
  import: "导入",
}

const PIE_COLORS = ["var(--color-chart-2)", "var(--color-chart-4)", "var(--color-chart-5)"]
const BAR_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"]

// ---- Component ----
export function ReportTemplates() {
  // Filter state
  const [typeFilter, setTypeFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [taxpayerTypeFilter, setTaxpayerTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [keyword, setKeyword] = useState("")
  // Advanced
  const [sourceFilter, setSourceFilter] = useState("all")
  const [versionFilter, setVersionFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<TemplateRecord | null>(null)
  const [templates, setTemplates] = useState<TemplateRecord[]>(allTemplates)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Unique values for filters
  const templateTypes = [...new Set(allTemplates.map((r) => r.templateType))]
  const industries = [...new Set(allTemplates.map((r) => r.industry))]
  const taxpayerTypes = [...new Set(allTemplates.map((r) => r.taxpayerType))]
  const sources: TemplateSource[] = ["system", "custom", "import"]
  const versions = [...new Set(allTemplates.map((r) => r.version))].sort()
  const operators = [...new Set(allTemplates.map((r) => r.operator))]

  // Computed filtered data
  const filteredTemplates = useMemo(() => {
    return templates.filter((r) => {
      if (typeFilter !== "all" && r.templateType !== typeFilter) return false
      if (industryFilter !== "all" && r.industry !== industryFilter) return false
      if (taxpayerTypeFilter !== "all" && r.taxpayerType !== taxpayerTypeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (showAdvanced) {
        if (sourceFilter !== "all" && r.source !== sourceFilter) return false
        if (versionFilter !== "all" && r.version !== versionFilter) return false
        if (operatorFilter !== "all" && r.operator !== operatorFilter) return false
      }
      if (keyword) {
        const q = keyword.toLowerCase()
        if (
          !r.templateId.toLowerCase().includes(q) &&
          !r.templateName.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [templates, typeFilter, industryFilter, taxpayerTypeFilter, statusFilter, keyword, showAdvanced, sourceFilter, versionFilter, operatorFilter])

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / PAGE_SIZE))
  const paged = filteredTemplates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const active = templates.filter((r) => r.status === "active").length
    const review = templates.filter((r) => r.status === "review").length
    const disabled = templates.filter((r) => r.status === "disabled").length

    const typeMap: Record<string, number> = {}
    templates.forEach((r) => {
      typeMap[r.templateType] = (typeMap[r.templateType] || 0) + 1
    })

    const sourceMap: Record<string, number> = { system: 0, custom: 0, import: 0 }
    templates.forEach((r) => {
      sourceMap[r.source] = (sourceMap[r.source] || 0) + 1
    })

    return { active, review, disabled, typeMap, sourceMap }
  }, [templates])

  // Chart data
  const statusPieData = [
    { name: "启用", value: stats.active },
    { name: "待审核", value: stats.review },
    { name: "禁用", value: stats.disabled },
  ].filter((d) => d.value > 0)

  const sourceBarData = useMemo(() => {
    return [
      { name: "系统内置", value: stats.sourceMap.system },
      { name: "自定义创建", value: stats.sourceMap.custom },
      { name: "导入", value: stats.sourceMap.import },
    ].filter((d) => d.value > 0)
  }, [stats.sourceMap])

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
    setTypeFilter("all")
    setIndustryFilter("all")
    setTaxpayerTypeFilter("all")
    setStatusFilter("all")
    setKeyword("")
    setSourceFilter("all")
    setVersionFilter("all")
    setOperatorFilter("all")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  // Batch status update
  function batchSetStatus(newStatus: TemplateStatus) {
    setTemplates((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: newStatus } : r))
    )
    setSelectedIds(new Set())
  }

  // Single status update
  function setTemplateStatus(id: string, newStatus: TemplateStatus) {
    setTemplates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  // Delete
  function batchDelete() {
    setTemplates((prev) => prev.filter((r) => !selectedIds.has(r.id)))
    setSelectedIds(new Set())
  }

  function deleteTemplate(id: string) {
    setTemplates((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-5">
      {/* ---- Template Status Overview ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground" suppressHydrationWarning>
          模板状态概览（可视化，直观掌控模板库）
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Status summary badges */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground" suppressHydrationWarning>
              {"本次查询汇总：模板总数 "}<strong className="font-mono text-foreground">{templates.length}</strong>{" 条"}
            </p>
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
            <p className="mt-2 text-xs font-medium text-muted-foreground">模板类型分布</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {Object.entries(stats.typeMap).map(([type, count]) => (
                <span key={type} className="rounded-md border border-border bg-muted/40 px-3 py-1.5" suppressHydrationWarning>
                  {type}{"("}<strong className="font-mono">{count}</strong>{"条)"}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">模板来源分布</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-md border border-border bg-muted/40 px-3 py-1.5" suppressHydrationWarning>
                {"系统内置("}<strong className="font-mono">{stats.sourceMap.system}</strong>{"条)"}
              </span>
              <span className="rounded-md border border-border bg-muted/40 px-3 py-1.5" suppressHydrationWarning>
                {"自定义创建("}<strong className="font-mono">{stats.sourceMap.custom}</strong>{"条)"}
              </span>
              <span className="rounded-md border border-border bg-muted/40 px-3 py-1.5" suppressHydrationWarning>
                {"导入("}<strong className="font-mono">{stats.sourceMap.import}</strong>{"条)"}
              </span>
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
              <p className="mb-1 text-center text-xs font-medium text-muted-foreground">来源分布</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={sourceBarData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sourceBarData.map((_, i) => (
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
          多维度模板筛选区（精准定位，适配多场景模板管理）
        </h3>

        {/* Basic filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">基础筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs">模板类型</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {templateTypes.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">适用行业</Label>
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
              <Label className="text-xs">纳税人类型</Label>
              <Select value={taxpayerTypeFilter} onValueChange={setTaxpayerTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {taxpayerTypes.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">模板状态</Label>
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
                placeholder="输入模板ID/名称/描述"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        <div className="mb-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-2.5 text-xs font-medium text-primary hover:underline"
          >
            {showAdvanced ? "收起高级筛选" : "展开高级筛选"}
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs">模板来源</Label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {sources.map((s) => (
                      <SelectItem key={s} value={s}>{sourceLabels[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">模板版本</Label>
                <Select value={versionFilter} onValueChange={setVersionFilter}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {versions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
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
                    {operators.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
            新建模板
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            导入模板文件
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            导出模板库
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            同步模板至账套
          </Button>
        </div>
      </section>

      {/* ---- Core Template Table ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground" suppressHydrationWarning>
          报表模板核心列表（结构化展示，支持行级操作+版本管控）
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
                <TableHead className="text-xs">模板ID</TableHead>
                <TableHead className="text-xs">模板名称</TableHead>
                <TableHead className="text-xs">模板类型</TableHead>
                <TableHead className="text-xs">适用行业</TableHead>
                <TableHead className="text-xs">纳税人类型</TableHead>
                <TableHead className="text-xs">模板状态</TableHead>
                <TableHead className="text-right text-xs">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    未找到匹配的报表模板记录
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((tpl) => (
                  <TableRow key={tpl.id} className="group hover:bg-muted/20">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(tpl.id)}
                        onCheckedChange={() => toggleOne(tpl.id)}
                        aria-label={`选择模板 ${tpl.templateId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{tpl.templateId}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs">{tpl.templateName}</TableCell>
                    <TableCell className="text-xs">{tpl.templateType}</TableCell>
                    <TableCell className="text-xs">{tpl.industry}</TableCell>
                    <TableCell className="text-xs">{tpl.taxpayerType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[tpl.status].className}>
                        {statusConfig[tpl.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="查看详情"
                          onClick={() => setDetailRecord(tpl)}
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
                        {tpl.status !== "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-emerald-600"
                            title="启用"
                            onClick={() => setTemplateStatus(tpl.id, "active")}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {tpl.status !== "review" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-amber-600"
                            title="设为待审核"
                            onClick={() => setTemplateStatus(tpl.id, "review")}
                          >
                            <span className="text-xs font-bold">{"?"}</span>
                          </Button>
                        )}
                        {tpl.status !== "disabled" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600"
                            title="禁用"
                            onClick={() => setTemplateStatus(tpl.id, "disabled")}
                          >
                            <span className="text-xs font-bold">{"x"}</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          title="删除"
                          onClick={() => deleteTemplate(tpl.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="版本日志"
                          onClick={() => setDetailRecord(tpl)}
                        >
                          <ScrollText className="h-3.5 w-3.5" />
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
            {"共 "}{filteredTemplates.length}{" 条记录，第 "}{currentPage}{" / "}{totalPages}{" 页"}
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
          批量操作区（勾选后激活，提升模板管理效率）
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
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            批量导出
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
          模板版本管理区（防误改，支持版本回溯/对比）
        </h3>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"主版本："}<strong className="text-foreground">V2.1</strong>{"（系统内置）"}
            </span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"自定义版本："}<strong className="text-foreground">C1.2</strong>{"（用户创建）"}
            </span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"最近更新："}<strong className="text-foreground">2026-02-20 16:30</strong>
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
              <GitCompareArrows className="mr-1.5 h-3.5 w-3.5" />
              版本对比
            </Button>
            <Button size="sm" variant="outline">
              <ArchiveRestore className="mr-1.5 h-3.5 w-3.5" />
              回滚至历史版本
            </Button>
            <Button size="sm" variant="outline">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              备份当前版本
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
              模板帮助中心
            </Button>
            <Button size="sm" variant="ghost">
              <ScrollText className="mr-1.5 h-3.5 w-3.5" />
              模板字段映射手册
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              刷新模板库
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
              {"报表模板详情 - "}{detailRecord?.templateId}
            </DialogTitle>
            <DialogDescription>
              查看报表模板的完整配置信息
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板ID</span>
                <span className="font-mono">{detailRecord.templateId}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板名称</span>
                <span>{detailRecord.templateName}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板类型</span>
                <span>{detailRecord.templateType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">适用行业</span>
                <span>{detailRecord.industry}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">纳税人类型</span>
                <span>{detailRecord.taxpayerType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板来源</span>
                <Badge variant="outline" className={
                  detailRecord.source === "system" ? "border-blue-200 bg-blue-50 text-blue-700" :
                  detailRecord.source === "custom" ? "border-purple-200 bg-purple-50 text-purple-700" :
                  "border-teal-200 bg-teal-50 text-teal-700"
                }>
                  {sourceLabels[detailRecord.source]}
                </Badge>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板版本</span>
                <span className="font-mono font-medium text-primary">{detailRecord.version}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">字段数量</span>
                <span className="font-mono">{detailRecord.fieldCount}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板状态</span>
                <Badge variant="outline" className={statusConfig[detailRecord.status].className}>
                  {statusConfig[detailRecord.status].label}
                </Badge>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">模板描述</span>
                <span className="leading-relaxed text-muted-foreground">{detailRecord.description}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">创建日期</span>
                <span>{detailRecord.createdDate}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">更新日期</span>
                <span>{detailRecord.updatedDate}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">操作人</span>
                <span>{detailRecord.operator}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
