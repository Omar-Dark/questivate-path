import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Loader2 } from 'lucide-react';

const Leaderboard = () => {
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Get top scorers based on quiz attempts
      const { data } = await supabase
        .from('quiz_attempts')
        .select('user_id, percentage, quiz:quizzes(title), created_at')
        .order('percentage', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(50);

      if (data) {
        // Group by user and calculate average
        const userScores: Record<string, any> = {};
        
        for (const attempt of data) {
          if (!userScores[attempt.user_id]) {
            userScores[attempt.user_id] = {
              user_id: attempt.user_id,
              totalScore: 0,
              count: 0,
              bestScore: 0,
            };
          }
          
          userScores[attempt.user_id].totalScore += attempt.percentage;
          userScores[attempt.user_id].count += 1;
          userScores[attempt.user_id].bestScore = Math.max(
            userScores[attempt.user_id].bestScore,
            attempt.percentage
          );
        }

        // Fetch user profiles
        const userIds = Object.keys(userScores);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        const scoreboard = Object.values(userScores)
          .map((score: any) => {
            const profile = profiles?.find((p) => p.id === score.user_id);
            return {
              ...score,
              avgScore: score.totalScore / score.count,
              username: profile?.username || 'Anonymous',
              avatar_url: profile?.avatar_url,
            };
          })
          .sort((a, b) => b.avgScore - a.avgScore)
          .slice(0, 100);

        setTopScorers(scoreboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <Award className="h-5 w-5 text-muted-foreground" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-500 bg-yellow-500/5';
    if (rank === 2) return 'border-gray-400 bg-gray-400/5';
    if (rank === 3) return 'border-amber-600 bg-amber-600/5';
    return '';
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
              <div className="p-4 rounded-full gradient-secondary">
                <Trophy className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Top performers based on quiz scores and learning progress
            </p>
          </div>

          {/* Top 3 */}
          {topScorers.length >= 3 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:order-1"
              >
                <Card className={`glass-card p-6 text-center space-y-4 ${getRankColor(2)}`}>
                  <Badge variant="secondary" className="bg-gray-400/20">
                    2nd Place
                  </Badge>
                  <div className="flex justify-center">
                    <Avatar className="h-20 w-20 border-4 border-gray-400">
                      <AvatarFallback className="text-2xl">
                        {topScorers[1].username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{topScorers[1].username}</p>
                    <p className="text-3xl font-bold text-gray-400 mt-2">
                      {topScorers[1].avgScore.toFixed(1)}%
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="md:order-2"
              >
                <Card className={`glass-card p-6 text-center space-y-4 ${getRankColor(1)} md:-mt-4`}>
                  <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500">
                    🏆 Champion
                  </Badge>
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24 border-4 border-yellow-500">
                      <AvatarFallback className="text-3xl">
                        {topScorers[0].username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-semibold text-xl">{topScorers[0].username}</p>
                    <p className="text-4xl font-bold text-yellow-500 mt-2">
                      {topScorers[0].avgScore.toFixed(1)}%
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:order-3"
              >
                <Card className={`glass-card p-6 text-center space-y-4 ${getRankColor(3)}`}>
                  <Badge variant="secondary" className="bg-amber-600/20 text-amber-700">
                    3rd Place
                  </Badge>
                  <div className="flex justify-center">
                    <Avatar className="h-20 w-20 border-4 border-amber-600">
                      <AvatarFallback className="text-2xl">
                        {topScorers[2].username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{topScorers[2].username}</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">
                      {topScorers[2].avgScore.toFixed(1)}%
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Full Leaderboard */}
          <Card className="glass-card max-w-4xl mx-auto">
            <div className="p-6 space-y-1">
              {topScorers.map((scorer, idx) => (
                <motion.div
                  key={scorer.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors ${
                    idx < 3 ? getRankColor(idx + 1) : ''
                  }`}
                >
                  <div className="w-12 flex justify-center">
                    {getRankIcon(idx + 1)}
                  </div>

                  <div className="w-8 text-center font-semibold text-muted-foreground">
                    #{idx + 1}
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {scorer.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold">{scorer.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {scorer.count} quiz{scorer.count !== 1 ? 'zes' : ''} completed
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">{scorer.avgScore.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Best: {scorer.bestScore.toFixed(1)}%
                    </p>
                  </div>
                </motion.div>
              ))}

              {topScorers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No quiz attempts yet. Be the first!
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Leaderboard;
