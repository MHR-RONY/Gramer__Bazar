import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bell, Moon, Search, Sun } from "lucide-react";

export type AdminNavItem = {
  key: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const ADMIN_THEME_KEY = "gb_admin_theme_v1";

type ThemeChoice = "light" | "dark";

type ThemeApi = {
  theme: ThemeChoice;
  toggle: () => void;
};

function readTheme(): ThemeChoice {
  try {
    const raw = localStorage.getItem(ADMIN_THEME_KEY);
    if (raw === "dark" || raw === "light") return raw;
  } catch {
    // ignore
  }
  return "light";
}

function writeTheme(theme: ThemeChoice) {
  try {
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  } catch {
    // ignore
  }
}

function AdminTopbar({
  title,
  subtitle,
  themeApi,
}: {
  title: string;
  subtitle?: string;
  themeApi: ThemeApi;
}) {
  const { toggleSidebar } = useSidebar();
  const { theme, toggle } = themeApi;

  return (
    <header className="sticky top-0 z-30 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
        {/* Left */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-10 w-10" onClick={toggleSidebar} />
          <div className="hidden sm:block">
            <div className="text-lg font-extrabold tracking-tight">{title}</div>
            {subtitle ? <div className="text-sm text-ink-muted">{subtitle}</div> : null}
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-full border bg-background px-4 sm:flex">
          <Search className="h-4 w-4 text-foreground/60" />
          <Input
            placeholder="Search admin…"
            className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-11 w-11 rounded-full"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-background transition-colors hover:bg-accent"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-full border bg-background px-2 py-2 text-sm font-semibold transition-colors hover:bg-accent"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-sm font-bold">A</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">Admin</div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile title */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="text-lg font-extrabold tracking-tight">{title}</div>
        {subtitle ? <div className="text-sm text-ink-muted">{subtitle}</div> : null}
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-4 sm:hidden">
        <div className="flex w-full items-center gap-2 rounded-full border bg-background px-4">
          <Search className="h-4 w-4 text-foreground/60" />
          <Input
            placeholder="Search admin…"
            className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
        </div>
      </div>
    </header>
  );
}

export function AdminShell({
  brandTitle,
  items,
  activeKey,
  onChange,
  pageTitle,
  pageSubtitle,
  children,
}: {
  brandTitle: string;
  items: AdminNavItem[];
  activeKey: string;
  onChange: (key: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeChoice>("light");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const themeApi: ThemeApi = {
    theme,
    toggle: () => {
      setTheme((prev) => {
        const next: ThemeChoice = prev === "dark" ? "light" : "dark";
        writeTheme(next);
        return next;
      });
    },
  };

  return (
    <div className={cn("min-h-svh", theme === "dark" ? "dark" : "")}
    >
      <SidebarProvider defaultOpen>
        <div className="flex min-h-svh w-full bg-background text-foreground">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="p-3">
              <div className="flex items-center gap-2 rounded-xl border bg-sidebar px-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <span className="text-base font-extrabold">GB</span>
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <div className="truncate text-base font-extrabold tracking-tight">{brandTitle}</div>
                  <div className="text-xs text-sidebar-foreground/60">Admin Panel</div>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs">Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map(({ key, label, Icon }) => (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton
                          type="button"
                          onClick={() => onChange(key)}
                          isActive={activeKey === key}
                          tooltip={label}
                          size="lg"
                          className={cn(
                            "text-base",
                            activeKey === key ? "bg-sidebar-accent text-sidebar-accent-foreground" : "",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="bg-background">
            <AdminTopbar title={pageTitle} subtitle={pageSubtitle} themeApi={themeApi} />
            <div className="px-4 py-6 sm:px-8 sm:py-8">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
