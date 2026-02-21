import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Pencil, BookOpen, Save, X,
  Trophy, CheckCircle2, Loader2, MapPin, Globe,
  Github, Linkedin, Phone, Calendar, Mail,
  BarChart3, FolderKanban, Route, Award
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema
const profileSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(50).regex(/^[a-zA-Z0-9_-]+$/),
  full_name: z.string().trim().max(100).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  avatar_url: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  website: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  github_url: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  linkedin_url: z.string().trim().url("Invalid URL").max(500).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

// Dummy statistics data
const dummyQuizHistory = [
  { id: "1", title: "JavaScript Basics", score: 92, date: "2026-02-15", passed: true },
  { id: "2", title: "React Hooks", score: 78, date: "2026-02-10", passed: true },
  { id: "3", title: "CSS Grid & Flexbox", score: 100, date: "2026-02-05", passed: true },
  { id: "4", title: "TypeScript Advanced", score: 65, date: "2026-01-28", passed: false },
  { id: "5", title: "Node.js Fundamentals", score: 88, date: "2026-01-20", passed: true },
];

const dummyTrackProgress = [
  { id: "1", name: "Frontend Development", progress: 72, status: "In Progress" },
  { id: "2", name: "Backend with Node.js", progress: 45, status: "In Progress" },
  { id: "3", name: "React Mastery", progress: 100, status: "Completed" },
  { id: "4", name: "DevOps Fundamentals", progress: 30, status: "In Progress" },
  { id: "5", name: "Python for Data Science", progress: 10, status: "Just Started" },
];

