import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, UserCheck, UserX, Shield, Building2, User } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

interface UserRecord {
  id: string;
  name: string;
  role: 'doctor' | 'hospital' | 'patient';
  email: string;
  phone: string;
  organization?: string;
  verified: boolean;
  lastActive: string;
  status: 'active' | 'pending' | 'suspended';
}

export function UserManagementTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const users: UserRecord[] = [
    {
      id: '1',
      name: 'Dr. Priya Menon',
      role: 'doctor',
      email: 'priya.menon@hospital.gov',
      phone: '+91 98765 43210',
      organization: 'Medical College Hospital, Trivandrum',
      verified: true,
      lastActive: `2 ${t('hours')} ${t('ago')}`,
      status: 'active',
    },
    // ... other users
  ];

  const roleFilters = [
    { id: 'all', name: t('allRecords'), count: users.length },
    { id: 'doctor', name: t('doctor'), count: users.filter(u => u.role === 'doctor').length },
    { id: 'hospital', name: t('hospital'), count: users.filter(u => u.role === 'hospital').length },
    { id: 'patient', name: t('patient'), count: users.filter(u => u.role === 'patient').length },
  ];

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter(u => u.role === filterRole);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
      case 'patient':
        return <User className="w-5 h-5" />;
      case 'hospital':
        return <Building2 className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-blue-100 text-blue-700';
      case 'hospital': return 'bg-purple-100 text-purple-700';
      case 'patient': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('userManagement')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('realTimeInsights')}
            </p>
          </div>
          <Button variant="primary" icon={<UserCheck className="w-4 h-4" />}>
            {t('addUser')}
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder={t('searchUsersPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {roleFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterRole(filter.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterRole === filter.id
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

      {/* Pending Verifications */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {t('pendingVerifications')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('reviewCarefully')}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          {t('reviewPending')}
        </Button>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-[#0b6e4f]">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">{t('activeUsers')}</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
          <p className="text-sm text-muted-foreground">{t('pending')}</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
          <p className="text-sm text-muted-foreground">{t('suspended')}</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-[#2196F3]">{users.filter(u => u.verified).length}</p>
          <p className="text-sm text-muted-foreground">{t('verified')}</p>
        </Card>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full ${getRoleColor(user.role)} flex items-center justify-center flex-shrink-0`}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{user.name}</h4>
                      {user.verified && <Shield className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📧 {user.email}</p>
                      <p>📱 {user.phone}</p>
                      <p className="text-xs">{t('lastVisit')}: {user.lastActive}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">{t('view')}</Button>
                  <Button variant="ghost" size="sm">{t('edit')}</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
