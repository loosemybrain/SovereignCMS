"use client"

import * as React from "react"
import { AppSidebar } from "@/components/cms/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface CMSLayoutProps {
  children: React.ReactNode
  tenant?: string
}

export function CMSLayout({ children, tenant = "demo" }: CMSLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar 
        tenant={tenant}
        runtimeConfig={{
          db: "memory",
          storage: "memory",
          auth: "none",
        }}
      />
      <SidebarInset className="flex flex-col min-h-svh">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
