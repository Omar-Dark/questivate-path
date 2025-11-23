import { Navbar } from "@/components/Navbar";
import { ProgressCircle } from "@/components/ProgressCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AIChat } from "@/components/AIChat";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
  Bookmark
} from "lucide-react";

const mockTrack = {
  id: "react-mastery",
  title: "React Mastery",
  description: "Learn React from basics to advanced patterns. Hooks, context, performance optimization, and modern best practices.",
  difficulty: "intermediate",
  duration: "60 hours",
  progress: 35,
  sections: [
    {
      id: "s1",
      title: "React Fundamentals",
      duration: "12 hours",
      completed: true,
      resources: [
        { id: "r1", type: "video", title: "Introduction to React", duration: "45 min", completed: true },
        { id: "r2", type: "article", title: "JSX and Components", duration: "20 min", completed: true },
        { id: "r3", type: "course", title: "Props and State", duration: "90 min", completed: true },
      ]
    },
    {
      id: "s2",
      title: "React Hooks",
      duration: "15 hours",
      completed: false,
      current: true,
      resources: [
        { id: "r4", type: "video", title: "useState Hook", duration: "40 min", completed: true },
        { id: "r5", type: "video", title: "useEffect Hook", duration: "55 min", completed: true },
        { id: "r6", type: "article", title: "Custom Hooks", duration: "30 min", completed: false },
        { id: "r7", type: "course", title: "Advanced Hook Patterns", duration: "120 min", completed: false },
      ]
    },
    {
      id: "s3",
      title: "State Management",
      duration: "18 hours",
      completed: false,
      resources: [
        { id: "r8", type: "video", title: "Context API", duration: "50 min", completed: false },
        { id: "r9", type: "article", title: "Redux Fundamentals", duration: "40 min", completed: false },
        { id: "r10", type: "course", title: "Zustand State Manager", duration: "90 min", completed: false },
      ]
    },
    {
      id: "s4",
      title: "Performance Optimization",
      duration: "15 hours",
      completed: false,
      resources: [
        { id: "r11", type: "video", title: "React.memo and useMemo", duration: "45 min", completed: false },
        { id: "r12", type: "article", title: "Code Splitting", duration: "25 min", completed: false },
      ]
    },
  ],
};

const resourceIcons = {
  video: Video,
  article: FileText,
  course: Book,
};

const TrackDetail = () => {
  const { id } = useParams();

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
                {mockTrack.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      section.current
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {section.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="line-clamp-1">{section.title}</span>
                    </div>
                  </button>
                ))}
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
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                  {mockTrack.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {mockTrack.duration}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                {mockTrack.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {mockTrack.description}
              </p>
              <div className="flex gap-3">
                <Button className="gradient-primary text-white border-0">
                  Continue Learning
                </Button>
                <Button variant="outline" className="glass-surface">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="glass-surface">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Sections Timeline */}
            <div className="space-y-8">
              {mockTrack.sections.map((section, sectionIdx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="relative"
                >
                  <Card className={`glass-card p-6 space-y-4 ${
                    section.current ? "border-primary" : ""
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {section.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <h3 className="text-xl font-display font-semibold">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {section.duration}
                        </p>
                      </div>
                      {section.current && (
                        <Badge className="bg-primary/10 text-primary">Current</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      {section.resources.map((resource) => {
                        const Icon = resourceIcons[resource.type as keyof typeof resourceIcons];
                        return (
                          <button
                            key={resource.id}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">
                                {resource.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {resource.duration}
                              </p>
                            </div>
                            {resource.completed && (
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
                  <ProgressCircle progress={mockTrack.progress} label="Overall Progress" />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sections</span>
                    <span className="font-medium">1 / 4 Complete</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resources</span>
                    <span className="font-medium">5 / 12 Complete</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Spent</span>
                    <span className="font-medium">21 hours</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="gradient-primary text-white border-0">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="glass-surface">
                    <Bookmark className="h-4 w-4" />
                  </Button>
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
      <AIChat context={{ roadmapId: mockTrack.id }} />
    </div>
  );
};

export default TrackDetail;
