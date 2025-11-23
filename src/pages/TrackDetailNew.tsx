import { Navbar } from "@/components/Navbar";
import { ProgressCircle } from "@/components/ProgressCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AIChat } from "@/components/AIChat";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Book, 
  Video, 
  FileText,
  Trophy,
  MessageCircle,
  Download,
  Bookmark,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const resourceIcons = {
  video: Video,
  article: FileText,
  course: Book,
};

const TrackDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());

  // Fetch roadmap data
  const { data: roadmap, isLoading: roadmapLoading } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("slug", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch sections with resources
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections", roadmap?.id],
    queryFn: async () => {
      if (!roadmap?.id) return [];
      
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("sections")
        .select("*")
        .eq("roadmap_id", roadmap.id)
        .order("order_index");
      
      if (sectionsError) throw sectionsError;

      const sectionsWithResources = await Promise.all(
        sectionsData.map(async (section) => {
          const { data: resourcesData, error: resourcesError } = await supabase
            .from("resources")
            .select("*")
            .eq("section_id", section.id)
            .order("order_index");
          
          if (resourcesError) throw resourcesError;
          
          return {
            ...section,
            resources: resourcesData || [],
          };
        })
      );

      return sectionsWithResources;
    },
    enabled: !!roadmap?.id,
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", roadmap?.id, user?.id],
    queryFn: async () => {
      if (!roadmap?.id || !user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("roadmap_id", roadmap.id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!roadmap?.id && !!user?.id,
  });

  useEffect(() => {
    if (userProgress?.completed_sections) {
      setCompletedResources(new Set(userProgress.completed_sections));
    }
  }, [userProgress]);

  const handleResourceClick = async (resourceUrl: string, resourceId: string) => {
    if (resourceUrl) {
      window.open(resourceUrl, "_blank");
      
      // Mark as completed
      if (user && roadmap) {
        const newCompleted = new Set(completedResources);
        newCompleted.add(resourceId);
        setCompletedResources(newCompleted);

        const { error } = await supabase
          .from("user_progress")
          .upsert({
            user_id: user.id,
            roadmap_id: roadmap.id,
            completed_sections: Array.from(newCompleted),
            progress_percent: Math.round((newCompleted.size / getTotalResources()) * 100),
          });

        if (error) {
          toast.error("Failed to update progress");
        } else {
          toast.success("Progress saved!");
        }
      }
    }
  };

  const getTotalResources = () => {
    return sections?.reduce((acc, section) => acc + section.resources.length, 0) || 0;
  };

  const getCompletedCount = () => {
    return completedResources.size;
  };

  const getProgressPercent = () => {
    const total = getTotalResources();
    if (total === 0) return 0;
    return Math.round((getCompletedCount() / total) * 100);
  };

  if (roadmapLoading || sectionsLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Roadmap not found</h1>
            <Link to="/tracks">
              <Button>Back to Tracks</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-[280px_1fr_320px] gap-8">
          {/* Left: Table of Contents */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <Card className="glass-card sticky top-24 p-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="font-display font-semibold">Contents</h3>
              <nav className="space-y-1">
                {sections?.map((section, idx) => {
                  const sectionCompleted = section.resources.every(r => 
                    completedResources.has(r.id)
                  );
                  return (
                    <div
                      key={section.id}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted`}
                    >
                      <div className="flex items-center gap-2">
                        {sectionCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="line-clamp-1">{section.title}</span>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </Card>
          </motion.aside>

          {/* Center: Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {roadmap.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {roadmap.estimated_hours} hours
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                {roadmap.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {roadmap.description}
              </p>
            </div>

            <Separator />

            {/* Sections Timeline */}
            <div className="space-y-8">
              {sections?.map((section, sectionIdx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="relative"
                >
                  <Card className="glass-card p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {section.resources.every(r => completedResources.has(r.id)) ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <h3 className="text-xl font-display font-semibold">
                            {section.title}
                          </h3>
                        </div>
                        {section.description && (
                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {section.resources.map((resource) => {
                        const Icon = resourceIcons[resource.type as keyof typeof resourceIcons];
                        const isCompleted = completedResources.has(resource.id);
                        return (
                          <button
                            key={resource.id}
                            onClick={() => handleResourceClick(resource.url, resource.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left group"
                          >
                            <Icon className="h-4 w-4 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1 flex items-center gap-2">
                                {resource.title}
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </p>
                              {resource.duration_minutes && (
                                <p className="text-xs text-muted-foreground">
                                  {resource.duration_minutes} min
                                </p>
                              )}
                            </div>
                            {isCompleted && (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Progress Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24 space-y-6">
              <Card className="glass-card p-6 space-y-6">
                <div className="flex justify-center">
                  <ProgressCircle progress={getProgressPercent()} label="Overall Progress" />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resources</span>
                    <span className="font-medium">{getCompletedCount()} / {getTotalResources()} Complete</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Need help? Ask our AI assistant about this track.
                </p>
              </Card>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* AI Chat Bubble */}
      <AIChat context={{ roadmapId: roadmap.id }} />
    </div>
  );
};

export default TrackDetail;
