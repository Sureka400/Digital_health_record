import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Shield, Server, Database, 
  AlertCircle, CheckCircle2, RefreshCw, 
  ShieldAlert, Lock, Fingerprint 
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

export function SystemMonitoringTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const stats = [
    { label: t('systemUptime'), value: '99.99%', status: 'optimal', icon: Server },
    { label: t('activeNodes'), value: '128', status: 'optimal', icon: Database },
    { label: t('avgLatency'), value: '45ms', status: 'optimal', icon: Activity },
    { label: t('securityThreats'), value: '0', status: 'secure', icon: Shield },
  ];

  const securityEvents = [
    { type: 'login', status: 'success', user: 'Admin_Kerala_01', ip: '192.168.1.1', time: '2 mins ago' },
    { type: 'access', status: 'denied', user: 'Unknown', ip: '45.12.33.2', time: '15 mins ago' },
    { type: 'encryption', status: 'active', user: 'System', ip: 'internal', time: 'Continuous' },
  ];

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <stat.icon className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <Badge variant={stat.status === 'optimal' || stat.status === 'secure' ? 'success' : 'warning'}>
                {stat.status.toUpperCase()}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Security Log */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              {t('realTimeSecurityMonitoring')}
            </h3>
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
              {t('refresh')}
            </Button>
          </div>

          <div className="space-y-4">
            {securityEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3">
                  {event.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{event.type.toUpperCase()} - {event.user}</p>
                    <p className="text-xs text-gray-400">{event.ip}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{event.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Integrity & Encryption */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-500" />
            {t('dataIntegrityEncryption')}
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Database Encryption</span>
                <span className="text-green-500 font-medium">AES-256 ACTIVE</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                <Fingerprint className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-semibold text-white">SHA-512</p>
                <p className="text-xs text-gray-400">Record Hashing</p>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                <Shield className="w-8 h-8 text-purple-500 mb-2" />
                <p className="text-sm font-semibold text-white">TLS 1.3</p>
                <p className="text-xs text-gray-400">Transit Security</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Network Health */}
      <Card className="p-6">
        <h3 className="font-semibold text-white mb-4">{t('nodeHealthDistribution')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['North Zone', 'Central Zone', 'South Zone'].map((zone, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">{zone}</span>
              </div>
              <span className="text-xs font-mono text-gray-400">HEALTHY</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
