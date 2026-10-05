import type { Lang } from "@/lib/i18n/config";

/**
 * Copy for the dedicated agent pages (/mira, /lumina) and the home page's agents section. Short on purpose:
 * titles, one line each, and the few numbers that matter. `ar` is typed against the same shape as `en`: a missing
 * key fails the build. Names, roles and status lines live in `dictionary.header.agents.items`.
 */

type Pair = readonly [title: string, line: string];
type Item = readonly [title: string, line: string, tag: string];

export type AgentPageCopy = {
  seo: { title: string; description: string };
  hero: { eyebrow: string; titleA: string; titleB: string; body: string; primary: string; secondary: string };
  /** Three numbers under the hero: [value, label]. */
  stats: readonly Pair[];
  role: { eyebrow: string; titleA: string; titleB: string; items: readonly Item[] };
  flow: { eyebrow: string; titleA: string; titleB: string; stepLabel: string; steps: readonly Pair[] };
  trust: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    doesTitle: string;
    does: readonly string[];
    doesNotTitle: string;
    doesNot: readonly string[];
    note: string;
  };
  handoff: { eyebrow: string; title: string; body: string; cta: string };
  cta: { eyebrow: string; titleA: string; titleB: string; body: string; primary: string; benefits: readonly string[] };
};

export type MiraPreviewCopy = {
  caption: string;
  /** The screening tools floating around the hero phone. */
  tools: readonly string[];
  chat: { title: string; chapter: string; question: string; answer: string; typing: string };
  chapters: readonly string[];
  safetyChip: string;
  screens: {
    hello: { greeting: string; ask: string; name: string; cta: string };
    days: { chapter: string; question: string; options: readonly string[] };
    safety: { title: string; status: string; ok: string };
    result: { title: string; areas: readonly string[]; review: string; reviewValue: string; download: string };
  };
};

export type LuminaPreviewCopy = {
  caption: string;
  signals: readonly string[];
  today: string;
  saved: string;
  greeting: string;
  views: {
    checkin: { title: string };
    journal: { title: string; entry: string; themes: readonly string[]; note: string };
    trend: { title: string; baseline: string; today: string; verdict: string; consistency: string };
    report: { title: string; sections: readonly string[]; share: string; consent: string };
  };
  bento: { goals: string; week: string };
};

type AgentSectionCard = { points: readonly string[]; cta: string };

export type AgentPagesCopy = {
  mira: AgentPageCopy & { preview: MiraPreviewCopy };
  lumina: AgentPageCopy & { preview: LuminaPreviewCopy };
  home: { eyebrow: string; titleA: string; titleB: string; intro: string; cards: { mira: AgentSectionCard; lumina: AgentSectionCard } };
};

