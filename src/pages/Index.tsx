import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Trophy, Users, Zap, Target, Brain, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

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
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  
  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  // Fetch roadmaps
  const { data: roadmaps } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("published", true)
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  // Fetch user progress
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isDaytime = currentTime >= 6 && currentTime < 18;

  const title = "Master Your Skills";
  const subtitle = "Track Your Progress";

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      
      {/* Parallax Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Animated Background Layers */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 -z-20"
        >
          <div className={`absolute inset-0 transition-all duration-1000 ${
            isDaytime 
              ? 'bg-gradient-to-br from-primary/10 via-background to-accent/10' 
              : 'bg-gradient-to-br from-primary/20 via-background to-primary-light/20'
          }`} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 h-full flex items-center">
          <motion.div
            style={{ x: smoothMouseX, y: smoothMouseY }}
            className="space-y-8 max-w-4xl"
          >
            {/* Letter-by-letter animated title */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card backdrop-blur-xl border border-primary/20"
              >
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  AI-Powered Learning Platform
                </span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight">
                {title.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                      ease: [0.6, 0.05, 0.01, 0.9],
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                  {subtitle.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: (title.length + i) * 0.05,
                        ease: [0.6, 0.05, 0.01, 0.9],
                      }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
              >
                Structured learning roadmaps with AI assistance, comprehensive quizzes, and real-world projects.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/tracks">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white border-0 text-lg px-10 py-7 group shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-card backdrop-blur-xl text-lg px-10 py-7 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                >
                  Join Free
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              className="flex items-center gap-8 pt-8"
            >
              {[
                { value: "50+", label: "Learning Tracks" },
                { value: "100+", label: "Projects" },
                { value: "10K+", label: "Students" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3 + i * 0.2 }}
                  className="group cursor-pointer"
                >
                  <p className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* 3D Carousel Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Trending Learning Paths
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands mastering these curated tracks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmaps?.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50,
                }}
                className="group"
              >
                <Link to={`/track/${roadmap.slug}`}>
                  <Card className="glass-card backdrop-blur-xl border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
                    {roadmap.cover_image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <motion.img
                          src={roadmap.cover_image_url}
                          alt={roadmap.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          roadmap.difficulty === 'beginner' 
                            ? 'bg-primary/20 text-primary' 
                            : roadmap.difficulty === 'intermediate'
                            ? 'bg-primary-light/20 text-primary-light'
                            : 'bg-accent/20 text-accent-foreground'
                        }`}>
                          {roadmap.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {roadmap.estimated_hours}h
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                        {roadmap.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {roadmap.description}
                      </p>
                      {user && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-primary">
                              {getProgressForRoadmap(roadmap.id)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${getProgressForRoadmap(roadmap.id)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full gradient-primary"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/tracks">
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-card backdrop-blur-xl border-primary/30 hover:border-primary hover:bg-primary/10 px-8 group"
              >
                Explore All Tracks
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Glassmorphism Features */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display font-bold">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              A complete ecosystem for your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="glass-card backdrop-blur-xl border-primary/20 p-8 space-y-4 h-full group hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                  <motion.div 
                    className="p-4 rounded-2xl gradient-primary w-fit"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Confetti Effect */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass-card backdrop-blur-xl relative overflow-hidden border-primary/30">
              <div className="absolute inset-0 gradient-primary opacity-10" />
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              <div className="relative p-16 md:p-24 text-center space-y-8">
                <motion.h2 
                  className="text-5xl md:text-7xl font-display font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Ready to Transform Your Future?
                </motion.h2>
                <motion.p 
                  className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Join thousands of learners mastering tech skills with AI-powered guidance and structured roadmaps.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                >
                  <Link to="/auth">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg" 
                        className="gradient-primary text-white border-0 text-xl px-12 py-8 shadow-2xl hover:shadow-primary/50"
                      >
                        Start Free Today
                        <Sparkles className="ml-2 h-6 w-6" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/tracks">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="glass-card backdrop-blur-xl text-xl px-12 py-8 border-primary/30 hover:border-primary hover:bg-primary/10"
                      >
                        Browse Courses
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
