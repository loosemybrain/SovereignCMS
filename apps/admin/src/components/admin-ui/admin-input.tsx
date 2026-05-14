import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import { cn } from "@sovereign-cms/ui"

const baseFieldClasses =
  "w-full rounded-lg border admin-border admin-surface px-3 py-2 text-sm admin-text placeholder:admin-text-muted transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none admin-focus-ring focus-visible:outline-none focus-visible:border-[color-mix(in_oklab,var(--admin-accent)_55%,var(--admin-border))] disabled:cursor-not-allowed disabled:opacity-60"

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(baseFieldClasses, props.className)} />
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(baseFieldClasses, props.className)} />
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(baseFieldClasses, props.className)} />
}
