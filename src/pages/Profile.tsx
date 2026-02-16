import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Camera, BookOpen, Bookmark, Settings, 
  Trophy, CheckCircle2, Loader2, MapPin, Globe,
  Github, Linkedin, Phone, Calendar, Mail
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for profile fields
const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(50, "Username must be 50 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  full_name: z
    .string()
    .trim()
    .max(100, "Full name must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  avatar_url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(500, "URL must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(100, "Location must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(500, "URL must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  github_url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(500, "URL must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  linkedin_url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(500, "URL must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be 20 characters or less")
    .optional()
    .or(z.literal("")),
});

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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
  
  const [completedRoadmaps, setCompletedRoadmaps] = useState<any[]>([]);
  const [savedRoadmaps, setSavedRoadmaps] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProgress: 0,
    completedTracks: 0,
    quizzesTaken: 0,
    achievements: 0
  });

  // Auth redirect removed for preview access

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

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

      // Fetch user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*, roadmap:roadmaps(*)")
        .eq("user_id", user?.id);

      const completed = progressData?.filter(p => p.progress_percent === 100) || [];
      setCompletedRoadmaps(completed);

      // Fetch saved roadmaps
      const { data: savedData } = await supabase
        .from("saved_roadmaps")
        .select("*, roadmap:roadmaps(*)")
        .eq("user_id", user?.id);

      setSavedRoadmaps(savedData || []);

      // Fetch quiz attempts
      const { data: quizData } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", user?.id);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", user?.id);

      setStats({
        totalProgress: progressData?.length || 0,
        completedTracks: completed.length,
        quizzesTaken: quizData?.length || 0,
        achievements: achievementsData?.length || 0
      });

    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    // Validate inputs before saving
    const validationResult = profileSchema.safeParse({
      username,
      full_name: fullName,
      bio,
      avatar_url: avatarUrl,
      location,
      website: website || undefined,
      github_url: githubUrl || undefined,
      linkedin_url: linkedinUrl || undefined,
      phone,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      toast.error(errors[0]?.message || "Invalid input");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName || null,
          bio: bio || null,
          avatar_url: avatarUrl || null,
          location: location || null,
          website: website || null,
          github_url: githubUrl || null,
          linkedin_url: linkedinUrl || null,
          phone: phone || null,
          birth_date: birthDate || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUnsaveRoadmap = async (savedRoadmapId: string) => {
    try {
      const { error } = await supabase
        .from("saved_roadmaps")
        .delete()
        .eq("id", savedRoadmapId);

      if (error) throw error;

      setSavedRoadmaps(savedRoadmaps.filter(s => s.id !== savedRoadmapId));
      toast.success("Removed from bookmarks");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (authLoading || loading) {
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
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-display font-bold">Profile</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Profile Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-display font-semibold">Profile Settings</h2>
                </div>

                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="gradient-primary text-white text-2xl">
                        {(fullName || username).charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="glass-surface"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="johndoe"
                          className="glass-surface"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="glass-surface"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="glass-surface opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Birth Date
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="glass-surface"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="glass-surface"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="New York, USA"
                      className="glass-surface"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="glass-surface min-h-24"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Social Links</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Website
                      </Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="glass-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github" className="flex items-center gap-2">
                        <Github className="h-4 w-4" /> GitHub
                      </Label>
                      <Input
                        id="github"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                        className="glass-surface"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="glass-surface"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="gradient-primary text-white border-0"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </Card>

              {/* Completed Courses */}
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-display font-semibold">Completed Courses</h2>
                </div>

                {completedRoadmaps.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No completed courses yet. Keep learning!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {completedRoadmaps.map((progress) => (
                      <Link 
                        key={progress.id}
                        to={`/track/${progress.roadmap.slug}`}
                      >
                        <Card className="glass-surface p-4 hover:border-primary/50 transition-all">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{progress.roadmap.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Completed on {new Date(progress.last_accessed_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="gradient-primary text-white border-0">
                              <Trophy className="h-3 w-3 mr-1" />
                              100%
                            </Badge>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>

              {/* Bookmarked Courses */}
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-display font-semibold">Bookmarked Courses</h2>
                </div>

                {savedRoadmaps.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No bookmarked courses yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {savedRoadmaps.map((saved) => (
                      <Card key={saved.id} className="glass-surface p-4">
                        <div className="flex items-center justify-between">
                          <Link 
                            to={`/track/${saved.roadmap.slug}`}
                            className="flex-1"
                          >
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {saved.roadmap.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {saved.roadmap.description}
                            </p>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUnsaveRoadmap(saved.id)}
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Stats */}
            <div className="space-y-6">
              <Card className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-display font-semibold">Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg glass-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg gradient-primary">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">Active Tracks</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.totalProgress}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg glass-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-medium">Completed</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.completedTracks}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg glass-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Trophy className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Quizzes</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.quizzesTaken}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg glass-surface">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg gradient-secondary">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Achievements</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.achievements}</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 space-y-4">
                <h3 className="font-semibold">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/tracks">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Tracks
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;