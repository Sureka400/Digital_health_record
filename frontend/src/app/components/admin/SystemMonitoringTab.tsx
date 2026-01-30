import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Database, Lock, Eye, CheckCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export function SystemMonitoringTab() {
  const systemHealth = [
    { metric: 'System Uptime', value: '98.5%', status: 'excellent', color: 'green' },
    { metric: 'API Response Time', value: '145ms', status: 'good', color: 'green' },
    { metric: 'Database Performance', value: '92%', status: 'good', color: 'green' },
    { metric: 'Storage Usage', value: '67%', status: 'normal', color: 'yellow' },
  ];

  const recentAccesses = [
    {
      id: '1',
      action: 'QR Code Scanned',
      user: 'Dr. Priya Menon',
      patient: 'Rajesh Kumar (KL-MW-2025-12345)',
      timestamp: '2 minutes ago',
      status: 'approved',
    },
    {
      id: '2',
      action: 'Medical Record Upload',
      user: 'Dr. Suresh Kumar',
      patient: 'Mohammed Ali (KL-MW-2025-13579)',
      timestamp: '15 minutes ago',
      status: 'approved',
    },
    {
      id: '3',
      action: 'Record Access Request',
      user: 'Dr. Aisha Rahman',
      patient: 'Priya Nair (KL-MW-2025-67890)',
      timestamp: '1 hour ago',
      status: 'approved',
    },
    {
      id: '4',
      action: 'Unauthorized Access Attempt',
      user: 'Unknown IP: 192.168.1.100',
      patient: 'Multiple patients',
      timestamp: '3 hours ago',
      status: 'blocked',
    },
  ];

  const consentLogs = [
    { patient: 'Rajesh Kumar', action: 'Granted access', doctor: 'Dr. Priya Menon', time: '10 mins ago' },
    { patient: 'Mohammed Ali', action: 'Revoked access', doctor: 'Dr. Suresh Kumar', time: '1 hour ago' },
    { patient: 'Priya Nair', action: 'Granted access', doctor: 'Dr. Aisha Rahman', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <h2 className="text-2xl font-bold text-foreground mb-2">System Monitoring</h2>
        <p className="text-sm text-muted-foreground">
          Real-time security, performance, and access control monitoring
        </p>
      </Card>

      {/* System Health */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          System Health
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemHealth.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-accent rounded-lg"
            >
              <p className="text-sm text-muted-foreground mb-1">{item.metric}</p>
              <p className={`text-2xl font-bold ${
                item.color === 'green' ? 'text-green-600' :
                item.color === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {item.value}
              </p>
              <Badge
                variant={
                  item.status === 'excellent' ? 'success' :
                  item.status === 'good' ? 'success' :
                  'warning'
                }
                className="mt-2"
              >
                {item.status}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Data Security Status */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Data Security Status</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">SSL Encryption Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Data Backup: Last 2 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Firewall: Active</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Access Audit Trail */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          Recent Access Logs
        </h3>

        <div className="space-y-2">
          {recentAccesses.map((access, index) => (
            <motion.div
              key={access.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg ${
                access.status === 'blocked' ? 'bg-red-50 border border-red-200' : 'bg-muted'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-foreground">{access.action}</p>
                    <Badge variant={access.status === 'approved' ? 'success' : 'danger'}>
                      {access.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    User: {access.user}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Patient: {access.patient}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {access.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Consent Management Logs */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          Consent Management Activity
        </h3>

        <div className="space-y-2">
          {consentLogs.map((log, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{log.patient}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.action} to {log.doctor}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Privacy First:</strong> All patient data access requires explicit consent. The system maintains a complete audit trail of all consent actions.
          </p>
        </div>
      </Card>

      {/* Database Statistics */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-600" />
          Database Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-accent rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">5.2M</p>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </div>
          <div className="p-3 bg-accent rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">2.5GB</p>
            <p className="text-sm text-muted-foreground">Storage Used</p>
          </div>
          <div className="p-3 bg-accent rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">1,240</p>
            <p className="text-sm text-muted-foreground">Queries/sec</p>
          </div>
          <div className="p-3 bg-accent rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">99.9%</p>
            <p className="text-sm text-muted-foreground">Availability</p>
          </div>
        </div>
      </Card>

      {/* Blockchain Audit Trail Info */}
      <Card className="bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔗</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Blockchain-Verified Audit Trail</h3>
            <p className="text-sm text-muted-foreground">
              All access logs and consent changes are recorded in an immutable blockchain ledger, ensuring complete transparency and preventing unauthorized modifications to the audit trail.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
