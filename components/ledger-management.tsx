"use client"

import { useState } from "react"
import {
  FileText,
  Receipt,
  PenLine,
  Calculator,
  BarChart3,
  AlertTriangle,
  Lock,
  Wrench,
  ClipboardList,
  Building2,
  ChevronRight,
  Search,
  Download,
  RefreshCw,
  Plus,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Database,
  ArrowUpDown,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type SubTab =
  | "info"
  | "invoice"
  | "journal"
  | "tax"
  | "report"
  | "risk"
  | "permission"
  | "maintenance"
  | "log"

const subTabs: { key: SubTab; label: string; icon: typeof FileText }[] = [
  { key: "info", label: "账套基础信息", icon: Building2 },
  { key: "invoice", label: "发票台账", icon: Receipt },
  { key: "journal", label: "分录台账", icon: PenLine },
  { key: "tax", label: "计税台账", icon: Calculator },
  { key: "report", label: "报表台账", icon: BarChart3 },
  { key: "risk", label: "风险台账", icon: AlertTriangle },
  { key: "permission", label: "权限管理", icon: Lock },
  { key: "maintenance", label: "数据维护", icon: Wrench },
  { key: "log", label: "操作日志", icon: ClipboardList },
]

/* ==================== 账套基础信息 ==================== */
function LedgerInfo() {
  const fields = [
    { label: "账套名称", value: "A商贸公司（小规模）" },
    { label: "统一社会信用代码", value: "91310000MA1FL8XXXX" },
    { label: "纳税人类型", value: "小规模纳税人" },
    { label: "所属行业", value: "批发和零售业" },
    { label: "核算准则", value: "小企业会计准则" },
    { label: "纳税周期", value: "季报" },
    { label: "账套创建日期", value: "2025-01-15" },
    { label: "最近操作日期", value: "2026-02-25" },
    { label: "负责代账会计", value: "张会计" },
    { label: "联系方式", value: "138-xxxx-xxxx" },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            企业基本信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {fields.map((f) => (
              <div key={f.label} className="flex items-baseline gap-3">
                <span className="shrink-0 text-sm text-muted-foreground">{f.label}</span>
                <span className="border-b border-dashed border-border flex-1" />
                <span className="shrink-0 text-sm font-medium text-foreground">{f.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4 text-primary" />
            数据统计概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "发票总数", value: "156", unit: "张", color: "text-blue-600" },
              { label: "分录总数", value: "312", unit: "条", color: "text-emerald-600" },
              { label: "报表数量", value: "8", unit: "份", color: "text-amber-600" },
              { label: "风险记录", value: "3", unit: "条", color: "text-red-500" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center"
              >
                <p className={`text-2xl font-bold ${s.color}`}>
                  {s.value}
                  <span className="ml-0.5 text-sm font-normal text-muted-foreground">{s.unit}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ==================== 通用台账表格 ==================== */
function LedgerTable({
  title,
  icon: Icon,
  columns,
  rows,
}: {
  title: string
  icon: typeof FileText
  columns: string[]
  rows: (string | React.ReactNode)[][]
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索..."
                className="h-8 w-48 pl-8 text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Filter className="h-3 w-3" />
              筛选
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="h-3 w-3" />
              导出
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((col) => (
                  <TableHead key={col} className="h-9 text-xs font-semibold text-foreground/80">
                    <span className="flex items-center gap-1">
                      {col}
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                    </span>
                  </TableHead>
                ))}
                <TableHead className="h-9 w-20 text-xs font-semibold text-foreground/80">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/20">
                  {row.map((cell, j) => (
                    <TableCell key={j} className="py-2.5 text-xs">
                      {cell}
                    </TableCell>
                  ))}
                  <TableCell className="py-2.5">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            共 {rows.length} 条记录
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <Button
                key={p}
                variant={p === 1 ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 text-xs"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ==================== 发票台账 ==================== */
function InvoiceLedger() {
  const StatusBadge = ({ status }: { status: string }) => {
    const m: Record<string, { cls: string; icon: typeof CheckCircle2 }> = {
      "已入账": { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
      "待确认": { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      "已作废": { cls: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
    }
    const cfg = m[status] || m["待确认"]
    return (
      <Badge variant="outline" className={`gap-1 text-[11px] font-normal ${cfg.cls}`}>
        <cfg.icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const rows: (string | React.ReactNode)[][] = [
    ["FP-20260201-001", "增值税普通发票", "2026-02-01", "A供应商", "15,000.00", <StatusBadge key="s1" status="已入账" />],
    ["FP-20260203-002", "增值税普通发票", "2026-02-03", "B物流公司", "3,200.00", <StatusBadge key="s2" status="已入账" />],
    ["FP-20260205-003", "增值税普通发票", "2026-02-05", "C采购商", "28,500.00", <StatusBadge key="s3" status="待确认" />],
    ["FP-20260210-004", "增值税普通发票", "2026-02-10", "D客户", "8,800.00", <StatusBadge key="s4" status="已入账" />],
    ["FP-20260215-005", "增值税普通发票", "2026-02-15", "E公司", "12,000.00", <StatusBadge key="s5" status="已作废" />],
  ]

  return (
    <LedgerTable
      title="发票台账"
      icon={Receipt}
      columns={["发票编号", "发票类型", "开票日期", "交易对方", "金额(元)", "状态"]}
      rows={rows}
    />
  )
}

/* ==================== 分录台账 ==================== */
function JournalLedger() {
  const rows: (string | React.ReactNode)[][] = [
    ["FL-20260201-001", "2026-02-01", "销售收入", "主营业务收入", "借", <span key="a1" className="font-mono text-emerald-600">15,000.00</span>],
    ["FL-20260201-002", "2026-02-01", "销售收入", "应收账款", "贷", <span key="a2" className="font-mono text-red-500">15,000.00</span>],
    ["FL-20260205-003", "2026-02-05", "采购入库", "库存商品", "借", <span key="a3" className="font-mono text-emerald-600">28,500.00</span>],
    ["FL-20260205-004", "2026-02-05", "采购入库", "应付账款", "贷", <span key="a4" className="font-mono text-red-500">28,500.00</span>],
    ["FL-20260210-005", "2026-02-10", "办公费用", "管理费用", "借", <span key="a5" className="font-mono text-emerald-600">3,200.00</span>],
  ]

  return (
    <LedgerTable
      title="分录台账"
      icon={PenLine}
      columns={["分录编号", "日期", "摘要", "科目", "借/贷", "金额(元)"]}
      rows={rows}
    />
  )
}

/* ==================== 计税台账 ==================== */
function TaxLedger() {
  const rows: (string | React.ReactNode)[][] = [
    ["2026年1月", "增值税", "季报", "0.00", <Badge key="t1" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">免征</Badge>],
    ["2026年1月", "城建税", "季报", "0.00", <Badge key="t2" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">免征</Badge>],
    ["2026年1月", "企业所得税", "季报", "300.00", <Badge key="t3" variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">预缴</Badge>],
    ["2026年2月", "增值税", "季报", "0.00", <Badge key="t4" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">免征</Badge>],
    ["2026年2月", "企业所得税", "季报", "300.00", <Badge key="t5" variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">预缴</Badge>],
  ]

  return (
    <LedgerTable
      title="计税台账"
      icon={Calculator}
      columns={["所属期间", "税种", "申报周期", "应纳税额(元)", "状态"]}
      rows={rows}
    />
  )
}

/* ==================== 报表台账 ==================== */
function ReportLedger() {
  const rows: (string | React.ReactNode)[][] = [
    ["RPT-202602-001", "利润表", "2026年2月", "2026-02-25", <Badge key="r1" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">已归档</Badge>],
    ["RPT-202602-002", "资产负债表", "2026年2月", "2026-02-25", <Badge key="r2" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[11px]">待审核</Badge>],
    ["RPT-202601-001", "利润表", "2026年1月", "2026-01-31", <Badge key="r3" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">已归档</Badge>],
    ["RPT-202601-002", "资产负债表", "2026年1月", "2026-01-31", <Badge key="r4" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">已归档</Badge>],
  ]

  return (
    <LedgerTable
      title="报表台账"
      icon={BarChart3}
      columns={["报表编号", "报表类型", "所属期间", "生成日期", "状态"]}
      rows={rows}
    />
  )
}

/* ==================== 风险台账 ==================== */
function RiskLedger() {
  const LevelBadge = ({ level }: { level: string }) => {
    const m: Record<string, string> = {
      "高风险": "bg-red-50 text-red-600 border-red-200",
      "中风险": "bg-amber-50 text-amber-700 border-amber-200",
      "低风险": "bg-blue-50 text-blue-600 border-blue-200",
    }
    return <Badge variant="outline" className={`text-[11px] ${m[level]}`}>{level}</Badge>
  }

  const rows: (string | React.ReactNode)[][] = [
    ["RSK-20260225-001", "发票连号", <LevelBadge key="l1" level="高风险" />, "2026-02-25", <Badge key="s1" variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">整改中</Badge>],
    ["RSK-20260225-002", "税负异常", <LevelBadge key="l2" level="中风险" />, "2026-02-25", <Badge key="s2" variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">整改中</Badge>],
    ["RSK-20260120-003", "成本占比异常", <LevelBadge key="l3" level="低风险" />, "2026-01-20", <Badge key="s3" variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">已闭环</Badge>],
  ]

  return (
    <LedgerTable
      title="风险台账"
      icon={AlertTriangle}
      columns={["风险编号", "风险类型", "风险等级", "发现日期", "处置状态"]}
      rows={rows}
    />
  )
}

/* ==================== 权限管理 ==================== */
function PermissionManager() {
  const users = [
    { name: "张会计", role: "主办会计", perms: ["全部模块"], status: "在线" },
    { name: "李助理", role: "助理会计", perms: ["发票解析", "分录台账"], status: "离线" },
    { name: "王主管", role: "审核主管", perms: ["报表审核", "风险审批"], status: "在线" },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            权限管理
          </CardTitle>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Plus className="h-3 w-3" />
            添加用户
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.name}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {u.name[0]}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                      u.status === "在线" ? "bg-emerald-500" : "bg-muted-foreground/40"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {u.perms.map((p) => (
                    <Badge
                      key={p}
                      variant="outline"
                      className="bg-primary/5 text-[11px] text-primary border-primary/20"
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  编辑
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ==================== 数据维护 ==================== */
function DataMaintenance() {
  const actions = [
    { label: "数据备份", desc: "备份当前账套所有数据至本地", icon: Database, time: "上次备份：2026-02-24 18:00" },
    { label: "数据恢复", desc: "从备份文件恢复账套数据", icon: RefreshCw, time: "最近恢复：无" },
    { label: "期末结转", desc: "执行当期损益结转操作", icon: ArrowUpDown, time: "上次结转：2026-01-31" },
    { label: "数据校验", desc: "全量校验账套数据一致性", icon: CheckCircle2, time: "上次校验：2026-02-25 10:30" },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench className="h-4 w-4 text-primary" />
          数据维护
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((a) => (
            <div
              key={a.label}
              className="group rounded-lg border border-border/60 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <a.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                >
                  执行
                </Button>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground/70">{a.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ==================== 操作日志 ==================== */
function OperationLogLedger() {
  const logs = [
    { time: "2026-02-25 14:30:22", user: "张会计", action: "生成利润表", module: "报表生成", result: "成功" },
    { time: "2026-02-25 14:28:15", user: "张会计", action: "一键算税", module: "税种计算", result: "成功" },
    { time: "2026-02-25 14:25:03", user: "张会计", action: "生成分录（批量）", module: "自动分录", result: "成功" },
    { time: "2026-02-25 14:20:10", user: "张会计", action: "上传发票12张", module: "发票解析", result: "成功" },
    { time: "2026-02-25 10:30:00", user: "系统", action: "数据一致性校验", module: "数据维护", result: "通过" },
    { time: "2026-02-24 18:00:00", user: "系统", action: "自动备份", module: "数据维护", result: "成功" },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4 text-primary" />
            操作日志
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="搜索日志..." className="h-8 w-48 text-xs" />
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="h-3 w-3" />
              导出
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-border/40 bg-muted/10 px-4 py-2.5"
            >
              <span className="shrink-0 font-mono text-xs text-muted-foreground">{log.time}</span>
              <Badge variant="outline" className="shrink-0 text-[11px] bg-primary/5 text-primary border-primary/20">
                {log.module}
              </Badge>
              <span className="flex-1 text-xs text-foreground">{log.action}</span>
              <span className="text-xs text-muted-foreground">{log.user}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px]",
                  log.result === "成功" || log.result === "通过"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                )}
              >
                {log.result}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ==================== Sub-key to SubTab mapping ==================== */
const subKeyToTab: Record<string, SubTab> = {
  "ledger-info": "info",
  "ledger-invoice": "invoice",
  "ledger-entry": "journal",
  "ledger-tax": "tax",
  "ledger-report": "report",
  "ledger-risk": "risk",
  "ledger-permission": "permission",
  "ledger-maintenance": "maintenance",
  "ledger-log": "log",
}

/* ==================== Main Component ==================== */
interface LedgerManagementProps {
  activeSubKey?: string
}

export function LedgerManagement({ activeSubKey }: LedgerManagementProps) {
  const resolvedTab: SubTab = (activeSubKey && subKeyToTab[activeSubKey]) || "info"

  const contentMap: Record<SubTab, React.ReactNode> = {
    info: <LedgerInfo />,
    invoice: <InvoiceLedger />,
    journal: <JournalLedger />,
    tax: <TaxLedger />,
    report: <ReportLedger />,
    risk: <RiskLedger />,
    permission: <PermissionManager />,
    maintenance: <DataMaintenance />,
    log: <OperationLogLedger />,
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>账套管理</span>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">
          {subTabs.find((t) => t.key === resolvedTab)?.label}
        </span>
      </div>

      {/* Content */}
      {contentMap[resolvedTab]}
    </div>
  )
}