const dummyProjectProgress = [
  { id: "1", name: "E-Commerce App", progress: 85, status: "In Progress" },
  { id: "2", name: "Portfolio Website", progress: 100, status: "Completed" },
  { id: "3", name: "Chat Application", progress: 40, status: "In Progress" },
  { id: "4", name: "Task Manager API", progress: 0, status: "Not Started" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const statusColor = (status: string) => {
  if (status === "Completed") return "bg-green-500/15 text-green-500 border-green-500/30";
  if (status === "In Progress") return "bg-primary/15 text-primary border-primary/30";
  if (status === "Just Started") return "bg-secondary/15 text-secondary border-secondary/30";
  return "bg-muted text-muted-foreground border-border";
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Snapshot for cancel
  const [snapshot, setSnapshot] = useState<any>(null);

  const [stats, setStats] = useState({ totalProgress: 0, completedTracks: 0, quizzesTaken: 0, achievements: 0 });

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
        setFullName(profileData.full_name || "");
        setBio(profileData.bio || "");
        setAvatarUrl(profileData.avatar_url || "");
        setLocation(profileData.location || "");
        setWebsite(profileData.website || "");
        setGithubUrl(profileData.github_url || "");
        setLinkedinUrl(profileData.linkedin_url || "");
        setPhone(profileData.phone || "");
        setBirthDate(profileData.birth_date || "");
      }
      const { data: progressData } = await supabase.from("user_progress").select("*").eq("user_id", user?.id);
      const { data: quizData } = await supabase.from("quiz_attempts").select("*").eq("user_id", user?.id);
      const { data: achievementsData } = await supabase.from("user_achievements").select("*").eq("user_id", user?.id);
      const completed = progressData?.filter(p => p.progress_percent === 100) || [];
      setStats({
        totalProgress: progressData?.length || 0,
        completedTracks: completed.length,
        quizzesTaken: quizData?.length || 0,
        achievements: achievementsData?.length || 0,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setSnapshot({ username, fullName, bio, avatarUrl, location, website, githubUrl, linkedinUrl, phone, birthDate });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (snapshot) {
      setUsername(snapshot.username); setFullName(snapshot.fullName); setBio(snapshot.bio);
      setAvatarUrl(snapshot.avatarUrl); setLocation(snapshot.location); setWebsite(snapshot.website);
      setGithubUrl(snapshot.githubUrl); setLinkedinUrl(snapshot.linkedinUrl);
      setPhone(snapshot.phone); setBirthDate(snapshot.birthDate);
    }
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    const validationResult = profileSchema.safeParse({
      username, full_name: fullName, bio, avatar_url: avatarUrl, location,
      website: website || undefined, github_url: githubUrl || undefined,
      linkedin_url: linkedinUrl || undefined, phone,
    });
    if (!validationResult.success) { toast.error(validationResult.error.errors[0]?.message || "Invalid input"); return; }
    try {
      setSaving(true);
      const { error } = await supabase.from("profiles").update({
        username, full_name: fullName || null, bio: bio || null, avatar_url: avatarUrl || null,
        location: location || null, website: website || null, github_url: githubUrl || null,
        linkedin_url: linkedinUrl || null, phone: phone || null, birth_date: birthDate || null,
        updated_at: new Date().toISOString(),
      }).eq("id", user?.id);
      if (error) throw error;
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally { setSaving(false); }
  };

  const displayUsername = username || "johndoe";
  const displayFullName = fullName || "John Doe";
  const displayBio = bio || "Passionate full-stack developer with a love for clean code and learning new technologies.";
  const displayLocation = location || "San Francisco, CA";
  const displayEmail = user?.email || "john@example.com";
  const displayPhone = phone || "+1 234 567 8900";
  const displayBirthDate = birthDate || "1998-05-14";
  const displayStats = user ? stats : { totalProgress: 5, completedTracks: 2, quizzesTaken: 8, achievements: 3 };
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "January 2025";

  const avgQuizScore = Math.round(dummyQuizHistory.reduce((a, q) => a + q.score, 0) / dummyQuizHistory.length);

  if (authLoading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          {/* ─── HERO BANNER ─── */}
          <Card className="glass-card overflow-hidden">
            {/* Gradient banner */}
            <div className="h-36 sm:h-44 gradient-neon relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90" />
            </div>

            <div className="relative px-6 pb-6 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="rounded-full p-[3px] gradient-neon glow-cyan">
                  <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="gradient-primary text-3xl font-bold text-primary-foreground">
                      {(displayFullName).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Name / meta */}
              <div className="flex-1 min-w-0 space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">{displayFullName}</h1>
                <p className="text-muted-foreground text-sm">@{displayUsername}</p>
                <p className="text-sm text-foreground/80 line-clamp-2 max-w-xl">{displayBio}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  {displayLocation && (
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{displayLocation}</span>
                  )}
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Member since {memberSince}</span>
                </div>

                {/* Social icon buttons */}
                <TooltipProvider delayDuration={200}>
                  <div className="flex items-center gap-1.5 pt-2">
                    {(githubUrl || !user) && (
                      <Tooltip><TooltipTrigger asChild>
                        <a href={githubUrl || "#"} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Github className="h-4 w-4" /></Button>
                        </a>
                      </TooltipTrigger><TooltipContent>GitHub</TooltipContent></Tooltip>
                    )}
                    {(linkedinUrl || !user) && (
                      <Tooltip><TooltipTrigger asChild>
                        <a href={linkedinUrl || "#"} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Linkedin className="h-4 w-4" /></Button>
                        </a>
                      </TooltipTrigger><TooltipContent>LinkedIn</TooltipContent></Tooltip>
                    )}
                    {(website || !user) && (
                      <Tooltip><TooltipTrigger asChild>
                        <a href={website || "#"} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Globe className="h-4 w-4" /></Button>
                        </a>
                      </TooltipTrigger><TooltipContent>Website</TooltipContent></Tooltip>
                    )}
                  </div>
                </TooltipProvider>
              </div>

              {/* Edit / Save / Cancel */}
              <div className="shrink-0 flex gap-2 self-start sm:self-end">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
                    <Button size="sm" className="gradient-primary text-primary-foreground border-0" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}Save
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleEdit}><Pencil className="h-4 w-4 mr-1" />Edit Profile</Button>
                )}
              </div>
            </div>
          </Card>

          {/* ─── MAIN GRID ─── */}
          <div className="grid lg:grid-cols-5 gap-8">

            {/* LEFT – Profile Details (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card p-6 space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2"><User className="h-5 w-5 text-primary" />Personal Info</h2>

                {isEditing ? (
                  /* ─── EDIT MODE ─── */
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} className="glass-surface" /></div>
                    <div className="space-y-2"><Label>Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} className="glass-surface" /></div>
                    <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="glass-surface min-h-20" /></div>
                    <div className="space-y-2"><Label>Avatar URL</Label><Input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="glass-surface" /></div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email</Label><Input value={user?.email || ""} disabled className="glass-surface opacity-60" /></div>
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="glass-surface" /></div>
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Location</Label><Input value={location} onChange={e => setLocation(e.target.value)} className="glass-surface" /></div>
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Birth Date</Label><Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="glass-surface" /></div>
                    </div>
                    <Separator />
                    <h3 className="font-semibold text-sm">Social Links</h3>
                    <div className="space-y-3">
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} className="glass-surface" placeholder="https://..." /></div>
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><Github className="h-3.5 w-3.5" />GitHub</Label><Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="glass-surface" placeholder="https://github.com/..." /></div>
                      <div className="space-y-2"><Label className="flex items-center gap-1.5"><Linkedin className="h-3.5 w-3.5" />LinkedIn</Label><Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="glass-surface" placeholder="https://linkedin.com/in/..." /></div>
                    </div>
                  </div>
                ) : (
                  /* ─── VIEW MODE ─── */
                  <div className="space-y-4">
                    {[
                      { icon: Mail, label: "Email", value: displayEmail },
                      { icon: Phone, label: "Phone", value: displayPhone },
                      { icon: MapPin, label: "Location", value: displayLocation },
                      { icon: Calendar, label: "Birth Date", value: new Date(displayBirthDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-lg glass-surface">
                        <div className="p-2 rounded-md bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm font-medium truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* RIGHT – Statistics (3 cols) */}
            <div className="lg:col-span-3 space-y-6">

              {/* Overview mini cards */}
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: BookOpen, label: "Active Tracks", value: displayStats.totalProgress, color: "text-primary", bg: "bg-primary/10" },
                  { icon: CheckCircle2, label: "Completed", value: displayStats.completedTracks, color: "text-green-500", bg: "bg-green-500/10" },
                  { icon: BarChart3, label: "Quizzes Taken", value: displayStats.quizzesTaken, color: "text-secondary", bg: "bg-secondary/10" },
                  { icon: Award, label: "Achievements", value: displayStats.achievements, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <motion.div key={label} variants={fadeUp}>
                    <Card className="glass-card p-4 text-center space-y-2">
                      <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-lg ${bg}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Tabbed details */}
              <Card className="glass-card p-6">
                <Tabs defaultValue="quizzes" className="space-y-5">
                  <TabsList className="w-full grid grid-cols-3 bg-muted/50">
                    <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    <TabsTrigger value="learning">Learning</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                  </TabsList>

                  {/* ── QUIZZES TAB ── */}
                  <TabsContent value="quizzes" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Recent Quiz Performance</h3>
                      <Badge variant="outline" className="text-primary border-primary/30">Avg {avgQuizScore}%</Badge>
                    </div>
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2.5">
                      {dummyQuizHistory.map(q => (
                        <motion.div key={q.id} variants={fadeUp} className="flex items-center gap-3 p-3 rounded-lg glass-surface">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{q.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(q.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{q.score}%</span>
                            <Badge className={q.passed ? "bg-green-500/15 text-green-500 border-green-500/30" : "bg-destructive/15 text-destructive border-destructive/30"} variant="outline">
                              {q.passed ? "Pass" : "Fail"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </TabsContent>

                  {/* ── LEARNING TAB ── */}
                  <TabsContent value="learning" className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Route className="h-4 w-4 text-primary" />Roadmap & Track Progress</h3>
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
                      {dummyTrackProgress.map(t => (
                        <motion.div key={t.id} variants={fadeUp} className="p-3 rounded-lg glass-surface space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{t.name}</p>
                            <Badge variant="outline" className={statusColor(t.status)}>{t.status}</Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={t.progress} className="h-2 flex-1" />
                            <span className="text-xs font-semibold w-10 text-right">{t.progress}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </TabsContent>

                  {/* ── PROJECTS TAB ── */}
                  <TabsContent value="projects" className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><FolderKanban className="h-4 w-4 text-primary" />Project Progress</h3>
                    <motion.div variants={stagger} initial="hidden" animate="show" className="grid sm:grid-cols-2 gap-3">
                      {dummyProjectProgress.map(p => (
                        <motion.div key={p.id} variants={fadeUp}>
                          <Card className="glass-surface p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{p.name}</p>
                              <Badge variant="outline" className={statusColor(p.status)}>{p.status}</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={p.progress} className="h-2 flex-1" />
                              <span className="text-xs font-semibold w-10 text-right">{p.progress}%</span>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
