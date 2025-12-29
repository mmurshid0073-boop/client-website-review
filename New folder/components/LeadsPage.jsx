import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Kanban, List, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new',
    value: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    const storedLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    setLeads(storedLeads);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedLeads;
    if (editingLead) {
      updatedLeads = leads.map(l => 
        l.id === editingLead.id ? { ...formData, id: l.id, updatedAt: new Date().toISOString() } : l
      );
      toast({ title: "Success", description: "Lead updated successfully." });
    } else {
      const newLead = { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() };
      updatedLeads = [...leads, newLead];
      toast({ title: "Success", description: "New lead added to pipeline." });
    }
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', company: '', source: 'website', status: 'new', value: 0 });
    setEditingLead(null);
  };

  const getStatusStyle = (status) => {
    const styles = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      qualified: 'bg-purple-50 text-purple-700 border-purple-200',
      converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      lost: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return styles[status] || styles.new;
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pipeline Management</h1>
          <p className="text-slate-500 mt-1">Track and manage sales opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-slate-200 p-1">
             <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="h-8 w-8 p-0">
                <List className="w-4 h-4" />
             </Button>
             <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')} className="h-8 w-8 p-0">
                <Kanban className="w-4 h-4" />
             </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingLead ? 'Edit Opportunity' : 'New Sales Opportunity'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase">Lead Name</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500" />
                   </div>
                   <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase">Company</label>
                      <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500" />
                   </div>
                </div>
                {/* Simplified form fields for brevity, you'd include email, phone etc similarly */}
                 <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500" />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Pipeline Stage</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500">
                        <option value="new">New Inquiry</option>
                        <option value="contacted">Contact Initiated</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Closed Won</option>
                        <option value="lost">Closed Lost</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase">Projected Value ($)</label>
                    <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500" />
                 </div>
                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">{editingLead ? 'Update' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
             <Search className="w-4 h-4 text-slate-400" />
             <input
               type="text"
               placeholder="Filter leads..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-transparent border-none focus:outline-none text-sm w-full"
             />
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">Lead Details</th>
                     <th className="px-6 py-4">Stage</th>
                     <th className="px-6 py-4">Source</th>
                     <th className="px-6 py-4 text-right">Value</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                     <tr key={lead.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-semibold text-slate-900">{lead.name}</div>
                           <div className="text-xs text-slate-500">{lead.company} • {lead.email}</div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)}`}>
                              {lead.status.replace('-', ' ')}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 capitalize">{lead.source}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900">${lead.value.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" onClick={() => { setEditingLead(lead); setFormData(lead); setIsDialogOpen(true); }} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Edit</Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default LeadsPage;