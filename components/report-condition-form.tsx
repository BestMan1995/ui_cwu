"use client"

import { useState } from "react"
import {
  Target,
  ChevronDown,
  Sparkles,
  ClipboardList,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const reportTypeOptions = [
  "利润表",
  "资产负债表",
  "增值税申报表",
  "现金流量表",
]

const periodOptions = [
  "2026年02月（月度）",
  "2026年01月（月度）",
  "2025年Q4（季度）",
  "2025年度（年度）",
]

const dataSourceOptions = [
  "自动读取账套分录+税种计算数据",
  "手动选择分录范围",
  "从Excel导入汇总数据",
]

const displayOptions = [
  "简洁版（会计模式）",
  "专业版（含明细科目）",
  "税务申报版",
]

interface AdvancedOption {
  id: string
  label: string
  checked: boolean
}

const defaultAdvancedOptions: AdvancedOption[] = [
  { id: "check-relation", label: "自动校验报表勾稽关系", checked: true },
  { id: "mark-core", label: "标注核心数据（净利润/资产总计）", checked: true },
  { id: "trace-notes", label: "生成数据溯源备注", checked: true },
  { id: "compare-history", label: "包含往期对比数据（近3期）", checked: false },
]

interface ReportConditionFormProps {
  onGenerate: () => void
}

export function ReportConditionForm({ onGenerate }: ReportConditionFormProps) {
  const [reportType, setReportType] = useState(reportTypeOptions[0])
  const [period, setPeriod] = useState(periodOptions[0])
  const [dataSource, setDataSource] = useState(dataSourceOptions[0])
  const [display, setDisplay] = useState(displayOptions[0])
  const [advancedOptions, setAdvancedOptions] = useState(defaultAdvancedOptions)

  const handleToggle = (id: string) => {
    setAdvancedOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, checked: !o.checked } : o))
    )
  }

  const handleReset = () => {
    setReportType(reportTypeOptions[0])
    setPeriod(periodOptions[0])
    setDataSource(dataSourceOptions[0])
    setDisplay(displayOptions[0])
    setAdvancedOptions(defaultAdvancedOptions)
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          报表生成条件
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          AI智能适配+账套联动
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* 基础配置 label */}
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          基础配置
        </p>

        {/* 报表类型 */}
        <FormField label="报表类型">
          <SelectBox value={reportType} options={reportTypeOptions} onChange={setReportType} />
          <p className="mt-1 text-xs text-muted-foreground">
            {"支持切换：" + reportTypeOptions.join(" / ")}
          </p>
        </FormField>

        {/* 报表周期 */}
        <FormField label="报表周期">
          <SelectBox value={period} options={periodOptions} onChange={setPeriod} />
        </FormField>

        {/* 数据来源 */}
        <FormField label="数据来源">
          <SelectBox value={dataSource} options={dataSourceOptions} onChange={setDataSource} />
        </FormField>

        {/* 展示维度 */}
        <FormField label="展示维度">
          <SelectBox value={display} options={displayOptions} onChange={setDisplay} />
        </FormField>

        {/* 高级配置 */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-foreground">
            高级配置
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              （可选）
            </span>
          </label>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {advancedOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                >
                  <Checkbox
                    checked={opt.checked}
                    onCheckedChange={() => handleToggle(opt.id)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 pt-1">
          <Button className="gap-2" onClick={onGenerate}>
            <Sparkles className="h-4 w-4" />
            一键生成报表
          </Button>
          <Button variant="outline" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            查看报表模板
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            重置配置
          </Button>
        </div>
      </div>
    </section>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function SelectBox({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-2.5 pr-10 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
