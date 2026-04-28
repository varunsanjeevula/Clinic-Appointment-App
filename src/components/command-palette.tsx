"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command as CommandPrimitive } from "cmdk";
import { LayoutDashboard, UserPlus, ListOrdered, Stethoscope, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const pages = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, keywords: "home overview stats" },
  { name: "Register Patient", href: "/register", icon: UserPlus, keywords: "new patient add triage" },
  { name: "Appointment Queue", href: "/queue", icon: ListOrdered, keywords: "queue list appointments" },
  { name: "Doctors", href: "/doctors", icon: Stethoscope, keywords: "doctors manage leaves" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = useCallback((href: string) => {
    router.push(href);
    setOpen(false);
  }, [router]);

  // Only render the cmdk Command tree when the dialog is actually open
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle>Command Palette</DialogTitle>
        <DialogDescription>Search for a command to run...</DialogDescription>
      </DialogHeader>
      <DialogContent className="top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0" showCloseButton={false}>
        <CommandPrimitive
          className="flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground"
        >
          <div className="p-1 pb-0">
            <div className="flex items-center gap-2 rounded-lg border border-input/30 bg-input/30 h-9 px-3">
              <Search className="size-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                placeholder="Search pages, patients, doctors..."
                autoFocus
              />
            </div>
          </div>

          <CommandPrimitive.List className="max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto p-1">
            <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </CommandPrimitive.Empty>

            <CommandPrimitive.Group
              heading="Pages"
              className={cn(
                "overflow-hidden p-1 text-foreground",
                "**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
              )}
            >
              {pages.map((p) => (
                <CommandPrimitive.Item
                  key={p.href}
                  value={p.name + " " + p.keywords}
                  onSelect={() => navigate(p.href)}
                  className="relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-hidden select-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
                >
                  <p.icon className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{p.name}</span>
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.Group>

            <CommandPrimitive.Group
              heading="Quick Actions"
              className={cn(
                "overflow-hidden p-1 text-foreground",
                "**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
              )}
            >
              <CommandPrimitive.Item
                value="register new patient"
                onSelect={() => navigate("/register")}
                className="relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-hidden select-none data-[selected=true]:bg-muted data-[selected=true]:text-foreground"
              >
                <Search className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>Register New Patient</span>
              </CommandPrimitive.Item>
            </CommandPrimitive.Group>
          </CommandPrimitive.List>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
