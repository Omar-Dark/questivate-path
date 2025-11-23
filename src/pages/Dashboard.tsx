import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProgressCircle } from '@/components/ProgressCircle';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Trophy, Target, Clock, TrendingUp, 
  Award, Loader2, Code2 
} from 'lucide-react';

interface UserProgress {
  roadmap: any;
  progress_percent: number;
  last_accessed_at: string;
}

interface QuizAttempt {
  quiz: any;
  percentage: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*, roadmap:roadmaps(*)')
        .eq('user_id', user?.id)
        .order('last_accessed_at', { ascending: false })
        .limit(5);

      setUserProgress(progressData || []);

      // Fetch recent quiz attempts
      const { data: attemptsData } = await supabase
        .from('quiz_attempts')
        .select('*, quiz:quizzes(*, roadmap:roadmaps(*))')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setQuizAttempts(attemptsData || []);

      // Fetch user achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false })
        .limit(6);

      setAchievements(achievementsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const overallProgress = userProgress.length > 0 
    ? Math.round(userProgress.reduce((acc, p) => acc + p.progress_percent, 0) / userProgress.length)
    : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">
              Welcome back, {user?.user_metadata?.username || 'Learner'}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your learning progress and achievements
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl gradient-primary">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userProgress.length}</p>
                  <p className="text-sm text-muted-foreground">Active Tracks</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl gradient-secondary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizAttempts.length}</p>
                  <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Progress & Quizzes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold">Continue Learning</h2>
                  <Link to="/tracks">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>

                {userProgress.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">No active tracks yet</p>
                    <Link to="/tracks">
                      <Button className="gradient-primary text-white border-0">
                        Browse Tracks
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userProgress.map((progress) => (
                      <Link 
                        key={progress.roadmap.id} 
                        to={`/track/${progress.roadmap.slug}`}
                        className="block"
                      >
                        <Card className="glass-surface p-4 hover:border-primary/50 transition-all">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold">{progress.roadmap.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {progress.roadmap.description}
                                </p>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                {progress.roadmap.difficulty}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{progress.progress_percent}%</span>
                              </div>
                              <Progress value={progress.progress_percent} />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>

              {/* Recent Quiz Attempts */}
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold">Recent Quiz Results</h2>
                </div>

                {quizAttempts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No quiz attempts yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quizAttempts.map((attempt: any) => (
                      <Card key={attempt.id} className="glass-surface p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{attempt.quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {attempt.quiz.roadmap?.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${
                              attempt.percentage >= 70 ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {attempt.percentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(attempt.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Achievements & Quick Actions */}
            <div className="space-y-6">
              {/* Overall Progress */}
              <Card className="glass-card p-6">
                <div className="flex flex-col items-center gap-4">
                  <ProgressCircle progress={overallProgress} label="Overall Progress" />
                  <Button className="w-full gradient-primary text-white border-0">
                    View Detailed Stats
                  </Button>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold">Achievements</h2>
                  <Link to="/achievements">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>

                {achievements.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No achievements yet. Keep learning!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {achievements.map((ua: any) => (
                      <div 
                        key={ua.id}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg glass-surface hover:border-primary/50 transition-all"
                      >
                        <div className="text-3xl">{ua.achievement.icon || '🏆'}</div>
                        <p className="text-xs text-center font-medium line-clamp-2">
                          {ua.achievement.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card p-6 space-y-3">
                <h2 className="text-xl font-display font-semibold">Quick Actions</h2>
                <Link to="/projects">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Code2 className="h-5 w-5 mr-2" />
                    Browse Projects
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Trophy className="h-5 w-5 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
