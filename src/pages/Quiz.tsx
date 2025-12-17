import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useExternalQuiz } from '@/hooks/useExternalApi';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const QUESTIONS_PER_PAGE = 5;

interface QuizResult {
  questionId: string;
  question: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  options: string[];
}

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quizData, isLoading, error } = useExternalQuiz(id);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });

  const quiz = quizData?.quiz;
  const questions = quiz?.questions || [];

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    // Calculate results locally since the API may not have submit endpoint
    const calculatedResults: QuizResult[] = questions.map((q) => {
      const selected = answers[q._id] || '';
      const isCorrect = selected === q.answer;
      return {
        questionId: q._id,
        question: q.question,
        selectedOption: selected,
        correctAnswer: q.answer,
        isCorrect,
        options: q.options,
      };
    });

    const correctCount = calculatedResults.filter((r) => r.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    setResults(calculatedResults);
    setScore({ correct: correctCount, total: questions.length, percentage });
    setSubmitted(true);
    
    toast.success(`Quiz completed! Score: ${correctCount}/${questions.length} (${percentage}%)`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Failed to load quiz</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">This quiz has no questions yet</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // If submitted, show results
  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-3xl font-display font-bold">Quiz Results</h1>
              <p className="text-muted-foreground">{quiz.title}</p>
              
              <Card className="glass-card p-8 max-w-md mx-auto">
                <div className="text-6xl font-bold gradient-text mb-2">
                  {score.percentage}%
                </div>
                <p className="text-xl">
                  {score.correct} out of {score.total} correct
                </p>
                <Badge 
                  className={`mt-4 ${score.percentage >= 80 ? 'bg-green-500' : score.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                >
                  {score.percentage >= 80 ? 'Passed!' : score.percentage >= 60 ? 'Good Try' : 'Keep Practicing'}
                </Badge>
              </Card>
            </motion.div>

            {/* Questions Review */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Review Your Answers</h2>
              {results.map((result, idx) => (
                <motion.div
                  key={result.questionId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`p-6 ${result.isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
                    <div className="flex items-start gap-4">
                      <Badge variant={result.isCorrect ? "default" : "destructive"} className="shrink-0">
                        {result.isCorrect ? <Check className="h-4 w-4" /> : 'X'}
                      </Badge>
                      <div className="flex-1 space-y-3">
                        <h3 className="font-semibold">Q{idx + 1}: {result.question}</h3>
                        
                        <div className="space-y-2">
                          {result.options.map((option, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg border ${
                                option === result.correctAnswer
                                  ? 'bg-green-500/20 border-green-500'
                                  : option === result.selectedOption && !result.isCorrect
                                  ? 'bg-red-500/20 border-red-500'
                                  : 'bg-muted/30 border-border'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {option === result.correctAnswer && (
                                  <Badge className="bg-green-500">Correct</Badge>
                                )}
                                {option === result.selectedOption && option !== result.correctAnswer && (
                                  <Badge variant="destructive">Your Answer</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Back to Track
                </Button>
                <Button 
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers({});
                    setResults([]);
                    setCurrentPage(0);
                  }}
                  className="gradient-primary text-white border-0"
                >
                  Retry Quiz
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Quiz taking view
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);
  const progress = (Object.keys(answers).length / questions.length) * 100;

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
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>
              <Badge variant="secondary">{questions.length} Questions</Badge>
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
                key={question._id}
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
                      <h3 className="text-lg font-semibold">{question.question}</h3>

                      <RadioGroup
                        value={answers[question._id] || ''}
                        onValueChange={(value) => 
                          setAnswers({ ...answers, [question._id]: value })
                        }
                      >
                        {question.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`flex items-center space-x-2 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                              answers[question._id] === option 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border'
                            }`}
                          >
                            <RadioGroupItem value={option} id={`${question._id}-${optIdx}`} />
                            <Label htmlFor={`${question._id}-${optIdx}`} className="flex-1 cursor-pointer">
                              {option}
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
                        : 'border border-border hover:border-primary/50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentPage === totalPages - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length < questions.length}
                  className="gradient-primary text-white border-0"
                >
                  Submit Quiz
                  <Check className="h-4 w-4 ml-2" />
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
