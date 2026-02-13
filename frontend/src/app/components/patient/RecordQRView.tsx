import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Calendar, Hospital, User, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/app/utils/api';
import { useTranslation } from '@/app/utils/translations';

interface RecordQRViewProps {
  token: string;
  onClose: () => void;
  language: string;
}

export function RecordQRView({ token, onClose, language }: RecordQRViewProps) {
  const { t } = useTranslation(language);
  const [data, setData] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/records/qr/${token}`);
      setData(response);
      if (response.type === 'single') {
        setSelectedRecord(response.record);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired QR code');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#0b6e4f] animate-spin mb-4" />
        <p className="text-white text-lg">{t('Loading details...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('Access Denied')}</h2>
        <p className="text-zinc-400 mb-6 max-w-xs">{t(error)}</p>
        <Button onClick={onClose} className="bg-[#0b6e4f] hover:bg-[#0b6e4f]/90 text-white">
          {t('Go Back')}
        </Button>
      </div>
    );
  }

  // If it's a patient profile and no record is selected yet, show list of records
  if (data?.type === 'patient' && !selectedRecord) {
    return (
      <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto pb-10">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <User className="text-[#0b6e4f]" /> {t('Patient Health Records')}
              </h1>
              <p className="text-zinc-400 text-sm mt-1">{data.patient.name} • {data.patient.abhaId}</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
              ✕
            </Button>
          </div>

          <div className="grid gap-4">
            {data.records.length === 0 ? (
              <Card className="p-8 text-center bg-zinc-900/50 border-zinc-800">
                <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400">{t('No records found for this patient.')}</p>
              </Card>
            ) : (
              data.records.map((rec: any) => (
                <Card 
                  key={rec._id} 
                  className="bg-zinc-900/50 border-zinc-800 text-white hover:border-[#0b6e4f]/50 transition-all cursor-pointer overflow-hidden group"
                  onClick={() => setSelectedRecord(rec)}
                >
                  <div className="flex items-center p-4 gap-4">
                    <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                      rec.category === 'prescription' ? 'bg-blue-500/10 text-blue-500' : 
                      rec.category === 'lab' ? 'bg-purple-500/10 text-purple-500' : 'bg-[#0b6e4f]/10 text-[#0b6e4f]'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{rec.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(rec.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 uppercase tracking-wider font-semibold text-[10px] text-zinc-600">{rec.category}</span>
                      </div>
                    </div>
                    <div className="text-[#0b6e4f] opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('View')} →
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="text-center text-xs text-zinc-500 py-8">
            <p>© 2025 Kerala Digital Health Mission</p>
          </div>
        </div>
      </div>
    );
  }

  const record = selectedRecord;
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto pb-10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            {data?.type === 'patient' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedRecord(null)}
                className="text-zinc-400 hover:text-white p-0 mr-2"
              >
                ← {t('Back to list')}
              </Button>
            )}
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="text-[#0b6e4f]" /> {t('Record Details')}
            </h1>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="bg-zinc-900/50 border-zinc-800 text-white overflow-hidden">
            <div className={`h-2 w-full ${
              record.category === 'prescription' ? 'bg-blue-500' : 
              record.category === 'lab' ? 'bg-purple-500' : 'bg-[#0b6e4f]'
            }`} />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{record.title}</h2>
                  <Badge variant="outline" className="text-[#0b6e4f] border-[#0b6e4f]">
                    {record.category?.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">{t('Date')}</p>
                  <p className="text-sm">{new Date(record.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <Hospital className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold">{t('Hospital')}</p>
                    <p className="text-sm font-medium">{record.hospital || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold">{t('Doctor')}</p>
                    <p className="text-sm font-medium">{record.doctor || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800 mb-8">
                <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">{t('Description / Notes')}</p>
                <p className="text-zinc-300 italic">
                  {record.description || 'No notes provided for this record.'}
                </p>
              </div>

              {record.fileUrl && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-500 uppercase font-semibold">{t('Attached Document')}</p>
                  <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
                    {record.fileUrl.endsWith('.pdf') ? (
                      <div className="text-center p-4">
                        <FileText className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                        <p className="text-sm text-zinc-500">PDF Document</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4 border-zinc-800"
                          onClick={() => window.open(`${api.API_URL.replace('/api', '')}/uploads/${record.fileUrl}`)}
                        >
                          <Download className="w-4 h-4 mr-2" /> {t('Download PDF')}
                        </Button>
                      </div>
                    ) : (
                      <img 
                        src={`${api.API_URL.replace('/api', '')}/uploads/${record.fileUrl}`} 
                        alt={record.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-[#0b6e4f]/10 border-[#0b6e4f]/20 text-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#0b6e4f] rounded-full flex items-center justify-center text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold">{t('Verified Health Record')}</h3>
                <p className="text-xs text-zinc-400">{t('Securely accessed via Kerala Health Portal')}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300">
              {t('This document is part of the digital health record system. It is verified and digitally signed by the healthcare provider.')}
            </p>
          </Card>
          
          <div className="text-center text-xs text-zinc-500 py-4">
            <p>© 2025 Kerala Digital Health Mission</p>
            <p className="mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Access logged at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
