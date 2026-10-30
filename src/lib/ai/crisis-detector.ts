import { MentalHealthResource } from '@/types';
import { initialMentalHealthResources } from '@/lib/store/tk-store';

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'critical' | 'high' | 'moderate' | 'none';
  detectedKeywords: string[];
  immediateActionRequired: boolean;
  hotlines: MentalHealthResource[];
  safetyMessage: string;
}

const CRITICAL_KEYWORDS = [
  'kill myself',
  'suicide',
  'end my life',
  'end it all',
  'want to die',
  'better off dead',
  'cut myself',
  'self harm',
  'hang myself',
  'overdose',
  'magpakamatay',
  'ayaw ko na mabuhay',
  'gusto ko na mamatay',
  'saktan ang sarili',
  'tapusin na lahat',
];

const HIGH_DISTRESS_KEYWORDS = [
  'can\'t breathe',
  'panic attack',
  'hearing voices',
  'abused',
  'hitting me',
  'unbearable pain',
  'hopeless',
  'nobody cares',
  'walang kwenta',
  'sobrang sakit',
  'sinasaktan ako',
];

export function detectCrisis(text: string): CrisisDetectionResult {
  const normalized = text.toLowerCase();
  const matchedCritical: string[] = [];
  const matchedHigh: string[] = [];

  for (const kw of CRITICAL_KEYWORDS) {
    if (normalized.includes(kw)) {
      matchedCritical.push(kw);
    }
  }

  for (const kw of HIGH_DISTRESS_KEYWORDS) {
    if (normalized.includes(kw)) {
      matchedHigh.push(kw);
    }
  }

  const hotlines = initialMentalHealthResources.filter(r => r.is_emergency);

  if (matchedCritical.length > 0) {
    return {
      isCrisis: true,
      severity: 'critical',
      detectedKeywords: matchedCritical,
      immediateActionRequired: true,
      hotlines,
      safetyMessage:
        'Please know that your life is precious and you do not have to carry this alone. Free, compassionate, and confidential help is available right now in the Philippines. Please connect with the emergency hotlines below immediately.',
    };
  }

  if (matchedHigh.length > 0) {
    return {
      isCrisis: true,
      severity: 'high',
      detectedKeywords: matchedHigh,
      immediateActionRequired: false,
      hotlines,
      safetyMessage:
        'We hear how deeply overwhelming things feel right now. You are not alone, and there is support ready to listen and help you through this moment.',
    };
  }

  return {
    isCrisis: false,
    severity: 'none',
    detectedKeywords: [],
    immediateActionRequired: false,
    hotlines: [],
    safetyMessage: '',
  };
}
