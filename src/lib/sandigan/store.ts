import {
  AIOfficer,
  AIOfficerTask,
  BataanServiceResource,
  MySafetyPlan,
  WellnessQuestion,
  FounderReport,
  ConferenceMeeting,
} from '@/types/sandigan';

// =====================================================================
// THE SEVEN AI OFFICERS — VIRTUAL HEADQUARTERS
// Defined in Section 8 of Project Sandigan Master Blueprint
// =====================================================================

export const initialAIOfficers: AIOfficer[] = [
  {
    id: 'amara',
    name: 'AMARA',
    role: 'Chief Supervisor & Executive Coordinator',
    department: 'Executive Operations',
    avatar: '👑',
    color: '#31556B', // Deep Blue
    personality: 'Strategic, decisive, highly organized, protective of human safety, respectful of Founder authority.',
    responsibilities: [
      'Task delegation & monitoring across all 7 AI officers',
      'Cross-departmental coordination & sprint oversight',
      'Level 2 decision approval & Level 3 escalation to Founder',
      'Daily 5:00 PM & 7:00 PM PHT report synthesis',
      'Chairing internal AI officer coordination sessions',
    ],
    activeTasksCount: 4,
    completedTasksCount: 18,
    status: 'active',
    biography: 'AMARA serves as the central operational conductor of Project Sandigan, ensuring all public services and department officers function cohesively while maintaining the highest privacy safeguards.',
  },
  {
    id: 'tala',
    name: 'TALA',
    role: 'Community Support & Peer Engagement',
    department: 'Safe Community & Youth Voices',
    avatar: '✨',
    color: '#8B5CF6', // Lavender / Violet
    personality: 'Warm, deeply empathetic, welcoming, youth-centric, culturally attuned to Filipino adolescents.',
    responsibilities: [
      'Moderating Safe Community and Voice of the Community submissions',
      'Ensuring peer dialogue adheres to anti-bullying guidelines',
      'Nurturing peer-to-peer solidarity and emotional resilience',
      'Promoting inclusive discussions across English, Filipino, and Taglish',
    ],
    activeTasksCount: 2,
    completedTasksCount: 14,
    status: 'active',
    biography: 'TALA cultivates a safe, non-judgmental community environment where young people can share reflections without fear of stigma or harassment.',
  },
  {
    id: 'gabay',
    name: 'GABAY',
    role: 'Crisis & Safeguarding Lead',
    department: 'Crisis Intervention & Triage',
    avatar: '🛡️',
    color: '#E11D48', // Rose / Red
    personality: 'Vigilant, calm under acute pressure, gentle, protocol-driven, unwavering commitment to human safety.',
    responsibilities: [
      'Real-time crisis keyword & distress detection in Talk to Tinig',
      'Immediate safety pathway activation & NCMH 1553 prompt delivery',
      'My Safety Plan guidance and verification',
      'Instant escalation alerting to Founder (Email & WhatsApp)',
      'Coordination with clinical referral partners in Bataan',
    ],
    activeTasksCount: 3,
    completedTasksCount: 29,
    status: 'active',
    biography: 'GABAY works in tandem with AMARA to scan for potential self-harm, abuse, or imminent danger, immediately providing non-clinical psychological first aid and connecting users to real human help.',
  },
  {
    id: 'siklab',
    name: 'SIKLAB',
    role: 'Wellness Assessment & Diagnostics Lead',
    department: 'Mental Wellness & Diagnostics',
    avatar: '🔥',
    color: '#F59E0B', // Amber
    personality: 'Analytical, encouraging, insightful, non-stigmatizing, growth-oriented.',
    responsibilities: [
      'Administering the anonymous 5–7 question Mental Wellness Check',
      'Scoring emotional indicators (anxiety, burnout, mood fluctuations)',
      'Delivering personalized coping recommendations and growth trajectories',
      'Guiding users through Personal Growth Journeys',
    ],
    activeTasksCount: 2,
    completedTasksCount: 21,
    status: 'active',
    biography: 'SIKLAB translates clinical screening concepts into accessible, youth-friendly self-reflection indicators without ever affixing clinical labels or pseudo-diagnoses.',
  },
  {
    id: 'dunong',
    name: 'DUNONG',
    role: 'Research & Knowledge Librarian',
    department: 'Mind Library & Psychoeducation',
    avatar: '📖',
    color: '#0D9488', // Teal
    personality: 'Scholarly, precise, curious, dedicated to evidence-informed mental health literacy.',
    responsibilities: [
      'Curating Mind Library educational modules, articles, and FAQs',
      'Demystifying psychiatric terms and dismantling local cultural stigmas',
      'Reviewing psychoeducational literature for cultural accuracy in Bataan and the Philippines',
      'Maintaining research citations and institutional learning archives',
    ],
    activeTasksCount: 3,
    completedTasksCount: 16,
    status: 'active',
    biography: 'DUNONG ensures that all educational content provided across Project Sandigan is evidence-based, scientifically accurate, and accessible to students of all reading levels.',
  },
  {
    id: 'kawing',
    name: 'KAWING',
    role: 'Referrals & Institutional Partnerships',
    department: 'Clinical Linkages & External Care',
    avatar: '🔗',
    color: '#2563EB', // Blue
    personality: 'Diplomatic, thorough, privacy-conscious, proactive, relationship-focused.',
    responsibilities: [
      'Vetting and maintaining the Bataan & Central Luzon health facility directory',
      'Facilitating user-consented professional help referral summaries',
      'Verifying operating hours and hotline reachability for provincial hospitals',
      'Monitoring referral transmission and acknowledgment logs',
    ],
    activeTasksCount: 2,
    completedTasksCount: 12,
    status: 'active',
    biography: 'KAWING builds bridge connections between digital self-help and certified physical psychiatric care, ensuring youth in Bataan and beyond find accessible clinic support.',
  },
  {
    id: 'sinag',
    name: 'SINAG',
    role: 'Daily Wellness Companion & Operations',
    department: 'Daily Support & Habits',
    avatar: '☀️',
    color: '#10B981', // Emerald
    personality: 'Optimistic, reliable, warm, consistent, encouraging of small daily habits.',
    responsibilities: [
      'Delivering the Daily Wellness Companion affirmations & reflections',
      'Managing the Sleep & Relaxation Center audio and wind-down guides',
      'Supporting Mood Tracker trends and positive reinforcement',
      'Assisting AMARA with operational checklists and reminder systems',
    ],
    activeTasksCount: 3,
    completedTasksCount: 25,
    status: 'active',
    biography: 'SINAG brightens everyday routines, reminding youth that mental wellness is cultivated through gentle, consistent micro-moments of rest, hydration, and self-kindness.',
  },
];

