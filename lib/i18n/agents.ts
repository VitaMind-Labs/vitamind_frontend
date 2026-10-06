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
  /** The first screen of the app, as the window on /lumina and the hero draw it. */
  home: { wellbeing: string; wellbeingLine: string; signalsTitle: string; signals: readonly string[]; planTitle: string; plan: readonly string[]; nextTitle: string; nextLine: string };
};

export type LuminaTracksCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  intro: string;
  /** What every user does, whatever the condition. */
  sharedTitle: string;
  sharedLine: string;
  /** The interactive mood card of the shared routine: five levels, one supportive line each. */
  mood: { title: string; prompt: string; levels: readonly string[]; messages: readonly string[]; saved: string };
  cards: readonly { tag: string; title: string; line: string; points: readonly string[] }[];
  /** Illustrative content for the small live previews inside the two cards (shown under the page's "example content" caption). */
  demo: {
    spark: { heading: string; tasks: readonly string[]; steps: readonly string[]; reminder: string; tip: string };
    library: { heading: string; items: readonly Pair[]; breathe: string };
  };
};

export type AgentPagesCopy = {
  mira: AgentPageCopy & { preview: MiraPreviewCopy };
  lumina: AgentPageCopy & { preview: LuminaPreviewCopy; tracks: LuminaTracksCopy };
};

