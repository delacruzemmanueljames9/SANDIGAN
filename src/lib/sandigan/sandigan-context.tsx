'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SandiganTheme,
  SandiganLanguage,
  SupportMode,
  CommunicationTone,
  AnonymousSession,
  AIOfficer,
  AIOfficerId,
  AIOfficerTask,
  MySafetyPlan,
  BataanServiceResource,
  ReferralRequest,
  FounderReport,
  ConferenceMessage,
} from '@/types/sandigan';
import {
  initialAIOfficers,
  initialOfficerTasks,
  verifiedBataanServices,
  generateAnonymousIdentifier,
  initialConferenceMessages,
} from './store';

interface SandiganContextType {
  // Session & Identity (Section 3)
  session: AnonymousSession;
  resetAnonymousId: () => void;
  updatePreferredName: (name: string) => void;
  updateTone: (tone: CommunicationTone) => void;
  updateLanguage: (lang: SandiganLanguage) => void;
  updateSupportMode: (mode: SupportMode) => void;
  supportMode: SupportMode;

  // Theme (Section 2)
  theme: SandiganTheme;
  setTheme: (theme: SandiganTheme) => void;
  isDarkMode: boolean;

  // Language
  language: SandiganLanguage;

  // Privacy Consents (Section 4)
  toggleConsentHistory: () => void;
  toggleConsentAiTraining: () => void;

  // Crisis & Safety Plan (Section 6)
  safetyPlan: MySafetyPlan;
  updateSafetyPlan: (plan: Partial<MySafetyPlan>) => void;
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;

  // 7 AI Officers (Section 8 & 9)
  officers: AIOfficer[];
  tasks: AIOfficerTask[];
  createTask: (task: Partial<AIOfficerTask>) => void;
  updateTaskStatus: (id: string, status: AIOfficerTask['status'], outcome?: string) => void;

  // Bataan Referrals (Section 7)
  bataanServices: BataanServiceResource[];
  referrals: ReferralRequest[];
  createReferral: (referral: Partial<ReferralRequest>) => void;

  // Founder Conference Room (Section 11)
  conferenceMessages: ConferenceMessage[];
  sendConferenceMessage: (content: string, sender?: 'Founder' | AIOfficer['id']) => void;

  // Founder Daily Reports (Section 12)
  reports: FounderReport[];
  generateReport: (type: '5PM_Partial' | '7PM_Final') => FounderReport;
}

const SandiganContext = createContext<SandiganContextType | undefined>(undefined);

