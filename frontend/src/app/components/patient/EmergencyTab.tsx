import React from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  User, 
  Droplet,
  Heart,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

export function EmergencyTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const emergencyContacts = [
    { label: t('ambulance'), number: '108', color: 'bg-red-100 text-red-600', icon: Activity },
    { label: t('police'), number: '100', color: 'bg-blue-100 text-blue-600', icon: ShieldAlert },
    { label: t('fireStation'), number: '101', color: 'bg-orange-100 text-orange-600', icon: AlertTriangle },
    { label: t('womenHelpline'), number: '1091', color: 'bg-pink-100 text-pink-600', icon: Heart },
  ];

  const hospitals = [
    {
      name: 'City Medical Center',
      distance: '0.8 km',
      type: 'Tertiary Care',
      open: true,
      phone: '+91 98765 43210'
    },
    {
      name: 'General Hospital',
      distance: '2.4 km',
      type: 'Government',
      open: true,
      phone: '+91 98765 43211'
    }
  ];

  return (
    <div className="space-y-6">
      {/* SOS Button */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <button className="w-full aspect-square max-w-[200px] mx-auto block rounded-full bg-red-600 text-white font-bold text-3xl shadow-[0_0_50px_rgba(220,38,38,0.5)] border-[10px] border-red-100 animate-pulse relative z-10">
          SOS
        </button>
        <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse" />
        <p className="text-center mt-4 text-red-600 font-bold animate-bounce uppercase tracking-widest">
          {t('tapToCallEmergency')}
        </p>
      </motion.div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        {emergencyContacts.map((contact, index) => (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 text-center cursor-pointer active:bg-accent transition-colors">
              <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <contact.icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-foreground">{contact.number}</div>
              <div className="text-xs text-muted-foreground">{contact.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Emergency Profile Summary */}
      <Card className="bg-red-50 border-red-200">
        <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          {t('emergencyMedicalCard')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-red-700 flex items-center gap-1">
              <Droplet className="w-3 h-3" />
              {t('bloodGroup')}
            </div>
            <div className="font-bold text-red-900 text-xl">O+ Positive</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-red-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t('allergies')}
            </div>
            <div className="font-bold text-red-900">Penicillin, Peanuts</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-200">
          <div className="text-xs text-red-700 mb-1">{t('emergencyContact')}</div>
          <div className="flex items-center justify-between">
            <div className="font-bold text-red-900">Priya (Wife)</div>
            <Button size="sm" variant="outline" className="border-red-300 text-red-700">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </div>
      </Card>

      {/* Nearby Hospitals */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          {t('nearbyHospitals')}
        </h3>
        <div className="space-y-3">
          {hospitals.map((hospital, index) => (
            <Card key={index} className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                  <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">OPEN</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {hospital.distance}
                  </span>
                  <span>•</span>
                  <span>{hospital.type}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="rounded-full">
                  <Navigation className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="primary" className="rounded-full bg-red-600 hover:bg-red-700">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* First Aid Tips */}
      <Card className="bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">{t('firstAidTips')}</h3>
        <ul className="space-y-2">
          <li className="text-sm text-amber-800 flex items-start gap-2">
            <span className="font-bold">1.</span>
            Stay calm and check for safety
          </li>
          <li className="text-sm text-amber-800 flex items-start gap-2">
            <span className="font-bold">2.</span>
            Call emergency services immediately
          </li>
          <li className="text-sm text-amber-800 flex items-start gap-2">
            <span className="font-bold">3.</span>
            Keep the patient warm and still
          </li>
        </ul>
      </Card>
    </div>
  );
}
