import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    role: 'user'
  });
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        toast({
          title: "Welcome back",
          description: "Secure session initialized successfully.",
        });
      } else {
        toast({
          title: "Authentication failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } else {
      const result = register(formData);
      if (result.success) {
        toast({
          title: "Account created",
          description: "Your enterprise workspace is ready.",
        });
      } else {
        toast({
          title: "Registration failed",
          description: result.error,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[600px] border border-slate-200">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900/50 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Enterprise CRM</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Manage your business with precision.
            </h2>
            <p className="text-slate-400 text-lg">
              Streamline operations, track leads, and manage client relationships with our professional suite of tools.
            </p>
          </div>
          <div className="relative z-10 text-sm text-slate-500">
            © 2024 Enterprise Systems Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900">
                {isLogin ? 'Sign in to your account' : 'Create your workspace'}
              </h2>
              <p className="mt-2 text-slate-600">
                {isLogin ? 'Enter your credentials to access the dashboard' : 'Get started with a free enterprise account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm"
                          placeholder="Acme Inc"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Role</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm appearance-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md mt-6"
              >
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                {isLogin ? "Need a workspace? Create account" : 'Already have a workspace? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;