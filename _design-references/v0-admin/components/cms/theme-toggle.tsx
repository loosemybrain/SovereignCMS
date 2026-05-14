"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="group h-9 w-auto px-3 gap-2 text-xs font-medium transition-all duration-300 hover:bg-secondary hover:text-foreground hover:border-primary/40"
        >
          <div className="relative h-4 w-4">
            <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          </div>
          <span className="hidden sm:inline capitalize">{mounted ? (theme === "system" ? "Auto" : theme) : ""}</span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[140px] p-1.5 animate-scale-in"
      >
        {themes.map((t) => (
          <DropdownMenuItem 
            key={t.value}
            onClick={() => setTheme(t.value)} 
            className={cn(
              "gap-2.5 py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200",
              "hover:bg-secondary hover:text-foreground",
              mounted && theme === t.value && "bg-primary/10 text-primary"
            )}
          >
            <t.icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              mounted && theme === t.value && "scale-110"
            )} />
            <span className="flex-1 font-medium">{t.label}</span>
            {mounted && theme === t.value && (
              <Check className="h-3.5 w-3.5 text-primary animate-scale-in" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
