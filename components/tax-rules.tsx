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

interface TaxRuleRecord {
  id: string
  ruleId: string
  ruleName: string
  industry: string
  taxType: string
  taxpayerType: string
  taxMethod: string
  priority: string
  status: RuleStatus
  formula: string
  description: string
  createdDate: string
  updatedDate: string
  operator: string
}

// ---- Mock Data ----
const allRules: TaxRuleRecord[] = [
  { id: "1", ruleId: "TR2602001", ruleName: "小规模商贸-增值税算税规则", industry: "商贸行业", taxType: "增值税", taxpayerType: "小规模纳税人", taxMethod: "简易计税", priority: "高", status: "active", formula: "不含税收入 x 3%", description: "适用于小规模纳税人商贸企业的增值税计算，按季度申报，季度销售额不超过30万免征", createdDate: "2026-01-10", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "2", ruleId: "TR2602002", ruleName: "小规模-附加税算税规则", industry: "全部行业", taxType: "附加税", taxpayerType: "小规模纳税人", taxMethod: "附加计税", priority: "高", status: "active", formula: "增值税额 x (7%+3%+2%) x 50%", description: "适用于小规模纳税人的城建税、教育费附加和地方教育附加，享受减半征收优惠", createdDate: "2026-01-10", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "3", ruleId: "TR2602003", ruleName: "商贸核定-企业所得税规则", industry: "商贸行业", taxType: "企业所得税", taxpayerType: "小规模纳税人", taxMethod: "核定征收", priority: "中", status: "review", formula: "收入总额 x 应税所得率(4%) x 25%", description: "适用于核定征收方式的商贸企业所得税计算，应税所得率按商贸行业4%执行", createdDate: "2026-01-15", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "4", ruleId: "TR2602004", ruleName: "一般纳税人-增值税规则", industry: "服务行业", taxType: "增值税", taxpayerType: "一般纳税人", taxMethod: "一般计税", priority: "高", status: "disabled", formula: "销项税额 - 进项税额", description: "适用于一般纳税人服务行业的增值税计算，税率6%，按月申报", createdDate: "2026-01-20", updatedDate: "2026-02-15", operator: "张会计" },
  { id: "5", ruleId: "TR2602005", ruleName: "商贸一般-增值税规则", industry: "商贸行业", taxType: "增值税", taxpayerType: "一般纳税人", taxMethod: "一般计税", priority: "高", status: "active", formula: "销项税额(13%) - 进项税额", description: "适用于一般纳税人商贸企业的增值税计算，税率13%，按月申报", createdDate: "2026-01-12", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "6", ruleId: "TR2602006", ruleName: "服务行业-附加税规则", industry: "服务行业", taxType: "附加税", taxpayerType: "一般纳税人", taxMethod: "附加计税", priority: "高", status: "active", formula: "增值税额 x (7%+3%+2%)", description: "适用于一般纳税人服务行业的城建税和教育费附加", createdDate: "2026-01-13", updatedDate: "2026-02-17", operator: "李会计" },
  { id: "7", ruleId: "TR2602007", ruleName: "建筑行业-增值税规则", industry: "建筑行业", taxType: "增值税", taxpayerType: "一般纳税人", taxMethod: "一般计税", priority: "高", status: "active", formula: "销项税额(9%) - 进项税额", description: "适用于一般纳税人建筑行业的增值税计算，税率9%", createdDate: "2026-01-14", updatedDate: "2026-02-16", operator: "张会计" },
  { id: "8", ruleId: "TR2602008", ruleName: "建筑简易-增值税规则", industry: "建筑行业", taxType: "增值税", taxpayerType: "一般纳税人", taxMethod: "简易计税", priority: "中", status: "active", formula: "(全部价款-分包款) / (1+3%) x 3%", description: "适用于一般纳税人选择简易计税的建筑老项目，差额征税3%", createdDate: "2026-01-16", updatedDate: "2026-02-18", operator: "李会计" },
  { id: "9", ruleId: "TR2602009", ruleName: "小微企业-所得税优惠规则", industry: "全部行业", taxType: "企业所得税", taxpayerType: "小规模纳税人", taxMethod: "查账征收", priority: "高", status: "active", formula: "应纳税所得额 x 5% (<=300万部分)", description: "适用于小微企业的企业所得税优惠政策，年应纳税所得额不超300万按5%计算", createdDate: "2026-01-18", updatedDate: "2026-02-19", operator: "张会计" },
  { id: "10", ruleId: "TR2602010", ruleName: "一般企业-所得税规则", industry: "全部行业", taxType: "企业所得税", taxpayerType: "一般纳税人", taxMethod: "查账征收", priority: "中", status: "active", formula: "应纳税所得额 x 25%", description: "适用于一般企业的企业所得税计算，标准税率25%", createdDate: "2026-01-19", updatedDate: "2026-02-15", operator: "张会计" },
  { id: "11", ruleId: "TR2602011", ruleName: "工资薪金-个人所得税规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "一般纳税人", taxMethod: "累计预扣", priority: "高", status: "active", formula: "(累计收入-累计免税-累计扣除-累计专项) x 税率 - 速算扣除数", description: "适用于居民个人工资薪金的个人所得税预扣预缴计算", createdDate: "2026-01-20", updatedDate: "2026-02-14", operator: "李会计" },
  { id: "12", ruleId: "TR2602012", ruleName: "劳务报酬-个税规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "一般纳税人", taxMethod: "预扣预缴", priority: "中", status: "active", formula: "每次收入(1-20%) x 预扣率 - 速算扣除数", description: "适用于劳务报酬所得的个人所得税预扣预缴计算", createdDate: "2026-01-21", updatedDate: "2026-02-13", operator: "张会计" },
  { id: "13", ruleId: "TR2602013", ruleName: "建筑行业-附加税规则", industry: "建筑行业", taxType: "附加税", taxpayerType: "一般纳税人", taxMethod: "附加计税", priority: "高", status: "active", formula: "增值税额 x (7%+3%+2%)", description: "适用于建筑行业一般纳税人的附加税费计算", createdDate: "2026-01-22", updatedDate: "2026-02-12", operator: "张会计" },
  { id: "14", ruleId: "TR2602014", ruleName: "商贸查账-所得税规则", industry: "商贸行业", taxType: "企业所得税", taxpayerType: "一般纳税人", taxMethod: "查账征收", priority: "中", status: "active", formula: "应纳税所得额 x 25%", description: "适用于商贸行业一般纳税人查账征收方式的企业所得税", createdDate: "2026-01-23", updatedDate: "2026-02-11", operator: "李会计" },
  { id: "15", ruleId: "TR2602015", ruleName: "服务行业-所得税规则", industry: "服务行业", taxType: "企业所得税", taxpayerType: "一般纳税人", taxMethod: "查账征收", priority: "中", status: "review", formula: "应纳税所得额 x 25%", description: "适用于服务行业一般纳税人的企业所得税计算", createdDate: "2026-01-24", updatedDate: "2026-02-10", operator: "张会计" },
  { id: "16", ruleId: "TR2602016", ruleName: "建筑核定-所得税规则", industry: "建筑行业", taxType: "企业所得税", taxpayerType: "小规模纳税人", taxMethod: "核定征收", priority: "中", status: "active", formula: "收入总额 x 应税所得率(8%) x 25%", description: "适用于建筑行业核定征收的企业所得税，应税所得率8%", createdDate: "2026-01-25", updatedDate: "2026-02-09", operator: "张会计" },
  { id: "17", ruleId: "TR2602017", ruleName: "印花税-购销合同规则", industry: "商贸行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "active", formula: "合同金额 x 0.03%", description: "适用于购销合同的印花税计算，税率万分之三", createdDate: "2026-01-26", updatedDate: "2026-02-08", operator: "李会计" },
  { id: "18", ruleId: "TR2602018", ruleName: "印花税-服务合同规则", industry: "服务行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "active", formula: "合同金额 x 0.03%", description: "适用于技术服务合同等的印花税计算", createdDate: "2026-01-27", updatedDate: "2026-02-07", operator: "李会计" },
  { id: "19", ruleId: "TR2602019", ruleName: "房产税-自用房产规则", industry: "全部行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "review", formula: "房产原值 x (1-30%) x 1.2%", description: "适用于企业自用房产的房产税从价计征", createdDate: "2026-01-28", updatedDate: "2026-02-06", operator: "张会计" },
  { id: "20", ruleId: "TR2602020", ruleName: "服务小规模-增值税规则", industry: "服务行业", taxType: "增值税", taxpayerType: "小规模纳税人", taxMethod: "简易计税", priority: "高", status: "active", formula: "不含税收入 x 3%", description: "适用于小规模纳税人服务行业的增值税计算", createdDate: "2026-01-29", updatedDate: "2026-02-05", operator: "张会计" },
  { id: "21", ruleId: "TR2602021", ruleName: "建筑小规模-增值税规则", industry: "建筑行业", taxType: "增值税", taxpayerType: "小规模纳税人", taxMethod: "简易计税", priority: "高", status: "active", formula: "不含税收入 x 3%", description: "适用于小规模纳税人建筑行业的增值税计算", createdDate: "2026-01-30", updatedDate: "2026-02-04", operator: "张会计" },
  { id: "22", ruleId: "TR2602022", ruleName: "一般纳税人-附加税通用", industry: "全部行业", taxType: "附加税", taxpayerType: "一般纳税人", taxMethod: "附加计税", priority: "高", status: "active", formula: "增值税额 x 12%", description: "适用于一般纳税人的城建税7%+教育费附加3%+地方教育附加2%", createdDate: "2026-01-31", updatedDate: "2026-02-03", operator: "李会计" },
  { id: "23", ruleId: "TR2602023", ruleName: "个体工商户-经营所得规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "小规模纳税人", taxMethod: "查账征收", priority: "中", status: "review", formula: "应纳税所得额 x 税率 - 速算扣除数(五级超额累进)", description: "适用于个体工商户生产经营所得的个人所得税计算", createdDate: "2026-02-01", updatedDate: "2026-02-02", operator: "张会计" },
  { id: "24", ruleId: "TR2602024", ruleName: "服务核定-所得税规则", industry: "服务行业", taxType: "企业所得税", taxpayerType: "小规模纳税人", taxMethod: "核定征收", priority: "中", status: "active", formula: "收入总额 x 应税所得率(10%) x 25%", description: "适用于服务行业核定征收企业所得税，应税所得率10%", createdDate: "2026-02-01", updatedDate: "2026-02-02", operator: "李会计" },
  { id: "25", ruleId: "TR2602025", ruleName: "建筑行业-预缴增值税规则", industry: "建筑行业", taxType: "增值税", taxpayerType: "一般纳税人", taxMethod: "预缴计税", priority: "中", status: "active", formula: "(全部价款-分包款) / (1+9%) x 2%", description: "适用于跨区域建筑项目的增值税预缴计算", createdDate: "2026-02-02", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "26", ruleId: "TR2602026", ruleName: "小规模-附加税减免规则", industry: "全部行业", taxType: "附加税", taxpayerType: "小规模纳税人", taxMethod: "附加计税", priority: "高", status: "active", formula: "增值税额 x 12% x 50%", description: "适用于小规模纳税人的附加税减半征收优惠政策", createdDate: "2026-02-03", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "27", ruleId: "TR2602027", ruleName: "残保金-通用规则", industry: "全部行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "disabled", formula: "(应安排人数-实际安排人数) x 上年度平均工资", description: "适用于企业残疾人就业保障金的计算", createdDate: "2026-02-04", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "28", ruleId: "TR2602028", ruleName: "工会经费-通用规则", industry: "全部行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "active", formula: "工资总额 x 2%", description: "适用于企业工会经费的计提规则", createdDate: "2026-02-05", updatedDate: "2026-02-17", operator: "张会计" },
  { id: "29", ruleId: "TR2602029", ruleName: "城镇土地使用税规则", industry: "全部行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从量计征", priority: "低", status: "disabled", formula: "实际占用面积 x 适用税额", description: "适用于企业城镇土地使用税的计算", createdDate: "2026-02-06", updatedDate: "2026-02-16", operator: "李会计" },
  { id: "30", ruleId: "TR2602030", ruleName: "商贸行业-消费税规则", industry: "商贸行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "active", formula: "销售额 x 消费税率", description: "适用于涉及消费税应税商品的商贸企业", createdDate: "2026-02-07", updatedDate: "2026-02-15", operator: "李会计" },
  { id: "31", ruleId: "TR2602031", ruleName: "个税-全年一次性奖金规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "一般纳税人", taxMethod: "单独计税", priority: "中", status: "active", formula: "全年奖金 / 12 查找税率表 x 税率 - 速算扣除数", description: "适用于全年一次性奖金选择单独计税的个税计算", createdDate: "2026-02-08", updatedDate: "2026-02-14", operator: "张会计" },
  { id: "32", ruleId: "TR2602032", ruleName: "个税-稿酬所得规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "一般纳税人", taxMethod: "预扣预缴", priority: "低", status: "review", formula: "每次收入(1-20%) x 70% x 20%", description: "适用于稿酬所得的个人所得税预扣预缴计算", createdDate: "2026-02-09", updatedDate: "2026-02-13", operator: "李会计" },
  { id: "33", ruleId: "TR2602033", ruleName: "高新技术-所得税优惠规则", industry: "服务行业", taxType: "企业所得税", taxpayerType: "一般纳税人", taxMethod: "查账征收", priority: "中", status: "active", formula: "应纳税所得额 x 15%", description: "适用于认定为高新技术企业的企业所得税优惠税率15%", createdDate: "2026-02-10", updatedDate: "2026-02-12", operator: "李会计" },
  { id: "34", ruleId: "TR2602034", ruleName: "建筑行业-预缴所得税规则", industry: "建筑行业", taxType: "企业所得税", taxpayerType: "一般纳税人", taxMethod: "预缴计税", priority: "中", status: "disabled", formula: "营业收入 x 0.2%", description: "适用于跨区域建筑项目的企业所得税预缴", createdDate: "2026-02-11", updatedDate: "2026-02-11", operator: "张会计" },
  { id: "35", ruleId: "TR2602035", ruleName: "车船税-通用规则", industry: "全部行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从量计征", priority: "低", status: "active", formula: "车辆数量 x 适用年税额", description: "适用于企业名下车辆的车船税年度计算", createdDate: "2026-02-12", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "36", ruleId: "TR2602036", ruleName: "个税-股息红利规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "一般纳税人", taxMethod: "代扣代缴", priority: "低", status: "active", formula: "股息红利 x 20%", description: "适用于个人取得的股息红利所得个人所得税", createdDate: "2026-02-13", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "37", ruleId: "TR2602037", ruleName: "研发费用-加计扣除规则", industry: "全部行业", taxType: "企业所得税", taxpayerType: "一般纳税人", taxMethod: "查账征收", priority: "中", status: "active", formula: "研发费用 x 100% 加计扣除", description: "适用于企业研发费用企业所得税加计扣除优惠政策", createdDate: "2026-02-14", updatedDate: "2026-02-18", operator: "张会计" },
  { id: "38", ruleId: "TR2602038", ruleName: "小规模-季度免征增值税", industry: "全部行业", taxType: "增值税", taxpayerType: "小规模纳税人", taxMethod: "简易计税", priority: "高", status: "active", formula: "季度销售额<=30万免征", description: "小规模纳税人季度销售额不超过30万元免征增值税", createdDate: "2026-02-15", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "39", ruleId: "TR2602039", ruleName: "契税-房产交易规则", industry: "全部行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从价计征", priority: "低", status: "review", formula: "成交价格 x 3%", description: "适用于企业购买不动产的契税计算", createdDate: "2026-02-16", updatedDate: "2026-02-19", operator: "李会计" },
  { id: "40", ruleId: "TR2602040", ruleName: "个税-特许权使用费规则", industry: "全部行业", taxType: "个人所得税", taxpayerType: "一般纳税人", taxMethod: "预扣预缴", priority: "低", status: "active", formula: "每次收入(1-20%) x 20%", description: "适用于特许权使用费所得的个人所得税预扣预缴", createdDate: "2026-02-17", updatedDate: "2026-02-20", operator: "张会计" },
  { id: "41", ruleId: "TR2602041", ruleName: "环保税-废气排放规则", industry: "建筑行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从量计征", priority: "低", status: "active", formula: "污染当量数 x 适用税额", description: "适用于排放废气的企业环保税计算", createdDate: "2026-02-18", updatedDate: "2026-02-20", operator: "李会计" },
  { id: "42", ruleId: "TR2602042", ruleName: "耕地占用税规则", industry: "建筑行业", taxType: "其他税种", taxpayerType: "一般纳税人", taxMethod: "从量计征", priority: "低", status: "disabled", formula: "实际占用面积 x 适用税额", description: "适用于占用耕地建设的企业一次性缴纳耕地占用税", createdDate: "2026-02-19", updatedDate: "2026-02-20", operator: "张会计" },
]

const PAGE_SIZE = 20

const statusConfig: Record<RuleStatus, { label: string; className: string }> = {
  active: { label: "启用", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  review: { label: "待审核", className: "bg-amber-50 text-amber-700 border-amber-200" },
  disabled: { label: "禁用", className: "bg-red-50 text-red-700 border-red-200" },
}

const PIE_COLORS = ["var(--color-chart-2)", "var(--color-chart-4)", "var(--color-chart-5)"]
const BAR_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

// ---- Component ----
export function TaxRules() {
  // Filter state
  const [industryFilter, setIndustryFilter] = useState("all")
  const [taxTypeFilter, setTaxTypeFilter] = useState("all")
  const [taxpayerTypeFilter, setTaxpayerTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [keyword, setKeyword] = useState("")
  // Advanced
  const [taxMethodFilter, setTaxMethodFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [operatorFilter, setOperatorFilter] = useState("all")

  // Table state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRecord, setDetailRecord] = useState<TaxRuleRecord | null>(null)
  const [rules, setRules] = useState<TaxRuleRecord[]>(allRules)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Unique values for filters
  const industries = [...new Set(allRules.map((r) => r.industry))]
  const taxTypes = [...new Set(allRules.map((r) => r.taxType))]
  const taxpayerTypes = [...new Set(allRules.map((r) => r.taxpayerType))]
  const taxMethods = [...new Set(allRules.map((r) => r.taxMethod))]
  const priorities = [...new Set(allRules.map((r) => r.priority))]
  const operators = [...new Set(allRules.map((r) => r.operator))]

  // Computed filtered data
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      if (industryFilter !== "all" && r.industry !== industryFilter) return false
      if (taxTypeFilter !== "all" && r.taxType !== taxTypeFilter) return false
      if (taxpayerTypeFilter !== "all" && r.taxpayerType !== taxpayerTypeFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (showAdvanced) {
        if (taxMethodFilter !== "all" && r.taxMethod !== taxMethodFilter) return false
        if (priorityFilter !== "all" && r.priority !== priorityFilter) return false
        if (operatorFilter !== "all" && r.operator !== operatorFilter) return false
      }
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
  }, [rules, industryFilter, taxTypeFilter, taxpayerTypeFilter, statusFilter, keyword, showAdvanced, taxMethodFilter, priorityFilter, operatorFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE))
  const paged = filteredRules.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Stats
  const stats = useMemo(() => {
    const active = rules.filter((r) => r.status === "active").length
    const review = rules.filter((r) => r.status === "review").length
    const disabled = rules.filter((r) => r.status === "disabled").length

    const taxTypeMap: Record<string, number> = {}
    rules.forEach((r) => {
      taxTypeMap[r.taxType] = (taxTypeMap[r.taxType] || 0) + 1
    })

    return { active, review, disabled, taxTypeMap }
  }, [rules])

  // Chart data
  const statusPieData = [
    { name: "启用", value: stats.active },
    { name: "待审核", value: stats.review },
    { name: "禁用", value: stats.disabled },
  ].filter((d) => d.value > 0)

  const taxTypeBarData = useMemo(() => {
    return Object.entries(stats.taxTypeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
  }, [stats.taxTypeMap])

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
    setTaxTypeFilter("all")
    setTaxpayerTypeFilter("all")
    setStatusFilter("all")
    setKeyword("")
    setTaxMethodFilter("all")
    setPriorityFilter("all")
    setOperatorFilter("all")
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
            <p className="mt-2 text-xs font-medium text-muted-foreground">税种规则分布</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {Object.entries(stats.taxTypeMap).map(([taxType, count]) => (
                <span key={taxType} className="rounded-md border border-border bg-muted/40 px-3 py-1.5" suppressHydrationWarning>
                  {taxType}{"("}<strong className="font-mono">{count}</strong>{"条)"}
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
              <p className="mb-1 text-center text-xs font-medium text-muted-foreground">税种分布</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={taxTypeBarData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {taxTypeBarData.map((_, i) => (
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
          多维度规则筛选区（精准定位，适配多场景查询）
        </h3>

        {/* Basic filters */}
        <div className="mb-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">基础筛选</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              <Label className="text-xs">税种类型</Label>
              <Select value={taxTypeFilter} onValueChange={setTaxTypeFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {taxTypes.map((s) => (
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
                <Label className="text-xs">计税方式</Label>
                <Select value={taxMethodFilter} onValueChange={setTaxMethodFilter}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {taxMethods.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">规则优先级</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {priorities.map((s) => (
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
            新增算税规则
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
          算税规则核心列表（结构化展示，支持行级操作）
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
                <TableHead className="text-xs">税种类型</TableHead>
                <TableHead className="text-xs">纳税人类型</TableHead>
                <TableHead className="text-xs">规则状态</TableHead>
                <TableHead className="text-right text-xs">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    未找到匹配的算税规则记录
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
                    <TableCell className="text-xs">{rule.taxType}</TableCell>
                    <TableCell className="text-xs">{rule.taxpayerType}</TableCell>
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
                            <span className="text-xs font-bold">{"?"}</span>
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
                            <span className="text-xs font-bold">{"x"}</span>
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
          批量操作区（勾选后激活，提升规则管理效率）
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
          规则版本管理区（防误改，支持回滚）
        </h3>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"规则库版本："}<strong className="text-foreground">V2.1</strong>
            </span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              {"最近更新："}<strong className="text-foreground">2026-02-20 17:10</strong>
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
              {"算税规则详情 - "}{detailRecord?.ruleId}
            </DialogTitle>
            <DialogDescription>
              查看算税规则的完整配置信息
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
                <span className="font-medium text-muted-foreground">税种类型</span>
                <span>{detailRecord.taxType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">纳税人类型</span>
                <span>{detailRecord.taxpayerType}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">计税方式</span>
                <span className="font-medium text-primary">{detailRecord.taxMethod}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">规则优先级</span>
                <Badge variant="outline" className={
                  detailRecord.priority === "高" ? "border-red-200 bg-red-50 text-red-700" :
                  detailRecord.priority === "中" ? "border-amber-200 bg-amber-50 text-amber-700" :
                  "border-muted bg-muted/50 text-muted-foreground"
                }>
                  {detailRecord.priority}
                </Badge>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">计算公式</span>
                <span className="rounded-md border border-border bg-muted/30 px-2 py-1 font-mono text-xs leading-relaxed">{detailRecord.formula}</span>
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
