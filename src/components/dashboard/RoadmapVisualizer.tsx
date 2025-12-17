import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Play, ChevronRight, ExternalLink, Clock, BookOpen, Video, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoadmapSections } from "@/hooks/useExternalApi";
import type { ExternalRoadmap, ExternalSection, ExternalResource } from "@/lib/externalApi";

interface RoadmapVisualizerProps {
  roadmap: ExternalRoadmap;
}

function SectionCard({ 
  section, 
  index, 
  isLast, 
  onSelect 
}: { 
  section: ExternalSection; 
  index: number;
  isLast: boolean; 
  onSelect: () => void;
}) {
  const difficultyConfig = {
    Beginner: {
      color: "text-green-500",
      bg: "bg-green-500/20",
      border: "border-green-500/50",
    },
    Intermediate: {
      color: "text-neon-cyan",
      bg: "bg-neon-cyan/20",
      border: "border-neon-cyan/50",
    },
    Advanced: {
      color: "text-neon-purple",
      bg: "bg-neon-purple/20",
      border: "border-neon-purple/50",
    },
  };

  const config = difficultyConfig[section.difficulty] || difficultyConfig.Beginner;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "relative w-12 h-12 rounded-full flex items-center justify-center",
            "bg-card border-2",
            config.border
          )}
        >
          <span className={cn("text-lg font-bold", config.color)}>{index + 1}</span>
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.1 + 0.1 }}
            className="w-0.5 h-16 origin-top bg-border"
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={onSelect}
        className={cn(
          "flex-1 p-4 rounded-xl border cursor-pointer transition-all duration-300 mb-4",
          "bg-card/50 hover:bg-card border-border hover:border-neon-cyan/30"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{section.title}</h4>
              <Badge variant="secondary" className={cn(config.bg, config.color, "text-xs")}>
                {section.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p>
            {section.resources && section.resources.length > 0 && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                {section.resources.length} resource{section.resources.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SectionDetailPanel({ 
  section, 
  onClose 
}: { 
  section: ExternalSection | null; 
  onClose: () => void;
}) {
  if (!section) return null;

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
            <h3 className="text-xl font-bold">{section.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <Badge variant="secondary" className={cn(
          section.difficulty === "Beginner" ? "bg-green-500/20 text-green-500" :
          section.difficulty === "Intermediate" ? "bg-neon-cyan/20 text-neon-cyan" :
          "bg-neon-purple/20 text-neon-purple"
        )}>
          {section.difficulty}
        </Badge>

        {section.resources && section.resources.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Resources:</p>
            <div className="space-y-2">
              {section.resources.map((resource) => (
                <a
                  key={resource._id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border hover:border-neon-cyan/50 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-neon-purple/10">
                    {resource.type === "video" ? (
                      <Video className="h-4 w-4 text-neon-purple" />
                    ) : (
                      <FileText className="h-4 w-4 text-neon-purple" />
                    )}
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

        {(!section.resources || section.resources.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No resources available for this section yet.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function RoadmapVisualizer({ roadmap }: RoadmapVisualizerProps) {
  const [selectedSection, setSelectedSection] = useState<ExternalSection | null>(null);
  const { data: sections, isLoading } = useRoadmapSections(roadmap._id);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading sections...
      </div>
    );
  }

  const sectionCount = sections?.length || 0;

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
            {sectionCount}
          </p>
          <p className="text-sm text-muted-foreground">Sections</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Nodes */}
        <div className="lg:col-span-2">
          {sections && sections.length > 0 ? (
            sections.map((section, index) => (
              <SectionCard
                key={section._id}
                section={section}
                index={index}
                isLast={index === sections.length - 1}
                onSelect={() => setSelectedSection(section)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No sections available for this roadmap yet.
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedSection ? (
            <SectionDetailPanel section={selectedSection} onClose={() => setSelectedSection(null)} />
          ) : (
            <div className="bg-card/50 border border-border rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                <ChevronRight className="h-8 w-8 text-neon-cyan" />
              </div>
              <p className="text-muted-foreground">
                Click on a section to view details and resources
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
