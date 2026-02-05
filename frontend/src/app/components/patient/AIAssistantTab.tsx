import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mic, Send, Bell, Volume2, MessageCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export function AIAssistantTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello Rajesh! 👋 I\'m your AI Health Assistant. I can help you understand your medical reports, remind you about medications, and answer health questions in simple language. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    '📋 Explain my latest report',
    '💊 My medication schedule',
    '⚠️ Health risk analysis',
    '🏥 Nearby hospitals',
  ];

  const healthInsights = [
    {
      title: 'Blood Sugar Trend',
      message: 'Your blood sugar levels have been stable for the past 2 weeks. Keep up the good work! 🎯',
      type: 'success' as const,
    },
    {
      title: 'Medication Reminder',
      message: 'Don\'t forget to take your evening medication at 8 PM today.',
      type: 'warning' as const,
    },
    {
      title: 'Health Tip',
      message: 'Walking for 30 minutes daily can help manage your diabetes better.',
      type: 'info' as const,
    },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('report') || lowerQuestion.includes('latest')) {
      return '📊 Your latest blood test from Jan 25 shows:\n\n✅ Hemoglobin: 13.5 g/dL (Normal)\n✅ Blood Sugar (Fasting): 105 mg/dL (Well controlled)\n⚠️ Cholesterol: 215 mg/dL (Slightly high)\n\nYour diabetes is well-managed! However, we should watch your cholesterol. Try to reduce oily foods and increase vegetables. Would you like diet suggestions?';
    }
    
    if (lowerQuestion.includes('medication') || lowerQuestion.includes('medicine')) {
      return '💊 Your Daily Medication Schedule:\n\n🌅 Morning (8 AM):\n- Metformin 500mg (for diabetes)\n- Multivitamin\n\n🌙 Evening (8 PM):\n- Metformin 500mg\n\nRemember to take medicines after meals! I\'ll send you reminders. 🔔';
    }
    
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('health')) {
      return '🎯 AI Health Risk Analysis:\n\n✅ Low Risk: Heart disease (due to good BP control)\n⚠️ Medium Risk: High cholesterol needs monitoring\n✅ Well Managed: Type 2 Diabetes\n\nRecommendations:\n1. Continue current medications\n2. Reduce salt and oil intake\n3. Walk 30 mins daily\n4. Next checkup in 3 months';
    }
    
    return 'I understand your question. As your AI assistant, I can help with:\n\n📋 Report explanations\n💊 Medication schedules\n⚠️ Health risk predictions\n🏥 Hospital information\n\nCould you please be more specific about what you\'d like to know?';
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action.substring(2).trim());
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t('aiHealthAssistant')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('multilingualVoiceEnabled')}
            </p>
          </div>
        </div>
      </Card>

      {/* Health Insights */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          {t('aiHealthInsights')}
        </h3>
        
        {healthInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`
              ${insight.type === 'success' ? 'bg-green-50 border-green-200' : ''}
              ${insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}
              ${insight.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
            `}>
              <div className="flex items-start gap-3">
                <Bell className={`w-5 h-5 flex-shrink-0 ${
                  insight.type === 'success' ? 'text-green-600' : ''
                } ${
                  insight.type === 'warning' ? 'text-yellow-600' : ''
                } ${
                  insight.type === 'info' ? 'text-blue-600' : ''
                }`} />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.message}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Interface */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {t('chatWithAI')}
        </h3>

        {/* Messages */}
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-[#0b6e4f] text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.type === 'ai' && (
                  <Badge variant="ai" className="mb-2">
                    <Sparkles className="w-3 h-3" />
                    {t('aiAssistant')}
                  </Badge>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString(language === 'en' ? 'en-IN' : language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">{t('quickActions')}:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-xs hover:bg-[#0b6e4f] hover:text-white transition-all"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <button className="p-3 bg-muted rounded-lg hover:bg-accent transition-all">
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder={t('askAnything')}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            icon={<Send className="w-5 h-5" />}
          >
            {t('continue')}
          </Button>
        </div>
      </Card>

      {/* "Explain like I'm 10" Feature */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧒</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {t('explainLike10')}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('explainLike10Desc')}
            </p>
            <Button variant="outline" size="sm" icon={<Volume2 className="w-4 h-4" />}>
              {t('tryVoiceExplanation')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
