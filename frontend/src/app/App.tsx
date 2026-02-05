import React, { useState } from 'react';
import { LanguageSelectionScreen } from '@/app/components/screens/LanguageSelectionScreen';
import { LoginScreen } from '@/app/components/screens/LoginScreen';
import { PatientDashboard } from '@/app/components/dashboards/PatientDashboard';
import { DoctorDashboard } from '@/app/components/dashboards/DoctorDashboard';
import { AdminDashboard } from '@/app/components/dashboards/AdminDashboard';
import { useLanguage } from '@/app/context/LanguageContext';

type AppScreen = 'language' | 'login' | 'dashboard';
type UserRole = 'patient' | 'doctor' | 'admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('language');
  const { language, setLanguage } = useLanguage();
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setCurrentScreen('login');
  };

  const handleLogin = (role: string) => {
    setUserRole(role as UserRole);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
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
        <PatientDashboard onLogout={handleLogout} language={language} />
      )}

      {currentScreen === 'dashboard' && userRole === 'doctor' && (
        <DoctorDashboard onLogout={handleLogout} language={language} />
      )}

      {currentScreen === 'dashboard' && userRole === 'admin' && (
        <AdminDashboard onLogout={handleLogout} language={language} />
      )}
    </div>
  );
}