const en: AgentPagesCopy = {
  mira: {
    seo: {
      title: "Mira — guided orientation and structured screening",
      description:
        "Meet Mira, VitaMind's orientation agent: a private, guided conversation with validated screening questions for ADHD, bipolar disorder and psychotic symptoms, and a clear summary to bring to a clinician. Free, no account needed.",
    },
    hero: {
      eyebrow: "Mira · Orientation agent",
      titleA: "A first conversation",
      titleB: "that notices what matters.",
      body: "A calm, guided conversation — then a clear summary to bring to a professional. Orientation, never a diagnosis.",
      primary: "Start with Mira",
      secondary: "See how it works",
    },
    stats: [
      ["~10", "minutes"],
      ["3", "screening areas"],
      ["0", "accounts needed"],
    ],
    role: {
      eyebrow: "What Mira does",
      titleA: "Careful,",
      titleB: "and human-first.",
      items: [
        ["Gentle intake", "About ten questions, four short chapters.", "Intake"],
        ["Validated screening", "ASRS · MDQ · PQ-B, asked naturally.", "Screening"],
        ["Structured triage", "Signals become a match level and a next step.", "Triage"],
        ["Risk detection", "A safety check runs the whole time.", "Safety"],
        ["A report to bring", "Key signals, ready for a professional.", "Report"],
        ["Private, bilingual", "English or Arabic. No account to begin.", "Private"],
      ],
    },
    flow: {
      eyebrow: "How Mira works",
      titleA: "From hello to",
      titleB: "a clear next step.",
      stepLabel: "Step",
      steps: [
        ["Say hello", "Just a first name."],
        ["Talk through your days", "Four short chapters, your own words."],
        ["Safety stays on", "Anything urgent reaches a human."],
        ["Get your orientation", "Signals, strength, next step."],
      ],
    },
    trust: {
      eyebrow: "Clear boundaries",
      titleA: "Orientation,",
      titleB: "never a diagnosis.",
      doesTitle: "Mira does",
      does: ["Validated screening", "Plain-language signals", "A next-step suggestion", "Escalates when you may be at risk"],
      doesNotTitle: "Mira never",
      doesNot: ["Diagnoses", "Prescribes medication", "Replaces a clinician", "Shares without your consent"],
      note: "In an emergency, contact local emergency services or a qualified clinician immediately.",
    },
    handoff: { eyebrow: "After Mira", title: "Meet Lumina.", body: "Your daily space: check-in, journal, baseline.", cta: "Discover Lumina" },
    cta: {
      eyebrow: "Begin when you are ready",
      titleA: "Ten minutes.",
      titleB: "One clear picture.",
      body: "Free. Private. No account needed.",
      primary: "Start with Mira",
      benefits: ["Free, no account", "Private by design", "Not a diagnosis"],
    },
    preview: {
      caption: "Illustration — example content",
      tools: ["ASRS · ADHD", "MDQ · Bipolar", "PQ-B · Psychosis"],
      chat: {
        title: "Orientation",
        chapter: "Evening",
        question: "Do you ever need far less sleep, yet still feel full of energy?",
        answer: "A few times — maybe twice a week.",
        typing: "Mira is reflecting…",
      },
      chapters: ["Morning", "Midday", "Evening", "Inner voice"],
      safetyChip: "Safety · no urgent flags",
      screens: {
        hello: { greeting: "Hello, I'm Mira.", ask: "What should I call you?", name: "Sara", cta: "Continue" },
        days: { chapter: "Evening", question: "Do you ever need far less sleep, yet feel full of energy?", options: ["Never", "Sometimes", "Often"] },
        safety: { title: "Safety check", status: "Listening", ok: "No urgent flags" },
        result: {
          title: "Your orientation",
          areas: ["Bipolar spectrum", "ADHD", "Psychosis spectrum"],
          review: "Clinician review",
          reviewValue: "Recommended",
          download: "Download report",
        },
      },
    },
  },
  lumina: {
    seo: {
      title: "Lumina — daily check-ins, journal and reports",
      description:
        "Meet Lumina, VitaMind's daily companion: a quick check-in, a private bilingual journal, simple goals, your own baseline and a monthly clinician report you share only with your consent.",
    },
    hero: {
      eyebrow: "Lumina · Daily companion",
      titleA: "Your days,",
      titleB: "kept and understood.",
      body: "A quick check-in, a private journal and your own baseline — turned into a report only when you choose.",
      primary: "Enter Lumina",
      secondary: "See how it works",
    },
    stats: [
      ["5", "signals a day"],
      ["30", "days, one picture"],
      ["1", "monthly report"],
    ],
    role: {
      eyebrow: "What Lumina does",
      titleA: "A steady presence,",
      titleB: "week after week.",
      items: [
        ["A steady companion", "Welcomes you into your day.", "Companion"],
        ["Daily check-in", "Five signals, a few seconds.", "Check-in"],
        ["Journal analysis", "Themes and emotions — never a diagnosis.", "Journal"],
        ["Continuous monitoring", "You, compared with your own baseline.", "Baseline"],
        ["Progress tracking", "Goals and trends, week after week.", "Progress"],
        ["Professional reports", "A monthly report, shared only by consent.", "Report"],
      ],
    },
    flow: {
      eyebrow: "How Lumina works",
      titleA: "A few seconds a day,",
      titleB: "a clearer month.",
      stepLabel: "Step",
      steps: [
        ["Check in", "Five signals. Seconds."],
        ["Write freely", "English, Gulf Arabic, or both."],
        ["See your evolution", "Baseline, trends, patterns."],
        ["Share by choice", "A report, only when you agree."],
      ],
    },
    trust: {
      eyebrow: "Your data, your call",
      titleA: "Private by design,",
      titleB: "shared by choice.",
      doesTitle: "Lumina does",
      does: ["Compares you with you", "Shows evidence and limits", "Describes patterns, not causes", "Reports only with consent"],
      doesNotTitle: "Lumina never",
      doesNot: ["Diagnoses or labels", "Scores you against others", "Replaces your clinician", "Shares your journal"],
      note: "Lumina is not an emergency service. If you are in danger, contact local emergency services right away.",
    },
    handoff: { eyebrow: "Before Lumina", title: "Start with Mira.", body: "A free, private orientation in about ten minutes.", cta: "Meet Mira" },
    cta: {
      eyebrow: "Make the days count",
      titleA: "Your next month,",
      titleB: "already clearer.",
      body: "7-day free trial. Cancel anytime.",
      primary: "Create your account",
      benefits: ["7-day free trial", "Cancel anytime", "You decide what is shared"],
    },
    preview: {
      caption: "Illustration — example content",
      signals: ["Mood", "Energy", "Focus", "Stress", "Sleep"],
      today: "Today",
      saved: "Saved",
      greeting: "Good evening",
      views: {
        checkin: { title: "Today's check-in" },
        journal: {
          title: "Smart Journal",
          entry: "Slept badly again, but the morning walk helped. Work still feels heavy.",
          themes: ["Sleep", "Work", "Walking"],
          note: "Themes and emotions — never a diagnosis",
        },
        trend: { title: "Last 30 days", baseline: "Your baseline", today: "Today", verdict: "Within your usual range", consistency: "Consistency" },
        report: { title: "Monthly report", sections: ["Trends", "Evidence", "Data limits"], share: "Share with my clinician", consent: "Only with your consent" },
      },
      bento: { goals: "goals today", week: "This week" },
    },
  },
  home: {
    eyebrow: "Meet the agents",
    titleA: "Two guides,",
    titleB: "one continuous care.",
    intro: "Mira opens the conversation; Lumina keeps it going between appointments. Each has her own role — and her own page.",
    cards: {
      mira: { points: ["Guided intake and validated screening", "Structured triage and a suggested next step", "Risk detection, with escalation to a human"], cta: "Explore Mira" },
      lumina: { points: ["Daily check-in and Smart Journal", "Baseline, trends and progress tracking", "Monthly clinician report, with your consent"], cta: "Explore Lumina" },
    },
  },
};

