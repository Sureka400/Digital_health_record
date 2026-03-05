import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, User, Clock, AlertCircle, Loader2, ShieldCheck, Activity, HeartPulse } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/app/utils/api';
import { useTranslation } from '@/app/utils/translations';

interface PublicProfileViewProps {
  blockchainId: string;
  onClose: () => void;
  language: string;
}

export function PublicProfileView({ blockchainId, onClose, language }: PublicProfileViewProps) {
  const { t } = useTranslation(language);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [blockchainId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/patients/public-profile/${blockchainId}`);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Patient profile not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#0b6e4f] animate-spin mb-4" />
        <p className="text-white text-lg">Fetching Blockchain Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
        <p className="text-zinc-400 mb-6 max-w-xs">{error}</p>
        <Button onClick={onClose} className="bg-[#0b6e4f] hover:bg-[#0b6e4f]/90 text-white">
          {t('Go Back')}
        </Button>
      </div>
    );
  }

  const { patient, healthRecords, appointments } = data;

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto pb-10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0b6e4f] rounded-full flex items-center justify-center">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                Verified Health Identity
              </h1>
              <p className="text-[#0b6e4f] text-xs font-bold uppercase tracking-widest">Ethereum Blockchain Secured</p>
            </div>
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
          {/* Patient Header Card */}
          <Card className="bg-zinc-900/50 border-zinc-800 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <User className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">{patient.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Age</p>
                  <p className="text-lg">{patient.age || 'N/A'} Yrs</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Gender</p>
                  <p className="text-lg">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Blood Group</p>
                  <p className="text-lg text-red-500 font-bold">{patient.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Status</p>
                  <Badge className="bg-green-600/20 text-green-500 border-green-600/30">Verified</Badge>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Blockchain Wallet Address</p>
                <p className="text-xs font-mono text-[#0b6e4f] break-all">{patient.blockchainId}</p>
              </div>
            </div>
          </Card>

          {/* Health Records Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="text-[#0b6e4f] w-5 h-5" /> Medical History
            </h3>
            {healthRecords.length === 0 ? (
              <Card className="p-8 text-center bg-zinc-900/30 border-zinc-800 text-zinc-500 italic">
                No health records found.
              </Card>
            ) : (
              healthRecords.map((rec: any) => (
                <Card key={rec._id} className="bg-zinc-900/50 border-zinc-800 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-[#0b6e4f]/10 rounded-lg">
                        <FileText className="w-5 h-5 text-[#0b6e4f]" />
                      </div>
                      <div>
                        <h4 className="font-bold">{rec.title}</h4>
                        <p className="text-xs text-zinc-400">{rec.hospital} • {rec.doctor}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">{new Date(rec.createdAt).toLocaleDateString()}</p>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Appointments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="text-[#2196F3] w-5 h-5" /> Recent Appointments
            </h3>
            {appointments.length === 0 ? (
              <Card className="p-8 text-center bg-zinc-900/30 border-zinc-800 text-zinc-500 italic">
                No recent appointments.
              </Card>
            ) : (
              appointments.map((app: any) => (
                <Card key={app._id} className="bg-zinc-900/50 border-zinc-800 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-2 bg-[#2196F3]/10 rounded-lg">
                        <Clock className="w-5 h-5 text-[#2196F3]" />
                      </div>
                      <div>
                        <h4 className="font-bold">{app.reason}</h4>
                        <p className="text-xs text-zinc-400">{app.doctor?.name || 'Doctor'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#2196F3]">{new Date(app.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-zinc-500">{app.time}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Security Footer */}
          <Card className="bg-zinc-900 border-dashed border-zinc-800 p-6 text-center">
            <HeartPulse className="w-8 h-8 text-[#0b6e4f] mx-auto mb-3" />
            <p className="text-sm text-zinc-300 mb-2">Data Integrity Guaranteed by Decentralized Ledger</p>
            <p className="text-xs text-zinc-500">
              Access to these records is logged and secured via Kerala's Digital Health Blockchain Infrastructure.
            </p>
          </Card>
          
          <div className="text-center text-xs text-zinc-500 py-4">
            <p>© 2025 Kerala Digital Health Mission</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
