import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Code2, CheckCircle2, Circle, ExternalLink, AlertCircle } from "lucide-react";
import { useState } from "react";

const projectsData: Record<string, {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tech: string[];
  overview: string;
  steps: { title: string; description: string }[];
  deliverables: string[];
}> = {
  "1": {
    id: "1",
    title: "Personal Portfolio Website",
    description: "Build a modern, responsive portfolio website showcasing your work and skills.",
    difficulty: "beginner",
    duration: "8 hours",
    tech: ["HTML", "CSS", "JavaScript"],
    overview: "Create a professional portfolio website from scratch. You'll learn the fundamentals of web development including semantic HTML, modern CSS layouts with Flexbox and Grid, and interactive JavaScript elements.",
    steps: [
      { title: "Project Setup & Planning", description: "Set up your development environment, create the project structure, and plan your portfolio layout." },
      { title: "HTML Structure", description: "Build the semantic HTML structure for your portfolio including header, hero, about, projects, and contact sections." },
      { title: "CSS Styling & Layout", description: "Style your portfolio using modern CSS techniques including Flexbox, Grid, custom properties, and responsive design." },
      { title: "JavaScript Interactivity", description: "Add interactive features like smooth scrolling, theme toggle, form validation, and animation on scroll." },
      { title: "Deployment", description: "Deploy your portfolio to a free hosting service like GitHub Pages, Vercel, or Netlify." },
    ],
    deliverables: ["Fully responsive portfolio website", "At least 4 sections (Hero, About, Projects, Contact)", "Mobile-first design", "Deployed to a live URL"],
  },
  "2": {
    id: "2",
    title: "Task Management App",
    description: "Create a full-featured task manager with React.",
    difficulty: "intermediate",
    duration: "15 hours",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    overview: "Build a complete task management application using React. Learn component architecture, state management, local storage persistence, and modern UI patterns.",
    steps: [
      { title: "Project Setup", description: "Initialize a React + TypeScript project with Vite and configure Tailwind CSS." },
      { title: "Component Architecture", description: "Design and build reusable components: TaskList, TaskItem, TaskForm, FilterBar." },
      { title: "State Management", description: "Implement state management for tasks including add, edit, delete, and toggle completion." },
      { title: "Filtering & Sorting", description: "Add filtering by status (all, active, completed) and sorting by date or priority." },
      { title: "Local Storage", description: "Persist tasks to localStorage so they survive page reloads." },
      { title: "Drag & Drop", description: "Implement drag and drop reordering of tasks." },
      { title: "Categories & Tags", description: "Add category and tag support for organizing tasks." },
      { title: "Polish & Deploy", description: "Add animations, keyboard shortcuts, and deploy the application." },
    ],
    deliverables: ["CRUD operations for tasks", "Filtering and sorting", "Persistent storage", "Responsive design", "Drag and drop reordering"],
  },
  "3": {
    id: "3",
    title: "E-commerce Platform",
    description: "Build a complete e-commerce solution with product listings, cart, checkout, and payment integration.",
    difficulty: "advanced",
    duration: "40 hours",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    overview: "Create a full-stack e-commerce platform. You'll build everything from product catalog management to shopping cart functionality and Stripe payment integration.",
    steps: [
      { title: "Database Design", description: "Design the database schema for products, users, orders, and reviews." },
      { title: "Backend API", description: "Build RESTful API endpoints for products, authentication, cart, and orders." },
      { title: "Product Catalog", description: "Create the product listing page with search, filters, and pagination." },
      { title: "Product Detail Page", description: "Build individual product pages with images, descriptions, and reviews." },
      { title: "Shopping Cart", description: "Implement cart functionality with add, remove, and quantity updates." },
      { title: "User Authentication", description: "Add user registration, login, and profile management." },
      { title: "Checkout Flow", description: "Build the checkout process with address collection and order summary." },
      { title: "Payment Integration", description: "Integrate Stripe for secure payment processing." },
      { title: "Order Management", description: "Create order history, tracking, and email notifications." },
      { title: "Admin Dashboard", description: "Build an admin panel for managing products and orders." },
      { title: "Testing", description: "Write unit tests and integration tests for critical flows." },
      { title: "Deployment", description: "Deploy the full-stack application to production." },
    ],
    deliverables: ["Product catalog with search/filter", "Shopping cart", "Stripe payment integration", "User authentication", "Order management", "Admin dashboard"],
  },
  "4": {
    id: "4",
    title: "Weather Dashboard",
    description: "Fetch and display weather data from APIs.",
    difficulty: "beginner",
    duration: "6 hours",
    tech: ["JavaScript", "API", "Chart.js"],
    overview: "Build a weather dashboard that fetches real-time data from a weather API. Learn about HTTP requests, async/await, and data visualization with charts.",
    steps: [
      { title: "API Setup", description: "Register for a weather API key and understand the endpoints." },
      { title: "UI Layout", description: "Build the dashboard layout with search, current weather, and forecast sections." },
      { title: "API Integration", description: "Fetch weather data using fetch/axios and handle loading/error states." },
      { title: "Data Visualization", description: "Display temperature trends and forecasts using Chart.js." },
    ],
    deliverables: ["Current weather display", "5-day forecast", "Temperature chart", "City search functionality"],
  },
  "5": {
    id: "5",
    title: "Social Media Clone",
    description: "Create a Twitter-like social platform with posts, likes, comments, and real-time updates.",
    difficulty: "advanced",
    duration: "50 hours",
    tech: ["React", "Node.js", "WebSockets", "MongoDB"],
    overview: "Build a full social media platform with real-time features. Master WebSocket connections, complex state management, and social graph algorithms.",
    steps: [
      { title: "Database & Auth Setup", description: "Set up MongoDB schemas and JWT authentication." },
      { title: "User Profiles", description: "Build profile pages with avatars, bios, and follow/unfollow." },
      { title: "Post Creation", description: "Implement posting with text, images, and hashtags." },
      { title: "Feed Algorithm", description: "Create a personalized feed based on follows and engagement." },
      { title: "Likes & Comments", description: "Add like and comment functionality with nested replies." },
      { title: "Real-time Updates", description: "Implement WebSocket connections for live notifications." },
      { title: "Search & Discovery", description: "Build search for users, posts, and trending topics." },
      { title: "Direct Messages", description: "Add real-time private messaging between users." },
      { title: "Notifications", description: "Create a notification system for likes, comments, follows." },
      { title: "Content Moderation", description: "Implement reporting and content moderation tools." },
      { title: "Performance Optimization", description: "Add infinite scroll, image optimization, and caching." },
      { title: "Testing & Deployment", description: "Comprehensive testing and production deployment." },
      { title: "Analytics Dashboard", description: "Build user engagement analytics." },
      { title: "Mobile Responsiveness", description: "Ensure full mobile experience." },
      { title: "Final Polish", description: "Edge cases, accessibility, and documentation." },
    ],
    deliverables: ["User authentication", "Post CRUD with media", "Real-time feed", "Likes, comments, follows", "Direct messaging", "Notifications"],
  },
  "6": {
    id: "6",
    title: "Blog Platform",
    description: "Build a blogging platform with markdown support, categories, tags, and a comment system.",
    difficulty: "intermediate",
    duration: "20 hours",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    overview: "Create a full-featured blogging platform with server-side rendering, markdown editing, and a robust comment system.",
    steps: [
      { title: "Project Setup", description: "Initialize Next.js with TypeScript and configure Prisma ORM." },
      { title: "Database Schema", description: "Design schemas for posts, categories, tags, comments, and users." },
      { title: "Authentication", description: "Implement NextAuth.js for social and email authentication." },
      { title: "Markdown Editor", description: "Build a rich markdown editor with live preview." },
      { title: "Blog Post Pages", description: "Create dynamic blog post pages with SSR and SEO optimization." },
      { title: "Categories & Tags", description: "Implement category and tag management with filtering." },
      { title: "Comment System", description: "Build nested comments with moderation capabilities." },
      { title: "Search", description: "Add full-text search across blog posts." },
      { title: "RSS Feed", description: "Generate RSS feeds for blog subscriptions." },
      { title: "Deploy", description: "Deploy to Vercel with database on Railway or Supabase." },
    ],
    deliverables: ["Markdown blog editor", "SSR blog pages", "Category/tag system", "Nested comments", "Full-text search", "RSS feed"],
  },
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = id ? projectsData[id] : null;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (idx: number) => {
    const next = new Set(completedSteps);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompletedSteps(next);
  };

  const progressPercent = project ? Math.round((completedSteps.size / project.steps.length) * 100) : 0;

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Project not found</h1>
            <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
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
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
              </Link>
            </Button>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-display font-bold">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{project.description}</p>
              </div>
              <Badge className={difficultyColors[project.difficulty]} variant="secondary">
                {project.difficulty}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{project.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code2 className="h-4 w-4" />
                <span>{project.steps.length} steps</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          </motion.div>

          <Card className="glass-card p-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">{completedSteps.size} / {project.steps.length} steps</span>
            </div>
            <Progress value={progressPercent} />
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-display font-semibold">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{project.overview}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-display font-semibold">Project Steps</h2>
            <div className="space-y-3">
              {project.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${completedSteps.has(idx) ? 'border-primary/30 bg-primary/5' : ''}`}
                    onClick={() => toggleStep(idx)}
                  >
                    <div className="flex items-start gap-3">
                      {completedSteps.has(idx) ? (
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">Step {idx + 1}: {step.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-display font-semibold">Deliverables</h2>
            <Card className="glass-card p-6">
              <ul className="space-y-2">
                {project.deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
