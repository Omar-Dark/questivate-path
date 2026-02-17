import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExternalQuizzes } from '@/hooks/useExternalApi';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const dummyQuizzes = [
  { _id: '1', title: 'JavaScript Fundamentals', description: 'Test your knowledge of JavaScript basics including variables, functions, closures, and ES6+ features.', rank: 'Beginner' },
  { _id: '2', title: 'React & Hooks Deep Dive', description: 'Challenge yourself with questions on React components, hooks, state management, and performance optimization.', rank: 'Intermediate' },
  { _id: '3', title: 'TypeScript Mastery', description: 'Explore advanced TypeScript concepts like generics, utility types, conditional types, and type guards.', rank: 'Advanced' },
  { _id: '4', title: 'CSS & Tailwind', description: 'From flexbox to grid, animations to responsive design — prove your styling expertise.', rank: 'Beginner' },
  { _id: '5', title: 'Node.js & Express', description: 'Backend fundamentals covering middleware, routing, authentication, and RESTful API design patterns.', rank: 'Intermediate' },
  { _id: '6', title: 'Data Structures & Algorithms', description: 'Classic CS problems: arrays, trees, graphs, sorting, and dynamic programming challenges.', rank: 'Advanced' },
];

const Quizzes = () => {
  const { data: apiQuizzes, isLoading, error, refetch } = useExternalQuizzes();
  const quizzes = apiQuizzes && apiQuizzes.length > 0 ? apiQuizzes : dummyQuizzes;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading quizzes...</p>
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
          <p className="text-muted-foreground">Failed to load quizzes</p>
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
            <h1 className="text-4xl font-display font-bold">Available Quizzes</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge with our collection of quizzes. Each quiz contains multiple-choice questions to help you assess your understanding.
            </p>
          </div>

          {!quizzes || quizzes.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No quizzes available yet</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz, idx) => (
                <motion.div
                  key={quiz._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-card p-6 h-full flex flex-col hover:border-primary/50 transition-all">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-semibold">{quiz.title}</h2>
                        {quiz.rank && (
                          <Badge variant="secondary">{quiz.rank}</Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {quiz.description}
                      </p>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-border">
                      <Button asChild className="w-full gradient-primary text-white border-0">
                        <Link to={`/quiz/${quiz._id}`}>
                          Start Quiz
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

export default Quizzes;
