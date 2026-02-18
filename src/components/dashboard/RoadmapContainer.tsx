import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExternalRoadmaps } from "@/hooks/useExternalApi";
import { RoadmapVisualizer } from "./RoadmapVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dummyRoadmaps = [
  {
    _id: '1', title: 'Frontend Development', description: 'Master modern frontend technologies.',
    sections: [
      { _id: 's1', title: 'HTML & CSS Basics', description: 'Learn the building blocks of the web.', difficulty: 'beginner' },
      { _id: 's2', title: 'JavaScript Fundamentals', description: 'Core JS concepts and ES6+.', difficulty: 'beginner' },
      { _id: 's3', title: 'React & State Management', description: 'Component-based UI development.', difficulty: 'intermediate' },
      { _id: 's4', title: 'Testing & Deployment', description: 'Write tests and deploy apps.', difficulty: 'advanced' },
    ],
    createdAt: '2025-01-01',
  },
  {
    _id: '2', title: 'Backend Development', description: 'Learn server-side programming.',
    sections: [
      { _id: 's5', title: 'Node.js & Express', description: 'Build REST APIs.', difficulty: 'beginner' },
      { _id: 's6', title: 'Databases & ORMs', description: 'SQL, NoSQL, and data modeling.', difficulty: 'intermediate' },
      { _id: 's7', title: 'Authentication & Security', description: 'Secure your applications.', difficulty: 'advanced' },
    ],
    createdAt: '2025-02-01',
  },
];

export function RoadmapContainer() {
  const { data: apiRoadmaps, isLoading, refetch } = useExternalRoadmaps();
  const roadmaps = apiRoadmaps && apiRoadmaps.length > 0 ? apiRoadmaps : dummyRoadmaps;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-4"
      >
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-neon-cyan" />
          <div className="absolute inset-0 h-12 w-12 animate-ping bg-neon-cyan/20 rounded-full" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading roadmaps...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Learning Roadmaps</h2>
          <p className="text-muted-foreground">
            Track your progress through curated learning paths
          </p>
        </div>
        <Button onClick={() => refetch()} variant="ghost" size="icon" className="text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue={roadmaps[0]?._id} className="w-full">
        <TabsList className="bg-card/50 border border-border p-1">
          {roadmaps.map((roadmap: any) => (
            <TabsTrigger
              key={roadmap._id}
              value={roadmap._id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan/20 data-[state=active]:to-neon-purple/20 data-[state=active]:text-neon-cyan"
            >
              {roadmap.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {roadmaps.map((roadmap: any) => (
          <TabsContent key={roadmap._id} value={roadmap._id} className="mt-6">
            <RoadmapVisualizer roadmap={roadmap} />
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
