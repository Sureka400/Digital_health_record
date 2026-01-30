import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Phone, MapPin, Activity, QrCode, Heart } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export function EmergencyTab() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Police', number: '100', icon: '👮' },
    { name: 'Fire', number: '101', icon: '🚒' },
    { name: 'Women Helpline', number: '1091', icon: '🆘' },
  ];

  const nearbyHospitals = [
    {
      name: 'Medical College Hospital',
      distance: '2.3 km',
      time: '8 mins',
      type: 'Government',
      emergency: true,
    },
    {
      name: 'District Hospital',
      distance: '4.1 km',
      time: '12 mins',
      type: 'Government',
      emergency: true,
    },
    {
      name: 'Community Health Center',
      distance: '1.5 km',
      time: '5 mins',
      type: 'Primary Care',
      emergency: false,
    },
  ];

  const criticalInfo = [
    { label: 'Blood Group', value: 'B+', color: 'text-red-600' },
    { label: 'Allergies', value: 'Penicillin', color: 'text-red-600' },
    { label: 'Chronic Conditions', value: 'Type 2 Diabetes', color: 'text-orange-600' },
    { label: 'Emergency Contact', value: '+91 98765 43210', color: 'text-blue-600' },
  ];

  const activateEmergencyMode = () => {
    setEmergencyMode(true);
    // In a real app, this would trigger notifications, share location, etc.
  };

  return (
    <div className="space-y-6">
      {/* Emergency SOS Button */}
      <motion.div
        animate={emergencyMode ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: emergencyMode ? Infinity : 0,
        }}
      >
        <Card className={`text-center ${emergencyMode ? 'bg-red-50 border-red-500 border-2' : ''}`}>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Emergency Access
          </h2>
          <Button
            variant={emergencyMode ? 'danger' : 'primary'}
            size="lg"
            fullWidth
            onClick={activateEmergencyMode}
            icon={<AlertCircle className="w-6 h-6" />}
            className={emergencyMode ? 'animate-pulse' : ''}
          >
            {emergencyMode ? '🚨 EMERGENCY MODE ACTIVE' : 'ACTIVATE EMERGENCY MODE'}
          </Button>
          {emergencyMode && (
            <motion.p
              className="text-sm text-red-600 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Your location and critical health info are being shared with nearby hospitals
            </motion.p>
          )}
        </Card>
      </motion.div>

      {/* Critical Health Information */}
      <Card className="bg-red-50 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Critical Health Info</h3>
            <p className="text-xs text-muted-foreground">Visible via Emergency QR</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {criticalInfo.map((info, index) => (
            <div key={index} className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700">
              <p className="text-xs text-gray-400 mb-1">{info.label}</p>
              <p className={`font-semibold ${info.color}`}>{info.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Emergency QR Code</span>
            <QrCode className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Works offline • No internet required
          </p>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Emergency Helplines
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {emergencyContacts.map((contact, index) => (
            <motion.a
              key={index}
              href={`tel:${contact.number}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-all"
            >
              <div className="text-3xl mb-2">{contact.icon}</div>
              <div className="font-semibold text-sm">{contact.name}</div>
              <div className="text-2xl font-bold text-red-600">{contact.number}</div>
            </motion.a>
          ))}
        </div>
      </Card>

      {/* Nearby Hospitals */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Nearby Hospitals
        </h3>
        
        <div className="space-y-3">
          {nearbyHospitals.map((hospital, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-muted rounded-lg hover:bg-accent transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                    {hospital.emergency && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                        24/7 Emergency
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{hospital.type}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📍 {hospital.distance}</span>
                    <span>⏱️ {hospital.time}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Navigate
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Location Sharing */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Live Location Sharing
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              In emergency mode, your real-time location is automatically shared with emergency contacts and nearby hospitals.
            </p>
            <Button variant="outline" size="sm" icon={<Activity className="w-4 h-4" />}>
              Configure Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}