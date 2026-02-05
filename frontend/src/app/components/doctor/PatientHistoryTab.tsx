import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, FileText, Calendar, User, Download, Loader2, Eye, Lock, Unlock, Share2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/app/components/ui/dialog';
import { api } from '@/app/utils/api';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

export function PatientHistoryTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await api.get('/records');
      setRecords(response.records);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', name: t('allRecords'), count: records.length },
    { id: 'prescription', name: t('prescriptions'), count: records.filter(r => r.category === 'prescription').length },
    { id: 'lab', name: t('labReports'), count: records.filter(r => r.category === 'lab').length },
    { id: 'imaging', name: t('imaging'), count: records.filter(r => ['xray', 'imaging', 'mri'].includes(r.category)).length },
  ];

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (r.hospital && r.hospital.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || r.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = async (recordId: string, title?: string) => {
    try {
      await api.download(`/records/${recordId}/download`, title || 'record');
    } catch (err: any) {
      alert(err.message || 'Download failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rajesh Kumar</h2>
            <p className="text-sm text-muted-foreground">{t('id')}: KL-MW-2025-12345</p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder={t('searchRecordsPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
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
            <h3 className="font-semibold text-foreground mb-1">{t('crossStateRecords')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('crossStateRecordsDesc')}
            </p>
          </div>
        </div>
      </Card>

      {/* Medical Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('medicalHistoryTimeline')}
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#0b6e4f] animate-spin mb-4" />
            <p className="text-muted-foreground">{t('loadingRecords')}</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-red-900/20 border border-red-900/50 rounded-xl">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchRecords} variant="outline">{t('retry')}</Button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">{t('noRecordsFound')}</h3>
            <p className="text-muted-foreground mt-1">{t('noRecordsMatch')}</p>
          </div>
        ) : (
          filteredRecords.map((record, index) => (
            <motion.div
              key={record._id}
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
                        <p className="text-sm text-muted-foreground uppercase">{record.category}</p>
                      </div>
                      <Badge variant="info">
                        {new Date(record.createdAt).toLocaleDateString(language)}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">
                      <p>🏥 {record.hospital || 'Not specified'}</p>
                      <p>👨‍⚕️ {record.doctor || 'Not specified'}</p>
                    </div>

                    {record.description && (
                      <div className="p-3 bg-accent rounded-lg mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t('details')}:</p>
                        <p className="text-sm text-foreground">{record.description}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => setSelectedRecord(record)}
                      >
                        {t('viewFull')}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Download className="w-4 h-4" />}
                        onClick={() => handleDownload(record._id, record.title)}
                      >
                        {t('download')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <RecordDetailsDialog 
        record={selectedRecord} 
        open={!!selectedRecord} 
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        onDownload={handleDownload}
        language={language}
        t={t}
      />

      {/* Patient Summary */}
      <Card className="bg-[#e8f5e9] border-[#0b6e4f]">
        <h3 className="font-semibold text-foreground mb-3">{t('patientSummary')}</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t('totalVisits')}</p>
            <p className="text-lg font-bold text-foreground">12</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('totalRecords')}</p>
            <p className="text-lg font-bold text-foreground">24</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('firstVisit')}</p>
            <p className="text-lg font-bold text-foreground">{new Date('2024-01-01').toLocaleDateString(language, { month: 'short', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('lastVisit')}</p>
            <p className="text-lg font-bold text-foreground">{new Date('2025-01-01').toLocaleDateString(language, { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RecordDetailsDialog({ record, open, onOpenChange, onDownload, language, t }: { 
  record: any | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onDownload: (id: string, title: string) => void,
  language: string,
  t: any
}) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{record.title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {new Date(record.createdAt).toLocaleDateString(language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} • {record.category?.toUpperCase() || 'RECORD'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold">{t('hospital')}</p>
              <p className="text-sm">{record.hospital || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold">{t('doctor')}</p>
              <p className="text-sm">{record.doctor || 'Not specified'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase font-semibold">{t('description')}</p>
            <p className="text-sm text-zinc-300 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
              {record.description || 'No additional description provided for this record.'}
            </p>
          </div>

          {record.fileUrl && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 uppercase font-semibold">{t('documentPreview')}</p>
              <div className="aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center overflow-hidden">
                {record.fileUrl.endsWith('.pdf') ? (
                  <div className="text-center p-4">
                    <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">PDF Document - Use download to view full content</p>
                  </div>
                ) : (
                  <img 
                    src={`${api.API_URL.replace('/api', '')}/uploads/${record.fileUrl}`} 
                    alt={record.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none border-zinc-700 hover:bg-zinc-800 text-white"
              onClick={() => onDownload(record._id, record.title)}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
            </Button>
          </div>
          <Button onClick={() => onOpenChange(false)} className="bg-[#0b6e4f] hover:bg-[#0b6e4f]/90 text-white">
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
