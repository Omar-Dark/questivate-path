import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressCircle } from '@/components/ProgressCircle';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Check, X, Trophy, RotateCcw, Home, Loader2, BookOpen } from 'lucide-react';

const QuizResults = () => {
  const { id, attemptId } = useParams();
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [attemptId]);

  const fetchResults = async () => {
    try {
      const { data: attemptData } = await supabase
        .from('quiz_attempts')
        .select('*, quiz:quizzes(*, roadmap:roadmaps(*))')
        .eq('id', attemptId)
        .single();

      setAttempt(attemptData);

      const { data: questionsData } = await supabase
        .from('questions')
        .select('*, choices:question_choices(*)')
        .eq('quiz_id', attemptData.quiz_id)
        .order('order_index');

      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const passed = attempt.percentage >= (attempt.quiz.passing_score || 70);
  const mistakes = attempt.answers.filter((a: any) => !a.is_correct);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className={`glass-card p-8 border-2 ${
              passed ? 'border-green-500' : 'border-yellow-500'
            }`}>
              <div className="space-y-6">
                <div className="flex justify-center">
                  {passed ? (
                    <div className="p-4 rounded-full bg-green-500/10">
                      <Trophy className="h-16 w-16 text-green-600" />
                    </div>
                  ) : (
                    <div className="p-4 rounded-full bg-yellow-500/10">
                      <RotateCcw className="h-16 w-16 text-yellow-600" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">
                    {passed ? 'Congratulations! 🎉' : 'Good Effort!'}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {passed 
                      ? `You passed the ${attempt.quiz.title}!` 
                      : `You scored ${attempt.percentage}%. Keep practicing!`
                    }
                  </p>
                </div>

                <div className="flex justify-center">
                  <ProgressCircle 
                    progress={attempt.percentage} 
                    size={160}
                    strokeWidth={12}
                    label="Your Score"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="glass-surface p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{attempt.score}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="glass-surface p-4 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{mistakes.length}</p>
                    <p className="text-sm text-muted-foreground">Incorrect</p>
                  </div>
                  <div className="glass-surface p-4 rounded-lg">
                    <p className="text-2xl font-bold">{questions.length}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Link to={`/quiz/${id}`}>
                    <Button variant="outline" size="lg">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </Link>
                  <Link to={`/track/${attempt.quiz.roadmap?.slug}`}>
                    <Button className="gradient-primary text-white border-0" size="lg">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Back to Track
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mistake Review */}
          {mistakes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-600" />
                <h2 className="text-2xl font-display font-bold">Review Mistakes</h2>
              </div>

              {mistakes.map((answer: any, idx: number) => {
                const question = questions.find((q) => q.id === answer.question_id);
                if (!question) return null;

                const userChoice = question.choices.find((c: any) => c.id === answer.choice_id);
                const correctChoice = question.choices.find((c: any) => c.is_correct);

                return (
                  <Card key={answer.question_id} className="glass-card p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="shrink-0">
                        Q{questions.findIndex((q) => q.id === question.id) + 1}
                      </Badge>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold">{question.prompt}</h3>

                        {/* User's Answer */}
                        <div className="glass-surface border-red-500/50 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Your Answer
                          </p>
                          <p>{userChoice?.choice_text}</p>
                        </div>

                        {/* Correct Answer */}
                        <div className="glass-surface border-green-500/50 p-4 rounded-lg space-y-2">
                          <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Correct Answer
                          </p>
                          <p>{correctChoice?.choice_text}</p>
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="glass-surface p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2">Explanation</p>
                            <p className="text-sm text-muted-foreground">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {mistakes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card p-8 text-center">
                <Check className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-display font-bold mb-2">Perfect Score!</h2>
                <p className="text-muted-foreground">
                  You answered all questions correctly. Excellent work!
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