const en: AgentPagesCopy = {
  mira: {
    seo: {
      title: "Mira — guided orientation and structured screening",
      description:
        "Meet Mira, VitaMind's orientation agent: a private, guided conversation built on established screening tools for ADHD, bipolar disorder and psychotic symptoms, and a clear summary to bring to a clinician. Included with your VitaMind account.",
    },
    hero: {
      eyebrow: "Mira · Orientation agent",
      titleA: "A first conversation",
      titleB: "that notices what matters.",
      body: "A calm, guided conversation — then a clear summary to bring to a professional. An orientation that supports clinical assessment; it is not a diagnosis.",
      primary: "Start with Mira",
      secondary: "See how it works",
    },
    stats: [
      ["~10", "minutes"],
      ["3", "screening areas"],
      ["1", "per account"],
    ],
    role: {
      eyebrow: "What Mira does",
      titleA: "Careful,",
      titleB: "and human-first.",
      items: [
        ["Gentle intake", "About ten questions, four short chapters.", "Intake"],
        ["Established screening tools", "ASRS · MDQ · PQ-B, asked in a natural conversation.", "Screening"],
        ["Structured triage", "Signals become a match level and a next step.", "Triage"],
        ["Risk detection", "A safety check runs the whole time.", "Safety"],
        ["A report to bring", "Key signals, ready for a professional.", "Report"],
        ["Private, bilingual", "English or Arabic. Included with your account.", "Private"],
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
      titleB: "not a diagnosis.",
      doesTitle: "Mira does",
      does: ["Questions based on established tools", "Plain-language signals", "A next-step suggestion", "Alerts a clinician when you may be at risk"],
      doesNotTitle: "Mira never",
      doesNot: ["Diagnose", "Recommend treatment or medication", "Replace a clinician", "Share without your consent"],
      note: "In an emergency, contact local emergency services or a qualified clinician immediately.",
    },
    handoff: { eyebrow: "After Mira", title: "Meet Lumina.", body: "Your daily space: check-in, journal, baseline.", cta: "Discover Lumina" },
    cta: {
      eyebrow: "Begin when you are ready",
      titleA: "Ten minutes.",
      titleB: "One clear picture.",
      body: "Create your account and give your consent: the orientation opens right away.",
      primary: "Start with Mira",
      benefits: ["Included with your account", "Private by design", "A summary to take away"],
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
      eyebrow: "Lumina · Your daily space",
      titleA: "Your days,",
      titleB: "kept and understood.",
      body: "Check in for a few seconds, write freely, and watch your own baseline take shape. A clinician sees a report only when you decide to share it.",
      primary: "Enter Lumina",
      secondary: "See how it works",
    },
    stats: [
      ["5", "signals a day"],
      ["30", "days, one picture"],
      ["1", "monthly report"],
    ],
    role: {
      eyebrow: "What Lumina holds",
      titleA: "Everything your day needs,",
      titleB: "nothing it doesn't.",
      items: [
        ["A calm welcome", "Opens on how you are today, not on a wall of numbers.", "Today"],
        ["Daily check-in", "Mood, energy, focus, stress and sleep. Seconds, not forms.", "Check-in"],
        ["Smart journal", "Write in English, Gulf Arabic or both. Lumina lifts out themes and emotions; it never labels you.", "Journal"],
        ["Your own baseline", "You, compared with you. A line inside your usual range is a steady month.", "Baseline"],
        ["Goals that bend", "Done, partly done or missed: every day counts and none of them judges you.", "Goals"],
        ["A report you control", "A monthly summary for your clinician, shared only if you switch it on.", "Report"],
      ],
    },
    flow: {
      eyebrow: "A day with Lumina",
      titleA: "A few seconds a day,",
      titleB: "a clearer month.",
      stepLabel: "Step",
      steps: [
        ["Check in", "Five signals, a few taps. That is the whole routine."],
        ["Write freely", "English, Gulf Arabic or both, in your own words."],
        ["Watch it take shape", "Your baseline, your trends and the patterns worth noticing."],
        ["Share by choice", "A monthly report for your clinician, only when you switch it on."],
      ],
    },
    trust: {
      eyebrow: "Your data, your call",
      titleA: "Private by design,",
      titleB: "shared by choice.",
      doesTitle: "Lumina does",
      does: ["Compares you with you", "Shows evidence and limits", "Describes patterns, not causes", "Reports only with consent"],
      doesNotTitle: "Lumina never",
      doesNot: ["Diagnose or label", "Score you against others", "Replace your clinician", "Share your journal"],
      note: "Lumina is not an emergency service. If you are in danger, contact local emergency services right away.",
    },
    handoff: { eyebrow: "Before Lumina", title: "Start with Mira.", body: "A private orientation in about ten minutes, done once with your account.", cta: "Meet Mira" },
    cta: {
      eyebrow: "Make the days count",
      titleA: "Your next month,",
      titleB: "already clearer.",
      body: "Your daily space opens once Mira's orientation is done.",
      primary: "Enter Lumina",
      benefits: ["Daily check-in and journal", "Private by design", "You decide what is shared"],
    },
    tracks: {
      eyebrow: "Three conditions, one daily thread",
      titleA: "Built around",
      titleB: "how you live.",
      intro: "Lumina adapts to the three conditions VitaMind supports. Whatever the condition, the daily rhythm is the same — and a clinician stays in charge of care.",
      sharedTitle: "The same daily core, for everyone",
      sharedLine: "ADHD, bipolar disorder and schizophrenia share one simple routine.",
      mood: {
        title: "How are you today?",
        prompt: "Tap the face that fits. There is no wrong answer.",
        levels: ["Low", "Down", "Okay", "Good", "Great"],
        messages: [
          "A heavy day. Noted, and you are not alone with it.",
          "Not an easy one. A small step is enough today.",
          "Steady. A calm day counts too.",
          "Good to hear. Notice what helped.",
          "A bright one. Keep a note of what made it so.",
        ],
        saved: "Saved to today",
      },
      cards: [
        {
          tag: "ADHD",
          title: "Spark, your daily organiser",
          line: "Spark is the AI assistant inside Lumina, designed for ADHD: it helps you structure your day and manage your tasks.",
          points: ["Plan and prioritise your day", "Turn big tasks into small, doable steps", "Gentle reminders, never pressure", "Organising tips built for how ADHD works"],
        },
        {
          tag: "Bipolar disorder · Schizophrenia",
          title: "Psychoeducation and self-management",
          line: "A library of approved resources to understand your condition, practise coping strategies and recognise your own triggers.",
          points: ["Psychoeducation in plain language", "Coping strategies you can practise", "Trigger and early-warning awareness", "Reading chosen from your own check-ins"],
        },
      ],
      demo: {
        spark: {
          heading: "Today with Spark",
          tasks: ["Reply to the clinic", "Prepare tomorrow's meeting", "Take a 10-minute walk"],
          steps: ["Open your notes", "Pick three points", "Send them to yourself"],
          reminder: "Reminder · 4:00 pm · Prepare tomorrow's meeting",
          tip: "Tip: start with the smallest step. Five minutes is enough.",
        },
        library: {
          heading: "Library",
          items: [
            ["Understanding your triggers", "5 min read"],
            ["A grounding exercise", "Coping strategy"],
            ["Sleep and mood", "Psychoeducation"],
          ],
          breathe: "Breathe",
        },
      },
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
      home: {
        wellbeing: "Today's wellbeing",
        wellbeingLine: "How you are, at a glance",
        signalsTitle: "Recent signals",
        signals: ["Your sleep has improved this week", "Mood steady over seven days", "Focus is higher in the morning"],
        planTitle: "Today's plan",
        plan: ["Breathing exercise", "Morning light", "Journal your thoughts"],
        nextTitle: "Within your usual range",
        nextLine: "Nothing to act on today.",
      },
    },
  },
};

const ar: AgentPagesCopy = {
  mira: {
    seo: {
      title: "ميرا — توجيه موجَّه وفحص منظَّم",
      description:
        "تعرّف على ميرا، وكيلة التوجيه في VitaMind: محادثة خاصة وموجَّهة مبنية على أدوات فحص معروفة حول اضطراب فرط الحركة وتشتت الانتباه والاضطراب ثنائي القطب وأعراض الذهان، وملخص واضح تحمله إلى مختص. ضمن حسابك في VitaMind.",
    },
    hero: {
      eyebrow: "ميرا · وكيلة التوجيه",
      titleA: "محادثة أولى",
      titleB: "تلاحظ ما يهم.",
      body: "محادثة هادئة وموجَّهة، ثم ملخص واضح تحمله إلى مختص. توجيه يدعم التقييم السريري، وليس تشخيصاً.",
      primary: "ابدأ مع ميرا",
      secondary: "اكتشف كيف تعمل",
    },
    stats: [
      ["~10", "دقائق"],
      ["3", "مجالات فحص"],
      ["1", "لكل حساب"],
    ],
    role: {
      eyebrow: "ما تفعله ميرا",
      titleA: "حذرة،",
      titleB: "والإنسان أولاً.",
      items: [
        ["استقبال هادئ", "نحو عشرة أسئلة في أربعة فصول قصيرة.", "استقبال"],
        ["أدوات فحص معروفة", "ASRS · MDQ · PQ-B، تُطرح ضمن محادثة طبيعية.", "فحص"],
        ["فرز منظَّم", "تتحول الإشارات إلى مستوى تطابق وخطوة تالية.", "فرز"],
        ["رصد المخاطر", "فحص أمان يعمل طوال الوقت.", "أمان"],
        ["تقرير تحمله معك", "الإشارات الرئيسية جاهزة لمختص.", "تقرير"],
        ["خاصة وبلغتين", "العربية أو الإنجليزية. ضمن حسابك.", "خاص"],
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
      titleB: "وليس تشخيصاً.",
      doesTitle: "ما تفعله ميرا",
      does: ["أسئلة مبنية على أدوات معروفة", "إشارات بلغة بسيطة", "اقتراح خطوة تالية", "تنبّه مختصاً حين قد تكون في خطر"],
      doesNotTitle: "ما لا تفعله ميرا",
      doesNot: ["لا تشخّص", "لا توصي بعلاج أو دواء", "لا تحلّ محل المختص", "لا تشارك دون موافقتك"],
      note: "في حالات الطوارئ، تواصل فوراً مع خدمات الطوارئ المحلية أو مع مختص مؤهل.",
    },
    handoff: { eyebrow: "بعد ميرا", title: "تعرّف على لومينا.", body: "مساحتك اليومية: فحص ومفكرة وخط مرجعي.", cta: "اكتشف لومينا" },
    cta: {
      eyebrow: "ابدأ حين تكون مستعداً",
      titleA: "عشر دقائق.",
      titleB: "صورة واحدة واضحة.",
      body: "أنشئ حسابك وامنح موافقتك: يُفتح التوجيه فوراً.",
      primary: "ابدأ مع ميرا",
      benefits: ["ضمن حسابك", "خاص في التصميم", "ملخص تحمله معك"],
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
      eyebrow: "لومينا · مساحتك اليومية",
      titleA: "أيامك،",
      titleB: "محفوظة ومفهومة.",
      body: "سجّل يومك في ثوانٍ، واكتب بحرية، وشاهد خطّك المرجعي يتشكّل. لا يرى المختص تقريراً إلا حين تقرر أنت مشاركته.",
      primary: "ادخل إلى لومينا",
      secondary: "اكتشف كيف تعمل",
    },
    stats: [
      ["5", "إشارات يومياً"],
      ["30", "يوماً، صورة واحدة"],
      ["1", "تقرير شهري"],
    ],
    role: {
      eyebrow: "ما تحمله لومينا",
      titleA: "كل ما يحتاجه يومك،",
      titleB: "ولا شيء زائد.",
      items: [
        ["استقبال هادئ", "تفتح على حالك اليوم، لا على جدار من الأرقام.", "اليوم"],
        ["الفحص اليومي", "المزاج والطاقة والتركيز والتوتر والنوم. ثوانٍ، لا استمارات.", "فحص"],
        ["المفكرة الذكية", "اكتب بالعربية الخليجية أو الإنجليزية أو بهما معاً. تستخرج لومينا المواضيع والمشاعر ولا تصنّفك أبداً.", "مفكرة"],
        ["خطّك المرجعي", "أنت مقارنةً بنفسك. خط داخل نطاقك المعتاد يعني شهراً مستقراً.", "خط مرجعي"],
        ["أهداف مرنة", "منجزة أو جزئية أو فائتة: كل يوم يُحسب ولا حكم على أحد.", "أهداف"],
        ["تقرير بيدك", "ملخص شهري لمختصك، لا يُشارَك إلا إن فعّلته أنت.", "تقرير"],
      ],
    },
    flow: {
      eyebrow: "يوم مع لومينا",
      titleA: "ثوانٍ كل يوم،",
      titleB: "وشهر أوضح.",
      stepLabel: "الخطوة",
      steps: [
        ["سجّل يومك", "خمس إشارات ببضع لمسات. هذا هو الروتين كله."],
        ["اكتب بحرية", "بالعربية الخليجية أو الإنجليزية أو بهما، بكلماتك."],
        ["شاهد الصورة تتشكّل", "خطّك المرجعي واتجاهاتك والأنماط التي تستحق الانتباه."],
        ["شارك بالاختيار", "تقرير شهري لمختصك، حين تفعّله فقط."],
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
    handoff: { eyebrow: "قبل لومينا", title: "ابدأ مع ميرا.", body: "توجيه خاص في نحو عشر دقائق، يُجرى مرة واحدة مع حسابك.", cta: "تعرّف على ميرا" },
    cta: {
      eyebrow: "اجعل أيامك محسوبة",
      titleA: "شهرك القادم،",
      titleB: "أوضح من الآن.",
      body: "تُفتح مساحتك اليومية فور اكتمال توجيه ميرا.",
      primary: "ادخل إلى لومينا",
      benefits: ["فحص يومي ومفكرة", "خاص في التصميم", "أنت تقرر ما يُشارَك"],
    },
    tracks: {
      eyebrow: "ثلاث حالات، خيط يومي واحد",
      titleA: "مصمَّمة حول",
      titleB: "طريقة عيشك.",
      intro: "تتكيّف لومينا مع الحالات الثلاث التي تدعمها VitaMind. وأياً كانت الحالة، يبقى الإيقاع اليومي نفسه — ويبقى المختص هو المسؤول عن الرعاية.",
      sharedTitle: "النواة اليومية نفسها للجميع",
      sharedLine: "اضطراب فرط الحركة وتشتت الانتباه والاضطراب ثنائي القطب والفصام يتشاركون روتيناً بسيطاً واحداً.",
      mood: {
        title: "كيف حالك اليوم؟",
        prompt: "اضغط على الوجه المناسب. لا توجد إجابة خاطئة.",
        levels: ["منخفض", "متعب", "عادي", "جيد", "رائع"],
        messages: [
          "يوم ثقيل. سجّلناه، ولست وحدك معه.",
          "ليس يوماً سهلاً. تكفي خطوة صغيرة اليوم.",
          "مستقر. اليوم الهادئ مهم أيضاً.",
          "جميل أن تسمع ذلك. لاحظ ما ساعدك.",
          "يوم مشرق. دوّن ما جعله كذلك.",
        ],
        saved: "تم الحفظ لليوم",
      },
      cards: [
        {
          tag: "فرط الحركة وتشتت الانتباه",
          title: "سبارك، منظّمك اليومي",
          line: "سبارك مساعد الذكاء الاصطناعي داخل لومينا، مصمَّم لاضطراب فرط الحركة وتشتت الانتباه: يساعدك على تنظيم يومك وإدارة مهامك.",
          points: ["خطّط ورتّب أولويات يومك", "حوّل المهام الكبيرة إلى خطوات صغيرة قابلة للتنفيذ", "تذكيرات لطيفة دون أي ضغط", "نصائح تنظيم مبنية على طريقة عمل اضطراب فرط الحركة"],
        },
        {
          tag: "ثنائي القطب · الفصام",
          title: "التثقيف النفسي والإدارة الذاتية",
          line: "مكتبة موارد معتمدة لفهم حالتك، وممارسة استراتيجيات التكيّف، والتعرّف على محفّزاتك الخاصة.",
          points: ["تثقيف نفسي بلغة بسيطة", "استراتيجيات تكيّف يمكنك ممارستها", "الوعي بالمحفّزات والإنذارات المبكرة", "قراءات تُختار من فحوصاتك اليومية"],
        },
      ],
      demo: {
        spark: {
          heading: "يومك مع سبارك",
          tasks: ["الردّ على العيادة", "تحضير اجتماع الغد", "مشي لمدة 10 دقائق"],
          steps: ["افتح ملاحظاتك", "اختر ثلاث نقاط", "أرسلها إلى نفسك"],
          reminder: "تذكير · 4:00 مساءً · تحضير اجتماع الغد",
          tip: "نصيحة: ابدأ بأصغر خطوة. خمس دقائق تكفي.",
        },
        library: {
          heading: "المكتبة",
          items: [
            ["فهم محفّزاتك", "قراءة 5 دقائق"],
            ["تمرين تثبيت", "استراتيجية تأقلم"],
            ["النوم والمزاج", "تثقيف نفسي"],
          ],
          breathe: "تنفّس",
        },
      },
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
      home: {
        wellbeing: "حالك اليوم",
        wellbeingLine: "نظرة سريعة على حالك",
        signalsTitle: "إشارات حديثة",
        signals: ["نومك تحسّن هذا الأسبوع", "مزاجك مستقر منذ سبعة أيام", "تركيزك أعلى في الصباح"],
        planTitle: "خطة اليوم",
        plan: ["تمرين تنفّس", "ضوء الصباح", "دوّن أفكارك"],
        nextTitle: "ضمن نطاقك المعتاد",
        nextLine: "لا شيء يستدعي تصرفاً اليوم.",
      },
    },
  },
};

export const agentPagesCopy: Record<Lang, AgentPagesCopy> = { en, ar };
