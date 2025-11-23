import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrackCard } from "@/components/TrackCard";
import { ArrowRight, BookOpen, Trophy, Users, Zap, Target, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const featuredTracks = [
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
];

const features = [
  {
    icon: BookOpen,
    title: "Curated Learning Paths",
    description: "Structured roadmaps with hand-picked resources from industry experts",
  },
  {
    icon: Trophy,
    title: "Track Your Progress",
    description: "Visual progress tracking, achievements, and milestones to keep you motivated",
  },
  {
    icon: Brain,
    title: "100-Question Quizzes",
    description: "Test your knowledge with comprehensive quizzes and detailed mistake reviews",
  },
  {
    icon: Target,
    title: "50+ Project Ideas",
    description: "Practice with real-world projects and get AI-generated suggestions",
  },
  {
    icon: Zap,
    title: "AI Assistant",
    description: "Get personalized help and suggestions from our intelligent chatbot",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Compete on leaderboards and share your achievements",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface"
                >
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">AI-Powered Learning Platform</span>
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                  Master Skills,
                  <br />
                  <span className="text-gradient">Track Progress</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Structured learning roadmaps, comprehensive quizzes, and real-world projects to accelerate your tech journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/tracks">
                  <Button size="lg" className="gradient-primary text-white border-0 text-lg px-8 group">
                    Browse Tracks
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="glass-surface text-lg px-8">
                    Explore Projects
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-display font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Learning Tracks</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <p className="text-3xl font-display font-bold text-primary">100+</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <p className="text-3xl font-display font-bold text-primary">10K+</p>
                  <p className="text-sm text-muted-foreground">Learners</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-3xl" />
              <img
                src={heroImage}
                alt="Learning Platform"
                className="relative rounded-2xl shadow-2xl glass-card"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete learning ecosystem designed to help you succeed in tech
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card p-6 space-y-4 h-full hover:border-primary/50 transition-all duration-300 group">
                  <div className="p-3 rounded-xl gradient-primary w-fit">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Popular Learning Tracks
              </h2>
              <p className="text-lg text-muted-foreground">
                Start your journey with these curated paths
              </p>
            </div>
            <Link to="/tracks">
              <Button variant="outline" className="glass-surface hidden sm:flex">
                View All Tracks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTracks.map((track, index) => (
              <TrackCard key={track.id} {...track} delay={index * 0.1} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link to="/tracks">
              <Button variant="outline" className="w-full glass-surface">
                View All Tracks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card relative overflow-hidden">
              <div className="absolute inset-0 gradient-primary opacity-10" />
              <div className="relative p-12 md:p-16 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                  Ready to Start Learning?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of learners mastering tech skills with structured roadmaps and hands-on projects.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="gradient-primary text-white border-0 text-lg px-8">
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" className="glass-surface text-lg px-8">
                    View Demo
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
