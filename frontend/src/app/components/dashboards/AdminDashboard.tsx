import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, Brain, Shield, LogOut, User, Globe } from 'lucide-react';
import { AnalyticsTab } from '@/app/components/admin/AnalyticsTab';
import { UserManagementTab } from '@/app/components/admin/UserManagementTab';
import { PolicyInsightsTab } from '@/app/components/admin/PolicyInsightsTab';
import { SystemMonitoringTab } from '@/app/components/admin/SystemMonitoringTab';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', name: t('analytics'), icon: BarChart3, color: '#0b6e4f' },
    { id: 'users', name: t('userManagement'), icon: Users, color: '#2196F3' },
    { id: 'policy', name: t('policyInsights'), icon: Brain, color: '#9c27b0' },
    { id: 'monitoring', name: t('systemMonitoring'), icon: Shield, color: '#ff9800' },
  ];

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'ml', name: 'മലയാളം' },
    { id: 'hi', name: 'हिंदी' },
    { id: 'ta', name: 'தமிழ்' },
    { id: 'bn', name: 'বাংলা' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-800 py-6 mb-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0b6e4f]/20 rounded-xl flex items-center justify-center border border-[#0b6e4f]/30">
                <User className="w-6 h-6 text-[#0b6e4f]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {t('adminPortal')}
                </h1>
                <p className="text-sm text-zinc-500">{t('governmentOfKerala')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Unified Language Switcher */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-medium uppercase">{language}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 p-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-800 transition-colors ${
                        language === lang.id ? 'text-[#0b6e4f] bg-[#0b6e4f]/10 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/30 text-red-500 border border-red-900/50 hover:bg-red-950/50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-2 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? '' : 'opacity-70'}`} />
                <span className="text-sm whitespace-nowrap">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'policy' && <PolicyInsightsTab />}
          {activeTab === 'monitoring' && <SystemMonitoringTab />}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-zinc-900/30 border-t border-zinc-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center grayscale opacity-50">
              🇮🇳
            </div>
            <div>
              <p className="text-zinc-400 font-medium">{t('keralaHealthPortal')} • {t('administrativeInterface')}</p>
              <p className="mt-1 text-xs text-zinc-600">{t('sihInitiative')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
