import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface TrackCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  progress?: number;
  coverImage?: string;
  delay?: number;
}

export const TrackCard = ({
  id,
  title,
  description,
  difficulty,
  duration,
  progress = 0,
  coverImage,
  delay = 0,
}: TrackCardProps) => {
  const difficultyColors = {
    beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/roadmap/${id}`}>
        <Card className="glass-card group hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
          {coverImage && (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-display font-semibold group-hover:text-primary transition-colors">
                {title}
              </h3>
              <Badge className={difficultyColors[difficulty]} variant="secondary">
                {difficulty}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>{progress}% Complete</span>
              </div>
            </div>

            {progress > 0 && (
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: delay + 0.2 }}
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full group-hover:gradient-primary group-hover:text-white transition-all"
              variant="outline"
            >
              <span>Continue Learning</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
