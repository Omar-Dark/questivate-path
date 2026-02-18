import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllUsers, useToggleUserRole } from '@/hooks/useExternalApi';
import { Loader2, ShieldCheck, User, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const dummyUsers = [
  { _id: '1', username: 'admin_sarah', email: 'sarah@example.com', role: 'admin', createdAt: '2025-08-15T10:30:00Z' },
  { _id: '2', username: 'john_dev', email: 'john@example.com', role: 'user', createdAt: '2025-09-01T14:20:00Z' },
  { _id: '3', username: 'maria_learns', email: 'maria@example.com', role: 'user', createdAt: '2025-10-12T08:45:00Z' },
  { _id: '4', username: 'alex_code', email: 'alex@example.com', role: 'user', createdAt: '2025-11-03T16:00:00Z' },
  { _id: '5', username: 'mod_james', email: 'james@example.com', role: 'admin', createdAt: '2025-07-20T09:15:00Z' },
];

export const AdminUsers = () => {
  const { data: apiUsers, isLoading, refetch } = useAllUsers();
  const toggleRole = useToggleUserRole();

  const users = apiUsers?.length ? apiUsers : dummyUsers;

  const handleToggleRole = (userId: string) => {
    toggleRole.mutate(userId, {
      onSuccess: () => { toast.success('User role updated'); refetch(); },
      onError: () => toast.error('Failed to update role'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Users</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium flex items-center gap-2">
                  {u.role === 'admin' ? <ShieldCheck className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
                  {u.username}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                    {u.role || 'user'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRole(u._id)}
                    disabled={toggleRole.isPending}
                  >
                    Toggle Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
