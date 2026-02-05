import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Video, User } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'upcoming' | 'completed';
}

export function AppointmentsTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const appointments: Appointment[] = [
    {
      id: '1',
      doctor: 'Dr. Priya Menon',
      specialty: 'General Physician',
      hospital: 'Medical College Hospital, Trivandrum',
      date: '2025-02-05',
      time: '10:00 AM',
      type: 'in-person',
      status: 'upcoming',
    },
    {
      id: '2',
      doctor: 'Dr. Suresh Kumar',
      specialty: 'Diabetologist',
      hospital: 'District Hospital, Ernakulam',
      date: '2025-02-12',
      time: '2:30 PM',
      type: 'video',
      status: 'upcoming',
    },
    {
      id: '3',
      doctor: 'Dr. Aisha Rahman',
      specialty: 'Cardiologist',
      hospital: 'Community Health Center, Kozhikode',
      date: '2025-01-20',
      time: '11:00 AM',
      type: 'in-person',
      status: 'completed',
    },
  ];

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header with Book Appointment */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{t('myAppointments')}</h2>
            <p className="text-sm text-muted-foreground">
              {upcomingAppointments.length} {t('upcomingAppointments')}
            </p>
          </div>
          <Button variant="primary" icon={<Calendar className="w-4 h-4" />}>
            {t('bookNew')}
          </Button>
        </div>
      </Card>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">{t('upcoming')}</h3>
        <div className="space-y-3">
          {upcomingAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="bg-gradient-to-r from-white to-[#e8f5e9]">
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 text-center bg-[#0b6e4f] text-white rounded-xl p-3">
                    <div className="text-2xl font-bold">
                      {new Date(appointment.date).getDate()}
                    </div>
                    <div className="text-xs">
                      {new Date(appointment.date).toLocaleDateString(language === 'en' ? 'en-IN' : language, { month: 'short' })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          {appointment.doctor}
                          {appointment.type === 'video' && (
                            <Badge variant="info">
                              <Video className="w-3 h-3" />
                              Video
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {appointment.hospital}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">
                        {appointment.type === 'video' ? t('joinVideoCall') : t('viewDetails')}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('reschedule')}
                      </Button>
                      <Button variant="ghost" size="sm">
                        {t('cancel')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart Reminders Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔔</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">{t('smartReminders')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('smartRemindersDesc')}
            </p>
          </div>
        </div>
      </Card>

      {/* Past Appointments */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">{t('past')}</h3>
        <div className="space-y-3">
          {pastAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="opacity-75 hover:opacity-100 transition-all">
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 text-center bg-muted text-foreground rounded-xl p-3">
                    <div className="text-2xl font-bold">
                      {new Date(appointment.date).getDate()}
                    </div>
                    <div className="text-xs">
                      {new Date(appointment.date).toLocaleDateString(language === 'en' ? 'en-IN' : language, { month: 'short' })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{appointment.doctor}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{appointment.specialty}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      {appointment.time}
                    </div>

                    <Button variant="outline" size="sm">
                      {t('viewSummary')}
                    </Button>
                  </div>

                  <Badge variant="success">✓ {t('completed')}</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
