import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Video, CheckCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export function MyAppointmentsTab() {
  const todayAppointments = [
    {
      id: '1',
      time: '10:00 AM',
      patient: 'Rajesh Kumar',
      patientId: 'KL-MW-2025-12345',
      type: 'Follow-up',
      mode: 'in-person',
      status: 'upcoming',
    },
    {
      id: '2',
      time: '11:30 AM',
      patient: 'Priya Nair',
      patientId: 'KL-MW-2025-67890',
      type: 'New Consultation',
      mode: 'video',
      status: 'upcoming',
    },
    {
      id: '3',
      time: '2:00 PM',
      patient: 'Mohammed Ali',
      patientId: 'KL-MW-2025-13579',
      type: 'Routine Checkup',
      mode: 'in-person',
      status: 'upcoming',
    },
  ];

  const completedToday = 5;
  const totalToday = todayAppointments.length + completedToday;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0b6e4f]">{totalToday}</p>
            <p className="text-sm text-muted-foreground">Total Today</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{completedToday}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{todayAppointments.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Schedule
        </h2>
        
        <div className="space-y-3">
          {todayAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-accent rounded-lg hover:bg-[#e8f5e9] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#0b6e4f] text-white rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-foreground">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
                {appointment.mode === 'video' && (
                  <Badge variant="info">
                    <Video className="w-3 h-3" />
                    Video Call
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{appointment.patient}</p>
                  <p className="text-xs text-muted-foreground">{appointment.patientId}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  {appointment.mode === 'video' ? 'Start Video Call' : 'Start Consultation'}
                </Button>
                <Button variant="outline" size="sm">
                  View Records
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[#e8f5e9] to-[#e3f2fd]">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" fullWidth>
            Add Walk-in
          </Button>
          <Button variant="outline" fullWidth>
            View Calendar
          </Button>
        </div>
      </Card>
    </div>
  );
}
