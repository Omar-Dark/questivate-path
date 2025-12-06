import { useQuery } from "@tanstack/react-query";

// External API endpoint
const ROADMAP_API_URL = "https://roadmap-project-chi.vercel.app/";

// Since the API returns only a status message, we define the expected roadmap structure
// and use fallback data when the API doesn't return actual roadmap data
export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked" | "available";
  order: number;
  resources?: {
    title: string;
    url: string;
    type: "video" | "article" | "documentation";
  }[];
  skills?: string[];
  estimatedHours?: number;
}

export interface ExternalRoadmap {
  id: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  totalSteps: number;
  completedSteps: number;
}

// Fallback roadmap data when API doesn't return expected structure
const fallbackRoadmaps: ExternalRoadmap[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer Path",
    description: "Master modern frontend development from basics to advanced concepts",
    totalSteps: 8,
    completedSteps: 3,
    nodes: [
      {
        id: "html-basics",
        title: "HTML Fundamentals",
        description: "Learn semantic HTML5, forms, accessibility, and best practices for structuring web content.",
        status: "completed",
        order: 1,
        estimatedHours: 10,
        skills: ["HTML5", "Semantic Markup", "Accessibility"],
        resources: [
          { title: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", type: "documentation" },
          { title: "HTML Crash Course", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", type: "video" },
        ],
      },
      {
        id: "css-styling",
        title: "CSS & Styling",
        description: "Master CSS layouts, Flexbox, Grid, animations, and responsive design patterns.",
        status: "completed",
        order: 2,
        estimatedHours: 15,
        skills: ["CSS3", "Flexbox", "Grid", "Animations"],
        resources: [
          { title: "CSS Complete Guide", url: "https://css-tricks.com/", type: "article" },
          { title: "Flexbox Froggy", url: "https://flexboxfroggy.com/", type: "documentation" },
        ],
      },
      {
        id: "javascript-core",
        title: "JavaScript Core",
        description: "Understand JavaScript fundamentals, ES6+, DOM manipulation, and async programming.",
        status: "completed",
        order: 3,
        estimatedHours: 25,
        skills: ["JavaScript", "ES6+", "DOM", "Async/Await"],
        resources: [
          { title: "JavaScript.info", url: "https://javascript.info/", type: "documentation" },
          { title: "JS Fundamentals", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", type: "video" },
        ],
      },
      {
        id: "react-basics",
        title: "React Fundamentals",
        description: "Learn React components, hooks, state management, and modern React patterns.",
        status: "in-progress",
        order: 4,
        estimatedHours: 30,
        skills: ["React", "JSX", "Hooks", "State Management"],
        resources: [
          { title: "React Docs", url: "https://react.dev/", type: "documentation" },
          { title: "React Tutorial", url: "https://www.youtube.com/watch?v=Rh3tobg7hEo", type: "video" },
        ],
      },
      {
        id: "typescript",
        title: "TypeScript",
        description: "Add type safety to your JavaScript with TypeScript fundamentals and advanced types.",
        status: "available",
        order: 5,
        estimatedHours: 20,
        skills: ["TypeScript", "Type Safety", "Generics"],
        resources: [
          { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", type: "documentation" },
        ],
      },
      {
        id: "state-management",
        title: "State Management",
        description: "Master state management with Context API, Redux, Zustand, and TanStack Query.",
        status: "locked",
        order: 6,
        estimatedHours: 15,
        skills: ["Redux", "Context API", "Zustand"],
      },
      {
        id: "testing",
        title: "Testing & Quality",
        description: "Write tests with Jest, React Testing Library, and implement CI/CD practices.",
        status: "locked",
        order: 7,
        estimatedHours: 15,
        skills: ["Jest", "Testing Library", "E2E Testing"],
      },
      {
        id: "performance",
        title: "Performance & Deployment",
        description: "Optimize React apps, implement lazy loading, and deploy to production.",
        status: "locked",
        order: 8,
        estimatedHours: 12,
        skills: ["Performance", "Optimization", "Deployment"],
      },
    ],
  },
  {
    id: "backend-developer",
    title: "Backend Developer Path",
    description: "Build scalable server-side applications and APIs",
    totalSteps: 6,
    completedSteps: 1,
    nodes: [
      {
        id: "node-basics",
        title: "Node.js Fundamentals",
        description: "Learn Node.js runtime, modules, file system, and async patterns.",
        status: "completed",
        order: 1,
        estimatedHours: 20,
        skills: ["Node.js", "NPM", "Async Patterns"],
      },
      {
        id: "express-api",
        title: "Express & REST APIs",
        description: "Build RESTful APIs with Express, middleware, and routing.",
        status: "in-progress",
        order: 2,
        estimatedHours: 25,
        skills: ["Express", "REST", "Middleware"],
      },
      {
        id: "databases",
        title: "Databases",
        description: "Master SQL and NoSQL databases, ORMs, and data modeling.",
        status: "available",
        order: 3,
        estimatedHours: 30,
        skills: ["PostgreSQL", "MongoDB", "Prisma"],
      },
      {
        id: "auth-security",
        title: "Authentication & Security",
        description: "Implement JWT, OAuth, and security best practices.",
        status: "locked",
        order: 4,
        estimatedHours: 20,
        skills: ["JWT", "OAuth", "Security"],
      },
      {
        id: "graphql",
        title: "GraphQL",
        description: "Build GraphQL APIs with Apollo Server and schema design.",
        status: "locked",
        order: 5,
        estimatedHours: 20,
        skills: ["GraphQL", "Apollo", "Schema Design"],
      },
      {
        id: "devops-basics",
        title: "DevOps Basics",
        description: "Docker, CI/CD, and cloud deployment essentials.",
        status: "locked",
        order: 6,
        estimatedHours: 25,
        skills: ["Docker", "CI/CD", "AWS/GCP"],
      },
    ],
  },
];

async function fetchExternalRoadmap(): Promise<ExternalRoadmap[]> {
  try {
    const response = await fetch(ROADMAP_API_URL);
    const data = await response.json();
    
    // Check if the API returns actual roadmap data
    if (data.roadmaps && Array.isArray(data.roadmaps)) {
      return data.roadmaps;
    }
    
    // If API only returns status message, use fallback data
    console.log("API returned:", data.message || "No roadmap data");
    return fallbackRoadmaps;
  } catch (error) {
    console.error("Failed to fetch from external API, using fallback:", error);
    return fallbackRoadmaps;
  }
}

export function useExternalRoadmap() {
  return useQuery({
    queryKey: ["external-roadmap"],
    queryFn: fetchExternalRoadmap,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useRoadmapById(id: string) {
  const { data: roadmaps, ...rest } = useExternalRoadmap();
  
  const roadmap = roadmaps?.find((r) => r.id === id);
  
  return {
    data: roadmap,
    ...rest,
  };
}
