import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Activity, FileText, MapPin, AlertCircle, Loader2, BarChart3 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { StatCard } from '@/app/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/app/utils/api';

type AnalyticsResponse = {
  summary: {
    totalPatients: number;
    totalDoctors: number;
    totalAdmins: number;
    totalRecords: number;
    consentsGranted: number;
    patientsWithRecords: number;
    uniqueHospitals: number;
  };
  uploadsByRole: { patient: number; doctor: number; admin: number; other: number };
  uploadsByMonth: { month: string; patient: number; doctor: number; admin: number; other: number }[];
  uploadsByDay: { day: string; patient: number; doctor: number; admin: number; other: number }[];
  recordsByCategory: { category: string; count: number }[];
  recordsByHospital: { hospital: string; count: number }[];
  latestUploads: { title: string; category?: string; hospital?: string; doctor?: string; createdByRole?: string; createdAt: string }[];
};

const hospitalColors = ['#0b6e4f', '#2196F3', '#ff9800', '#9c27b0', '#4caf50', '#e91e63'];

function formatNumber(value?: number | null) {
  if (value === undefined || value === null) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}

function formatMonth(key: string) {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en', { month: 'short' });
}

export function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/analytics');
      setData(res as AnalyticsResponse);
    } catch (err: any) {
      setError(err?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const statsData = useMemo(() => {
    const summary = data?.summary;
    const uploads = data?.uploadsByRole;
    const totalUploads = (uploads?.patient || 0) + (uploads?.doctor || 0);
    const clinicianCount = (summary?.totalDoctors || 0) + (summary?.totalAdmins || 0);
    return [
      {
        icon: <Users className="w-6 h-6" />,
        label: 'Registered Patients',
        value: formatNumber(summary?.totalPatients),
        color: '#0b6e4f',
        trend: `${formatNumber(summary?.patientsWithRecords)} with records`,
      },
      {
        icon: <Activity className="w-6 h-6" />,
        label: 'Health Records',
        value: formatNumber(summary?.totalRecords),
        color: '#2196F3',
        trend: `${formatNumber(totalUploads)} uploads`,
      },
      {
        icon: <FileText className="w-6 h-6" />,
        label: 'Hospitals Uploading',
        value: formatNumber(summary?.uniqueHospitals),
        color: '#ff9800',
        trend: `${formatNumber(summary?.consentsGranted)} active consents`,
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        label: 'Clinicians',
        value: formatNumber(clinicianCount),
        color: '#9c27b0',
        trend: `${formatNumber(summary?.totalDoctors)} doctors`,
      },
    ];
  }, [data]);

  const monthlyTrend = useMemo(() => {
    return (data?.uploadsByMonth || []).map((row) => ({
      month: formatMonth(row.month),
      patientUploads: row.patient,
      doctorUploads: row.doctor,
    }));
  }, [data]);

  const categoryData = useMemo(() => data?.recordsByCategory || [], [data]);

  const hospitalData = useMemo(
    () =>
      (data?.recordsByHospital || []).map((h, idx) => ({
        name: h.hospital || 'Unknown',
        value: h.count,
        color: hospitalColors[idx % hospitalColors.length],
      })),
    [data],
  );

  if (loading) {
    return (
      <Card className="flex items-center gap-3 p-6">
        <Loader2 className="w-5 h-5 animate-spin text-[#0b6e4f]" />
        <span className="text-sm text-muted-foreground">Loading analytics...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-950/40 border-red-900/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200 mb-1">Analytics failed to load</p>
            <p className="text-sm text-red-300/80">{error}</p>
            <button
              onClick={loadAnalytics}
              className="mt-3 px-3 py-1.5 text-sm rounded-md bg-red-800 text-white hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <h2 className="text-2xl font-bold text-foreground mb-2">Live Health Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Built directly from patient and doctor uploads, deduplicated at the record level.
        </p>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
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

      {/* Monthly Upload Trends */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0b6e4f]" />
          Uploads from Patients vs Doctors
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="patientUploads" stroke="#0b6e4f" strokeWidth={2} name="Patient uploads" />
              <Line type="monotone" dataKey="doctorUploads" stroke="#2196F3" strokeWidth={2} name="Doctor uploads" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category & Hospital Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Records by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0b6e4f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Top Uploading Hospitals
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hospitalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {hospitalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Latest activity */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0b6e4f]" />
            Latest Uploads
          </h3>
          <p className="text-xs text-muted-foreground">
            Reflects patient and doctor submissions without duplicates.
          </p>
        </div>
        <div className="divide-y divide-zinc-800">
          {(data?.latestUploads || []).map((upload, idx) => (
            <div key={`${upload.title}-${idx}`} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">{upload.title || 'Untitled record'}</p>
                <p className="text-xs text-muted-foreground">
                  {(upload.category || 'Uncategorized').toUpperCase()} - {upload.hospital || 'Unknown hospital'}
                </p>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <p>{upload.createdByRole || 'PATIENT'}</p>
                <p>{new Date(upload.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
          {(data?.latestUploads?.length || 0) === 0 && (
            <p className="text-sm text-muted-foreground">No uploads yet.</p>
          )}
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#0b6e4f]">
            {formatNumber(data?.summary?.patientsWithRecords)}
          </p>
          <p className="text-sm text-muted-foreground">Patients with records</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#2196F3]">
            {formatNumber(data?.uploadsByRole?.doctor)}
          </p>
          <p className="text-sm text-muted-foreground">Doctor uploads</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#ff9800]">
            {formatNumber(data?.uploadsByRole?.patient)}
          </p>
          <p className="text-sm text-muted-foreground">Patient uploads</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-3xl font-bold text-[#4caf50]">
            {formatNumber(data?.summary?.consentsGranted)}
          </p>
          <p className="text-sm text-muted-foreground">Active consents</p>
        </Card>
      </div>
    </div>
  );
}