// =====================================================================
// VERIFIED BATAAN & REGIONAL MENTAL HEALTH SERVICES (Section 7)
// Rigorously verified real-world facilities in Bataan, Philippines
// =====================================================================

export const verifiedBataanServices: BataanServiceResource[] = [
  {
    id: 'bataan-mmwgh',
    name: 'Mariveles Mental Wellness and General Hospital (MMWGH)',
    location: 'P. Monroe St., Poblacion, Mariveles, Bataan',
    type: 'Psychiatric Center',
    phone: '(047) 935-4661',
    mobile: '0968-854-3858 / 0922-883-3964',
    email: 'info@mmwgh.gov.ph',
    operatingHours: '24/7 Emergency Psychiatric Services & Crisis Hotline; OPD Mon-Fri 8:00 AM - 5:00 PM',
    services: [
      '24/7 Psychiatric Emergency Triage & Acute Inpatient Care',
      'Outpatient Psychiatric Consultation & Psychotherapy',
      'Child and Adolescent Mental Health Specialty Clinic',
      'Free Crisis Hotline & Tele-Mental Health Assistance',
      'Community Mental Health Outreach Programs in Bataan',
    ],
    isVerified: true,
    priorityRegion: 'Bataan',
  },
  {
    id: 'bataan-bghmc',
    name: 'Bataan General Hospital and Medical Center (BGHMC) — Psychiatry Unit',
    location: 'Manahan St., Tenejero, Balanga City, Bataan',
    type: 'Government Hospital',
    phone: '(047) 237-9770',
    mobile: '0939-937-2446',
    email: 'bataangeneralhospital@yahoo.com',
    operatingHours: 'Emergency Room 24/7; Psychiatric OPD Mon-Fri 8:00 AM - 4:00 PM',
    services: [
      'Comprehensive Medical & Psychiatric Emergency Intervention',
      'General Psychiatric Evaluations & Psychotherapy',
      'Subsidized Consultations via PhilHealth Mental Health Benefit Package',
      'Medical Social Services & Youth Counseling',
    ],
    isVerified: true,
    priorityRegion: 'Bataan',
  },
  {
    id: 'bataan-pho',
    name: 'Bataan Provincial Health Office — Mental Health Program',
    location: 'Provincial Capitol Compound, Balanga City, Bataan',
    type: 'Government Hospital',
    phone: '(047) 237-2413',
    email: 'pho@bataan.gov.ph',
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM',
    services: [
      'Provincial Mental Health Community Care Coordination',
      'Barangay Health Station Referrals & Medication Assistance',
      'Student Mental Well-being Advocacy Workshops in Bataan Schools',
    ],
    isVerified: true,
    priorityRegion: 'Bataan',
  },
  {
    id: 'balanga-cho',
    name: 'City Health Office of Balanga — Psychosocial Desk',
    location: 'City Government of Balanga, Bataan',
    type: 'City Health Office',
    phone: '(047) 237-2969',
    operatingHours: 'Mon-Fri 8:00 AM - 5:00 PM',
    services: [
      'Free Primary Psychosocial Screening & Community First Aid',
      'Referral to BGHMC & Mariveles Hospital for Advanced Care',
      'Youth Counseling & Family Mediation Services',
    ],
    isVerified: true,
    priorityRegion: 'Bataan',
  },
  {
    id: 'nat-ncmh',
    name: 'National Center for Mental Health (NCMH) 24/7 Crisis Hotline',
    location: 'Mandaluyong / Nationwide Toll-Free via Landline',
    type: 'Crisis Support',
    phone: '1553',
    mobile: '0917-899-8727 / 0966-351-4518',
    email: 'ncmh@doh.gov.ph',
    operatingHours: '24/7 Nationwide',
    services: [
      'Free 24/7 Emergency Psychological First Aid',
      'Suicide Crisis Intervention & De-escalation',
      'National Referral Network to DOH Hospitals',
    ],
    isVerified: true,
    priorityRegion: 'National',
  },
];

