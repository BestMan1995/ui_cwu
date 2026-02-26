import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const logs = [
  { time: "2026-02-25 10:32:15", action: "发票批量解析", result: "成功 8 / 失败 2", user: "张会计" },
  { time: "2026-02-25 10:30:02", action: "上传 10 个文件", result: "成功", user: "张会计" },
  { time: "2026-02-25 10:28:47", action: "切换账套至 A商贸公司", result: "成功", user: "张会计" },
  { time: "2026-02-25 09:15:33", action: "登录系统", result: "成功", user: "张会计" },
  { time: "2026-02-24 17:42:10", action: "导出 B公司 2月报表", result: "成功", user: "李会计" },
]

export function OperationLog() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>时间</TableHead>
            <TableHead>操作</TableHead>
            <TableHead>结果</TableHead>
            <TableHead>操作人</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {log.time}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {log.action}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    log.result === "成功"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {log.result}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{log.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
