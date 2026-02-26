"use client"

import { useState, useMemo } from "react"
import {
  Search,
  RotateCcw,
  Download,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
  FileText,
  Tag,
  Link2,
  UserCheck,
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
type RiskLevel = "high" | "medium" | "low"
type DisposalStatus = "pending" | "processing" | "closed" | "failed"
type RiskType = "invoice" | "entry" | "tax" | "report"
type DiscoveryChannel = "ai" | "manual"

interface RiskRecord {
  id: string
  riskId: string
  title: string
  level: RiskLevel
  riskType: RiskType
  channel: DiscoveryChannel
  status: DisposalStatus
  relatedModule: string
  handler: string
  period: string
  createdAt: string
  closedAt: string
  description: string
}

// ---- Deterministic formatter ----
function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// ---- Mock Data ----
const riskTitles: Array<{ title: string; riskType: RiskType; relatedModule: string; description: string }> = [
  { title: "发票进销项不匹配", riskType: "invoice", relatedModule: "发票解析", description: "2月进项税额与销项税额差异超过30%阈值，需核实是否存在虚开发票风险" },
  { title: "分录科目串户", riskType: "entry", relatedModule: "自动分录", description: "管理费用-办公费与管理费用-差旅费科目串户，金额12,500元" },
  { title: "增值税计税基数错误", riskType: "tax", relatedModule: "税种计算", description: "增值税销项税额计算基数与发票金额不一致，差异金额5,200元" },
  { title: "报表公式逻辑错误", riskType: "report", relatedModule: "报表生成", description: "利润表中营业利润公式缺少投资收益科目，导致利润偏低" },
  { title: "发票重复入账", riskType: "invoice", relatedModule: "发票解析", description: "发票号FP2602015已在2月1日入账，本次重复入账需撤销" },
  { title: "分录借贷不平衡", riskType: "entry", relatedModule: "自动分录", description: "凭证JE2602008借方合计125,000元，贷方合计124,800元，差额200元" },
  { title: "附加税税率适用错误", riskType: "tax", relatedModule: "税种计算", description: "城建税适用税率应为7%（城区），实际计算使用5%（县级）" },
  { title: "资产负债表不平衡", riskType: "report", relatedModule: "报表生成", description: "资产合计与负债+所有者权益合计差异1,500元，需检查科目余额" },
  { title: "发票认证期限预警", riskType: "invoice", relatedModule: "发票解析", description: "3张增值税专用发票将于3月15日到期，需尽快认证抵扣" },
  { title: "分录摘要缺失", riskType: "entry", relatedModule: "自动分录", description: "15笔自动生成分录缺少业务摘要，不符合会计档案管理规范" },
  { title: "企业所得税预缴偏差", riskType: "tax", relatedModule: "税种计算", description: "季度预缴金额与利润表利润总额×25%差异超过15%，需复核" },
  { title: "现金流量表勾稽关系异常", riskType: "report", relatedModule: "报表生成", description: "经营活动现金流量净额与利润表净利润调整后差异较大" },
  { title: "发票金额异常偏高", riskType: "invoice", relatedModule: "发票解析", description: "单张发票金额50万元，超过该供应商历史月均采购额的3倍" },
  { title: "分录日期跨期", riskType: "entry", relatedModule: "自动分录", description: "3笔1月份费用在2月入账，可能存在跨期调整风险" },
  { title: "印花税计税依据遗漏", riskType: "tax", relatedModule: "税种计算", description: "2月新增购销合同3份未纳入印花税计税依据" },
  { title: "科目余额表异常余额", riskType: "report", relatedModule: "报表生成", description: "应付账款科目出现借方余额28,000元，可能存在多付或串户" },
  { title: "发票税率异常", riskType: "invoice", relatedModule: "发票解析", description: "普通发票适用13%税率，但商品类别应适用6%税率" },
  { title: "分录辅助核算缺失", riskType: "entry", relatedModule: "自动分录", description: "应收账款科目8笔分录未挂客户辅助核算，影响账龄分析" },
  { title: "个税申报数据不一致", riskType: "tax", relatedModule: "税种计算", description: "个税代扣代缴计算人数与工资表人数不一致，差异2人" },
  { title: "报表格式不符合最新准则", riskType: "report", relatedModule: "报表生成", description: "利润表格式未按2026年最新企业会计准则调整列报项目" },
  { title: "发票供应商名称不一致", riskType: "invoice", relatedModule: "发票解析", description: "发票上供应商名称与合同签订方名称不一致，需核实" },
  { title: "分录金额尾差累积", riskType: "entry", relatedModule: "自动分录", description: "2月份自动分录尾差累积达到85元，建议月末一次性调整" },
  { title: "增值税留抵税额异常增长", riskType: "tax", relatedModule: "税种计算", description: "留抵税额环比增长200%，可能引起税务机关关注" },
  { title: "报表附注内容缺失", riskType: "report", relatedModule: "报表生成", description: "财务报表附注缺少重要会计政策变更说明" },
  { title: "发票开具信息不完整", riskType: "invoice", relatedModule: "发票解析", description: "5张发票缺少纳税人识别号或地址电话信息" },
  { title: "分录关联发票断链", riskType: "entry", relatedModule: "自动分录", description: "12笔费用分录无法关联到对应发票，原始凭证缺失" },
  { title: "城建税计算基数错误", riskType: "tax", relatedModule: "税种计算", description: "城建税计算基数未包含消费税部分，少计580元" },
  { title: "费用明细表分类错误", riskType: "report", relatedModule: "报表生成", description: "招待费错误归入办公费类目，影响税前扣除限额计算" },
  { title: "发票作废未同步冲销", riskType: "invoice", relatedModule: "发票解析", description: "2月5日作废的发票FP2602003对应分录未及时冲销" },
  { title: "分录审批流程缺失", riskType: "entry", relatedModule: "自动分录", description: "金额超过10万元的分录未经过二级审批流程" },
  { title: "所得税汇算清缴差异", riskType: "tax", relatedModule: "税种计算", description: "业务招待费税前扣除超过营业收入的0.5%限额" },
  { title: "合并报表抵消分录缺失", riskType: "report", relatedModule: "报表生成", description: "内部交易抵消分录未生成，合并报表数据可能虚增" },
  { title: "发票认证失败", riskType: "invoice", relatedModule: "发票解析", description: "2张专票认证失败，密文区信息与系统不一致" },
  { title: "分录模板匹配失败", riskType: "entry", relatedModule: "自动分录", description: "新增业务类型无匹配分录模板，需人工新增规则" },
  { title: "房产税申报遗漏", riskType: "tax", relatedModule: "税种计算", description: "新购入办公用房未纳入房产税从价计征范围" },
  { title: "往来账款对账差异", riskType: "report", relatedModule: "报表生成", description: "应收账款与客户对账单差异15,000元，需逐笔核对" },
  { title: "发票跨区域开具异常", riskType: "invoice", relatedModule: "发票解析", description: "供应商注册地与发票开具地不一致，可能存在虚开风险" },
  { title: "分录金额超预算", riskType: "entry", relatedModule: "自动分录", description: "市场推广费本月累计支出超预算35%，需预算调整审批" },
  { title: "增值税申报表与账簿不一致", riskType: "tax", relatedModule: "税种计算", description: "增值税申报表销售额与总账销售收入差异3,200元" },
  { title: "年度报表年初数异常", riskType: "report", relatedModule: "报表生成", description: "2026年资产负债表年初数与2025年末数不一致，差异800元" },
  { title: "电子发票真伪校验失败", riskType: "invoice", relatedModule: "发票解析", description: "3张电子发票在国税平台查验结果为无此发票信息" },
  { title: "分录记账凭证号重复", riskType: "entry", relatedModule: "自动分录", description: "2月凭证号JE2602015出现两次，需修正凭证编号" },
]

const levels: RiskLevel[] = ["high", "medium", "low"]
const statuses: DisposalStatus[] = ["pending", "processing", "closed", "closed", "closed", "closed", "closed", "closed", "pending", "processing"]
const channels: DiscoveryChannel[] = ["ai", "ai", "ai", "ai", "ai", "manual", "ai", "ai", "ai", "manual"]
const handlers = ["张会计", "李会计", "王主管", "赵审计"]

const allRecords: RiskRecord[] = riskTitles.map((item, i) => {
  const idx = i + 1
  const level = levels[i % 3]
  const status = i < 10 ? statuses[i] : (i < 28 ? "closed" : (i < 36 ? "pending" : "processing"))
  const channel = channels[i % channels.length]
  const handler = handlers[i % handlers.length]
  const day = String(Math.max(1, 25 - Math.floor(i / 2))).padStart(2, "0")
  const closedDay = status === "closed" ? String(Math.min(28, 25 - Math.floor(i / 2) + 2)).padStart(2, "0") : ""

  return {
    id: String(idx),
    riskId: `RS2602${String(idx).padStart(3, "0")}`,
    title: item.title,
    level,
    riskType: item.riskType,
    channel,
    status,
    relatedModule: item.relatedModule,
    handler,
    period: "2026-02",
    createdAt: `2026-02-${day}`,
    closedAt: closedDay ? `2026-02-${closedDay}` : "",
    description: item.description,
  }
})

const PAGE_SIZE = 20

const levelConfig: Record<RiskLevel, { label: string; className: string; dotColor: string }> = {
  high: { label: "高风险", className: "bg-red-50 text-red-700 border-red-200", dotColor: "bg-red-500" },
  medium: { label: "中风险", className: "bg-amber-50 text-amber-700 border-amber-200", dotColor: "bg-amber-500" },
  low: { label: "低风险", className: "bg-yellow-50 text-yellow-600 border-yellow-200", dotColor: "bg-yellow-400" },
}

const statusConfig: Record<DisposalStatus, { label: string; className: string }> = {
  pending: { label: "待处置", className: "bg-slate-50 text-slate-600 border-slate-200" },
  processing: { label: "处置中", className: "bg-amber-50 text-amber-700 border-amber-200" },
  closed: { label: "已闭环", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "处置失败", className: "bg-red-50 text-red-700 border-red-200" },
}

const riskTypeConfig: Record<RiskType, { label: string }> = {
  invoice: { label: "发票风险" },
  entry: { label: "分录风险" },
  tax: { label: "计税风险" },
  report: { label: "报表风险" },
}

const channelConfig: Record<DiscoveryChannel, { label: string; className: string }> = {
  ai: { label: "AI检测", className: "bg-blue-50 text-blue-700 border-blue-200" },
  manual: { label: "人工复核", className: "bg-slate-50 text-slate-700 border-slate-200" },
}

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

// ---- Component ----
export function RiskLedger() {
  // Filter state
  const [periodFilter, setPeriodFilter] = useState("2026-02")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskTypeFilter, setRiskTypeFilter] = useState("all")
  const [keyword, setKeyword] = useState("")
  const [channelFilter, setChannelFilter] = useState("all")
  const [handlerFilter, setHandlerFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<RiskRecord | null>(null)

  // Unique filter options
  const handlerOptions = [...new Set(allRecords.map((r) => r.handler))]
  const moduleOptions = [...new Set(allRecords.map((r) => r.relatedModule))]

  // Computed filtered data
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (periodFilter !== "all" && r.period !== periodFilter) return false
      if (levelFilter !== "all" && r.level !== levelFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (riskTypeFilter !== "all" && r.riskType !== riskTypeFilter) return false
      if (channelFilter !== "all" && r.channel !== channelFilter) return false
      if (handlerFilter !== "all" && r.handler !== handlerFilter) return false
      if (moduleFilter !== "all" && r.relatedModule !== moduleFilter) return false
      if (keyword) {
        const q = keyword.toLowerCase()
        if (
          !r.riskId.toLowerCase().includes(q) &&
          !r.title.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [periodFilter, levelFilter, statusFilter, riskTypeFilter, channelFilter, handlerFilter, moduleFilter, keyword])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const paged = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const high = filteredRecords.filter((r) => r.level === "high").length
    const medium = filteredRecords.filter((r) => r.level === "medium").length
    const low = filteredRecords.filter((r) => r.level === "low").length
    const closed = filteredRecords.filter((r) => r.status === "closed").length
    const pending = filteredRecords.filter((r) => r.status === "pending").length
    const processing = filteredRecords.filter((r) => r.status === "processing").length
    const failed = filteredRecords.filter((r) => r.status === "failed").length

    const typeBreakdown: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      const label = riskTypeConfig[r.riskType].label
      typeBreakdown[label] = (typeBreakdown[label] || 0) + 1
    })

    const channelBreakdown: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      const label = channelConfig[r.channel].label
      channelBreakdown[label] = (channelBreakdown[label] || 0) + 1
    })

    return { total: filteredRecords.length, high, medium, low, closed, pending, processing, failed, typeBreakdown, channelBreakdown }
  }, [filteredRecords])

  // Chart: Module risk pie
  const modulePieData = useMemo(() => {
    return Object.entries(stats.typeBreakdown)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [stats.typeBreakdown])

  // Chart: Monthly risk trend
  const monthlyTrendData = useMemo(() => {
    const dayMap: Record<string, number> = {}
    allRecords.forEach((r) => {
      const day = r.createdAt.slice(8)
      dayMap[day] = (dayMap[day] || 0) + 1
    })
    return Object.entries(dayMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-10)
      .map(([day, count]) => ({ day: `${day}日`, count }))
  }, [])

  // Chart: Disposal rate trend (by week)
  const disposalRateData = useMemo(() => {
    const weeks = [
      { label: "第1周", start: 1, end: 7 },
      { label: "第2周", start: 8, end: 14 },
      { label: "第3周", start: 15, end: 21 },
      { label: "第4周", start: 22, end: 28 },
    ]
    return weeks.map((w) => {
      const weekRecords = allRecords.filter((r) => {
        const d = parseInt(r.createdAt.slice(8))
        return d >= w.start && d <= w.end
      })
      const total = weekRecords.length
      const closed = weekRecords.filter((r) => r.status === "closed").length
      return {
        week: w.label,
        rate: total > 0 ? Math.round((closed / total) * 10000) / 100 : 0,
      }
    })
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
    setLevelFilter("all")
    setStatusFilter("all")
    setRiskTypeFilter("all")
    setKeyword("")
    setChannelFilter("all")
    setHandlerFilter("all")
    setModuleFilter("all")
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleQuery() {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-5">
      {/* ---- Risk Overview Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          {"风险处置概览（可视化，一键掌控风控整体状态）"}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{"本次查询汇总"}</p>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"风险总数："}
                  <strong className="font-mono tabular-nums">{stats.total}</strong>
                  {" 条"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-red-700">
                  {"高风险："}
                  <strong>{stats.high}</strong>
                  {" 条"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-amber-700">
                  {"中风险："}
                  <strong>{stats.medium}</strong>
                  {" 条"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-yellow-600">
                  {"低风险："}
                  <strong>{stats.low}</strong>
                  {" 条"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"处置进度汇总："}
                </span>
                <span className="text-emerald-700">
                  {"已闭环("}{stats.closed}{"条)"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-slate-600">
                  {"待处置("}{stats.pending}{"条)"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-amber-700">
                  {"处置中("}{stats.processing}{"条)"}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-red-700">
                  {"处置失败("}{stats.failed}{"条)"}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{"风险类型与发现渠道分布"}</p>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"风险类型分布："}
                  {Object.entries(stats.typeBreakdown)
                    .map(([name, count]) => `${name}(${count}条)`)
                    .join(" | ")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-foreground">
                  {"发现渠道分布："}
                  {Object.entries(stats.channelBreakdown)
                    .map(([name, count]) => `${name}(${count}条)`)
                    .join(" | ")}
                </span>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{"闭环率"}</span>
                  <span className="font-mono font-medium text-foreground">
                    {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}{"%"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.closed / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Filter Section ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {"多维度风险筛选区（精准定位，适配风控全场景查询）"}
        </h3>

        {/* Core filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">{"核心筛选"}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs">{"风险周期"}</Label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="2026-02">{"2026-02"}</SelectItem>
                  <SelectItem value="2026-01">{"2026-01"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"风险等级"}</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="high">{"高风险"}</SelectItem>
                  <SelectItem value="medium">{"中风险"}</SelectItem>
                  <SelectItem value="low">{"低风险"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"处置状态"}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="pending">{"待处置"}</SelectItem>
                  <SelectItem value="processing">{"处置中"}</SelectItem>
                  <SelectItem value="closed">{"已闭环"}</SelectItem>
                  <SelectItem value="failed">{"处置失败"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"风险类型"}</Label>
              <Select value={riskTypeFilter} onValueChange={setRiskTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="invoice">{"发票风险"}</SelectItem>
                  <SelectItem value="entry">{"分录风险"}</SelectItem>
                  <SelectItem value="tax">{"计税风险"}</SelectItem>
                  <SelectItem value="report">{"报表风险"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"关键词模糊查询"}</Label>
              <Input
                placeholder="风险ID/风险标题"
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
              <Label className="text-xs">{"发现渠道"}</Label>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  <SelectItem value="ai">{"AI检测"}</SelectItem>
                  <SelectItem value="manual">{"人工复核"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"处置人"}</Label>
              <Select value={handlerFilter} onValueChange={setHandlerFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {handlerOptions.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{"关联模块"}</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"全部"}</SelectItem>
                  {moduleOptions.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
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
            <RefreshCw className="h-3.5 w-3.5" />
            {"同步最新风险"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            {"导出处置台账"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Tag className="h-3.5 w-3.5" />
            {"批量打标签"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
            {"清理已闭环"}
          </Button>
        </div>
      </section>

      {/* ---- Data Table ---- */}
      <section className="rounded-xl border border-border bg-card">
        <div className="px-5 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            {"风险处置核心台账列表（共 "}{filteredRecords.length}{" 条）"}
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
                <TableHead className="text-xs">{"风险ID"}</TableHead>
                <TableHead className="text-xs">{"风险标题"}</TableHead>
                <TableHead className="text-center text-xs">{"风险等级"}</TableHead>
                <TableHead className="text-xs">{"风险类型"}</TableHead>
                <TableHead className="text-center text-xs">{"发现渠道"}</TableHead>
                <TableHead className="text-center text-xs">{"处置状态"}</TableHead>
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
                      record.level === "high" && record.status !== "closed"
                        ? "bg-red-50/40"
                        : record.status === "pending"
                          ? "bg-slate-50/40"
                          : ""
                    }
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => toggleOne(record.id)}
                        aria-label={`选中 ${record.riskId}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.riskId}</TableCell>
                    <TableCell className="max-w-48 text-xs font-medium">
                      <span className="line-clamp-1">{record.title}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${levelConfig[record.level].className}`}
                      >
                        {levelConfig[record.level].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{riskTypeConfig[record.riskType].label}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${channelConfig[record.channel].className}`}
                      >
                        {channelConfig[record.channel].label}
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
                          title="查看详情"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {record.status !== "closed" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              title="编辑处置"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              title="添加处置记录"
                            >
                              <FileText className="h-3.5 w-3.5" />
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
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              title="删除"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              title="处置记录"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              title="关联溯源"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
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
              <UserCheck className="h-3.5 w-3.5" />
              {"批量分配处置人"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              {"批量标记处置中"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {"批量确认闭环"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-3.5 w-3.5" />
              {"批量导出处置记录"}
            </Button>
          </div>
        </section>
      )}

      {/* ---- Pagination & Stats ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
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
          <h4 className="mb-3 text-xs font-semibold text-muted-foreground">{"风险统计（本次查询）"}</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="风险总数" value={`${stats.total} 条`} />
            <StatCard label="高风险" value={`${stats.high} 条`} variant="danger" />
            <StatCard label="中风险" value={`${stats.medium} 条`} variant="warning" />
            <StatCard label="低风险" value={`${stats.low} 条`} variant="info" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="已闭环" value={`${stats.closed} 条`} variant="success" />
            <StatCard label="待处置" value={`${stats.pending} 条`} />
            <StatCard label="处置中" value={`${stats.processing} 条`} variant="warning" />
            <StatCard
              label="闭环率"
              value={`${stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%`}
              variant="success"
            />
          </div>
        </div>
      </section>

      {/* ---- Charts ---- */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {"风控数据可视化分析（辅助复盘，优化风控规则）"}
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Module risk pie chart */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"各模块风险占比饼图"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modulePieData}
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
                    {modulePieData.map((_, index) => (
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

          {/* Monthly risk generation trend */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"月度风险生成趋势"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value} 条`, "风险数量"]}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disposal rate trend */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">{"风险处置率趋势"}</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={disposalRateData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "闭环率"]}
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
            {"返回周期风险检测"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            {"风控帮助中心"}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            {"风控规则手册"}
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
            <DialogTitle>{"风险详情"}</DialogTitle>
            <DialogDescription suppressHydrationWarning>
              {"风险ID："}{detailRecord?.riskId}
            </DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-3 text-sm">
              <DetailRow label="风险ID" value={detailRecord.riskId} />
              <DetailRow label="风险标题" value={detailRecord.title} />
              <DetailRow label="风险等级" value={levelConfig[detailRecord.level].label} />
              <DetailRow label="风险类型" value={riskTypeConfig[detailRecord.riskType].label} />
              <DetailRow label="发现渠道" value={channelConfig[detailRecord.channel].label} />
              <DetailRow label="处置状态" value={statusConfig[detailRecord.status].label} />
              <DetailRow label="关联模块" value={detailRecord.relatedModule} />
              <DetailRow label="处置人" value={detailRecord.handler} />
              <DetailRow label="风险周期" value={detailRecord.period} />
              <DetailRow label="发现日期" value={detailRecord.createdAt} />
              <DetailRow label="闭环日期" value={detailRecord.closedAt || "----"} />
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">{"风险描述"}</p>
                <p className="text-sm leading-relaxed text-foreground">{detailRecord.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---- Helper Components ----
function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string
  variant?: "default" | "success" | "warning" | "danger" | "info"
}) {
  const colorMap = {
    default: "text-foreground",
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-red-700",
    info: "text-yellow-600",
  }
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${colorMap[variant]}`}>
        {value}
      </p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}
