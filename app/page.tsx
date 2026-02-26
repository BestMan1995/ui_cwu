"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AppSidebar, type PageKey } from "@/components/app-sidebar"
import { InvoiceUpload } from "@/components/invoice-upload"
import { ParseResults } from "@/components/parse-results"
import { IssuePanel } from "@/components/issue-panel"
import { BottomBar } from "@/components/bottom-bar"
import { OperationLog } from "@/components/operation-log"
import { JournalEntryForm } from "@/components/journal-entry-form"
import { JournalEntryResults } from "@/components/journal-entry-results"
import { JournalAiPanel } from "@/components/journal-ai-panel"
import { JournalBottomBar } from "@/components/journal-bottom-bar"
import { TaxConditionForm } from "@/components/tax-condition-form"
import { TaxResults } from "@/components/tax-results"
import { TaxTrendPanel } from "@/components/tax-trend-panel"
import { TaxOperations } from "@/components/tax-operations"
import { TaxBottomBar } from "@/components/tax-bottom-bar"
import { ReportConditionForm } from "@/components/report-condition-form"
import { ReportPreview } from "@/components/report-preview"
import { ReportTracePanel } from "@/components/report-trace-panel"
import { ReportOperations } from "@/components/report-operations"
import { ReportBottomBar } from "@/components/report-bottom-bar"
import { RiskConditionForm } from "@/components/risk-condition-form"
import { RiskOverview } from "@/components/risk-overview"
import { RiskDetailPanel } from "@/components/risk-detail-panel"
import { RiskOperations } from "@/components/risk-operations"
import { RiskBottomBar } from "@/components/risk-bottom-bar"
import { LedgerManagement } from "@/components/ledger-management"
import { InvoiceHistory } from "@/components/invoice-history"
import { JournalHistory } from "@/components/journal-history"
import { JournalRules } from "@/components/journal-rules"
import { TaxResultHistory } from "@/components/tax-result-history"
import { TaxRules } from "@/components/tax-rules"
import { ReportHistory } from "@/components/report-history"
import { Shield } from "lucide-react"

// Default sub-key for each page
const defaultSubKeys: Record<PageKey, string> = {
  invoice: "invoice-upload",
  journal: "journal-pending",
  tax: "tax-period",
  report: "report-period",
  risk: "risk-period",
  ledger: "ledger-info",
}

// Sub-key label map for the tab header
const subKeyLabels: Record<string, string> = {
  "invoice-upload": "发票上传解析",
  "invoice-history": "历史解析台账",
  "journal-pending": "待生成分录",
  "journal-done": "已生成分录",
  "journal-rules": "分录规则管理",
  "tax-period": "周期算税",
  "tax-result": "算税结果",
  "tax-rules": "算税规则管理",
  "report-period": "周期报表生成",
  "report-history": "历史报表台账",
  "report-templates": "报表模板管理",
  "risk-period": "周期风险检测",
  "risk-ledger": "风险处置台账",
  "risk-rules": "风控规则管理",
  "ledger-info": "账套基础信息",
  "ledger-invoice": "发票台账",
  "ledger-entry": "分录台账",
  "ledger-tax": "计税台账",
  "ledger-report": "报表台账",
  "ledger-risk": "风险台账",
  "ledger-permission": "权限管理",
  "ledger-maintenance": "数据维护",
  "ledger-log": "操作日志",
}

const tabLabels: Record<PageKey, string> = {
  invoice: "发票智能解析",
  journal: "自动分录生成",
  tax: "税种智能计算",
  report: "报表生成",
  risk: "财务风险智能预警",
  ledger: "账套管理",
}

const ruleVersionMap: Record<PageKey, string> = {
  invoice: "V1.0",
  journal: "V1.2",
  tax: "2026.02",
  report: "2026.02",
  risk: "2026.02",
  ledger: "2026.02",
}

