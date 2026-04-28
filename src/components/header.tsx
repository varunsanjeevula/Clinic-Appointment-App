"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search, Menu, User, LogOut, Mail, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading: userLoading } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">M</div>
          <span className="font-bold text-sm">Med<span className="text-primary">Queue</span></span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs h-8 px-3 w-56 justify-start"
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {mounted && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        )}

        {/* User Profile */}
        <div className="relative ml-2" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            {userLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : user ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                {userLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ) : user ? (
                  <>
                    <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">Not logged in</p>
                )}
              </div>
              
              <div className="p-2 space-y-1">
                {user ? (
                  <>
                    <Link href="/my-appointments" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      My Appointments
                    </Link>
                    <Link href="/api/auth/logout" className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                      <LogOut className="w-4 h-4" />
                      Log out
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors" onClick={() => setShowProfile(false)}>
                    <User className="w-4 h-4" />
                    Log in
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
