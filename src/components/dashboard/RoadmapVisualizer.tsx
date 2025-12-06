import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Play, ChevronRight, ExternalLink, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RoadmapNode, ExternalRoadmap } from "@/hooks/useExternalRoadmap";

interface RoadmapVisualizerProps {
  roadmap: ExternalRoadmap;
}

function StepCard({ node, isLast, onSelect }: { node: RoadmapNode; isLast: boolean; onSelect: () => void }) {
  const statusConfig = {
    completed: {
      icon: Check,
      bg: "bg-green-500",
      border: "border-green-500/50",
      glow: "shadow-green-500/30 shadow-lg",
      line: "bg-green-500",
      text: "text-green-500",
    },
    "in-progress": {
      icon: Play,
      bg: "bg-gradient-to-r from-neon-cyan to-neon-purple",
      border: "border-neon-cyan/50",
      glow: "shadow-neon-cyan/50 shadow-xl",
      line: "bg-gradient-to-b from-neon-cyan to-border",
      text: "text-neon-cyan",
    },
    available: {
      icon: ChevronRight,
      bg: "bg-card",
      border: "border-border",
      glow: "",
      line: "bg-border",
      text: "text-foreground",
    },
    locked: {
      icon: Lock,
      bg: "bg-muted",
      border: "border-muted",
      glow: "",
      line: "bg-border/50",
      text: "text-muted-foreground",
    },
  };

  const config = statusConfig[node.status];
  const Icon = config.icon;

  return (
    <div className="flex gap-4">
      {/* Node connector */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: node.order * 0.1 }}
          className={cn(
            "relative w-12 h-12 rounded-full flex items-center justify-center",
            config.bg,
            config.border,
            "border-2",
            config.glow
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              node.status === "completed" || node.status === "in-progress" ? "text-white" : config.text
            )}
          />
          {node.status === "in-progress" && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple animate-pulse opacity-50" />
          )}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: node.order * 0.1 + 0.1 }}
            className={cn("w-0.5 h-16 origin-top", config.line)}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: node.order * 0.1 }}
        onClick={onSelect}
        className={cn(
          "flex-1 p-4 rounded-xl border cursor-pointer transition-all duration-300 mb-4",
          node.status === "locked" ? "opacity-60 bg-muted/30" : "bg-card/50 hover:bg-card",
          node.status === "in-progress" ? "border-neon-cyan/50 ring-1 ring-neon-cyan/20" : "border-border hover:border-neon-cyan/30"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn("font-semibold", config.text)}>{node.title}</h4>
              {node.status === "in-progress" && (
                <Badge variant="secondary" className="bg-neon-cyan/20 text-neon-cyan text-xs">
                  In Progress
                </Badge>
              )}
              {node.status === "completed" && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-500 text-xs">
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{node.description}</p>
            {node.skills && node.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {node.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-xs rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          {node.estimatedHours && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              {node.estimatedHours}h
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StepDetailPanel({ node, onClose }: { node: RoadmapNode | null; onClose: () => void }) {
  if (!node) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{node.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {node.skills && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Skills you'll learn:</p>
            <div className="flex flex-wrap gap-2">
              {node.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-neon-cyan/10 text-neon-cyan">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {node.resources && node.resources.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Resources:</p>
            <div className="space-y-2">
              {node.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border hover:border-neon-cyan/50 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-neon-purple/10">
                    <BookOpen className="h-4 w-4 text-neon-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-neon-cyan transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-neon-cyan transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {node.status !== "locked" && (
          <Button className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 text-white border-0">
            {node.status === "completed" ? "Review" : node.status === "in-progress" ? "Continue" : "Start Learning"}
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function RoadmapVisualizer({ roadmap }: RoadmapVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const progress = (roadmap.completedSteps / roadmap.totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Roadmap Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{roadmap.title}</h2>
          <p className="text-muted-foreground">{roadmap.description}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-neon-cyan">
            {roadmap.completedSteps}/{roadmap.totalSteps}
          </p>
          <p className="text-sm text-muted-foreground">Steps Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap Nodes */}
        <div className="lg:col-span-2">
          {roadmap.nodes.map((node, index) => (
            <StepCard
              key={node.id}
              node={node}
              isLast={index === roadmap.nodes.length - 1}
              onSelect={() => setSelectedNode(node)}
            />
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedNode ? (
            <StepDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          ) : (
            <div className="bg-card/50 border border-border rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                <ChevronRight className="h-8 w-8 text-neon-cyan" />
              </div>
              <p className="text-muted-foreground">
                Click on a step to view details and resources
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
