"use client"

import { useState, useCallback } from "react"
import { Upload, FileUp, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface InvoiceUploadProps {
  onParse: () => void
}

export function InvoiceUpload({ onParse }: InvoiceUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [autoDedup, setAutoDedup] = useState(true)
  const [fieldCheck, setFieldCheck] = useState(true)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const pdfCount = files.filter((f) => f.name.toLowerCase().endsWith(".pdf")).length

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
        <Upload className="h-5 w-5 text-primary" />
        发票上传区
      </h2>

      {/* 拖拽上传区 */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30"
        }`}
      >
        <FileUp className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          拖拽文件到此处，或点击选择文件
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          支持 JPG / PNG / PDF，可批量上传
        </p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
            <CheckSquare className="h-4 w-4" />
            选择文件
          </span>
        </label>
      </div>

      {/* 已选文件信息 */}
      {files.length > 0 && (
        <p className="mt-3 rounded-lg bg-primary/5 px-4 py-2 text-sm text-foreground">
          已选：<strong>{files.length}</strong> 个文件
          {pdfCount > 0 && (
            <span className="text-muted-foreground">
              （其中 {pdfCount} 个 PDF 文件）
            </span>
          )}
        </p>
      )}

      {/* 选项行 */}
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox
            checked={autoDedup}
            onCheckedChange={(v) => setAutoDedup(!!v)}
          />
          自动去重
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox
            checked={fieldCheck}
            onCheckedChange={(v) => setFieldCheck(!!v)}
          />
          字段校验
        </label>
        <Button className="ml-auto gap-2" onClick={onParse}>
          <FileUp className="h-4 w-4" />
          开始解析
        </Button>
      </div>
    </section>
  )
}
