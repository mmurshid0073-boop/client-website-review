import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, UserPlus, Target, Settings, LogOut, Building2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'leads', label: 'Leads', icon: Target },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'User Management', icon: UserPlus }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800 shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-wide">Nexus CRM</span>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-semibold border border-blue-700">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role === 'admin' ? 'Administrator' : 'Team Member'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-400" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;