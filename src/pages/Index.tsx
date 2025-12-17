import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Trophy, Users, Zap, Target, Brain, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useExternalRoadmaps } from "@/hooks/useExternalApi";
import { isAuthenticated } from "@/lib/externalApi";

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
    title: "Comprehensive Quizzes",
    description: "Test your knowledge with quizzes and detailed mistake reviews",
  },
  {
    icon: Target,
    title: "Real Resources",
    description: "Access curated articles, videos, and documentation",
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
  const { scrollYProgress } = useScroll();
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  const { data: roadmaps } = useExternalRoadmaps();

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
                { value: `${roadmaps?.length || 0}+`, label: "Learning Tracks" },
                { value: "100+", label: "Resources" },
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

      {/* Roadmaps Section */}
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
            {roadmaps?.slice(0, 6).map((roadmap, index) => (
              <motion.div
                key={roadmap._id}
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
                <Link to={`/roadmap/${roadmap._id}`}>
                  <Card className="glass-card backdrop-blur-xl border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">
                        {roadmap.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {roadmap.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {roadmap.sections?.length || 0} sections
                      </div>
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
            <Link to="/roadmaps">
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

      {/* Features Section */}
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
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <Card className="glass-card backdrop-blur-xl h-full p-8 space-y-4 border-transparent hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    className="relative w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-500"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="relative text-xl font-display font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="relative text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-light/10 to-primary/20" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 relative text-center space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who are accelerating their careers with structured learning paths.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="gradient-primary text-white border-0 text-lg px-10 py-7 shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2024 SkillPath. All rights reserved.
            </p>
            <div className="flex gap-6 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
