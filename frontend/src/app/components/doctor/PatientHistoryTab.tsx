import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, FileText, Calendar, User, Download } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';

export function PatientHistoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const medicalRecords = [
    {
      id: '1',
      date: '2025-01-28',
      type: 'Prescription',
      title: 'General Checkup & Medication',
      hospital: 'Medical College Hospital, Trivandrum',
      doctor: 'Dr. Priya Menon',
      diagnosis: 'Type 2 Diabetes Management',
      medications: ['Metformin 500mg', 'Multivitamin'],
      notes: 'Patient responding well to treatment. Blood sugar levels stable.',
      category: 'prescription',
    },
    {
      id: '2',
      date: '2025-01-25',
      type: 'Lab Report',
      title: 'Complete Blood Count',
      hospital: 'District Hospital, Ernakulam',
      doctor: 'Dr. Suresh Kumar',
      results: {
        'Hemoglobin': '13.5 g/dL',
        'Blood Sugar (Fasting)': '105 mg/dL',
        'Cholesterol': '215 mg/dL',
      },
      category: 'lab',
    },
    {
      id: '3',
      date: '2025-01-20',
      type: 'X-Ray',
      title: 'Chest X-Ray Report',
      hospital: 'Community Health Center, Kozhikode',
      doctor: 'Dr. Aisha Rahman',
      findings: 'Normal chest X-ray. No abnormalities detected.',
      category: 'xray',
    },
  ];

  const filters = [
    { id: 'all', name: 'All Records', count: medicalRecords.length },
    { id: 'prescription', name: 'Prescriptions', count: 1 },
    { id: 'lab', name: 'Lab Reports', count: 1 },
    { id: 'xray', name: 'Imaging', count: 1 },
  ];

  const filteredRecords = filterType === 'all'
    ? medicalRecords
    : medicalRecords.filter(r => r.category === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Patient: Rajesh Kumar</h2>
            <p className="text-sm text-muted-foreground">ID: KL-MW-2025-12345</p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Search medical records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === filter.id
                    ? 'bg-[#0b6e4f] text-white'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Cross-State Records Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🌍</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Cross-State Records Available</h3>
            <p className="text-sm text-muted-foreground">
              This patient's records from other states are accessible through the unified health network.
            </p>
          </div>
        </div>
      </Card>

      {/* Medical Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Medical History Timeline
        </h3>

        {filteredRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex gap-4">
                {/* Timeline */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-[#0b6e4f] text-white rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  {index !== filteredRecords.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border -mb-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{record.title}</h4>
                      <p className="text-sm text-muted-foreground">{record.type}</p>
                    </div>
                    <Badge variant="info">
                      {new Date(record.date).toLocaleDateString('en-IN')}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    <p>🏥 {record.hospital}</p>
                    <p>👨‍⚕️ {record.doctor}</p>
                  </div>

                  {/* Details based on type */}
                  {record.category === 'prescription' && (
                    <div className="space-y-2 mb-3">
                      <div className="p-3 bg-accent rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Diagnosis:</p>
                        <p className="text-sm text-foreground">{record.diagnosis}</p>
                      </div>
                      <div className="p-3 bg-accent rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Medications:</p>
                        <ul className="text-sm text-foreground space-y-1">
                          {record.medications?.map((med, i) => (
                            <li key={i}>• {med}</li>
                          ))}
                        </ul>
                      </div>
                      {record.notes && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                          <p className="text-sm text-foreground">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {record.category === 'lab' && record.results && (
                    <div className="p-3 bg-accent rounded-lg mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Test Results:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(record.results).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <p className="text-muted-foreground">{key}</p>
                            <p className="font-semibold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.category === 'xray' && record.findings && (
                    <div className="p-3 bg-accent rounded-lg mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Findings:</p>
                      <p className="text-sm text-foreground">{record.findings}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={<FileText className="w-4 h-4" />}>
                      View Full
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Patient Summary */}
      <Card className="bg-[#e8f5e9] border-[#0b6e4f]">
        <h3 className="font-semibold text-foreground mb-3">Patient Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Total Visits</p>
            <p className="text-lg font-bold text-foreground">12</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Records</p>
            <p className="text-lg font-bold text-foreground">24</p>
          </div>
          <div>
            <p className="text-muted-foreground">First Visit</p>
            <p className="text-lg font-bold text-foreground">Jan 2024</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Visit</p>
            <p className="text-lg font-bold text-foreground">Jan 2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
