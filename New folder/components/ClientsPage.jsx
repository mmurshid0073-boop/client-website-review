import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, Building2, MoreHorizontal, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active',
    value: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const storedClients = JSON.parse(localStorage.getItem('crm_clients') || '[]');
    setClients(storedClients);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let updatedClients;
    if (editingClient) {
      updatedClients = clients.map(c => 
        c.id === editingClient.id ? { ...formData, id: c.id, updatedAt: new Date().toISOString() } : c
      );
      toast({ title: "Success", description: "Client profile updated." });
    } else {
      const newClient = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedClients = [...clients, newClient];
      toast({ title: "Success", description: "New client acquired." });
    }

    localStorage.setItem('crm_clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '', status: 'active', value: 0 });
    setEditingClient(null);
  };

  const handleDelete = (id) => {
    const updatedClients = clients.filter(c => c.id !== id);
    localStorage.setItem('crm_clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
    setDeleteConfirmId(null);
    toast({ title: "Deleted", description: "Client removed from database.", variant: "destructive" });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-500 mt-1">Manage corporate accounts and contacts.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                <DialogTitle>{editingClient ? 'Edit Client Profile' : 'New Client Onboarding'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Full Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Company</label>
                    <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Email Address</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Phone</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                    </select>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Account Value (USD)</label>
                    <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {editingClient ? 'Update Profile' : 'Create Account'}
                </Button>
                </form>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact Status</th>
                <th className="px-6 py-4 text-right">Account Value</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <motion.tr 
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {client.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      client.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                      client.status === 'inactive' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    ${client.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                                setEditingClient(client);
                                setFormData(client);
                                setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        {deleteConfirmId === client.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDelete(client.id)}
                              className="h-8 px-2 bg-red-600 hover:bg-red-700 text-white text-xs"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(null)}
                              className="h-8 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(client.id)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                          >
                            <span className="sr-only">Delete</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </Button>
                        )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;