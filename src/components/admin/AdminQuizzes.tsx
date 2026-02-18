import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  useExternalQuizzes,
  useExternalQuiz,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '@/hooks/useExternalApi';
import { ExternalQuiz, ExternalQuestion } from '@/lib/externalApi';
import { Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const dummyQuizzes = [
  {
    _id: 'dq1',
    title: 'HTML & CSS Fundamentals',
    description: 'Test your knowledge of basic web technologies.',
    questions: [
      { _id: 'dqq1', question: 'What does HTML stand for?', answer: 'HyperText Markup Language', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'] },
      { _id: 'dqq2', question: 'Which CSS property controls text size?', answer: 'font-size', options: ['text-size', 'font-size', 'text-style', 'font-style'] },
    ],
  },
  {
    _id: 'dq2',
    title: 'JavaScript Basics',
    description: 'Core JavaScript concepts quiz.',
    questions: [
      { _id: 'dqq3', question: 'Which keyword declares a constant?', answer: 'const', options: ['var', 'let', 'const', 'define'] },
    ],
  },
  {
    _id: 'dq3',
    title: 'React Essentials',
    description: 'Test your understanding of React fundamentals.',
    questions: [],
  },
];

// ======== Quiz Form ========
const QuizForm = ({ initial, onSubmit, onCancel }: {
  initial?: { title: string; description: string };
  onSubmit: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Quiz description" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="gradient-primary text-white border-0" onClick={() => onSubmit({ title, description })}>
          {initial ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

// ======== Question Form ========
const QuestionForm = ({ initial, onSubmit, onCancel }: {
  initial?: { question: string; answer: string; options: string[] };
  onSubmit: (data: { question: string; answer: string; options: string[] }) => void;
  onCancel: () => void;
}) => {
  const [question, setQuestion] = useState(initial?.question || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [options, setOptions] = useState<string[]>(initial?.options || ['', '', '', '']);

  const updateOption = (index: number, value: string) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What is...?" />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        {options.map((opt, i) => (
          <Input
            key={i}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
          />
        ))}
        {options.length < 6 && (
          <Button variant="ghost" size="sm" onClick={() => setOptions([...options, ''])}>
            <Plus className="h-3 w-3 mr-1" /> Add Option
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <Label>Correct Answer (must match one of the options exactly)</Label>
        <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Correct answer" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="gradient-primary text-white border-0" onClick={() => onSubmit({ question, answer, options: options.filter(o => o.trim()) })}>
          {initial ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

// ======== Quiz Questions Panel ========
const QuizQuestions = ({ quizId, dummyQuestions }: { quizId: string; dummyQuestions?: ExternalQuestion[] }) => {
  const { data, isLoading, refetch } = useExternalQuiz(quizId);
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExternalQuestion | null>(null);

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-primary mx-auto" />;

  const questions = data?.quiz?.questions || dummyQuestions || [];

  return (
    <div className="space-y-3 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Questions ({questions.length})</p>
        <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditing(null); }}>
          <Plus className="h-3 w-3 mr-1" /> Add Question
        </Button>
      </div>

      {(showForm || editing) && (
        <Card className="p-4 glass-surface">
          <QuestionForm
            initial={editing ? { question: editing.question, answer: editing.answer, options: editing.options } : undefined}
            onSubmit={(formData) => {
              if (editing) {
                updateQuestion.mutate({ questionId: editing._id, updates: formData }, {
                  onSuccess: () => { toast.success('Question updated'); setEditing(null); refetch(); },
                  onError: () => toast.error('Failed to update'),
                });
              } else {
                createQuestion.mutate({ quizId, data: formData }, {
                  onSuccess: () => { toast.success('Question created'); setShowForm(false); refetch(); },
                  onError: () => toast.error('Failed to create'),
                });
              }
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </Card>
      )}

      {questions.map((q: any, i: number) => (
        <div key={q._id} className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex gap-2 items-start">
              <Badge variant="outline" className="shrink-0 mt-0.5">{i + 1}</Badge>
              <p className="text-sm font-medium">{q.question}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(q)}><Pencil className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() =>
                deleteQuestion.mutate(q._id, {
                  onSuccess: () => { toast.success('Question deleted'); refetch(); },
                  onError: () => toast.error('Failed to delete'),
                })
              }><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 pl-8">
            {q.options.map((opt: string, j: number) => (
              <p key={j} className={`text-xs px-2 py-1 rounded ${opt === q.answer ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground'}`}>
                {opt}
              </p>
            ))}
          </div>
        </div>
      ))}

      {!questions.length && !showForm && (
        <p className="text-sm text-muted-foreground italic text-center py-4">No questions yet</p>
      )}
    </div>
  );
};

// ======== Main AdminQuizzes ========
export const AdminQuizzes = () => {
  const { data: apiQuizzes, isLoading, refetch } = useExternalQuizzes();
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const deleteQuiz = useDeleteQuiz();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExternalQuiz | null>(null);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  const quizzes = apiQuizzes?.length ? apiQuizzes : dummyQuizzes as any[];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        <Button className="gradient-primary text-white border-0" onClick={() => { setShowForm(true); setEditing(null); }}>
          <Plus className="h-4 w-4 mr-2" /> New Quiz
        </Button>
      </div>

      {(showForm || editing) && (
        <Card className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">{editing ? 'Edit Quiz' : 'Create Quiz'}</h3>
          <QuizForm
            initial={editing ? { title: editing.title, description: editing.description } : undefined}
            onSubmit={(data) => {
              if (editing) {
                updateQuiz.mutate({ id: editing._id, updates: data }, {
                  onSuccess: () => { toast.success('Quiz updated'); setEditing(null); refetch(); },
                  onError: () => toast.error('Failed to update'),
                });
              } else {
                createQuiz.mutate(data, {
                  onSuccess: () => { toast.success('Quiz created'); setShowForm(false); refetch(); },
                  onError: () => toast.error('Failed to create'),
                });
              }
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </Card>
      )}

      <div className="space-y-3">
        {quizzes?.map((q: any) => (
          <Collapsible
            key={q._id}
            open={expandedQuiz === q._id}
            onOpenChange={(open) => setExpandedQuiz(open ? q._id : null)}
          >
            <Card className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 font-medium hover:text-primary transition-colors text-left flex-1">
                    {expandedQuiz === q._id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    <HelpCircle className="h-4 w-4 text-primary" />
                    {q.title}
                  </button>
                </CollapsibleTrigger>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(q)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() =>
                    deleteQuiz.mutate(q._id, {
                      onSuccess: () => { toast.success('Quiz deleted'); refetch(); },
                      onError: () => toast.error('Failed to delete'),
                    })
                  }><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">{q.description}</p>
                <QuizQuestions quizId={q._id} dummyQuestions={q.questions} />
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {!quizzes?.length && !showForm && (
        <Card className="glass-card p-8 text-center text-muted-foreground">No quizzes found</Card>
      )}
    </div>
  );
};
