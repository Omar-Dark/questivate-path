import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminRoadmaps } from '@/components/admin/AdminRoadmaps';
import { AdminQuizzes } from '@/components/admin/AdminQuizzes';
import { Shield, Users, Map, HelpCircle } from 'lucide-react';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-primary">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage roadmaps, quizzes, users, and more</p>
            </div>
          </div>

          <Tabs defaultValue="roadmaps" className="space-y-6">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="roadmaps" className="gap-2">
                <Map className="h-4 w-4" /> Roadmaps
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="gap-2">
                <HelpCircle className="h-4 w-4" /> Quizzes
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roadmaps">
              <AdminRoadmaps />
            </TabsContent>
            <TabsContent value="quizzes">
              <AdminQuizzes />
            </TabsContent>
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
