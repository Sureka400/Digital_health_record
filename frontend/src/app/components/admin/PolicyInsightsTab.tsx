import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertTriangle, Target, Download, Brain } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useTranslation } from '@/app/utils/translations';
import { useLanguage } from '@/app/context/LanguageContext';

export function PolicyInsightsTab() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const aiPredictions = [
    {
      title: 'Predicted Seasonal Flu Outbreak',
      severity: 'high',
      location: 'Ernakulam District',
      timeline: 'Next 2-3 weeks',
      confidence: '87%',
      recommendation: 'Increase vaccination drives and stock emergency supplies',
      impact: 'Estimated 2,500+ cases',
    },
    // ... other predictions
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('policyInsights')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('realTimeInsights')}
            </p>
          </div>
        </div>
      </Card>

      {/* AI Predictions & Outbreak Detection */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          {t('aiPredictiveAnalysis')}
        </h3>
        
        <div className="space-y-3">
          {aiPredictions.map((prediction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`
                ${prediction.severity === 'high' ? 'bg-red-50 border-red-200' : ''}
                ${prediction.severity === 'medium' ? 'bg-orange-50 border-orange-200' : ''}
                ${prediction.severity === 'low' ? 'bg-yellow-50 border-yellow-200' : ''}
              `}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{prediction.title}</h4>
                    <p className="text-sm text-muted-foreground">{prediction.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={
                      prediction.severity === 'high' ? 'danger' :
                      prediction.severity === 'medium' ? 'warning' :
                      'default'
                    }>
                      {prediction.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="ai">
                      <Sparkles className="w-3 h-3" />
                      {prediction.confidence}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-zinc-800/50 backdrop-blur-sm rounded border border-zinc-700">
                    <p className="text-xs text-gray-400">Timeline</p>
                    <p className="text-sm font-semibold text-white">{prediction.timeline}</p>
                  </div>
                  <div className="p-2 bg-zinc-800/50 backdrop-blur-sm rounded border border-zinc-700">
                    <p className="text-xs text-gray-400">Impact</p>
                    <p className="text-sm font-semibold text-white">{prediction.impact}</p>
                  </div>
                </div>

                <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg mb-3 border border-zinc-700">
                  <p className="text-xs font-medium text-gray-400 mb-1">
                    AI Recommendation:
                  </p>
                  <p className="text-sm text-foreground">{prediction.recommendation}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    {t('generateActionPlan')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('viewDetails')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Policy Recommendations */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          {t('dataDrivenPolicyRecommendations')}
        </h3>

        <div className="mt-4">
          <Button variant="primary" fullWidth icon={<Download className="w-4 h-4" />}>
            {t('downloadFullReport')}
          </Button>
        </div>
      </Card>

      {/* Impact Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <h3 className="font-semibold text-foreground mb-3">{t('projectedImpact')}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold text-green-600">25%</p>
            <p className="text-sm text-muted-foreground">Reduction in preventable diseases</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">40%</p>
            <p className="text-sm text-muted-foreground">Faster emergency response</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">₹15 Cr</p>
            <p className="text-sm text-muted-foreground">Estimated cost savings</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">90%</p>
            <p className="text-sm text-muted-foreground">Health record coverage</p>
          </div>
        </div>
      </Card>

      {/* AI Transparency */}
      <Card className="bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">{t('aboutAiPredictions')}</h3>
            <p className="text-sm text-muted-foreground">
              Our AI models analyze patterns from 5M+ health records, weather data, demographic information, and historical disease trends.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
