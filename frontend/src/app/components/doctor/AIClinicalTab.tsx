import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertTriangle, TrendingUp, Pill, Brain } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export function AIClinicalTab() {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const clinicalSuggestions = [
    {
      title: 'Diagnosis Support',
      suggestion: 'Based on symptoms (fatigue, increased thirst, frequent urination) and lab results (elevated blood glucose), consider Type 2 Diabetes.',
      confidence: 'High',
      evidence: ['HbA1c: 7.2%', 'Fasting glucose: 145 mg/dL', 'Patient history'],
      severity: 'info',
    },
    {
      title: 'Drug Interaction Alert',
      warning: 'Metformin may interact with contrast dyes. Consider holding 48 hours before imaging.',
      confidence: 'Critical',
      severity: 'danger',
    },
    {
      title: 'Treatment Recommendation',
      suggestion: 'Lifestyle modifications + Metformin 500mg twice daily. Monitor HbA1c every 3 months.',
      confidence: 'High',
      evidence: ['Standard of care', 'Patient compliance history', 'Renal function normal'],
      severity: 'success',
    },
  ];

  const riskPredictions = [
    { condition: 'Cardiovascular Disease', risk: 'Low', percentage: 12, color: 'green' },
    { condition: 'Diabetic Retinopathy', risk: 'Medium', percentage: 35, color: 'yellow' },
    { condition: 'Kidney Disease', risk: 'Low', percentage: 8, color: 'green' },
  ];

  const treatmentHistory = [
    {
      medication: 'Metformin 500mg',
      started: '2024-06-15',
      effectiveness: 'Good',
      adherence: '85%',
    },
    {
      medication: 'Atorvastatin 10mg',
      started: '2024-08-20',
      effectiveness: 'Moderate',
      adherence: '70%',
    },
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
            <h2 className="text-2xl font-bold text-foreground">AI Clinical Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Decision support • Not a replacement for clinical judgment
            </p>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> AI suggestions are for decision support only. Always use your clinical judgment and verify recommendations.
            </p>
          </div>
        </div>
      </Card>

      {/* Clinical Suggestions */}
      {showSuggestions && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Clinical Suggestions
          </h3>
          
          <div className="space-y-3">
            {clinicalSuggestions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`
                  ${item.severity === 'danger' ? 'bg-red-50 border-red-200' : ''}
                  ${item.severity === 'info' ? 'bg-blue-50 border-blue-200' : ''}
                  ${item.severity === 'success' ? 'bg-green-50 border-green-200' : ''}
                `}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-5 h-5 ${
                        item.severity === 'danger' ? 'text-red-600' : ''
                      } ${
                        item.severity === 'info' ? 'text-blue-600' : ''
                      } ${
                        item.severity === 'success' ? 'text-green-600' : ''
                      }`} />
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                    </div>
                    <Badge variant={
                      item.confidence === 'Critical' ? 'danger' :
                      item.confidence === 'High' ? 'success' :
                      'default'
                    }>
                      {item.confidence}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground mb-3">
                    {item.suggestion || item.warning}
                  </p>

                  {item.evidence && (
                    <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700">
                      <p className="text-xs font-medium text-gray-400 mb-2">
                        Supporting Evidence:
                      </p>
                      <ul className="space-y-1">
                        {item.evidence.map((ev, i) => (
                          <li key={i} className="text-sm text-foreground">
                            • {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">Accept</Button>
                    <Button variant="ghost" size="sm">Dismiss</Button>
                    <Button variant="ghost" size="sm">More Info</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Predictions */}
      <Card>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          AI Risk Predictions
        </h3>

        <div className="space-y-4">
          {riskPredictions.map((risk, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{risk.condition}</span>
                <Badge variant={
                  risk.risk === 'Low' ? 'success' :
                  risk.risk === 'Medium' ? 'warning' :
                  'danger'
                }>
                  {risk.risk} Risk
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    risk.color === 'green' ? 'bg-green-500' :
                    risk.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{risk.percentage}% likelihood</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Drug Interaction Checker */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Pill className="w-5 h-5 text-red-600" />
          Drug Interaction Alerts
        </h3>

        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-yellow-800 mb-1">
                  Moderate Interaction Detected
                </p>
                <p className="text-sm text-yellow-700">
                  Metformin + Contrast Dyes: May increase risk of lactic acidosis. Consider holding metformin 48 hours before and after contrast procedures.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✓ No critical interactions detected with current medications
            </p>
          </div>
        </div>
      </Card>

      {/* Treatment History Comparison */}
      <Card>
        <h3 className="font-semibold text-foreground mb-3">Treatment History & Effectiveness</h3>
        
        <div className="space-y-3">
          {treatmentHistory.map((treatment, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{treatment.medication}</p>
                  <p className="text-xs text-muted-foreground">
                    Started: {new Date(treatment.started).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <Badge variant={
                  treatment.effectiveness === 'Good' ? 'success' :
                  treatment.effectiveness === 'Moderate' ? 'warning' :
                  'default'
                }>
                  {treatment.effectiveness}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Adherence Rate</p>
                  <p className="font-semibold text-sm">{treatment.adherence}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Effectiveness</p>
                  <p className="font-semibold text-sm">{treatment.effectiveness}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Learning Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧠</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Continuous Learning</h3>
            <p className="text-sm text-muted-foreground">
              Our AI continuously learns from anonymized medical data across Kerala's healthcare network to improve diagnostic accuracy and treatment recommendations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}