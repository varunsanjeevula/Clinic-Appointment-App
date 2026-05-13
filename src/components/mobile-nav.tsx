"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, UserPlus, ListOrdered, Stethoscope,
  CalendarDays, MapPin, MoreHorizontal, X, Moon, Sun,
  LogOut, User, Activity, FileText, Bell, UserCircle,
  HelpCircle, BarChart, Settings, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/queries";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/register", label: "Register", icon: UserPlus },
  { href: "/hospitals", label: "Hospitals", icon: MapPin },
  { href: "/my-appointments", label: "Visits", icon: CalendarDays },
  { href: "/queue", label: "Queue", icon: ListOrdered },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
];

const adminDrawerItems = [
  { href: "/queue", label: "Appointment Queue", icon: ListOrdered },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "#", label: "Analytics", icon: BarChart },
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Access Control", icon: Shield },
  { href: "#", label: "Help Center", icon: HelpCircle },
];

const userDrawerItems = [
  { href: "/my-appointments", label: "Your Appointments", icon: CalendarDays },
  { href: "/register", label: "Register Patient", icon: UserPlus },
  { href: "#", label: "Medical Records", icon: FileText },
  { href: "#", label: "Notifications", icon: Bell },
  { href: "#", label: "My Profile", icon: UserCircle },
  { href: "#", label: "Help & Support", icon: HelpCircle },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const isAdmin = user?.email?.toLowerCase() === "admin@gmail.com";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs = isAdmin
    ? [
        { href: "/", label: "Home", icon: LayoutDashboard },
        { href: "/hospitals", label: "Hospitals", icon: MapPin },
        { href: "/queue", label: "Queue", icon: ListOrdered },
        { href: "/doctors", label: "Doctors", icon: Stethoscope },
      ]
    : [
        { href: "/", label: "Home", icon: LayoutDashboard },
        { href: "/hospitals", label: "Hospitals", icon: MapPin },
        { href: "/register", label: "Register", icon: UserPlus },
        { href: "/my-appointments", label: "Visits", icon: CalendarDays },
      ];

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-background/80 backdrop-blur-xl border-t border-border safe-bottom">
          <div className="flex items-center justify-around px-1 h-16">
            {tabs.map((tab) => {
              const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground active:scale-95"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-indicator"
                      className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <tab.icon className={cn("w-5 h-5 transition-all", isActive && "scale-110")} />
                  <span className={cn("text-[10px] font-medium leading-none", isActive && "font-semibold")}>{tab.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl text-muted-foreground active:scale-95 transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">More</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-Out Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAdmin={isAdmin}
        user={user}
      />
    </>
  );
}

function MobileDrawer({
  open,
  onClose,
  isAdmin,
  user,
}: {
  open: boolean;
  onClose: () => void;
  isAdmin: boolean;
  user: { name: string; email: string } | undefined | null;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const drawerItems = isAdmin ? adminDrawerItems : userDrawerItems;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[280px] bg-background border-l border-border shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  M
                </div>
                <span className="font-bold text-lg tracking-tight">
                  Med<span className="text-primary">Queue</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <User className="w-4 h-4" />
                  Sign in to your account
                </Link>
              )}
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                {isAdmin ? "Administration" : "Navigation"}
              </p>
              <nav className="space-y-0.5">
                {drawerItems.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : item.href !== "#" && pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 active:bg-muted"
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 active:bg-muted transition-all"
                >
                  {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              )}

              {/* Logout */}
              {user && (
                <Link
                  href="/api/auth/logout"
                  onClick={onClose}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive active:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                  <span>Log out</span>
                </Link>
              )}

              <div className="flex items-center gap-2 px-3 text-[10px] font-semibold text-emerald-400">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>System Online</span>
                <span className="text-muted-foreground/50 ml-auto">v2.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export { MobileDrawer };
