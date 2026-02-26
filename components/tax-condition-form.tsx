"use client"

import { useState } from "react"
import {
  Target,
  ChevronDown,
  Sparkles,
  BookOpen,
  RotateCcw,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const periodOptions = [
  "2026年02月（月度）",
  "2026年01月（月度）",
  "2025年12月（月度）",
  "2025年Q4（季度）",
]

const dataSourceOptions = [
  "自动读取账套分录数据（已读取12笔）",
  "手动导入分录数据",
  "从Excel导入",
]

interface TaxType {
  id: string
  name: string
  checked: boolean
  disabled: boolean
  note?: string
}

const defaultTaxTypes: TaxType[] = [
  { id: "vat", name: "增值税", checked: true, disabled: false },
  { id: "cit", name: "企业所得税（预缴）", checked: true, disabled: false },
  { id: "urban", name: "城市维护建设税", checked: false, disabled: true, note: "随增值税免征" },
  { id: "edu", name: "教育费附加", checked: false, disabled: true, note: "随增值税免征" },
  { id: "stamp", name: "印花税", checked: false, disabled: true, note: "未触发计税条件" },
]

interface TaxConditionFormProps {
  onCalculate: () => void
}

export function TaxConditionForm({ onCalculate }: TaxConditionFormProps) {
  const [period, setPeriod] = useState(periodOptions[0])
  const [dataSource, setDataSource] = useState(dataSourceOptions[0])
  const [taxTypes, setTaxTypes] = useState<TaxType[]>(defaultTaxTypes)

  const handleToggleTax = (id: string) => {
    setTaxTypes((prev) =>
      prev.map((t) =>
        t.id === id && !t.disabled ? { ...t, checked: !t.checked } : t
      )
    )
  }

  const handleReset = () => {
    setPeriod(periodOptions[0])
    setDataSource(dataSourceOptions[0])
    setTaxTypes(defaultTaxTypes)
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          算税基础条件
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          AI智能预填+政策联动
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* 核算基础 */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            核算基础
          </p>
        </div>

        {/* 核算周期 */}
        <FormField label="核算周期">
          <SelectBox value={period} options={periodOptions} onChange={setPeriod} />
        </FormField>

        {/* 数据来源 */}
        <FormField label="数据来源">
          <SelectBox value={dataSource} options={dataSourceOptions} onChange={setDataSource} />
        </FormField>

        {/* 适用政策 */}
        <FormField label="适用政策">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-2.5">
            <Info className="h-4 w-4 shrink-0 text-amber-600" />
            <span className="text-sm text-amber-800">
              {"小规模纳税人月销＜10万免增值税（2026版）"}
            </span>
            <button className="ml-auto shrink-0 text-xs font-medium text-primary hover:underline">
              {"详情 ▸"}
            </button>
          </div>
        </FormField>

        {/* 选择税种 */}
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-foreground">
            选择税种
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              （自动关联增值税状态）
            </span>
          </label>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {taxTypes.map((tax) => (
                <label
                  key={tax.id}
                  className={`flex items-center gap-2 text-sm ${
                    tax.disabled
                      ? "cursor-not-allowed text-muted-foreground/60"
                      : "cursor-pointer text-foreground"
                  }`}
                >
                  <Checkbox
                    checked={tax.checked}
                    disabled={tax.disabled}
                    onCheckedChange={() => handleToggleTax(tax.id)}
                  />
                  <span>{tax.name}</span>
                  {tax.note && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {tax.note}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 pt-1">
          <Button className="gap-2" onClick={onCalculate}>
            <Sparkles className="h-4 w-4" />
            一键计算
          </Button>
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            查看算税规则
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            重置条件
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
