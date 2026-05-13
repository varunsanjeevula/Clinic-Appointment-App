"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { CommandPalette } from "@/components/command-palette";
import { MobileBottomNav } from "@/components/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <CommandPalette />
      <div className="flex-1 flex flex-col lg:ml-60 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
