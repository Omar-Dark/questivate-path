import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Map,
  FolderKanban,
  User,
  Settings,
  Trophy,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "My Paths", icon: Map, path: "/tracks" },
  { title: "Projects", icon: FolderKanban, path: "/projects" },
  { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple">
              <Sparkles className="h-5 w-5 text-sidebar" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple blur-lg opacity-50" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent"
              >
                Questivate
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const NavLink = (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                active
                  ? "bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-neon-cyan to-neon-purple"
                />
              )}
              <item.icon className={cn("h-5 w-5 shrink-0", active && "text-neon-cyan")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar border-sidebar-border">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavLink;
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3 p-2 rounded-xl", collapsed ? "justify-center" : "")}>
          <Avatar className="h-10 w-10 ring-2 ring-neon-cyan/30">
            <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-purple text-sidebar font-bold">
              {user?.user_metadata?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.user_metadata?.username || "Learner"}
                </p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
