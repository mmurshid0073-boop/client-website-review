import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, TrendingUp, DollarSign, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalLeads: 0,
    conversionRate: 0,
    revenue: 0
  });

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem('crm_clients') || '[]');
    const leads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;
    
    setStats({
      totalClients: clients.length,
      totalLeads: leads.length,
      conversionRate: conversionRate.toFixed(1),
      revenue: clients.reduce((sum, c) => sum + (c.value || 0), 0)
    });
  }, []);

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      trend: '+12.5%',
      isPositive: true,
      accent: 'blue'
    },
    {
      title: 'Active Leads',
      value: stats.totalLeads,
      icon: Target,
      trend: '+8.2%',
      isPositive: true,
      accent: 'indigo'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      trend: '-2.1%',
      isPositive: false,
      accent: 'emerald'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+15.3%',
      isPositive: true,
      accent: 'slate'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500 mt-1">Real-time insights and performance metrics.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {stat.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">New corporate client acquired</p>
                  <p className="text-xs text-slate-500">Global Tech Solutions Ltd.</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">2 hrs ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Lead Sources</h2>
          </div>
          <div className="p-6 space-y-6">
            {[
              { source: 'Direct Traffic', percentage: 45, color: 'bg-blue-600' },
              { source: 'Corporate Referrals', percentage: 30, color: 'bg-indigo-500' },
              { source: 'LinkedIn Ads', percentage: 15, color: 'bg-sky-500' },
              { source: 'Email Campaigns', percentage: 10, color: 'bg-slate-400' }
            ].map((source) => (
              <div key={source.source}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-slate-700">{source.source}</span>
                  <span className="text-slate-500">{source.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${source.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;