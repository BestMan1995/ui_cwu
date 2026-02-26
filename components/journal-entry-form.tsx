"use client"

import { useState } from "react"
import {
  Target,
  ChevronDown,
  Sparkles,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const invoiceOptions = [
  "增值税普通发票-2026-02-20-办公费1000元",
  "餐饮发票-2026-02-19-招待费500元",
  "增值税普通发票-2026-02-18-差旅费2300元",
  "交通费发票-2026-02-17-交通费150元",
]

const standardOptions = [
  "小企业会计准则（2024版）",
  "企业会计准则（2024版）",
  "政府会计准则",
]

const entryTypeOptions = [
  "费用类分录（AI自动识别）",
  "收入类分录",
  "资产类分录",
  "负债类分录",
]

interface JournalEntryFormProps {
  onGenerate: () => void
}

export function JournalEntryForm({ onGenerate }: JournalEntryFormProps) {
  const [selectedInvoice, setSelectedInvoice] = useState(invoiceOptions[0])
  const [standard, setStandard] = useState(standardOptions[0])
  const [entryType, setEntryType] = useState(entryTypeOptions[0])

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          分录生成条件
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          AI智能推荐
        </span>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* 选择发票 */}
        <FormField label="选择发票">
          <SelectBox
            value={selectedInvoice}
            options={invoiceOptions}
            onChange={setSelectedInvoice}
          />
        </FormField>

        {/* 企业类型 - 不可修改 */}
        <FormField label="企业类型">
          <div className="flex items-center rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
            小规模纳税人 - 商贸行业
            <span className="ml-auto text-xs text-muted-foreground/60">
              不可修改，关联账套
            </span>
          </div>
        </FormField>

        {/* 核算准则 */}
        <FormField label="核算准则">
          <SelectBox
            value={standard}
            options={standardOptions}
            onChange={setStandard}
          />
        </FormField>

        {/* 分录类型 */}
        <FormField label="分录类型">
          <SelectBox
            value={entryType}
            options={entryTypeOptions}
            onChange={setEntryType}
          />
        </FormField>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 pt-2">
          <Button className="gap-2" onClick={onGenerate}>
            <Sparkles className="h-4 w-4" />
            一键生成分录
          </Button>
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            查看分录规则
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
