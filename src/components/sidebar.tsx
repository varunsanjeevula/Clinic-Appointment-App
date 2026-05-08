"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, ListOrdered, Stethoscope, Activity, CalendarDays, BarChart, Settings, Shield, HelpCircle, FileText, Bell, UserCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/queries";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/register", label: "Register Patient", icon: UserPlus },
  { href: "/hospitals", label: "Hospitals", icon: MapPin },
  { href: "/my-appointments", label: "Your Appointments", icon: CalendarDays },
  { href: "/queue", label: "Appointment Queue", icon: ListOrdered },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
];

const adminSystemItems = [
  { href: "#", label: "Analytics", icon: BarChart },
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Access Control", icon: Shield },
  { href: "#", label: "Help Center", icon: HelpCircle },
];

const userSystemItems = [
  { href: "#", label: "Medical Records", icon: FileText },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "My Profile", icon: UserCircle },
  { href: "#", label: "Help Support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";

  const filteredNavItems = navItems.filter(item => {
    if (isAdmin) {
      return ["/", "/hospitals", "/queue", "/doctors"].includes(item.href);
    } else {
      return ["/", "/hospitals", "/my-appointments", "/register"].includes(item.href);
    }
  });

  return (
    <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border sticky top-0 bg-sidebar z-10">
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

      <nav className="px-2 space-y-0.5">
        {filteredNavItems.map((item) => {
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

      {isAdmin && (
        <>
          <div className="px-3 pt-8 pb-2">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              System Administration
            </span>
          </div>
          <nav className="px-2 space-y-0.5">
            {adminSystemItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}

      {!isAdmin && (
        <>
          <div className="px-3 pt-8 pb-2">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Personal
            </span>
          </div>
          <nav className="px-2 space-y-0.5">
            {userSystemItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}

      <div className="flex-1" />

      <div className="p-4 border-t border-sidebar-border mt-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-400 mb-1">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>System Online</span>
        </div>
        <p className="text-[10px] text-muted-foreground/50">© 2026 MedQueue v2.0</p>
      </div>
    </aside>
  );
}
