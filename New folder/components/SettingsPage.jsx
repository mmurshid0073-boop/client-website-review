import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Save, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', company: user?.company || '' });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser(profileData);
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and workspace preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <Tabs defaultValue="general" className="w-full flex flex-col md:flex-row h-full">
           <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 p-4">
              <TabsList className="flex flex-col h-auto bg-transparent gap-1">
                 <TabsTrigger value="general" className="w-full justify-start px-3 py-2 h-auto text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                    <User className="w-4 h-4 mr-2" /> General
                 </TabsTrigger>
                 <TabsTrigger value="security" className="w-full justify-start px-3 py-2 h-auto text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                    <Lock className="w-4 h-4 mr-2" /> Security
                 </TabsTrigger>
                 <TabsTrigger value="notifications" className="w-full justify-start px-3 py-2 h-auto text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200">
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                 </TabsTrigger>
              </TabsList>
           </div>
           
           <div className="flex-1 p-8">
              <TabsContent value="general" className="mt-0 space-y-6">
                 <div>
                    <h3 className="text-lg font-medium text-slate-900">Profile Information</h3>
                    <p className="text-sm text-slate-500">Update your account details and public profile.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="grid gap-2">
                       <label className="text-sm font-medium text-slate-700">Display Name</label>
                       <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="grid gap-2">
                       <label className="text-sm font-medium text-slate-700">Email Address</label>
                       <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="grid gap-2">
                       <label className="text-sm font-medium text-slate-700">Company</label>
                       <input type="text" value={profileData.company} onChange={e => setProfileData({...profileData, company: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="pt-4">
                       <Button onClick={handleUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                 <div className="text-center py-12">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Security Settings</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">Password updates and 2FA settings are managed through your centralized identity provider in this demo.</p>
                 </div>
              </TabsContent>
           </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;