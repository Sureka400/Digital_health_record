import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Search, 
  FileText, 
  AlertCircle, 
  LineChart,
  BrainCircuit,
  Microscope,
  Stethoscope
} from 'lucide-react';
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
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    suggestedActions?: string[];
  };
}

export function AIConsultantTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: t('aiIntro'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { text: t('analyzeRecentReports'), icon: <FileText className="w-4 h-4" /> },
    { text: t('checkDrugInteractions'), icon: <AlertCircle className="w-4 h-4" /> },
    { text: t('predictHealthTrends'), icon: <LineChart className="w-4 h-4" /> },
    { text: t('clinicalDecisionSupport'), icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: t('aiPlaceholderResponse'),
        timestamp: new Date(),
        metadata: {
          confidence: 0.94,
          sources: [t('clinicalGuidelines'), t('patientHistory')],
          suggestedActions: [t('orderBloodTest'), t('consultSpecialist')],
        },
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Left Sidebar - AI Tools */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          {t('aiAssistant')}
        </h3>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">
            {t('activePatient')}
          </p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl">
              👨‍🦳
            </div>
            <div>
              <p className="font-bold text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">{t('age')}: 65 | {t('id')}: JD123</p>
            </div>
          </div>
          <Badge variant="outline" className="w-full justify-center bg-white">
            {t('contextualAnalysisActive')}
          </Badge>
        </Card>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            {t('specializedAgents')}
          </p>
          {[
            { name: t('radiologyAgent'), icon: <Microscope className="w-4 h-4" />, color: 'blue' },
            { name: t('pathologyAgent'), icon: <Stethoscope className="w-4 h-4" />, color: 'green' },
            { name: t('genomicAgent'), icon: <BrainCircuit className="w-4 h-4" />, color: 'purple' },
          ].map((agent) => (
            <button
              key={agent.name}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all text-sm font-medium"
            >
              <div className={`p-2 rounded-lg bg-${agent.color}-100 text-${agent.color}-600`}>
                {agent.icon}
              </div>
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <Card className="lg:col-span-3 flex flex-col h-full bg-slate-50/50">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' ? 'bg-[#0b6e4f] text-white' : 'bg-white shadow-sm'
                  }`}>
                    {msg.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="space-y-2">
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-[#0b6e4f] text-white rounded-tr-none' 
                        : 'bg-white text-foreground rounded-tl-none border border-slate-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>

                    {msg.metadata && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        {msg.metadata.sources && (
                          <div className="flex flex-wrap gap-2">
                            {msg.metadata.sources.map((source, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] py-0">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {msg.metadata.suggestedActions && (
                          <div className="flex flex-wrap gap-2">
                            {msg.metadata.suggestedActions.map((action, i) => (
                              <Button key={i} variant="outline" size="sm" className="text-xs h-7 px-2">
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Prompts & Input */}
        <div className="p-4 bg-white border-t space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt.text)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent hover:bg-slate-200 transition-all text-xs font-medium whitespace-nowrap text-foreground"
              >
                {prompt.icon}
                {prompt.text}
              </button>
            ))}
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder={t('askAiClinicalQuestion')}
              className="pr-24 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button 
                variant="primary" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground">
            {t('aiDisclaimer')}
          </p>
        </div>
      </Card>
    </div>
  );
}
