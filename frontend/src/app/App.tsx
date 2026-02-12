import React, { useState, useEffect } from 'react';
import { LanguageSelectionScreen } from '@/app/components/screens/LanguageSelectionScreen';
import { LoginScreen } from '@/app/components/screens/LoginScreen';
import { PatientDashboard } from '@/app/components/dashboards/PatientDashboard';
import { DoctorDashboard } from '@/app/components/dashboards/DoctorDashboard';
import { AdminDashboard } from '@/app/components/dashboards/AdminDashboard';
import { useLanguage } from '@/app/context/LanguageContext';
import { api } from '@/app/utils/api';

type AppScreen = 'language' | 'login' | 'dashboard';
type UserRole = 'patient' | 'doctor' | 'admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('language');
  const { language, setLanguage } = useLanguage();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUserRole(role.toLowerCase() as UserRole);
      setCurrentScreen('dashboard');
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/patients/me');
      setUser(res.user);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setCurrentScreen('login');
  };

  const handleLogin = (role: string) => {
    const lowerRole = role.toLowerCase() as UserRole;
    setUserRole(lowerRole);
    setCurrentScreen('dashboard');
    fetchProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
    setUser(null);
    setCurrentScreen('language');
    setLanguage('en');
  };

  return (
    <div className="app">
      {/* Language Selection Screen */}
      {currentScreen === 'language' && (
        <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />
      )}

      {/* Login Screen */}
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} language={language} />
      )}

      {/* Dashboard - Role-based rendering */}
      {currentScreen === 'dashboard' && userRole === 'patient' && (
        <PatientDashboard onLogout={handleLogout} language={language} user={user} />
      )}

      {currentScreen === 'dashboard' && userRole === 'doctor' && (
        <DoctorDashboard onLogout={handleLogout} language={language} user={user} />
      )}

      {currentScreen === 'dashboard' && userRole === 'admin' && (
        <AdminDashboard onLogout={handleLogout} language={language} user={user} />
      )}
    </div>
  );
}
