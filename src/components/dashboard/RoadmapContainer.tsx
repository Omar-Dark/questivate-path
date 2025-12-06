import { motion } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExternalRoadmap } from "@/hooks/useExternalRoadmap";
import { RoadmapVisualizer } from "./RoadmapVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RoadmapContainer() {
  const { data: roadmaps, isLoading, isError, error, refetch } = useExternalRoadmap();

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
        <p className="text-muted-foreground animate-pulse">Loading roadmaps from API...</p>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 space-y-4"
      >
        <div className="p-4 rounded-full bg-destructive/10">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Failed to Load Roadmaps</h3>
          <p className="text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : "Unable to fetch roadmap data. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </motion.div>
    );
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 space-y-4"
      >
        <p className="text-muted-foreground">No roadmaps available</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
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

      <Tabs defaultValue={roadmaps[0]?.id} className="w-full">
        <TabsList className="bg-card/50 border border-border p-1">
          {roadmaps.map((roadmap) => (
            <TabsTrigger
              key={roadmap.id}
              value={roadmap.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan/20 data-[state=active]:to-neon-purple/20 data-[state=active]:text-neon-cyan"
            >
              {roadmap.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {roadmaps.map((roadmap) => (
          <TabsContent key={roadmap.id} value={roadmap.id} className="mt-6">
            <RoadmapVisualizer roadmap={roadmap} />
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
