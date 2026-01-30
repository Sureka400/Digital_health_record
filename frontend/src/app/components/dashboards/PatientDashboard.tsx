import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, FileText, MessageCircle, Calendar, Gift, AlertCircle, LogOut, Globe, User } from 'lucide-react';
import { HealthQRTab } from '@/app/components/patient/HealthQRTab';
import { HealthRecordsTab } from '@/app/components/patient/HealthRecordsTab';
import { AIAssistantTab } from '@/app/components/patient/AIAssistantTab';
import { AppointmentsTab } from '@/app/components/patient/AppointmentsTab';
import { SchemesTab } from '@/app/components/patient/SchemesTab';
import { EmergencyTab } from '@/app/components/patient/EmergencyTab';

interface PatientDashboardProps {
  onLogout: () => void;
}

export function PatientDashboard({ onLogout }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('qr');

  const tabs = [
    { id: 'qr', name: 'My Health QR', icon: QrCode, color: '#0b6e4f' },
    { id: 'records', name: 'Health Records', icon: FileText, color: '#2196F3' },
    { id: 'ai', name: 'AI Assistant', icon: MessageCircle, color: '#9c27b0' },
    { id: 'appointments', name: 'Appointments', icon: Calendar, color: '#ff9800' },
    { id: 'schemes', name: 'Schemes', icon: Gift, color: '#4caf50' },
    { id: 'emergency', name: 'Emergency', icon: AlertCircle, color: '#f44336' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b6e4f] to-[#2196F3] text-white py-6 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Patient Portal</h1>
                <p className="text-sm opacity-90">Welcome, Ravi Kumar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Tab Navigation */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0b6e4f] text-white shadow-md'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? tab.color : undefined,
                }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'qr' && <HealthQRTab />}
          {activeTab === 'records' && <HealthRecordsTab />}
          {activeTab === 'ai' && <AIAssistantTab />}
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'schemes' && <SchemesTab />}
          {activeTab === 'emergency' && <EmergencyTab />}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>Kerala Digital Health Portal • Powered by Government of Kerala</p>
          <p className="mt-1 text-xs">SIH 2025 Initiative</p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}