import { Navbar } from "@/components/Navbar";
import { TrackCard } from "@/components/TrackCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const mockTracks = [
  {
    id: "web-dev-fundamentals",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript from scratch. Build responsive websites and understand modern web standards.",
    difficulty: "beginner" as const,
    duration: "40 hours",
    progress: 0,
  },
  {
    id: "react-mastery",
    title: "React Mastery",
    description: "Learn React from basics to advanced patterns. Hooks, context, performance optimization, and modern best practices.",
    difficulty: "intermediate" as const,
    duration: "60 hours",
    progress: 35,
  },
  {
    id: "fullstack-node",
    title: "Full-Stack with Node.js",
    description: "Build complete web applications with Node.js, Express, MongoDB, and React. Authentication, APIs, and deployment.",
    difficulty: "advanced" as const,
    duration: "80 hours",
    progress: 12,
  },
  {
    id: "typescript-deep-dive",
    title: "TypeScript Deep Dive",
    description: "Master TypeScript for large-scale applications. Advanced types, generics, decorators, and architectural patterns.",
    difficulty: "intermediate" as const,
    duration: "35 hours",
    progress: 0,
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Principles",
    description: "Learn design thinking, user research, wireframing, prototyping, and modern design tools like Figma.",
    difficulty: "beginner" as const,
    duration: "25 hours",
    progress: 0,
  },
  {
    id: "system-design",
    title: "System Design & Architecture",
    description: "Design scalable systems. Load balancing, caching, databases, microservices, and distributed systems.",
    difficulty: "advanced" as const,
    duration: "50 hours",
    progress: 0,
  },
];

const Tracks = () => {
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
              />
            </div>
            <Select defaultValue="all">
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
            <Select defaultValue="popular">
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
            {mockTracks.map((track, index) => (
              <TrackCard key={track.id} {...track} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Tracks;