export default function Page() {
  const [activePage, setActivePage] = useState<PageKey>("tax")
  const [activeSubKey, setActiveSubKey] = useState("tax-period")
  const [activeTab, setActiveTab] = useState<"main" | "log">("main")
  const [entryGenerated, setEntryGenerated] = useState(false)
  const [taxCalculated, setTaxCalculated] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [showTrace, setShowTrace] = useState(false)
  const [riskDetected, setRiskDetected] = useState(false)
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null)

  function handlePageChange(page: PageKey) {
    setActivePage(page)
    setActiveSubKey(defaultSubKeys[page])
    setActiveTab("main")
  }

  function handleSubChange(page: PageKey, subKey: string) {
    setActivePage(page)
    setActiveSubKey(subKey)
    setActiveTab("main")
  }

  // Determine which content to render based on activeSubKey
  function renderContent() {
    // Operation log tab overrides everything
    if (activeTab === "log") {
      return (
        <>
          <h2 className="text-base font-semibold text-foreground">
            操作日志
          </h2>
          <OperationLog />
        </>
      )
    }

    // Invoice pages
    if (activeSubKey === "invoice-upload") {
      return (
        <>
          <InvoiceUpload onParse={() => {}} />
          <ParseResults />
          <IssuePanel />
          <BottomBar />
        </>
      )
    }
    if (activeSubKey === "invoice-history") {
      return <InvoiceHistory />
    }

    // Journal pages
    if (activeSubKey === "journal-pending") {
      return (
        <>
          <JournalEntryForm onGenerate={() => setEntryGenerated(true)} />
          <JournalEntryResults generated={entryGenerated} />
          <JournalAiPanel generated={entryGenerated} />
          <JournalBottomBar
            onBack={() => handleSubChange("invoice", "invoice-upload")}
            onRefresh={() => {
              setEntryGenerated(false)
              setTimeout(() => setEntryGenerated(true), 100)
            }}
          />
        </>
      )
    }
    if (activeSubKey === "journal-done") {
      return <JournalHistory />
    }
    if (activeSubKey === "journal-rules") {
      return <JournalRules />
    }

    // Tax pages
    if (activeSubKey === "tax-period") {
      return (
        <>
          <TaxConditionForm onCalculate={() => setTaxCalculated(true)} />
          <TaxResults calculated={taxCalculated} />
          <TaxTrendPanel calculated={taxCalculated} />
          <TaxOperations calculated={taxCalculated} />
          <TaxBottomBar
            onBack={() => handleSubChange("journal", "journal-pending")}
            onRecalculate={() => {
              setTaxCalculated(false)
              setTimeout(() => setTaxCalculated(true), 100)
            }}
          />
        </>
      )
    }
    if (activeSubKey === "tax-result") {
      return <TaxResultHistory />
    }
    if (activeSubKey === "tax-rules") {
      return <TaxRules />
    }

    // Report pages
    if (activeSubKey === "report-period") {
      return (
        <>
          <ReportConditionForm onGenerate={() => setReportGenerated(true)} />
          <ReportPreview
            generated={reportGenerated}
            onShowTrace={() => setShowTrace(!showTrace)}
          />
          <ReportTracePanel visible={reportGenerated && showTrace} />
          <ReportOperations generated={reportGenerated} />
          <ReportBottomBar
            onBack={() => handleSubChange("tax", "tax-period")}
            onRegenerate={() => {
              setReportGenerated(false)
              setShowTrace(false)
              setTimeout(() => setReportGenerated(true), 100)
            }}
          />
        </>
      )
    }
    if (activeSubKey === "report-history") {
      return <ReportHistory />
    }
    if (activeSubKey === "report-templates") {
      return <PlaceholderContent label="报表模板管理" desc="管理利润表、资产负债表等报表模板，支持自定义模板" />
    }

    // Risk pages
    if (activeSubKey === "risk-period") {
      return (
        <>
          <RiskConditionForm onDetect={() => setRiskDetected(true)} />
          <RiskOverview
            detected={riskDetected}
            expandedId={expandedRiskId}
            onToggleExpand={setExpandedRiskId}
          />
          <RiskDetailPanel expandedId={expandedRiskId} />
          <RiskOperations detected={riskDetected} />
          <RiskBottomBar
            onBack={() => handleSubChange("report", "report-period")}
            onRefresh={() => {
              setRiskDetected(false)
              setExpandedRiskId(null)
              setTimeout(() => setRiskDetected(true), 100)
            }}
          />
        </>
      )
    }
    if (activeSubKey === "risk-ledger") {
      return <PlaceholderContent label="风险处置台账" desc="记录所有风险的处置过程和整改结果，支持跟踪闭环状态" />
    }
    if (activeSubKey === "risk-rules") {
      return <PlaceholderContent label="风控规则管理" desc="管理风险检测规则库，支持按风险等级和类型配置阈值" />
    }

    // Ledger pages - all handled by LedgerManagement with sub key
    if (activePage === "ledger") {
      return <LedgerManagement activeSubKey={activeSubKey} />
    }

    return null
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header ruleVersion={ruleVersionMap[activePage]} />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          activePage={activePage}
          activeSubKey={activeSubKey}
          onPageChange={handlePageChange}
          onSubChange={handleSubChange}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-border bg-card px-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("main")}
                className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === "main"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tabLabels[activePage]} - {subKeyLabels[activeSubKey] || ""}
                {activeTab === "main" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("log")}
                className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === "log"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                操作日志
                {activeTab === "log" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              仅限本地局域网使用
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl space-y-6 px-6 py-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* Placeholder for sub-pages not yet implemented */
function PlaceholderContent({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Settings2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{label}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{desc}</p>
        <div className="mt-5 rounded-lg bg-muted/50 px-4 py-2">
          <p className="text-xs text-muted-foreground">该子模块正在开发中，即将上线</p>
        </div>
      </div>
    </div>
  )
}

function Settings2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  )
}
