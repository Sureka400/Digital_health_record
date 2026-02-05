import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Activity, FileText, MapPin, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { StatCard } from '@/app/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

export function AnalyticsTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const statsData = [
    { icon: <Users className="w-6 h-6" />, label: t('totalMigrantWorkers'), value: '2,50,000+', color: '#0b6e4f', trend: `+12% ${t('thisMonth')}` },
    { icon: <Activity className="w-6 h-6" />, label: t('activeHealthRecords'), value: '5M+', color: '#2196F3', trend: `+8% ${t('thisMonth')}` },
    { icon: <FileText className="w-6 h-6" />, label: t('documentsUploaded'), value: '15M+', color: '#ff9800', trend: `+15% ${t('thisMonth')}` },
    { icon: <MapPin className="w-6 h-6" />, label: t('hospitalsConnected'), value: '150+', color: '#9c27b0', trend: `+5 ${t('new')}` },
  ];

  const diseaseData = [
    { disease: t('diabetes'), cases: 4500 },
    { disease: t('hypertension'), cases: 3800 },
    { disease: t('respiratory'), cases: 2900 },
    { disease: t('gastrointestinal'), cases: 2200 },
    { disease: t('dermatological'), cases: 1800 },
  ];

  const monthlyTrend = [
    { month: t('jul'), registrations: 18000, consultations: 12000 },
    { month: t('aug'), registrations: 20000, consultations: 15000 },
    { month: t('sep'), registrations: 22000, consultations: 17000 },
    { month: t('oct'), registrations: 25000, consultations: 19000 },
    { month: t('nov'), registrations: 28000, consultations: 21000 },
    { month: t('dec'), registrations: 30000, consultations: 24000 },
    { month: t('jan'), registrations: 32000, consultations: 26000 },
  ];

  const districtData = [
    { name: t('trivandrum'), value: 45000, color: '#0b6e4f' },
    { name: t('ernakulam'), value: 38000, color: '#2196F3' },
    { name: t('kozhikode'), value: 32000, color: '#ff9800' },
    { name: t('thrissur'), value: 28000, color: '#9c27b0' },
    { name: t('others'), value: 107000, color: '#4caf50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('populationHealthAnalytics')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('realTimeInsights')}
        </p>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </div>

      {/* Monthly Trends */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0b6e4f]" />
          {t('regAndConsultTrends')}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="registrations" stroke="#0b6e4f" strokeWidth={2} name={t('registrations')} />
              <Line type="monotone" dataKey="consultations" stroke="#2196F3" strokeWidth={2} name={t('consultations')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Disease Distribution & Geographic Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Disease Trends */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            {t('commonHealthConditions')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="disease" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#0b6e4f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* District Distribution */}
        <Card>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            {t('districtWiseDistribution')}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={districtData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Health Alerts */}
      <Card className="bg-orange-50 border-orange-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t('activeHealthAlerts')}</h3>
            <div className="space-y-2">
              <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700">
                <p className="font-medium text-sm text-white">{t('fluOutbreakErnakulam')}</p>
                <p className="text-xs text-gray-400">{t('fluOutbreakDetails')}</p>
              </div>
              <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700">
                <p className="font-medium text-sm text-white">{t('diabetesScreeningDrive')}</p>
                <p className="text-xs text-gray-400">{t('diabetesScreeningDetails')}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#0b6e4f]">94%</p>
          <p className="text-sm text-muted-foreground">{t('dataAccuracy')}</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#2196F3]">2.3s</p>
          <p className="text-sm text-muted-foreground">{t('avgQrScanTime')}</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#ff9800]">98.5%</p>
          <p className="text-sm text-muted-foreground">{t('uptime')}</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#4caf50]">4.8/5</p>
          <p className="text-sm text-muted-foreground">{t('userSatisfaction')}</p>
        </Card>
      </div>
    </div>
  );
}
