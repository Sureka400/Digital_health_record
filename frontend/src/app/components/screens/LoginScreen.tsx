import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, QrCode, CreditCard, Mic, Heart, Users, Activity } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { api } from '@/app/utils/api';
import { useTranslation } from '@/app/utils/translations';

interface LoginScreenProps {
  onLogin: (role: string) => void;
  language: string;
}

export function LoginScreen({ onLogin, language }: LoginScreenProps) {
  const { t } = useTranslation(language);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'qr' | 'id'>('phone');
  const [email, setEmail] = useState('');
  const [showImpactStats, setShowImpactStats] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/send-otp', { email });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (role: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (otpSent && email) {
        // Use real OTP verification if email was entered
        response = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        onLogin(response.role);
      } else {
        // For demo purposes, we use hardcoded credentials matching the seed script
        const demoEmail = role === 'patient' ? 'patient@demo.com' : (role === 'doctor' ? 'doctor@demo.com' : 'admin@demo.com');
        const password = 'password123';
        
        response = await api.post('/auth/login', { email: demoEmail, password });
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', role);
        onLogin(role);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900">
      {/* Impact Stats Banner */}
      {showImpactStats && (
        <motion.div
          className="bg-gradient-to-r from-[#0b6e4f] to-[#2196F3] text-white py-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <div>
                    <div className="text-2xl font-bold">2.5L+</div>
                    <div className="text-xs opacity-90">{t('livesSupported')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <div>
                    <div className="text-2xl font-bold">150+</div>
                    <div className="text-xs opacity-90">{t('hospitalsConnected')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <div>
                    <div className="text-2xl font-bold">5M+</div>
                    <div className="text-xs opacity-90">{t('recordsDigitized')}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowImpactStats(false)}
                className="text-xs opacity-75 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Side - Illustration */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1698465281093-9f09159733b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoZWFsdGhjYXJlJTIwd29ya2VyJTIwZG9jdG9yJTIwcGF0aWVudHxlbnwxfHx8fDE3Njk4MzYyODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthcare in Kerala"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-zinc-800">
                <p className="text-sm font-medium text-[#10b981]">
                  🌟 {t('empoweringMigrantWorkers')}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {t('accessAnywhere')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-800 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-[#0b6e4f] to-[#2196F3] rounded-xl">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t('welcome')}</h2>
                    <p className="text-sm text-gray-400">{t('signIn')}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Login Method Selection */}
              <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-zinc-800/50 rounded-lg">
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`py-2.5 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'phone'
                      ? 'bg-zinc-700 shadow-sm text-[#10b981]'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Mail className="w-4 h-4 mx-auto mb-1" />
                  {t('phone')}
                </button>
                <button
                  onClick={() => setLoginMethod('qr')}
                  className={`py-2.5 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'qr'
                      ? 'bg-zinc-700 shadow-sm text-[#10b981]'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1" />
                  {t('qrCode')}
                </button>
                <button
                  onClick={() => setLoginMethod('id')}
                  className={`py-2.5 rounded-md text-sm font-medium transition-all ${
                    loginMethod === 'id'
                      ? 'bg-zinc-700 shadow-sm text-[#10b981]'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1" />
                  {t('govId')}
                </button>
              </div>

              {/* Phone Login */}
              {loginMethod === 'phone' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <Input
                    type="email"
                    placeholder={t('enterEmailAddress')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5" />}
                    label={t('emailAddress')}
                  />

                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        icon={<CreditCard className="w-5 h-5" />}
                        label="OTP"
                      />
                    </motion.div>
                  )}
                  
                  <button className="flex items-center gap-2 text-sm text-[#2196F3] hover:underline">
                    <Mic className="w-4 h-4" />
                    {t('useVoiceInput')}
                  </button>

                  <Button variant="primary" size="lg" fullWidth onClick={otpSent ? () => handleLogin('patient') : handleSendOTP} disabled={loading}>
                    {loading ? t('sending') : (otpSent ? t('continue') : t('sendOTP'))}
                  </Button>
                </motion.div>
              )}

              {/* QR Login */}
              {loginMethod === 'qr' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('scanQRToSignIn')}
                  </p>
                  <Button variant="outline" size="lg" fullWidth onClick={() => handleLogin('patient')} disabled={loading}>
                    {loading ? t('authenticating') : t('openCamera')}
                  </Button>
                </motion.div>
              )}

              {/* Gov ID Login */}
              {loginMethod === 'id' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <Input
                    type="text"
                    placeholder={t('enterGovId')}
                    icon={<CreditCard className="w-5 h-5" />}
                    label={t('govId')}
                  />
                  <Button variant="primary" size="lg" fullWidth onClick={() => handleLogin('patient')} disabled={loading}>
                    {loading ? t('processing') : t('continue')}
                  </Button>
                </motion.div>
              )}

              {/* Quick Role Selection for Demo */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3 text-center">{t('quickDemoAccess')}</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleLogin('patient')} disabled={loading}>
                    {t('patient')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleLogin('doctor')} disabled={loading}>
                    {t('doctor')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleLogin('admin')} disabled={loading}>
                    {t('admin')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <motion.div
              className="mt-6 bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-gray-400 text-center mb-2">
                ♿ {t('accessibleForEveryone')}
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-400">
                <span>🔊 {t('voiceSupport')}</span>
                <span>🌐 {t('fiveLanguages')}</span>
                <span>📱 {t('worksOffline')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}