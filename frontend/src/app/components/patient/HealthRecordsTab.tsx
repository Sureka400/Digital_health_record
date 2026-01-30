import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Eye, Share2, Calendar, Lock, Unlock } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  hospital: string;
  doctor: string;
  category: 'prescription' | 'lab' | 'xray' | 'discharge';
  consentEnabled: boolean;
}

export function HealthRecordsTab() {
  const [records] = useState<MedicalRecord[]>([
    {
      id: '1',
      type: 'Prescription',
      title: 'General Checkup & Medication',
      date: '2025-01-28',
      hospital: 'Medical College Hospital, Trivandrum',
      doctor: 'Dr. Priya Menon',
      category: 'prescription',
      consentEnabled: true,
    },
    {
      id: '2',
      type: 'Lab Report',
      title: 'Blood Test - Complete Blood Count',
      date: '2025-01-25',
      hospital: 'District Hospital, Ernakulam',
      doctor: 'Dr. Suresh Kumar',
      category: 'lab',
      consentEnabled: true,
    },
    {
      id: '3',
      type: 'X-Ray',
      title: 'Chest X-Ray Report',
      date: '2025-01-20',
      hospital: 'Community Health Center, Kozhikode',
      doctor: 'Dr. Aisha Rahman',
      category: 'xray',
      consentEnabled: false,
    },
    {
      id: '4',
      type: 'Discharge Summary',
      title: 'Post-Surgery Discharge',
      date: '2025-01-15',
      hospital: 'Medical College Hospital, Trivandrum',
      doctor: 'Dr. Rajesh Nair',
      category: 'discharge',
      consentEnabled: true,
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      prescription: 'bg-blue-900/50 text-blue-400',
      lab: 'bg-purple-900/50 text-purple-400',
      imaging: 'bg-green-900/50 text-green-400',
      vaccination: 'bg-teal-900/50 text-teal-400',
      consultation: 'bg-indigo-900/50 text-indigo-400',
      discharge: 'bg-orange-900/50 text-orange-400',
    };
    return colors[category as keyof typeof colors] || 'bg-zinc-800 text-gray-300';
  };

  const toggleConsent = (recordId: string) => {
    // Toggle consent logic would go here
    console.log('Toggle consent for', recordId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              My Health Records
            </h2>
            <p className="text-sm text-muted-foreground">
              Timeline-based medical history with secure access control
            </p>
          </div>
          <Badge variant="ai">
            ✨ AI Classified
          </Badge>
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="relative">
              {/* Timeline Line */}
              {index !== records.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-border -mb-4" />
              )}

              <div className="flex gap-4">
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${getCategoryColor(record.category)} flex items-center justify-center`}>
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{record.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(record.category)}`}>
                      {record.type}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    <p>🏥 {record.hospital}</p>
                    <p>👨‍⚕️ {record.doctor}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => setSelectedRecord(record)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Share2 className="w-4 h-4" />}
                    >
                      Share
                    </Button>
                    
                    {/* Consent Toggle */}
                    <button
                      onClick={() => toggleConsent(record.id)}
                      className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        record.consentEnabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {record.consentEnabled ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          Shared
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          Private
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* QR Link Info */}
      <Card className="bg-[#e8f5e9] border-[#0b6e4f]">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔗</div>
          <div>
            <h3 className="font-semibold text-[#0b6e4f] mb-1">
              All records linked to your Health QR
            </h3>
            <p className="text-sm text-foreground">
              Scan your QR code at any hospital to give doctors instant access to your shared medical history. You control what gets shared through consent toggles.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}