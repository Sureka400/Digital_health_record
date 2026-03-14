import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertTriangle, Target, RefreshCw, Brain, Activity, MapPin } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/app/utils/api';

type PolicyInsightsResponse = {
  summary: {
    totalPatients: number;
    totalRecords: number;
    patientsWithRecords: number;
    coveragePercent: number;
    uniqueHospitals: number;
    last30Records: number;
    prev30Records: number;
    growth30d: number;
  };
  topCategories: { category: string; total: number; last30: number }[];
  hotspots: { hospital: string; count: number }[];
  coverageTrend: { day: string; total: number }[];
  recommendations: { title: string; category: string; expectedImpact: string; action: string; priority: 'low' | 'medium' | 'high' }[];
  alerts: { title: string; severity: 'info' | 'warning' | 'danger'; detail: string }[];
};

function formatNumber(value: number) {
  return value.toLocaleString('en-IN');
}

export function PolicyInsightsTab() {
  const [data, setData] = useState<PolicyInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/policy');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load policy insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const maxCategoryTotal = useMemo(() => {
    if (!data?.topCategories?.length) return 1;
    return Math.max(...data.topCategories.map((c) => c.total || 0), 1);
  }, [data]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading policy insights from live data…</span>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-700 font-semibold">Unable to load policy insights</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <Button variant="outline" onClick={fetchInsights} icon={<RefreshCw className="w-4 h-4" />}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const { summary, topCategories, hotspots, coverageTrend, recommendations, alerts } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-black">Data-Powered Policy Insights</h2>
              <p className="text-sm text-muted-foreground">
                Live recommendations generated from health record activity and coverage data
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchInsights} icon={<RefreshCw className="w-4 h-4" />}>
            Refresh data
          </Button>
        </div>
      </Card>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Coverage achieved</p>
          <p className="text-3xl font-bold text-[#0b6e4f]">{summary.coveragePercent}%</p>
          <p className="text-xs text-muted-foreground">
            {formatNumber(summary.patientsWithRecords)} of {formatNumber(summary.totalPatients)} patients have records
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Records in last 30 days</p>
          <p className="text-3xl font-bold text-[#2196F3]">{formatNumber(summary.last30Records)}</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-[#2196F3]" />
            <span className={summary.growth30d >= 0 ? 'text-green-600' : 'text-red-600'}>
              {summary.growth30d >= 0 ? '+' : ''}
              {summary.growth30d}%
            </span>
            <span className="text-muted-foreground">vs previous 30 days</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total records</p>
          <p className="text-3xl font-bold text-[#9c27b0]">{formatNumber(summary.totalRecords)}</p>
          <p className="text-xs text-muted-foreground">Across {formatNumber(summary.uniqueHospitals)} contributing facilities</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Volume trend (7d)</p>
          <div className="flex items-end gap-1 h-14">
            {coverageTrend.slice(-7).map((d) => (
              <div
                key={d.day}
                className="flex-1 rounded-sm bg-[#0b6e4f]/80"
                style={{ height: `${Math.min(100, (d.total / Math.max(1, summary.last30Records / 7)) * 100)}%` }}
                title={`${d.day}: ${d.total} records`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Daily uploads over last 7 days</p>
        </Card>
      </div>

      {/* Alerts */}
      {alerts?.length > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-foreground">Alerts that need attention</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.detail}</p>
                </div>
                <Badge variant={alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top categories */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Highest-load record categories
          </h3>
          <Badge variant="info">Last 30 days focus</Badge>
        </div>
        <div className="space-y-3">
          {topCategories.map((c) => (
            <div key={c.category} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{c.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(c.total)} records total • {formatNumber(c.last30)} in last 30 days
                  </p>
                </div>
                <Badge variant="success">{Math.round((c.last30 / Math.max(1, c.total)) * 100)}% recent share</Badge>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0b6e4f] to-[#2196F3]"
                  style={{ width: `${Math.min(100, (c.total / maxCategoryTotal) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {topCategories.length === 0 && (
            <p className="text-sm text-muted-foreground">No record categories available yet.</p>
          )}
        </div>
      </Card>

      {/* Hotspots */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Facilities with highest volume
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {hotspots.map((h) => (
            <div key={h.hospital} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{h.hospital || 'Unnamed facility'}</p>
                  <p className="text-sm text-muted-foreground">{formatNumber(h.count)} records</p>
                </div>
                <Badge variant="warning">High load</Badge>
              </div>
            </div>
          ))}
          {hotspots.length === 0 && <p className="text-sm text-muted-foreground">No hospitals have uploaded data yet.</p>}
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-foreground">Actionable policy moves</h3>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg border border-zinc-800 bg-accent"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="info">{rec.category}</Badge>
                <Badge variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'default'}>
                  {rec.priority.toUpperCase()}
                </Badge>
              </div>
              <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{rec.action}</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Activity className="w-4 h-4" />
                <span>{rec.expectedImpact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
