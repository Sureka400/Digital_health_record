import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Database, Lock, Eye, CheckCircle, RefreshCw, TrendingUp, ServerCrash, MapPin } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { api } from '@/app/utils/api';

type MonitoringResponse = {
  summary: {
    totalRecords: number;
    totalPatients: number;
    uploads7d: number;
    uploads24h: number;
    uptimePercent: number;
    apiLatencyMs: number;
    storageUsagePercent: number;
  };
  uploadsByDay: { day: string; patient: number; doctor: number; admin: number; other: number; total: number }[];
  latestUploads: { title: string; category: string; hospital: string; doctor: string; role: string; createdAt: string }[];
  consent: {
    stats: { granted: number; revoked: number };
    recent: { id: string; granted: boolean; purpose: string; updatedAt: string; granteeType: string }[];
  };
  hotspots: { hospital: string; count: number }[];
};

function formatNumber(n: number) {
  return n.toLocaleString('en-IN');
}

function formatAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

export function SystemMonitoringTab() {
  const [data, setData] = useState<MonitoringResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/monitoring');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading system monitoring from live records…</span>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-700 font-semibold">Unable to load monitoring data</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={load}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const { summary, uploadsByDay, latestUploads, consent, hotspots } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">System Monitoring</h2>
            <p className="text-sm text-muted-foreground">Live health, performance, and audit signals derived from records</p>
          </div>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={load}>
            Refresh
          </Button>
        </div>
      </Card>

      {/* System Health */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          System Health (derived)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Uptime (heuristic)</p>
            <p className="text-2xl font-bold text-green-600">{summary.uptimePercent}%</p>
            <Badge variant="success" className="mt-2">calculated</Badge>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">API Latency (derived)</p>
            <p className="text-2xl font-bold text-blue-600">{summary.apiLatencyMs} ms</p>
            <Badge variant="info" className="mt-2">load proxy</Badge>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Storage Utilization</p>
            <p className="text-2xl font-bold text-orange-600">{summary.storageUsagePercent}%</p>
            <Badge variant={summary.storageUsagePercent > 85 ? 'warning' : 'success'} className="mt-2">
              {summary.storageUsagePercent > 85 ? 'watch' : 'ok'}
            </Badge>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Uploads (24h)</p>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(summary.uploads24h)}</p>
            <Badge variant="info" className="mt-2">real</Badge>
          </div>
        </div>
      </Card>

      {/* Upload trend 7d */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Upload trend (last 7 days)
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {uploadsByDay.map((d) => (
            <div key={d.day} className="p-2 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">{d.day.slice(5)}</p>
              <p className="text-lg font-semibold text-foreground">{d.total}</p>
              <div className="flex h-2 w-full overflow-hidden rounded bg-zinc-800">
                <div className="bg-[#0b6e4f]" style={{ width: `${(d.patient / Math.max(1, d.total)) * 100}%` }} />
                <div className="bg-[#2196F3]" style={{ width: `${(d.doctor / Math.max(1, d.total)) * 100}%` }} />
                <div className="bg-[#ff9800]" style={{ width: `${(d.admin / Math.max(1, d.total)) * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                P {d.patient} • D {d.doctor} • A {d.admin}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent uploads */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-600" />
          Latest record activity
        </h3>
        <div className="space-y-2">
          {latestUploads.map((u, idx) => (
            <motion.div
              key={`${u.title}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-3 rounded-lg bg-muted"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">{u.title}</p>
                  <p className="text-xs text-muted-foreground">{u.category} • {u.hospital || 'Unknown hospital'}</p>
                  <p className="text-xs text-muted-foreground">By {u.role}{u.doctor ? ` • Dr ${u.doctor}` : ''}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatAgo(u.createdAt)}</span>
              </div>
            </motion.div>
          ))}
          {latestUploads.length === 0 && <p className="text-sm text-muted-foreground">No uploads yet.</p>}
        </div>
      </Card>

      {/* Consent logs */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          Consent management activity
        </h3>
        <div className="flex gap-3 mb-3">
          <Badge variant="success">Granted: {consent.stats.granted}</Badge>
          <Badge variant={consent.stats.revoked > 0 ? 'warning' : 'success'}>Revoked: {consent.stats.revoked}</Badge>
        </div>
        <div className="space-y-2">
          {consent.recent.map((c) => (
            <div key={c.id} className="p-3 bg-muted rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {c.granted ? 'Granted' : 'Revoked'} ({c.granteeType})
                </p>
                <p className="text-xs text-muted-foreground">{c.purpose || 'No purpose provided'}</p>
              </div>
              <Badge variant={c.granted ? 'success' : 'danger'}>{c.granted ? 'granted' : 'revoked'}</Badge>
              <span className="text-xs text-muted-foreground">{formatAgo(c.updatedAt)}</span>
            </div>
          ))}
          {consent.recent.length === 0 && <p className="text-sm text-muted-foreground">No consent actions yet.</p>}
        </div>
      </Card>

      {/* Hotspots */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          High-volume facilities
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {hotspots.map((h) => (
            <div key={h.hospital} className="p-3 bg-muted rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">{h.hospital || 'Unnamed facility'}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(h.count)} records</p>
              </div>
              <Badge variant="warning">monitor</Badge>
            </div>
          ))}
          {hotspots.length === 0 && <p className="text-sm text-muted-foreground">No facilities have uploaded yet.</p>}
        </div>
      </Card>

      {/* Data Security Status */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Data Security Checks</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Token auth enforced (API)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Consent required for access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Audit trail persisted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Backups recommended</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Availability hint */}
      <Card className="bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <ServerCrash className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Availability is data-derived</h3>
            <p className="text-sm text-muted-foreground">
              Metrics are computed from record and consent activity. Add real infra telemetry to replace these heuristics when available.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
