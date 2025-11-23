import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const QUESTIONS_PER_PAGE = 10;

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchQuiz();
  }, [id, user]);

  useEffect(() => {
    if (quiz && quiz.time_limit_minutes && timeLeft === null) {
      setTimeLeft(quiz.time_limit_minutes * 60);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*, roadmap:roadmaps(*)')
        .eq('id', id)
        .single();

      setQuiz(quizData);

      const { data: questionsData } = await supabase
        .from('questions')
        .select('*, choices:question_choices(*)')
        .eq('quiz_id', id)
        .order('order_index');

      setQuestions(questionsData || []);

      // Create quiz attempt
      const { data: attemptData } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          quiz_id: id,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      setAttemptId(attemptData?.id);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      // Calculate score
      let correct = 0;
      const answersArray = questions.map((q) => {
        const userChoice = q.choices.find((c: any) => c.id === answers[q.id]);
        const isCorrect = userChoice?.is_correct || false;
        if (isCorrect) correct++;

        return {
          question_id: q.id,
          choice_id: answers[q.id],
          is_correct: isCorrect,
        };
      });

      const score = correct;
      const percentage = (correct / questions.length) * 100;

      // Update attempt
      await supabase
        .from('quiz_attempts')
        .update({
          finished_at: new Date().toISOString(),
          score,
          percentage: Number(percentage.toFixed(2)),
          answers: answersArray,
        })
        .eq('id', attemptId);

      navigate(`/quiz/${id}/results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
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

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);
  const progress = (Object.keys(answers).length / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground">{quiz.roadmap?.title}</p>
              </div>
              {timeLeft !== null && (
                <Card className="glass-card p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </Card>
              )}
            </div>

            <Card className="glass-card p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {Object.keys(answers).length} / {questions.length} answered
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            </Card>
          </motion.div>

          {/* Questions */}
          <div className="space-y-6">
            {currentQuestions.map((question, idx) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-card p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="shrink-0">
                      Q{startIdx + idx + 1}
                    </Badge>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-lg font-semibold">{question.prompt}</h3>
                      
                      {question.hint && (
                        <p className="text-sm text-muted-foreground italic">
                          Hint: {question.hint}
                        </p>
                      )}

                      <RadioGroup
                        value={answers[question.id]}
                        onValueChange={(value) => 
                          setAnswers({ ...answers, [question.id]: value })
                        }
                      >
                        {question.choices.map((choice: any) => (
                          <div
                            key={choice.id}
                            className="flex items-center space-x-2 p-3 rounded-lg glass-surface hover:border-primary/50 transition-all"
                          >
                            <RadioGroupItem value={choice.id} id={choice.id} />
                            <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                              {choice.choice_text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      idx === currentPage
                        ? 'gradient-primary text-white'
                        : 'glass-surface hover:border-primary/50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentPage === totalPages - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || Object.keys(answers).length < questions.length}
                  className="gradient-primary text-white border-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  variant="outline"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
