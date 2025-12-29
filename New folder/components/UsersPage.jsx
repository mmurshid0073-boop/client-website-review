import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ShieldAlert, UserCog, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '', role: 'user' });
  const { toast } = useToast();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('crm_users') || '[]');
    setUsers(storedUsers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === formData.email)) {
        toast({ title: "Error", description: "Email already exists.", variant: "destructive" });
        return;
    }
    const newUser = { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('crm_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setIsDialogOpen(false);
    setFormData({ name: '', email: '', password: '', company: '', role: 'user' });
    toast({ title: "User Added", description: "New team member has been created." });
  };

  const handleDelete = (id) => {
      if (id === currentUser.id) return;
      const updatedUsers = users.filter(u => u.id !== id);
      localStorage.setItem('crm_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      toast({ title: "User Removed", description: "Access revoked successfully." });
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
           <ShieldAlert className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restricted Access</h2>
        <p className="text-slate-500 mt-2 max-w-sm">This section requires administrator privileges. Please contact your system administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-500 mt-1">Control access and user permissions.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              <input type="text" placeholder="Department/Company" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
              <Button type="submit" className="w-full bg-blue-600 text-white">Create Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative group">
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
               </div>
               <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" disabled={user.id === currentUser.id} onClick={() => handleDelete(user.id)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                     <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
               <span className="text-slate-500">{user.company}</span>
               <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                  {user.role === 'admin' ? 'Administrator' : 'Team Member'}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;