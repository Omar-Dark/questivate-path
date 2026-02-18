import { Navbar } from "@/components/Navbar";
import { TrackCard } from "@/components/TrackCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useExternalRoadmaps } from "@/hooks/useExternalApi";
import * as React from "react";

const Tracks = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("popular");

  const { data: apiRoadmaps, isLoading } = useExternalRoadmaps();

  const dummyTracks = [
    { _id: '1', title: 'JavaScript Essentials', description: 'Learn JavaScript from scratch including ES6+, async programming, and DOM manipulation.', sections: [{}, {}, {}], createdAt: '2025-01-01' },
    { _id: '2', title: 'React Development', description: 'Build modern web applications with React, hooks, context, and routing.', sections: [{}, {}, {}, {}], createdAt: '2025-02-01' },
    { _id: '3', title: 'TypeScript Fundamentals', description: 'Add type safety to your JavaScript projects with TypeScript generics, interfaces, and utility types.', sections: [{}, {}], createdAt: '2025-03-01' },
    { _id: '4', title: 'CSS Mastery', description: 'From flexbox to grid, animations, custom properties, and responsive design patterns.', sections: [{}, {}, {}], createdAt: '2025-01-15' },
    { _id: '5', title: 'Node.js Backend', description: 'Server-side JavaScript with Express, middleware, databases, and deployment.', sections: [{}, {}, {}, {}], createdAt: '2025-02-15' },
    { _id: '6', title: 'Git & DevOps', description: 'Version control, CI/CD pipelines, Docker, and cloud deployment essentials.', sections: [{}, {}], createdAt: '2025-03-15' },
  ];

  const roadmaps = apiRoadmaps && apiRoadmaps.length > 0 ? apiRoadmaps : dummyTracks;

  const filteredRoadmaps = React.useMemo(() => {
    if (!roadmaps) return [];
    
    let filtered = roadmaps.filter(roadmap => {
      const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roadmap.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    if (sortBy === "recent") {
      filtered = filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [roadmaps, searchQuery, difficultyFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading tracks...</span>
          </div>
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 glass-surface">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
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
                  key={roadmap._id} 
                  id={roadmap._id}
                  title={roadmap.title}
                  description={roadmap.description || ""}
                  difficulty="intermediate"
                  duration={`${roadmap.sections?.length || 0} sections`}
                  progress={0}
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