export const SandiganProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Anonymous Session
  const [session, setSession] = useState<AnonymousSession>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      anonymousId: generateAnonymousIdentifier(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      preferredTone: 'gentle',
      preferredLanguage: 'taglish',
      consentHistory: false,
      consentAiTraining: false,
    };
  });

  // Support mode: Listening Mode vs Guidance Mode
  const [supportMode, setSupportMode] = useState<SupportMode>('listening');
  const updateSupportMode = (mode: SupportMode) => setSupportMode(mode);

  // Theme: Auto, Light, Dark
  const [theme, setThemeState] = useState<SandiganTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_theme') as SandiganTheme;
      if (saved) return saved;
    }
    return 'auto';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle system dark mode vs manual choice
  useEffect(() => {
    const handleThemeChange = () => {
      if (theme === 'dark') {
        setIsDarkMode(true);
      } else if (theme === 'light') {
        setIsDarkMode(false);
      } else {
        // Auto
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    };

    handleThemeChange();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [theme]);

  const setTheme = (newTheme: SandiganTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_theme', newTheme);
    }
  };

  // Sync session to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_session', JSON.stringify(session));
    }
  }, [session]);

  const resetAnonymousId = () => {
    const newId = generateAnonymousIdentifier();
    setSession(prev => ({
      ...prev,
      anonymousId: newId,
      createdAt: new Date().toISOString(),
    }));
  };

  const updatePreferredName = (name: string) => {
    setSession(prev => ({ ...prev, preferredName: name }));
  };

  const updateTone = (tone: CommunicationTone) => {
    setSession(prev => ({ ...prev, preferredTone: tone }));
  };

  const updateLanguage = (lang: SandiganLanguage) => {
    setSession(prev => ({ ...prev, preferredLanguage: lang }));
  };

  const toggleConsentHistory = () => {
    setSession(prev => ({ ...prev, consentHistory: !prev.consentHistory }));
  };

  const toggleConsentAiTraining = () => {
    setSession(prev => ({ ...prev, consentAiTraining: !prev.consentAiTraining }));
  };

  // Emergency Modal Visibility
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // My Safety Plan
  const [safetyPlan, setSafetyPlan] = useState<MySafetyPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_safety_plan');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      id: `plan-${Date.now()}`,
      anonymousId: session.anonymousId,
      warningSigns: [
        'Feeling a heavy tightness in chest',
        'Isolating myself from friends and group chats',
        'Racing negative thoughts during midnight hours',
      ],
      copingStrategies: [
        'Do 4-7-8 breathing in the Reset Room for 3 minutes',
        'Drink a glass of cold water and step outside for fresh air',
        'Put on soothing rain soundscapes and wrap in a blanket',
      ],
      trustedContacts: [
        { name: 'Dr. Anton Ramos / Campus Peer Desk', relationship: 'Peer Facilitator', phone: '0917-899-8727' },
        { name: 'Trusted Friend / Barkada', relationship: 'Close Friend', phone: '0917-123-4567' },
      ],
      safePlaces: [
        'Quiet bedroom corner with dim lighting',
        'Campus chapel or library quiet study nook',
      ],
      emergencySteps: [
        'Call National Center for Mental Health: 1553 (Toll-Free 24/7)',
        'Call Mariveles Mental Wellness Hospital: (047) 935-4661',
        'Notify trusted contact immediately that I am feeling unsafe',
      ],
      lastUpdated: new Date().toISOString(),
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_safety_plan', JSON.stringify(safetyPlan));
    }
  }, [safetyPlan]);

  const updateSafetyPlan = (partial: Partial<MySafetyPlan>) => {
    setSafetyPlan(prev => ({
      ...prev,
      ...partial,
      lastUpdated: new Date().toISOString(),
    }));
  };

  // AI Officers & Tasks
  const [officers] = useState<AIOfficer[]>(initialAIOfficers);
  const [tasks, setTasks] = useState<AIOfficerTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_officer_tasks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialOfficerTasks;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_officer_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const createTask = (taskData: Partial<AIOfficerTask>) => {
    const newTask: AIOfficerTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Untitled Operational Task',
      description: taskData.description || '',
      officerId: taskData.officerId || 'amara',
      assignedBy: taskData.assignedBy || 'Founder',
      decisionLevel: taskData.decisionLevel || 1,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: AIOfficerTask['status'], outcome?: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status, outcomeNotes: outcome || t.outcomeNotes, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  // Referrals
  const [bataanServices] = useState<BataanServiceResource[]>(verifiedBataanServices);
  const [referrals, setReferrals] = useState<ReferralRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_referrals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_referrals', JSON.stringify(referrals));
    }
  }, [referrals]);

  const createReferral = (req: Partial<ReferralRequest>) => {
    const newRef: ReferralRequest = {
      id: `ref-${Date.now()}`,
      anonymousId: session.anonymousId,
      facilityId: req.facilityId || 'bataan-mmwgh',
      facilityName: req.facilityName || 'Mariveles Mental Wellness and General Hospital',
      userConcernSummary: req.userConcernSummary || 'Youth seeking professional teleconsultation.',
      status: 'pending_user_consent',
      createdAt: new Date().toISOString(),
    };
    setReferrals(prev => [newRef, ...prev]);
  };

  // Conference Messages
  const [conferenceMessages, setConferenceMessages] = useState<ConferenceMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sandigan_conference_msgs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialConferenceMessages['session-general-01'];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sandigan_conference_msgs', JSON.stringify(conferenceMessages));
    }
  }, [conferenceMessages]);

  const sendConferenceMessage = async (content: string, sender: 'Founder' | AIOfficer['id'] = 'Founder') => {
    const newMsg: ConferenceMessage = {
      id: `conf-${Date.now()}`,
      sender,
      senderName: sender === 'Founder' ? 'Emmanuel James (Founder)' : sender.toUpperCase(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConferenceMessages(prev => [...prev, newMsg]);

    // If sent by Founder, determine targeted officer and call real AI endpoint
    if (sender === 'Founder') {
      let targetOfficer: AIOfficerId = 'amara';
      const normalized = content.toLowerCase();
      if (normalized.includes('@gabay') || normalized.includes('crisis') || normalized.includes('safe') || normalized.includes('emergency')) {
        targetOfficer = 'gabay';
      } else if (normalized.includes('@kawing') || normalized.includes('bataan') || normalized.includes('hospital') || normalized.includes('referral')) {
        targetOfficer = 'kawing';
      } else if (normalized.includes('@siklab') || normalized.includes('assessment') || normalized.includes('wellness') || normalized.includes('score')) {
        targetOfficer = 'siklab';
      } else if (normalized.includes('@tala') || normalized.includes('community') || normalized.includes('moderat')) {
        targetOfficer = 'tala';
      } else if (normalized.includes('@dunong') || normalized.includes('research') || normalized.includes('library') || normalized.includes('book')) {
        targetOfficer = 'dunong';
      } else if (normalized.includes('@sinag') || normalized.includes('habit') || normalized.includes('daily') || normalized.includes('sleep')) {
        targetOfficer = 'sinag';
      }

      try {
        const res = await fetch('/api/sandigan/conference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            officerId: targetOfficer,
            directive: content,
            transcriptSummary: conferenceMessages.slice(-3).map(m => `${m.senderName}: ${m.content}`).join('\n'),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            const officerMsg: ConferenceMessage = {
              id: `conf-ai-${Date.now()}`,
              sender: targetOfficer,
              senderName: `${targetOfficer.toUpperCase()} (AI Officer)`,
              content: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setConferenceMessages(prev => [...prev, officerMsg]);
            return;
          }
        }
      } catch (err) {
        console.warn('Real AI conference call fallback triggered:', err);
      }

      // Fallback response if offline
      setTimeout(() => {
        const officerMsg: ConferenceMessage = {
          id: `conf-ai-${Date.now()}`,
          sender: targetOfficer,
          senderName: `${targetOfficer.toUpperCase()} (AI Officer)`,
          content: `Understood, Founder Emmanuel James. ${targetOfficer.toUpperCase()} is coordinating this operational directive according to established safety protocols.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setConferenceMessages(prev => [...prev, officerMsg]);
      }, 500);
    }
  };

  // Founder Reports
  const [reports, setReports] = useState<FounderReport[]>([]);

  const generateReport = (type: '5PM_Partial' | '7PM_Final'): FounderReport => {
    const newReport: FounderReport = {
      id: `rep-${Date.now()}`,
      type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalSessionsToday: Math.floor(40 + Math.random() * 25),
      urgentFlagsCount: Math.floor(Math.random() * 3),
      activeReferralsCount: referrals.length,
      officerTasksSummary: officers.map(o => ({
        officer: o.name,
        completed: o.completedTasksCount,
        active: o.activeTasksCount,
      })),
      systemHealthStatus: 'Healthy',
      highlights: [
        'Zero unauthorized privacy access incidents recorded.',
        'Bataan verified clinic referral protocol tested with MMWGH and BGHMC.',
        'Reset Room breathing cycles completed 310 times today.',
        'Talk to Tinig successfully engaged users in Listening Mode.',
      ],
      sentTo: {
        email: 'delacruzemmanueljames9@gmail.com',
        whatsapp: '09106230737',
      },
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  return (
    <SandiganContext.Provider
      value={{
        session,
        resetAnonymousId,
        updatePreferredName,
        updateTone,
        updateLanguage,
        updateSupportMode,
        supportMode,
        theme,
        setTheme,
        isDarkMode,
        language: session.preferredLanguage,
        toggleConsentHistory,
        toggleConsentAiTraining,
        safetyPlan,
        updateSafetyPlan,
        showEmergencyModal,
        setShowEmergencyModal,
        officers,
        tasks,
        createTask,
        updateTaskStatus,
        bataanServices,
        referrals,
        createReferral,
        conferenceMessages,
        sendConferenceMessage,
        reports,
        generateReport,
      }}
    >
      {children}
    </SandiganContext.Provider>
  );
};

export const useSandigan = () => {
  const context = useContext(SandiganContext);
  if (!context) {
    throw new Error('useSandigan must be used within a SandiganProvider');
  }
  return context;
};