const ar: AgentPagesCopy = {
  mira: {
    seo: {
      title: "ميرا — توجيه موجَّه وفحص منظَّم",
      description:
        "تعرّف على ميرا، وكيلة التوجيه في VitaMind: محادثة خاصة وموجَّهة بأسئلة فحص معتمدة حول اضطراب فرط الحركة وتشتت الانتباه والاضطراب ثنائي القطب وأعراض الذهان، وملخص واضح تحمله إلى مختص. مجانية ودون حاجة إلى حساب.",
    },
    hero: {
      eyebrow: "ميرا · وكيلة التوجيه",
      titleA: "محادثة أولى",
      titleB: "تلاحظ ما يهم.",
      body: "محادثة هادئة وموجَّهة، ثم ملخص واضح تحمله إلى مختص. توجيه، وليس تشخيصاً أبداً.",
      primary: "ابدأ مع ميرا",
      secondary: "اكتشف كيف تعمل",
    },
    stats: [
      ["~10", "دقائق"],
      ["3", "مجالات فحص"],
      ["0", "حسابات مطلوبة"],
    ],
    role: {
      eyebrow: "ما تفعله ميرا",
      titleA: "حذرة،",
      titleB: "والإنسان أولاً.",
      items: [
        ["استقبال هادئ", "نحو عشرة أسئلة في أربعة فصول قصيرة.", "استقبال"],
        ["فحص معتمد", "ASRS · MDQ · PQ-B، تُطرح بطبيعية.", "فحص"],
        ["فرز منظَّم", "تتحول الإشارات إلى مستوى تطابق وخطوة تالية.", "فرز"],
        ["رصد المخاطر", "فحص أمان يعمل طوال الوقت.", "أمان"],
        ["تقرير تحمله معك", "الإشارات الرئيسية جاهزة لمختص.", "تقرير"],
        ["خاصة وبلغتين", "العربية أو الإنجليزية. دون حساب للبدء.", "خاص"],
      ],
    },
    flow: {
      eyebrow: "كيف تعمل ميرا",
      titleA: "من التحية إلى",
      titleB: "خطوة تالية واضحة.",
      stepLabel: "الخطوة",
      steps: [
        ["ابدأ بالتحية", "اسمك الأول فقط."],
        ["تحدّث عن أيامك", "أربعة فصول قصيرة، بكلماتك."],
        ["الأمان حاضر دائماً", "أي أمر عاجل يصل إلى إنسان."],
        ["تلقَّ توجيهك", "الإشارات والقوة والخطوة التالية."],
      ],
    },
    trust: {
      eyebrow: "حدود واضحة",
      titleA: "توجيه،",
      titleB: "وليس تشخيصاً أبداً.",
      doesTitle: "ما تفعله ميرا",
      does: ["فحص بأسئلة معتمدة", "إشارات بلغة بسيطة", "اقتراح خطوة تالية", "تصعّد حين قد تكون في خطر"],
      doesNotTitle: "ما لا تفعله ميرا",
      doesNot: ["لا تشخّص", "لا تصف الأدوية", "لا تحلّ محل المختص", "لا تشارك دون موافقتك"],
      note: "في حالات الطوارئ، تواصل فوراً مع خدمات الطوارئ المحلية أو مع مختص مؤهل.",
    },
    handoff: { eyebrow: "بعد ميرا", title: "تعرّف على لومينا.", body: "مساحتك اليومية: فحص ومفكرة وخط مرجعي.", cta: "اكتشف لومينا" },
    cta: {
      eyebrow: "ابدأ حين تكون مستعداً",
      titleA: "عشر دقائق.",
      titleB: "صورة واحدة واضحة.",
      body: "مجاناً وبخصوصية، ودون حساب.",
      primary: "ابدأ مع ميرا",
      benefits: ["مجاني ودون حساب", "خاص في التصميم", "ليس تشخيصاً"],
    },
    preview: {
      caption: "توضيحي — محتوى تجريبي",
      tools: ["ASRS · فرط الحركة", "MDQ · ثنائي القطب", "PQ-B · الذهان"],
      chat: {
        title: "التوجيه",
        chapter: "المساء",
        question: "هل تحتاج أحياناً إلى نوم أقل بكثير ومع ذلك تشعر بطاقة كاملة؟",
        answer: "عدة مرات — ربما مرتين في الأسبوع.",
        typing: "ميرا تتأمل…",
      },
      chapters: ["الصباح", "منتصف النهار", "المساء", "الصوت الداخلي"],
      safetyChip: "الأمان · لا مؤشرات عاجلة",
      screens: {
        hello: { greeting: "مرحباً، أنا ميرا.", ask: "بماذا تحب أن أناديك؟", name: "سارة", cta: "متابعة" },
        days: { chapter: "المساء", question: "هل تحتاج أحياناً إلى نوم أقل بكثير ومع ذلك تشعر بطاقة كاملة؟", options: ["أبداً", "أحياناً", "كثيراً"] },
        safety: { title: "فحص الأمان", status: "تصغي", ok: "لا مؤشرات عاجلة" },
        result: {
          title: "توجيهك",
          areas: ["طيف ثنائي القطب", "فرط الحركة", "طيف الذهان"],
          review: "مراجعة المختص",
          reviewValue: "موصى بها",
          download: "نزّل التقرير",
        },
      },
    },
  },
  lumina: {
    seo: {
      title: "لومينا — الفحص اليومي والمفكرة والتقارير",
      description:
        "تعرّف على لومينا، رفيقة VitaMind اليومية: فحص سريع، ومفكرة خاصة بلغتين، وأهداف بسيطة، وخطّك المرجعي، وتقرير شهري للمختص لا يُشارَك إلا بموافقتك.",
    },
    hero: {
      eyebrow: "لومينا · الرفيقة اليومية",
      titleA: "أيامك،",
      titleB: "محفوظة ومفهومة.",
      body: "فحص سريع ومفكرة خاصة وخطّك المرجعي — يتحول إلى تقرير حين تختار فقط.",
      primary: "ادخل إلى لومينا",
      secondary: "اكتشف كيف تعمل",
    },
    stats: [
      ["5", "إشارات يومياً"],
      ["30", "يوماً، صورة واحدة"],
      ["1", "تقرير شهري"],
    ],
    role: {
      eyebrow: "ما تفعله لومينا",
      titleA: "حضور ثابت،",
      titleB: "أسبوعاً بعد أسبوع.",
      items: [
        ["رفيقة ثابتة", "تستقبلك في يومك.", "رفيقة"],
        ["الفحص اليومي", "خمس إشارات في ثوانٍ.", "فحص"],
        ["تحليل المفكرة", "مواضيع ومشاعر — وليس تشخيصاً.", "مفكرة"],
        ["متابعة مستمرة", "أنت، مقارنةً بخطّك المرجعي.", "خط مرجعي"],
        ["تتبّع التقدّم", "أهداف واتجاهات، أسبوعاً بعد أسبوع.", "تقدّم"],
        ["تقارير مهنية", "تقرير شهري، بموافقتك فقط.", "تقرير"],
      ],
    },
    flow: {
      eyebrow: "كيف تعمل لومينا",
      titleA: "ثوانٍ كل يوم،",
      titleB: "وشهر أوضح.",
      stepLabel: "الخطوة",
      steps: [
        ["افحص يومك", "خمس إشارات. ثوانٍ."],
        ["اكتب بحرية", "الإنجليزية أو الخليجية أو الاثنتان."],
        ["شاهد تطوّرك", "خط مرجعي واتجاهات وأنماط."],
        ["شارك بالاختيار", "تقرير، حين توافق فقط."],
      ],
    },
    trust: {
      eyebrow: "بياناتك، وقرارك",
      titleA: "خاصة في التصميم،",
      titleB: "ومُشارَكة بالاختيار.",
      doesTitle: "ما تفعله لومينا",
      does: ["تقارنك بنفسك", "تُظهر الأدلة وحدودها", "تصف الأنماط لا الأسباب", "تقارير بموافقتك فقط"],
      doesNotTitle: "ما لا تفعله لومينا",
      doesNot: ["لا تشخّص ولا تصنّف", "لا تقيّمك مقارنةً بغيرك", "لا تحلّ محل مختصك", "لا تشارك مفكرتك"],
      note: "لومينا ليست خدمة طوارئ. إن كنت في خطر، تواصل فوراً مع خدمات الطوارئ المحلية.",
    },
    handoff: { eyebrow: "قبل لومينا", title: "ابدأ مع ميرا.", body: "توجيه مجاني وخاص في نحو عشر دقائق.", cta: "تعرّف على ميرا" },
    cta: {
      eyebrow: "اجعل أيامك محسوبة",
      titleA: "شهرك القادم،",
      titleB: "أوضح من الآن.",
      body: "تجربة مجانية 7 أيام. ألغِ في أي وقت.",
      primary: "أنشئ حسابك",
      benefits: ["تجربة مجانية 7 أيام", "الإلغاء في أي وقت", "أنت تقرر ما يُشارَك"],
    },
    preview: {
      caption: "توضيحي — محتوى تجريبي",
      signals: ["المزاج", "الطاقة", "التركيز", "التوتر", "النوم"],
      today: "اليوم",
      saved: "تم الحفظ",
      greeting: "مساء الخير",
      views: {
        checkin: { title: "فحص اليوم" },
        journal: {
          title: "المفكرة الذكية",
          entry: "نمتُ سيئاً مرة أخرى، لكن مشي الصباح ساعدني. ما زال العمل يبدو ثقيلاً.",
          themes: ["النوم", "العمل", "المشي"],
          note: "مواضيع ومشاعر — وليس تشخيصاً",
        },
        trend: { title: "آخر 30 يوماً", baseline: "خطّك المرجعي", today: "اليوم", verdict: "ضمن نطاقك المعتاد", consistency: "الانتظام" },
        report: { title: "التقرير الشهري", sections: ["الاتجاهات", "الأدلة", "حدود البيانات"], share: "شارك مع مختصي", consent: "بموافقتك فقط" },
      },
      bento: { goals: "أهداف اليوم", week: "هذا الأسبوع" },
    },
  },
  home: {
    eyebrow: "تعرّف على الوكيلتين",
    titleA: "دليلتان،",
    titleB: "ورعاية متصلة.",
    intro: "تفتح ميرا المحادثة، وتُبقيها لومينا مستمرة بين الموعدين. لكل منهما دورها — وصفحتها.",
    cards: {
      mira: { points: ["استقبال موجَّه وفحص معتمد", "فرز منظَّم وخطوة تالية مقترحة", "رصد المخاطر مع تصعيد إلى إنسان"], cta: "اكتشف ميرا" },
      lumina: { points: ["فحص يومي ومفكرة ذكية", "خط مرجعي واتجاهات وتتبّع للتقدّم", "تقرير شهري للمختص، بموافقتك"], cta: "اكتشف لومينا" },
    },
  },
};

export const agentPagesCopy: Record<Lang, AgentPagesCopy> = { en, ar };
