import { Navbar } from "@/components/Navbar";
import { TrackCard } from "@/components/TrackCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import * as React from "react";

const Tracks = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("popular");

  // Fetch roadmaps with content check
  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps-with-content"],
    queryFn: async () => {
      // Fetch roadmaps
      const { data: roadmapData, error: roadmapError } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (roadmapError) throw roadmapError;
      if (!roadmapData) return [];

      // Fetch sections with resources for all roadmaps
      const { data: sectionsWithResources, error: sectionsError } = await supabase
        .from("sections")
        .select("roadmap_id, resources(id)")
        .in("roadmap_id", roadmapData.map(r => r.id));

      // Fetch quizzes for all roadmaps
      const { data: quizzes, error: quizzesError } = await supabase
        .from("quizzes")
        .select("roadmap_id")
        .in("roadmap_id", roadmapData.map(r => r.id));

      if (sectionsError) throw sectionsError;
      if (quizzesError) throw quizzesError;

      // Create sets of roadmap IDs that have content
      const roadmapsWithResources = new Set(
        sectionsWithResources
          ?.filter(s => s.resources && s.resources.length > 0)
          .map(s => s.roadmap_id) || []
      );
      const roadmapsWithQuizzes = new Set(quizzes?.map(q => q.roadmap_id) || []);

      // Filter to only include roadmaps with at least some content
      return roadmapData.filter(roadmap => 
        roadmapsWithResources.has(roadmap.id) || roadmapsWithQuizzes.has(roadmap.id)
      );
    },
  });

  // Fetch user progress for all roadmaps
  const { data: userProgressData } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getProgressForRoadmap = (roadmapId: string) => {
    if (!userProgressData) return 0;
    const progress = userProgressData.find(p => p.roadmap_id === roadmapId);
    return progress?.progress_percent || 0;
  };

  const filteredRoadmaps = React.useMemo(() => {
    if (!roadmaps) return [];
    
    let filtered = roadmaps.filter(roadmap => {
      const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roadmap.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || roadmap.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });

    if (sortBy === "recent") {
      filtered = filtered.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "duration") {
      filtered = filtered.sort((a, b) => a.estimated_hours - b.estimated_hours);
    }

    return filtered;
  }, [roadmaps, searchQuery, difficultyFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">Loading tracks...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Learning Tracks
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose your path and start your learning journey. Each track is carefully curated with resources, quizzes, and projects.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks..."
                className="pl-10 glass-surface"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full md:w-48 glass-surface">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 glass-surface">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No tracks found matching your criteria
              </div>
            ) : (
              filteredRoadmaps.map((roadmap, index) => (
              <TrackCard 
                key={roadmap.id} 
                id={roadmap.slug}
                title={roadmap.title}
                description={roadmap.description || ""}
                difficulty={roadmap.difficulty as "beginner" | "intermediate" | "advanced"}
                duration={`${roadmap.estimated_hours} hours`}
                progress={getProgressForRoadmap(roadmap.id)}
                coverImage={roadmap.cover_image_url}
                delay={index * 0.1}
              />
            ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Tracks;
