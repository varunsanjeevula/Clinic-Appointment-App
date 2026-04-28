"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, ListOrdered, Stethoscope, Activity, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-appointments", label: "Your Appointments", icon: CalendarDays },
  { href: "/register", label: "Register Patient", icon: UserPlus },
  { href: "/queue", label: "Appointment Queue", icon: ListOrdered },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
          M
        </div>
        <span className="font-heading text-lg font-bold text-sidebar-foreground tracking-tight">
          Med<span className="text-primary">Queue</span>
        </span>
      </div>

      <div className="px-3 pt-6 pb-2">
        <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Main Menu
        </span>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[7px] w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-400 mb-1">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>System Online</span>
        </div>
        <p className="text-[10px] text-muted-foreground/50">© 2026 MedQueue v2.0</p>
      </div>
    </aside>
  );
}