// =====================================================================
// INITIAL AI OFFICER TASKS (Level 1, 2, and 3)
// =====================================================================

export const initialOfficerTasks: AIOfficerTask[] = [
  {
    id: 'task-amara-01',
    title: 'Monitor System Launch & Ensure 7-Officer Coordination',
    description: 'Oversee autonomous background routines, inspect crisis escalation queues, and prepare daily 5:00 PM and 7:00 PM Founder reports.',
    officerId: 'amara',
    assignedBy: 'Founder',
    decisionLevel: 2,
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-10-30T08:00:00Z',
    updatedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'task-gabay-01',
    title: 'Verify Bataan Emergency Crisis Hotlines & MMWGH Triage',
    description: 'Ensure direct dial links for NCMH 1553 and Mariveles Mental Wellness Hospital operate seamlessly with zero latency.',
    officerId: 'gabay',
    assignedBy: 'AMARA',
    decisionLevel: 1,
    status: 'completed',
    priority: 'urgent',
    createdAt: '2026-10-30T08:30:00Z',
    updatedAt: '2026-10-30T09:45:00Z',
    outcomeNotes: 'Verified MMWGH emergency lines (047-935-4661) and NCMH 1553 toll-free accessibility.',
  },
  {
    id: 'task-siklab-01',
    title: 'Calibrate Mental Wellness Check 7-Question Scoring Matrix',
    description: 'Ensure anonymous questions accurately gauge burnout, sleep health, and situational distress without producing diagnostic labels.',
    officerId: 'siklab',
    assignedBy: 'AMARA',
    decisionLevel: 1,
    status: 'completed',
    priority: 'medium',
    createdAt: '2026-10-30T09:00:00Z',
    updatedAt: '2026-10-30T11:00:00Z',
    outcomeNotes: 'Completed 7-point scale with adaptive Filipino and Taglish translations.',
  },
  {
    id: 'task-kawing-01',
    title: 'Establish Referral Protocol for Balanga & Mariveles Clinics',
    description: 'Draft the patient-controlled consent summary template for BGHMC and MMWGH consultations.',
    officerId: 'kawing',
    assignedBy: 'AMARA',
    decisionLevel: 2,
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-10-30T10:15:00Z',
    updatedAt: '2026-10-30T11:30:00Z',
  },
  {
    id: 'task-dunong-01',
    title: 'Curate Mind Library Guides on Academic Pressure in Bataan',
    description: 'Incorporate study habits, imposter syndrome reframing, and local campus peer counseling resources into the Mind Library.',
    officerId: 'dunong',
    assignedBy: 'AMARA',
    decisionLevel: 1,
    status: 'completed',
    priority: 'medium',
    createdAt: '2026-10-30T09:30:00Z',
    updatedAt: '2026-10-30T12:00:00Z',
  },
];

// =====================================================================
// MENTAL WELLNESS CHECK QUESTIONS (Section 2 & 3)
// 7 Evidence-informed anonymous questions
// =====================================================================

