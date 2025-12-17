import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExternalRoadmaps } from '@/hooks/useExternalApi';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Map, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Roadmaps = () => {
  const { data: roadmaps, isLoading, error, refetch } = useExternalRoadmaps();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading roadmaps...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Failed to load roadmaps</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl gradient-primary">
                <Map className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold">Learning Roadmaps</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow structured learning paths to master new skills. Each roadmap contains sections with curated resources to guide your journey.
            </p>
          </div>

          {!roadmaps || roadmaps.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No roadmaps available yet</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {roadmaps.map((roadmap, idx) => (
                <motion.div
                  key={roadmap._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card p-6 h-full flex flex-col hover:border-primary/50 transition-all group">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {roadmap.title}
                        </h2>
                        <Badge variant="secondary">
                          {roadmap.sections.length} sections
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {roadmap.description}
                      </p>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-border">
                      <Button asChild className="w-full gradient-primary text-white border-0">
                        <Link to={`/roadmap/${roadmap._id}`}>
                          Start Learning
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Roadmaps;
