import { motion } from "framer-motion";
import { Flame, Target, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroStatsProps {
  level: number;
  streak: number;
  xp: number;
  completedPaths: number;
  username?: string;
}

export function HeroStats({ level, streak, xp, completedPaths, username = "Learner" }: HeroStatsProps) {
  const stats = [
    {
      icon: Zap,
      label: "Level",
      value: level,
      color: "from-neon-cyan to-neon-cyan/50",
      glow: "shadow-neon-cyan/30",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: streak,
      suffix: "🔥",
      color: "from-orange-500 to-orange-500/50",
      glow: "shadow-orange-500/30",
    },
    {
      icon: Target,
      label: "Total XP",
      value: xp.toLocaleString(),
      color: "from-neon-purple to-neon-purple/50",
      glow: "shadow-neon-purple/30",
    },
    {
      icon: Trophy,
      label: "Paths Done",
      value: completedPaths,
      color: "from-yellow-500 to-yellow-500/50",
      glow: "shadow-yellow-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-neon-cyan/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Welcome Text */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold"
            >
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                {username}
              </span>
              !
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Continue your learning journey. You're making great progress!
            </motion.p>
          </div>

          {/* Quick Level Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-lg font-bold text-background">{level}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Level</p>
              <p className="text-sm font-semibold text-neon-cyan">Rising Star</p>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50",
                "hover:border-neon-cyan/50 transition-all duration-300 group"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg bg-gradient-to-br",
                    stat.color,
                    "shadow-lg",
                    stat.glow
                  )}
                >
                  <stat.icon className="h-4 w-4 text-background" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">
                    {stat.value}
                    {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
                  </p>
                </div>
              </div>
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/5 group-hover:to-neon-purple/5 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