export const wellnessCheckQuestions: WellnessQuestion[] = [
  {
    id: 1,
    category: 'mood',
    questionEn: 'Over the past two weeks, how often have you felt down, sad, or emotionally drained?',
    questionFil: 'Sa nakalipas na dalawang linggo, gaano kadalas kang nakaramdam ng lungkot o labis na panghihina ng loob?',
    questionTaglish: 'In the past two weeks, gaano kadalas kang nalulungkot or feeling emotionally drained?',
  },
  {
    id: 2,
    category: 'anxiety',
    questionEn: 'How frequently have you felt nervous, anxious, or on edge with racing thoughts?',
    questionFil: 'Gaano kadalas kang nakaramdam ng kaba, matinding pag-aalala, o hindi mapakali?',
    questionTaglish: 'Gaano kadalas kang kinakabahan, anxious, o hindi mapakali dahil sa racing thoughts?',
  },
  {
    id: 3,
    category: 'burnout',
    questionEn: 'Have you been feeling exhausted by school, work, or daily obligations, finding it hard to get started?',
    questionFil: 'Nakakaramdam ka ba ng labis na pagkapagod sa pag-aaral o pang-araw-araw na gawain?',
    questionTaglish: 'Feeling burnt out ka ba sa school or tasks na parang sobrang hirap magsimula?',
  },
  {
    id: 4,
    category: 'sleep',
    questionEn: 'How has your sleep quality been (trouble falling asleep, staying asleep, or sleeping too much)?',
    questionFil: 'Kumusta ang iyong pagtulog (hirap makatulog, nagigising sa gabi, o labis na antok)?',
    questionTaglish: 'Kumusta ang sleep mo lately (hirap makatulog, putol-putol, or sobra-sobrang tulog)?',
  },
  {
    id: 5,
    category: 'social',
    questionEn: 'Have you felt isolated, lonely, or like you have to carry your problems completely by yourself?',
    questionFil: 'Pakiramdam mo ba ay nag-iisa ka at ikaw lang mag-isa ang pumapasan sa iyong mga dalahin?',
    questionTaglish: 'Feeling isolated ka ba or feel mo ikaw lang mag-isa ang may pasan ng problems mo?',
  },
  {
    id: 6,
    category: 'academic',
    questionEn: 'Do deadlines, expectations from family, or personal standards make you feel overwhelmed?',
    questionFil: 'Nagdudulot ba ng labis na presyon ang mga inaasahan ng pamilya o mga pasanin sa eskwela?',
    questionTaglish: 'Overwhelming ba ang pressure from family, grades, or personal expectations?',
  },
  {
    id: 7,
    category: 'hope',
    questionEn: 'Do you feel optimistic about the coming weeks and have activities you look forward to?',
    questionFil: 'May pag-asa ka pa bang nadarama para sa mga darating na linggo at mga bagay na inaabangan?',
    questionTaglish: 'May sense of hope ka pa ba for the coming days and things you look forward to?',
  },
];

// =====================================================================
// FOUNDER CONFERENCE ROOM INITIAL STATE (Section 11)
// =====================================================================

export const initialConferenceMessages: { [meetingId: string]: any[] } = {
  'session-general-01': [
    {
      id: 'm1',
      sender: 'amara',
      senderName: 'AMARA (Chief Supervisor)',
      content: 'Good day, Founder Emmanuel James. All seven AI Officers are present and in operational readiness for Project Sandigan.',
      timestamp: 'Today, 08:30 AM',
    },
    {
      id: 'm2',
      sender: 'gabay',
      senderName: 'GABAY (Crisis & Safeguarding)',
      content: 'Crisis protocols are active. Direct escalation to your notification channels (delacruzemmanueljames9@gmail.com / 09106230737) and NCMH 1553 links have been verified.',
      timestamp: 'Today, 08:32 AM',
    },
    {
      id: 'm3',
      sender: 'kawing',
      senderName: 'KAWING (Referrals & Partnerships)',
      content: 'Local Bataan mental health facilities—including Mariveles Mental Wellness Hospital and BGHMC Balanga—are fully mapped and prioritized in our directory.',
      timestamp: 'Today, 08:35 AM',
    },
    {
      id: 'm4',
      sender: 'Founder',
      senderName: 'Emmanuel James (Founder)',
      content: 'Thank you team. Ensure every student knows they do not have to carry it alone. Maintain strict privacy under the Data Privacy Act.',
      timestamp: 'Today, 08:40 AM',
    },
  ],
};

// =====================================================================
// UTILITY: ANONYMOUS IDENTIFIER GENERATION (Section 3)
// Non-invasive, persistent local ID e.g. "SAN-001248"
// =====================================================================

export function generateAnonymousIdentifier(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SAN-${randomNum}`;
}
