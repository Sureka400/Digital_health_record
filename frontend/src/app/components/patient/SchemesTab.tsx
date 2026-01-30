import React from 'react';
import { motion } from 'motion/react';
import { Gift, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface Scheme {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  eligibility: string;
  eligible: boolean;
  applied: boolean;
  aiDetected: boolean;
}

export function SchemesTab() {
  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'Karunya Benevolent Fund',
      description: 'Financial assistance for treatment of serious ailments',
      benefits: [
        'Up to ₹5 lakh assistance',
        'Coverage for critical illnesses',
        'Fast-track processing',
      ],
      eligibility: 'BPL cardholders, Annual income < ₹3 lakh',
      eligible: true,
      applied: false,
      aiDetected: true,
    },
    {
      id: '2',
      name: 'Kerala State Health Insurance',
      description: 'Comprehensive health insurance for workers',
      benefits: [
        '₹5 lakh annual coverage',
        'Cashless treatment',
        'Pre and post hospitalization',
      ],
      eligibility: 'Migrant workers registered in Kerala',
      eligible: true,
      applied: true,
      aiDetected: true,
    },
    {
      id: '3',
      name: 'Diabetes Management Program',
      description: 'Free medication and monitoring for diabetes patients',
      benefits: [
        'Free monthly medication',
        'Quarterly health checkups',
        'Diet counseling',
      ],
      eligibility: 'Registered diabetes patients',
      eligible: true,
      applied: false,
      aiDetected: true,
    },
    {
      id: '4',
      name: 'Ayushman Bharat - PMJAY',
      description: 'National health protection scheme',
      benefits: [
        '₹5 lakh per family per year',
        '1,500+ medical procedures',
        'All public and empaneled hospitals',
      ],
      eligibility: 'Based on SECC data',
      eligible: false,
      applied: false,
      aiDetected: false,
    },
  ];

  const eligibleSchemes = schemes.filter(s => s.eligible);
  const appliedSchemes = schemes.filter(s => s.applied);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-[#0b6e4f] to-[#2196F3] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Government Schemes & Benefits</h2>
            <p className="text-white/90">Personalized for your health profile</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{eligibleSchemes.length}</div>
            <div className="text-sm text-white/90">Eligible</div>
          </div>
        </div>
      </Card>

      {/* AI Detection Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              AI-Powered Eligibility Detection
            </h3>
            <p className="text-sm text-muted-foreground">
              Based on your health records, location, and profile, our AI has automatically identified {eligibleSchemes.length} schemes you're eligible for.
            </p>
          </div>
        </div>
      </Card>

      {/* Applied Schemes */}
      {appliedSchemes.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Active Schemes
          </h3>
          <div className="space-y-3">
            {appliedSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-green-50 border-green-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-foreground">{scheme.name}</h4>
                    </div>
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{scheme.description}</p>
                  <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                    View Details
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Eligible Schemes */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#0b6e4f]" />
          Available Schemes
        </h3>
        <div className="space-y-3">
          {schemes
            .filter(s => s.eligible && !s.applied)
            .map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{scheme.name}</h4>
                        {scheme.aiDetected && (
                          <Badge variant="ai">
                            <Sparkles className="w-3 h-3" />
                            AI Detected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{scheme.description}</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Key Benefits:</p>
                    <ul className="space-y-1">
                      {scheme.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eligibility */}
                  <div className="p-3 bg-accent rounded-lg mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Eligibility:</p>
                    <p className="text-sm text-foreground">{scheme.eligibility}</p>
                  </div>

                  {/* Apply Button */}
                  <Button variant="primary" fullWidth icon={<ExternalLink className="w-4 h-4" />}>
                    Apply Now
                  </Button>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Other Schemes */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Other Schemes</h3>
        <div className="space-y-3">
          {schemes
            .filter(s => !s.eligible)
            .map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{scheme.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{scheme.description}</p>
                      <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
                        Not eligible: {scheme.eligibility}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our AI assistant can help you understand each scheme in simple language and guide you through the application process.
            </p>
            <Button variant="outline" size="sm">
              Talk to AI Assistant
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
