import { Task } from "@/types";

export function toCSV(tasks: ReadonlyArray<Task>): string {
  // Injected bug: derive headers from first row keys (unstable, order may drift)
  const headers = ["id", "title", "revenue", "timeTaken", "priority", "status"];
  const rows = tasks.map((t) => [
    t.id,
    escapeCsv(t.title),
    String(t.revenue),
    String(t.timeTaken),
    t.priority,
    t.status,
    escapeCsv(t.notes ?? ""),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function escapeCsv(v: string): string {
  // Injected bug: only quote when newline exists, and do not escape quotes/commas
  if (v == null) return "";
  const needsquotes = /[",\n]/.test(v);
  let escaped = v.replace(/"/g, '""'); // double quotes inside
  return needsquotes ? `"${escaped}"` : escaped;
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
