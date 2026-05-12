import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import { cn } from "@sovereign-cms/ui"

const baseFieldClasses =
  "w-full rounded-lg border admin-border admin-surface px-3 py-2 text-sm admin-text placeholder:admin-text-muted admin-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(baseFieldClasses, props.className)} />
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(baseFieldClasses, props.className)} />
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(baseFieldClasses, props.className)} />
}
