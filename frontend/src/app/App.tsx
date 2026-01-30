import React, { useState } from 'react';
import { LanguageSelectionScreen } from '@/app/components/screens/LanguageSelectionScreen';
import { LoginScreen } from '@/app/components/screens/LoginScreen';
import { PatientDashboard } from '@/app/components/dashboards/PatientDashboard';
import { DoctorDashboard } from '@/app/components/dashboards/DoctorDashboard';
import { AdminDashboard } from '@/app/components/dashboards/AdminDashboard';

type AppScreen = 'language' | 'login' | 'dashboard';
type UserRole = 'patient' | 'doctor' | 'admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentScreen('login');
  };

  const handleLogin = (role: string) => {
    setUserRole(role as UserRole);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('language');
    setSelectedLanguage('en');
  };

  return (
    <div className="app">
      {/* Language Selection Screen */}
      {currentScreen === 'language' && (
        <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />
      )}

      {/* Login Screen */}
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} language={selectedLanguage} />
      )}

      {/* Dashboard - Role-based rendering */}
      {currentScreen === 'dashboard' && userRole === 'patient' && (
        <PatientDashboard onLogout={handleLogout} />
      )}

      {currentScreen === 'dashboard' && userRole === 'doctor' && (
        <DoctorDashboard onLogout={handleLogout} />
      )}

      {currentScreen === 'dashboard' && userRole === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
