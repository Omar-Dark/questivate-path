import { Button } from "@/components/ui/button";
import { BookOpen, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-primary">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-display font-semibold">LearnPath</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/tracks" className="text-sm font-medium hover:text-primary transition-colors">
              Tracks
            </Link>
            <Link to="/projects" className="text-sm font-medium hover:text-primary transition-colors">
              Projects
            </Link>
            <Link to="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
              Leaderboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button className="gradient-primary text-white border-0 hover:opacity-90">
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
