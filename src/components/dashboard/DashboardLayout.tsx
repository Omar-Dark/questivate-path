import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-neon-cyan" />
          <div className="absolute inset-0 h-12 w-12 animate-ping bg-neon-cyan/20 rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border z-40 flex items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r-0">
              <AppSidebar collapsed={false} onToggle={() => {}} />
            </SheetContent>
          </Sheet>
          <span className="ml-4 text-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Questivate
          </span>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      )}

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 80 : 280,
          paddingTop: isMobile ? 64 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("min-h-screen transition-all")}
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </motion.main>
    </div>
  );
}
