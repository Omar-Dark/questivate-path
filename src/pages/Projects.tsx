import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, ArrowRight, Code2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const mockProjects = [
  {
    id: "1",
    title: "Personal Portfolio Website",
    description: "Build a modern, responsive portfolio website showcasing your work and skills. Learn HTML, CSS, and JavaScript fundamentals.",
    difficulty: "beginner",
    duration: "8 hours",
    tech: ["HTML", "CSS", "JavaScript"],
    steps: 5,
  },
  {
    id: "2",
    title: "Task Management App",
    description: "Create a full-featured task manager with React. Implement CRUD operations, state management, and local storage.",
    difficulty: "intermediate",
    duration: "15 hours",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    steps: 8,
  },
  {
    id: "3",
    title: "E-commerce Platform",
    description: "Build a complete e-commerce solution with product listings, cart, checkout, and payment integration.",
    difficulty: "advanced",
    duration: "40 hours",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    steps: 12,
  },
  {
    id: "4",
    title: "Weather Dashboard",
    description: "Fetch and display weather data from APIs. Learn about API integration, async/await, and data visualization.",
    difficulty: "beginner",
    duration: "6 hours",
    tech: ["JavaScript", "API", "Chart.js"],
    steps: 4,
  },
  {
    id: "5",
    title: "Social Media Clone",
    description: "Create a Twitter-like social platform with posts, likes, comments, and real-time updates.",
    difficulty: "advanced",
    duration: "50 hours",
    tech: ["React", "Node.js", "WebSockets", "MongoDB"],
    steps: 15,
  },
  {
    id: "6",
    title: "Blog Platform",
    description: "Build a blogging platform with markdown support, categories, tags, and a comment system.",
    difficulty: "intermediate",
    duration: "20 hours",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    steps: 10,
  },
];

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const Projects = () => {
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
              Project Ideas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Practice your skills with real-world projects. Each project includes detailed steps, requirements, and expected deliverables.
            </p>
          </div>

          <Card className="glass-card p-6 border-primary/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg gradient-secondary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">Need More Ideas?</h3>
                <p className="text-sm text-muted-foreground">
                  Ask our AI assistant to generate custom project ideas based on your skill level and interests.
                </p>
                <Button className="gradient-primary text-white border-0">
                  Ask AI for Ideas
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
            <Select defaultValue="duration">
              <SelectTrigger className="w-full md:w-48 glass-surface">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="glass-card group hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-display font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <Badge className={difficultyColors[project.difficulty]} variant="secondary">
                        {project.difficulty}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Code2 className="h-3.5 w-3.5" />
                          <span>{project.steps} steps</span>
                        </div>
                      </div>

                      <Button
                        className="w-full group-hover:gradient-primary group-hover:text-white transition-all"
                        variant="outline"
                      >
                        <span>Start Project</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Projects;
