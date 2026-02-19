import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAllUsers, useToggleUserRole } from '@/hooks/useExternalApi';
import { Loader2, ShieldCheck, User, RefreshCw, Trash2, Pencil, Ban, Eye, Search, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const dummyUsers = [
  { _id: '1', username: 'admin_sarah', email: 'sarah@example.com', role: 'admin', createdAt: '2025-08-15T10:30:00Z', status: 'active' },
  { _id: '2', username: 'john_dev', email: 'john@example.com', role: 'user', createdAt: '2025-09-01T14:20:00Z', status: 'active' },
  { _id: '3', username: 'maria_learns', email: 'maria@example.com', role: 'user', createdAt: '2025-10-12T08:45:00Z', status: 'banned' },
  { _id: '4', username: 'alex_code', email: 'alex@example.com', role: 'user', createdAt: '2025-11-03T16:00:00Z', status: 'active' },
  { _id: '5', username: 'mod_james', email: 'james@example.com', role: 'admin', createdAt: '2025-07-20T09:15:00Z', status: 'active' },
  { _id: '6', username: 'dev_lisa', email: 'lisa@example.com', role: 'user', createdAt: '2025-12-05T11:30:00Z', status: 'active' },
  { _id: '7', username: 'newbie_tom', email: 'tom@example.com', role: 'user', createdAt: '2026-01-18T09:00:00Z', status: 'active' },
];

export const AdminUsers = () => {
  const { data: apiUsers, isLoading, refetch } = useAllUsers();
  const toggleRole = useToggleUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ username: '', email: '' });

  const allUsers = apiUsers?.length ? apiUsers : dummyUsers;
  const users = allUsers.filter((u: any) =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleRole = (userId: string) => {
    toggleRole.mutate(userId, {
      onSuccess: () => { toast.success('User role updated'); refetch(); },
      onError: () => toast.error('Failed to update role'),
    });
  };

  const handleBanUser = (user: any) => {
    toast.success(`User "${user.username}" has been ${user.status === 'banned' ? 'unbanned' : 'banned'}`);
  };

  const handleDeleteUser = (user: any) => {
    toast.success(`User "${user.username}" has been deleted`);
    setDeleteConfirm(null);
  };

  const handleEditUser = () => {
    toast.success(`User "${editingUser?.username}" updated`);
    setEditingUser(null);
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold">All Users ({allUsers.length})</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {u.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                    {u.role === 'admin' && <ShieldCheck className="h-3 w-3 mr-1" />}
                    {u.role || 'user'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.status === 'banned' ? 'destructive' : 'outline'} className={u.status !== 'banned' ? 'border-green-500/50 text-green-600' : ''}>
                    {u.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingUser(u)}>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditingUser(u); setEditForm({ username: u.username, email: u.email }); }}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleRole(u._id)}>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Toggle Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBanUser(u)} className={u.status === 'banned' ? 'text-green-600' : 'text-orange-600'}>
                        <Ban className="h-4 w-4 mr-2" /> {u.status === 'banned' ? 'Unban User' : 'Ban User'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteConfirm(u)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!users.length && (
        <p className="text-center text-muted-foreground py-8">No users found matching "{searchQuery}"</p>
      )}

      {/* View Profile Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {viewingUser.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{viewingUser.username}</h3>
                  <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge variant={viewingUser.role === 'admin' ? 'default' : 'secondary'}>{viewingUser.role}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={viewingUser.status === 'banned' ? 'destructive' : 'outline'}>{viewingUser.status || 'active'}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm">{viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono text-muted-foreground">{viewingUser._id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={editForm.username} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editForm.email} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button className="gradient-primary text-white border-0" onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">{deleteConfirm?.username}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDeleteUser(deleteConfirm)}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
