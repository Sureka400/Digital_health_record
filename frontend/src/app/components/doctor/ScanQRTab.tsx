import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Camera, AlertTriangle, Heart, Activity } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export function ScanQRTab() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPatient, setScannedPatient] = useState<any>(null);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setScannedPatient({
        id: 'KL-MW-2025-12345',
        name: 'Rajesh Kumar',
        age: 32,
        gender: 'Male',
        bloodGroup: 'B+',
        photo: null,
        allergies: ['Penicillin'],
        chronicConditions: ['Type 2 Diabetes'],
        lastVisit: '2025-01-28',
        emergencyContact: '+91 98765 43210',
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Card */}
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Scan Patient QR Code
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Scan the patient's health QR code for instant access to their medical records
        </p>

        {!scannedPatient ? (
          <div className="space-y-4">
            <motion.div
              className={`w-64 h-64 mx-auto border-4 rounded-2xl flex items-center justify-center ${
                isScanning ? 'border-[#0b6e4f] bg-[#e8f5e9]' : 'border-dashed border-muted bg-muted'
              }`}
              animate={
                isScanning
                  ? {
                      borderColor: ['#0b6e4f', '#2196F3', '#0b6e4f'],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
            >
              {isScanning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <QrCode className="w-24 h-24 text-[#0b6e4f]" />
                </motion.div>
              ) : (
                <Camera className="w-24 h-24 text-muted-foreground" />
              )}
            </motion.div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleScan}
              disabled={isScanning}
              icon={<Camera className="w-5 h-5" />}
            >
              {isScanning ? 'Scanning...' : 'Open Camera to Scan'}
            </Button>

            <p className="text-xs text-muted-foreground">
              Or enter patient ID manually
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Patient Identified</h3>
            <Button variant="outline" onClick={() => setScannedPatient(null)}>
              Scan Another Patient
            </Button>
          </motion.div>
        )}
      </Card>

      {/* Patient Summary */}
      {scannedPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Basic Info */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0b6e4f] to-[#2196F3] rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                {scannedPatient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-1">{scannedPatient.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <span>👤 {scannedPatient.age} years, {scannedPatient.gender}</span>
                  <span>🆔 {scannedPatient.id}</span>
                  <span className="text-red-600 font-semibold">🩸 {scannedPatient.bloodGroup}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">Active Patient</Badge>
                  <Badge variant="default">Last visit: {scannedPatient.lastVisit}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Critical Alerts */}
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-800 mb-1">⚠️ Critical Alerts</h3>
                <p className="text-sm text-red-700">
                  Review carefully before prescribing medication
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-red-800">Drug Allergies</p>
                    <p className="text-sm text-red-600">
                      {scannedPatient.allergies.join(', ')}
                    </p>
                  </div>
                  <Badge variant="danger">High Risk</Badge>
                </div>
              </div>

              <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-orange-800">Chronic Conditions</p>
                    <p className="text-sm text-orange-600">
                      {scannedPatient.chronicConditions.join(', ')}
                    </p>
                  </div>
                  <Badge variant="warning">Monitor</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medical Records</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" fullWidth>
              View Full History
            </Button>
            <Button variant="secondary" fullWidth>
              Start Consultation
            </Button>
          </div>
        </motion.div>
      )}

      {/* Info Card */}
      {!scannedPatient && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Quick & Secure Access</h3>
              <p className="text-sm text-muted-foreground">
                The QR code provides instant access to patient records while maintaining privacy and security. All accesses are logged and require patient consent.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}