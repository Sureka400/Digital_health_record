import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, UserCheck, UserX, Shield, Building2, User, Mail, Phone, MapPin, Calendar, Activity } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/app/utils/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/app/components/ui/dialog';

interface UserRecord {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  organization?: string;
  verified: boolean;
  lastActive: string | Date;
  status: 'active' | 'pending' | 'suspended';
  photoUrl?: string;
  abhaId?: string;
  blockchainId?: string;
  gender?: string;
  bloodGroup?: string;
  preferredLanguage?: string;
  homeState?: string;
  dob?: string | Date | null;
  isProfileComplete?: boolean;
  stats?: {
    recordCount: number;
    upcomingAppointments: number;
    completedAppointments: number;
  };
}

export function UserManagementTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const pendingUsers = useMemo(
    () => users.filter((u) => u.status === 'pending' || !u.verified),
    [users]
  );
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [loadingPendingAppts, setLoadingPendingAppts] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/users');
      setUsers((res as any).users || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const loadPendingAppts = async () => {
      setLoadingPendingAppts(true);
      try {
        const res = await api.get('/admin/pending-appointments');
        setPendingAppointments((res as any).appointments || []);
      } catch {
        setPendingAppointments([]);
      } finally {
        setLoadingPendingAppts(false);
      }
    };
    loadPendingAppts();
  }, []);

  const roleFilters = useMemo(() => ([
    { id: 'all', name: 'All Users', count: users.length },
    { id: 'doctor', name: 'Doctors', count: users.filter(u => u.role === 'DOCTOR' || u.role === 'doctor').length },
    { id: 'hospital', name: 'Hospitals', count: users.filter(u => u.role === 'HOSPITAL' || u.role === 'hospital').length },
    { id: 'patient', name: 'Patients', count: users.filter(u => u.role === 'PATIENT' || u.role === 'patient').length },
  ]), [users]);

  const normalizeRole = (role?: string) => (role ? role.toUpperCase() : 'PATIENT');

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const byRole = filterRole === 'all'
      ? users
      : users.filter(u => normalizeRole(u.role) === filterRole.toUpperCase());
    if (!normalizedSearch) return byRole;
    return byRole.filter((u) =>
      u.name.toLowerCase().includes(normalizedSearch) ||
      u.email.toLowerCase().includes(normalizedSearch) ||
      (u.phone || '').toLowerCase().includes(normalizedSearch)
    );
  }, [users, filterRole, searchQuery]);

  const getRoleIcon = (role: string) => {
    const normalized = role?.toUpperCase();
    switch (normalized) {
      case 'DOCTOR':
        return <User className="w-5 h-5" />;
      case 'HOSPITAL':
        return <Building2 className="w-5 h-5" />;
      case 'PATIENT':
        return <User className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    const normalized = role?.toUpperCase();
    switch (normalized) {
      case 'DOCTOR':
        return 'bg-blue-100 text-blue-700';
      case 'HOSPITAL':
        return 'bg-purple-100 text-purple-700';
      case 'PATIENT':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatLastActive = (value: any) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('en-IN');
  };

  const updateUserInList = (updated: UserRecord) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setSelectedUser((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
  };

  const handleVerify = async (userId: string) => {
    setSavingUserId(userId);
    try {
      const res = await api.patch(`/admin/users/${userId}/verify`, {});
      if ((res as any).user) {
        updateUserInList((res as any).user);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to verify user');
    } finally {
      setSavingUserId(null);
    }
  };

  const handleToggleStatus = async (user: UserRecord) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setSavingUserId(user.id);
    try {
      const res = await api.patch(`/admin/users/${user.id}/status`, { status: nextStatus });
      if ((res as any).user) {
        updateUserInList((res as any).user);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    } finally {
      setSavingUserId(null);
    }
  };

  const handleSaveUser = async (userId: string, updates: Partial<UserRecord>) => {
    setSavingUserId(userId);
    try {
      const payload: any = {};
      if (updates.status) payload.status = updates.status;
      if (updates.role) payload.role = normalizeRole(updates.role);
      if (updates.organization !== undefined) payload.organization = updates.organization;
      if (typeof updates.verified === 'boolean') payload.verified = updates.verified;

      const res = await api.patch(`/admin/users/${userId}`, payload);
      if ((res as any).user) {
        updateUserInList((res as any).user);
      }
      setSelectedUser(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to save user');
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage doctors, hospitals, and patient accounts
            </p>
          </div>
          <Button variant="primary" icon={<UserCheck className="w-4 h-4" />} onClick={fetchUsers} disabled={loading}>
            Refresh
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <div className="flex gap-2 overflow-x-auto">
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

      {/* Loading / error */}
      {loading && (
        <Card className="p-4 text-sm text-muted-foreground">
          Loading users...
        </Card>
      )}
      {error && (
        <Card className="p-4 text-sm text-red-500 border-red-200 bg-red-50">
          {error}
        </Card>
      )}
      {!loading && !error && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Pending Appointments ({pendingAppointments.length || 0})
              </h3>
              <p className="text-sm text-muted-foreground">
                Upcoming appointments waiting for review
              </p>
            </div>
          </div>
          {loadingPendingAppts ? (
            <p className="text-sm text-muted-foreground">Loading pending appointments...</p>
          ) : pendingAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending appointments.</p>
          ) : (
            <div className="space-y-2">
              {pendingAppointments.slice(0, 4).map((appt) => (
                <div key={appt.id} className="p-3 bg-white rounded-lg border border-yellow-200">
                  <p className="font-semibold text-foreground">{appt.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {appt.specialty} • {appt.doctor} • {new Date(appt.date).toLocaleDateString('en-IN')} {appt.time}
                  </p>
                  <p className="text-xs text-muted-foreground">{appt.hospital}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-[#0b6e4f]">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">Active Users</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
          <p className="text-sm text-muted-foreground">Suspended</p>
        </Card>
        <Card hover className="text-center">
          <p className="text-2xl font-bold text-[#2196F3]">{users.filter(u => u.verified).length}</p>
          <p className="text-sm text-muted-foreground">Verified</p>
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
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full ${getRoleColor(user.role)} flex items-center justify-center overflow-hidden border-2 border-[#0b6e4f]/10`}>
                    {user.photoUrl ? (
                      <img
                        src={`${api.API_URL.replace('/api', '')}/uploads/${user.photoUrl}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getRoleIcon(user.role)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 
                        className="font-semibold text-foreground hover:text-[#0b6e4f] cursor-pointer transition-colors"
                        onClick={() => setSelectedUser(user)}
                      >
                        {user.name}
                      </h4>
                      {user.verified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                      <Badge variant={
                        user.status === 'active' ? 'success' :
                        user.status === 'pending' ? 'warning' :
                        'danger'
                      }>
                        {user.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📧 {user.email}</p>
                      <p>📱 {user.phone || 'Not provided'}</p>
                      {user.organization && (
                        <p>🏥 {user.organization}</p>
                      )}
                      <p className="text-xs">Last active: {formatLastActive(user.lastActive)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!user.verified && (
                    <Button variant="primary" size="sm" disabled={savingUserId === user.id} onClick={() => handleVerify(user.id)}>
                      Verify
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    View
                  </Button>
                  <Button variant="ghost" size="sm" disabled={savingUserId === user.id} onClick={() => handleToggleStatus(user)}>
                    {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Role Assignment Info */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔐</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Role-Based Access Control</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The system uses strict role-based permissions to ensure data security and privacy.
            </p>
            <div className="text-sm space-y-1">
              <p>• <strong>Patients:</strong> View own records, manage consent</p>
              <p>• <strong>Doctors:</strong> Access patient records with consent, upload documents</p>
              <p>• <strong>Hospitals:</strong> Manage facilities, verify doctors</p>
              <p>• <strong>Admins:</strong> Full system access, analytics, user management</p>
            </div>
          </div>
        </div>
      </Card>

      <UserDetailDialog 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onSave={handleSaveUser}
        savingId={savingUserId}
        formatDate={formatLastActive}
      />
    </div>
  );
}

function UserDetailDialog({ user, open, onOpenChange, onSave, savingId, formatDate }: { 
  user: UserRecord | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onSave: (id: string, updates: Partial<UserRecord>) => void,
  savingId: string | null,
  formatDate: (v: any) => string
}) {
  if (!user) return null;

  const [role, setRole] = useState(user.role?.toUpperCase?.() || 'PATIENT');
  const [status, setStatus] = useState<UserRecord['status']>(user.status || 'active');
  const [verified, setVerified] = useState<boolean>(user.verified || false);
  const [organization, setOrganization] = useState<string>(user.organization || '');
  const [detail, setDetail] = useState<UserRecord | null>(user);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role?.toUpperCase?.() || 'PATIENT');
      setStatus(user.status || 'active');
      setVerified(!!user.verified);
      setOrganization(user.organization || '');
      setDetail(user);
      const fetchDetail = async () => {
        setLoadingDetail(true);
        try {
          const res = await api.get(`/admin/users/${user.id}`);
          if ((res as any).user) {
            setDetail(res.user);
            setRole(res.user.role?.toUpperCase?.() || role);
            setStatus(res.user.status || status);
            setVerified(!!res.user.verified);
            setOrganization(res.user.organization || '');
          }
        } catch {
          // ignore
        } finally {
          setLoadingDetail(false);
        }
      };
      fetchDetail();
    }
  }, [user]);

  const handleSave = () => {
    onSave(user.id, { role, status, verified, organization });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20 ${
              user.role?.toUpperCase?.() === 'DOCTOR' ? 'bg-blue-100 text-blue-700' :
              user.role?.toUpperCase?.() === 'HOSPITAL' ? 'bg-purple-100 text-purple-700' :
              'bg-green-100 text-green-700'
            }`}>
              {user.photoUrl ? (
                <img
                  src={`${api.API_URL.replace('/api', '')}/uploads/${user.photoUrl}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.role?.toUpperCase?.() === 'DOCTOR' ? <User className="w-6 h-6" /> :
                user.role?.toUpperCase?.() === 'HOSPITAL' ? <Building2 className="w-6 h-6" /> :
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{user.name}</DialogTitle>
              <DialogDescription className="text-zinc-400 capitalize">
                {role} • {status}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </p>
              <p className="text-sm">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase font-semibold flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Organization
            </p>
            <Input
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Hospital/Company"
              className="bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Verification
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                <span className="text-sm">{verified ? 'Verified' : 'Pending'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Last Active
              </p>
              <p className="text-sm">{formatDate(user.lastActive)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold">Role</p>
              <select
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-semibold">Status</p>
              <select
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as UserRecord['status'])}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {detail && (
            <div className="grid grid-cols-2 gap-3 text-sm bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
              <p><span className="text-zinc-500">ABHA:</span> {detail.abhaId || '—'}</p>
              <p><span className="text-zinc-500">Blockchain ID:</span> {detail.blockchainId || '—'}</p>
              <p><span className="text-zinc-500">Gender:</span> {detail.gender || '—'}</p>
              <p><span className="text-zinc-500">Blood Group:</span> {detail.bloodGroup || '—'}</p>
              <p><span className="text-zinc-500">DOB:</span> {detail.dob ? formatDate(detail.dob) : '—'}</p>
              <p><span className="text-zinc-500">Language:</span> {detail.preferredLanguage || '—'}</p>
              <p><span className="text-zinc-500">Home State:</span> {detail.homeState || '—'}</p>
              <p><span className="text-zinc-500">Profile Complete:</span> {detail.isProfileComplete ? 'Yes' : 'No'}</p>
              <p><span className="text-zinc-500">Records:</span> {detail.stats?.recordCount ?? 0}</p>
              <p><span className="text-zinc-500">Upcoming Appts:</span> {detail.stats?.upcomingAppointments ?? 0}</p>
              <p><span className="text-zinc-500">Completed Appts:</span> {detail.stats?.completedAppointments ?? 0}</p>
            </div>
          )}
          
          <div className="pt-4 border-t border-zinc-800 flex gap-2">
            <Button variant="outline" className="flex-1 border-zinc-800 hover:bg-zinc-900" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              className="flex-1 bg-[#0b6e4f] hover:bg-[#0b6e4f]/90 text-white"
              onClick={handleSave}
              disabled={savingId === user.id}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
