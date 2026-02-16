import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllUsers, useToggleUserRole } from '@/hooks/useExternalApi';
import { Loader2, ShieldCheck, User, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const AdminUsers = () => {
  const { data: users, isLoading, refetch } = useAllUsers();
  const toggleRole = useToggleUserRole();

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

      {!users?.length ? (
        <p className="text-muted-foreground text-center py-8">No users found.</p>
      ) : (
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
      )}
    </Card>
  );
};
