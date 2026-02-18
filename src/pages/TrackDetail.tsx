import { Navbar } from "@/components/Navbar";
import { ProgressCircle } from "@/components/ProgressCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useExternalRoadmap, useRoadmapSections, useExternalQuizzes } from "@/hooks/useExternalApi";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Video, 
  FileText,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const resourceIcons = {
  video: Video,
  article: FileText,
};

const dummyRoadmaps: Record<string, any> = {
  '1': {
    _id: '1', title: 'Frontend Development', description: 'Master modern frontend technologies including HTML, CSS, JavaScript, and React. Build responsive, accessible web applications.',
  },
  '2': {
    _id: '2', title: 'Backend Development', description: 'Learn server-side programming with Node.js, Express, databases, and API design.',
  },
  '3': {
    _id: '3', title: 'Data Science', description: 'Explore data analysis, machine learning, and statistical modeling with Python.',
  },
  '4': {
    _id: '4', title: 'Mobile Development', description: 'Build cross-platform mobile apps with React Native and Flutter.',
  },
};

const dummySections: Record<string, any[]> = {
  '1': [
    { _id: 's1', title: 'HTML & CSS Basics', description: 'Learn the fundamentals of web structure and styling', difficulty: 'Beginner', resources: [
      { _id: 'r1', title: 'HTML Crash Course', url: '#', type: 'video' },
      { _id: 'r2', title: 'CSS Flexbox Guide', url: '#', type: 'article' },
      { _id: 'r3', title: 'Responsive Design Principles', url: '#', type: 'article' },
    ]},
    { _id: 's2', title: 'JavaScript Fundamentals', description: 'Core JavaScript concepts including variables, functions, and DOM manipulation', difficulty: 'Beginner', resources: [
      { _id: 'r4', title: 'JavaScript for Beginners', url: '#', type: 'video' },
      { _id: 'r5', title: 'ES6+ Features Guide', url: '#', type: 'article' },
    ]},
    { _id: 's3', title: 'React Essentials', description: 'Component-based architecture, hooks, and state management', difficulty: 'Intermediate', resources: [
      { _id: 'r6', title: 'React Official Tutorial', url: '#', type: 'article' },
      { _id: 'r7', title: 'React Hooks Deep Dive', url: '#', type: 'video' },
    ]},
  ],
  '2': [
    { _id: 's4', title: 'Node.js Basics', description: 'Server-side JavaScript runtime', difficulty: 'Beginner', resources: [
      { _id: 'r8', title: 'Node.js Getting Started', url: '#', type: 'video' },
    ]},
    { _id: 's5', title: 'REST API Design', description: 'Build RESTful APIs with Express', difficulty: 'Intermediate', resources: [
      { _id: 'r9', title: 'REST API Best Practices', url: '#', type: 'article' },
    ]},
  ],
  '3': [
    { _id: 's6', title: 'Python Fundamentals', description: 'Python programming basics for data science', difficulty: 'Beginner', resources: [
      { _id: 'r10', title: 'Python for Data Science', url: '#', type: 'video' },
    ]},
  ],
  '4': [
    { _id: 's7', title: 'React Native Setup', description: 'Environment setup and first app', difficulty: 'Beginner', resources: [
      { _id: 'r11', title: 'React Native Quickstart', url: '#', type: 'article' },
    ]},
  ],
};

const TrackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());

  const { data: apiRoadmap, isLoading: roadmapLoading, error: roadmapError } = useExternalRoadmap(id);
  const { data: apiSections, isLoading: sectionsLoading } = useRoadmapSections(id);
  const { data: quizzes } = useExternalQuizzes();

  const roadmap = apiRoadmap || (id ? dummyRoadmaps[id] : null);
  const sections = apiSections?.length ? apiSections : (id ? dummySections[id] || [] : []);

  const handleResourceClick = (resourceUrl: string, resourceId: string) => {
    if (resourceUrl) {
      window.open(resourceUrl, "_blank");
      const newCompleted = new Set(completedResources);
      newCompleted.add(resourceId);
      setCompletedResources(newCompleted);
      toast.success("Resource opened!");
    }
  };

  const getTotalResources = () => {
    return sections?.reduce((acc: number, section: any) => acc + section.resources.length, 0) || 0;
  };

  const getCompletedCount = () => completedResources.size;

  const getProgressPercent = () => {
    const total = getTotalResources();
    if (total === 0) return 0;
    return Math.round((getCompletedCount() / total) * 100);
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  if (roadmapLoading || sectionsLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading track...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Track not found</h1>
            <p className="text-muted-foreground">The track you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/roadmaps">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Roadmaps
              </Link>
            </Button>
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
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/roadmaps">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <h3 className="font-display font-semibold">Contents</h3>
              </div>
              <nav className="space-y-1">
                {sections?.map((section: any) => {
                  const sectionCompleted = section.resources.every((r: any) => 
                    completedResources.has(r._id)
                  );
                  return (
                    <div
                      key={section._id}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        {sectionCompleted && section.resources.length > 0 ? (
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
              <Button variant="ghost" size="sm" asChild className="lg:hidden">
                <Link to="/roadmaps">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Roadmaps
                </Link>
              </Button>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                {roadmap.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {roadmap.description}
              </p>

              {quizzes && quizzes.length > 0 && (
                <Card className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Available Quizzes</p>
                      <p className="text-xs text-muted-foreground">Test your knowledge</p>
                    </div>
                    <Button size="sm" asChild className="gradient-primary text-white border-0">
                      <Link to="/quizzes">View Quizzes</Link>
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <Separator />

            <div className="space-y-8">
              {(!sections || sections.length === 0) ? (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No sections available for this roadmap yet.</p>
                </Card>
              ) : (
                sections.map((section: any, sectionIdx: number) => (
                  <motion.div
                    key={section._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIdx * 0.1 }}
                    className="relative"
                  >
                    <Card className="glass-card p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {section.resources.length > 0 && section.resources.every((r: any) => completedResources.has(r._id)) ? (
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
                        <Badge variant="secondary" className="capitalize">
                          {section.difficulty}
                        </Badge>
                      </div>

                      {section.resources.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          No resources available for this section yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {section.resources.map((resource: any) => {
                            const Icon = resourceIcons[resource.type as keyof typeof resourceIcons] || FileText;
                            const isCompleted = completedResources.has(resource._id);
                            return (
                              <button
                                key={resource._id}
                                onClick={() => handleResourceClick(resource.url, resource._id)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left group"
                              >
                                <Icon className="h-4 w-4 text-primary" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium line-clamp-1 flex items-center gap-2">
                                    {resource.title}
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {resource.type}
                                  </p>
                                </div>
                                {isCompleted && (
                                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))
              )}
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sections</span>
                    <span className="font-medium">{sections?.length || 0}</span>
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
    </div>
  );
};

export default TrackDetail;
