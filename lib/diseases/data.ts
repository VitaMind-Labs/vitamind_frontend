import { Brain, Moon, Activity } from 'lucide-react';

export type DiseaseType = 'ADHD' | 'BIPOLAR' | 'SCHIZOPHRENIA';

export interface DiseaseDefinition {
  title: string;
  fullName: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  icon: typeof Brain;
  color: string;
  bgGlow: string;
  stats: string;
  prognosis: string;
  theme: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    accentLight: string;
    gradient: string;
    sidebarBg: string;
    sidebarActive: string;
    cardBorder: string;
    glow: string;
  };
}

export const diseaseDefinitions: Record<DiseaseType, DiseaseDefinition> = {
  ADHD: {
    title: 'ADHD',
    fullName: 'Attention Deficit Hyperactivity Disorder',
    description:
      'A neurodevelopmental disorder characterized by persistent patterns of inattention, hyperactivity, and impulsivity that interfere with daily functioning and development.',
    symptoms: [
      'Difficulty sustaining attention on tasks',
      'Frequent careless mistakes in schoolwork or work',
      'Seems not to listen when spoken to directly',
      'Difficulty organizing tasks and activities',
      'Easily distracted by external stimuli',
      'Fidgeting and inability to stay seated',
      'Excessive talking and interrupting others',
      'Difficulty waiting for turns',
    ],
    causes: [
      'Genetic factors (heritability 70-80%)',
      'Brain structure and function differences',
      'Premature birth or low birth weight',
      'Exposure to environmental toxins',
      'Brain injuries',
    ],
    treatments: [
      'Behavioral therapy and CBT',
      'Stimulant medications (methylphenidate, amphetamines)',
      'Non-stimulant medications (atomoxetine, guanfacine)',
      'Educational support and accommodations',
      'Parent training and family therapy',
      'Organizational skills training',
    ],
    icon: Brain,
    color: 'from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)]',
    bgGlow: 'hsl(187,27%,40%)',
    stats: 'Affects approximately 5-7% of children and 2-3% of adults worldwide',
    prognosis:
      'With proper treatment, most individuals lead successful and productive lives',
    theme: {
      primary: '#518591',
      primaryLight: '#6fa3af',
      primaryDark: '#3d6b77',
      accent: '#e3b01c',
      accentLight: '#f0c94d',
      gradient: 'from-[#518591] to-[#e3b01c]',
      sidebarBg: '#1a3a42',
      sidebarActive: '#518591',
      cardBorder: '#518591',
      glow: 'rgba(81,133,145,0.15)',
    },
  },
  BIPOLAR: {
    title: 'BIPOLAR',
    fullName: 'Bipolar Disorder',
    description:
      'A mental health condition causing extreme mood swings that include emotional highs (mania or hypomania) and lows (depression), affecting energy, activity levels, and daily functioning.',
    symptoms: [
      'Manic episodes: elevated mood, increased energy, reduced need for sleep',
      'Grandiose ideas and inflated self-esteem',
      'Rapid speech and racing thoughts',
      'Impulsive or risky behavior during mania',
      'Depressive episodes: persistent sadness and hopelessness',
      'Loss of interest in activities once enjoyed',
      'Changes in appetite and sleep patterns',
      'Difficulty concentrating and making decisions',
    ],
    causes: [
      'Strong genetic component',
      'Imbalance in neurotransmitters',
      'Brain structure abnormalities',
      'Stressful life events as triggers',
      'Circadian rhythm disruption',
    ],
    treatments: [
      'Mood stabilizers (lithium, valproate)',
      'Atypical antipsychotics',
      'Psychotherapy (CBT, interpersonal therapy)',
      'Psychoeducation for patients and families',
      'Lifestyle management (sleep, exercise, stress reduction)',
      'Electroconvulsive therapy for severe cases',
    ],
    icon: Moon,
    color: 'from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)]',
    bgGlow: 'hsl(45,93%,47%)',
    stats: 'Affects approximately 2-3% of the global population equally across genders',
    prognosis:
      'Lifelong condition manageable with consistent treatment and monitoring',
    theme: {
      primary: '#e3b01c',
      primaryLight: '#f0c94d',
      primaryDark: '#b89016',
      accent: '#518591',
      accentLight: '#6fa3af',
      gradient: 'from-[#e3b01c] to-[#518591]',
      sidebarBg: '#3d2e0a',
      sidebarActive: '#e3b01c',
      cardBorder: '#e3b01c',
      glow: 'rgba(227,176,28,0.15)',
    },
  },
  SCHIZOPHRENIA: {
    title: 'SCHIZOPHRENIA',
    fullName: 'Schizophrenia',
    description:
      'A serious mental disorder characterized by distortions in thinking, perception, emotions, language, sense of self, and behavior, affecting about 0.3-0.7% of people worldwide.',
    symptoms: [
      'Hallucinations (most commonly auditory voices)',
      'Delusions (fixed false beliefs)',
      'Disorganized thinking and speech',
      'Grossly disorganized or catatonic behavior',
      'Negative symptoms: reduced emotional expression',
      'Avolition (decreased motivation for self-initiated activities)',
      'Cognitive impairments in attention and memory',
      'Social withdrawal and anhedonia',
    ],
    causes: [
      'Genetic predisposition (polygenic risk)',
      'Pregnancy and birth complications',
      'Neurodevelopmental abnormalities',
      'Environmental stressors and trauma',
      'Dopamine dysregulation in the brain',
    ],
    treatments: [
      'First and second-generation antipsychotics',
      'Cognitive Behavioral Therapy for psychosis',
      'Family interventions and psychoeducation',
      'Social skills training and rehabilitation',
      'Supported employment and housing',
      'Case management for coordinated care',
    ],
    icon: Activity,
    color: 'from-[hsl(187,27%,40%)] via-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)]',
    bgGlow: 'hsl(187,27%,40%)',
    stats: 'Onset typically between late teens and mid-30s, slightly more common in males',
    prognosis:
      'One-third achieve significant improvement, one-third have periodic episodes, one-third experience persistent symptoms',
    theme: {
      primary: '#518591',
      primaryLight: '#6fa3af',
      primaryDark: '#3d6b77',
      accent: '#e3b01c',
      accentLight: '#f0c94d',
      gradient: 'from-[#518591] via-[#e3b01c] to-[#518591]',
      sidebarBg: '#1a2a2e',
      sidebarActive: '#518591',
      cardBorder: '#518591',
      glow: 'rgba(81,133,145,0.12)',
    },
  },
};

export const diseaseTypes: DiseaseType[] = ['ADHD', 'BIPOLAR', 'SCHIZOPHRENIA'];
