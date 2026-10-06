import type { Lang } from "@/lib/i18n/config";

/**
 * Copy for the home page's story, in the order a first-time visitor needs it:
 *
 * - `heroMap`: the three parts of VitaMind as one quiet line under the hero buttons.
 * - `what`: what VitaMind is, as one statement and one picture (you · VitaMind · your clinician).
 * - `audience`: who it is for: people living with ADHD, bipolar disorder or psychosis, and the professionals around them.
 * - `agents`: what Mira does (once) and what Lumina does (every day), three lines each.
 * How professionals are involved lives in `healthcare.ts`. Each block only says what the visitor needs to understand the
 * product; the detail lives on /mira, /lumina, /tracks, /trust and /support, and each block links there.
 * `ar` is typed against the same shape as `en`, so a missing key fails the build.
 */

type Pair = readonly [title: string, line: string];

export type HomeStoryCopy = {
  heroMap: { label: string; items: readonly { name: string; line: string }[] };
  what: {
    rail: string;
    eyebrow: string;
    titleA: string;
    titleB: string;
    /** Read word by word as the reader scrolls. */
    statement: string;
    /** The few words of the statement that carry it, highlighted in gold. */
    highlight: readonly string[];
    nodes: readonly { label: string; title: string; points: readonly string[] }[];
    consent: string;
    rule: string;
  };
  audience: {
    rail: string;
    eyebrow: string;
    titleA: string;
    titleB: string;
    intro: string;
    people: { label: string; title: string; conditions: readonly Pair[]; link: string };
    unsure: { title: string; line: string; cta: string };
    pros: { label: string; title: string; items: readonly Pair[]; cta: string };
  };
  agents: {
    rail: string;
    eyebrow: string;
    titleA: string;
    titleB: string;
    intro: string;
    then: string;
    mira: AgentChapter;
    lumina: AgentChapter;
  };
};

type AgentChapter = { when: string; role: string; lead: string; does: readonly string[]; boundary: string; cta: string };

const en: HomeStoryCopy = {
  heroMap: {
    label: "VitaMind in three parts",
    items: [
      { name: "Mira", line: "Orientation, once" },
      { name: "Lumina", line: "Your daily space" },
      { name: "Clinicians", line: "Always in charge" },
    ],
  },
  what: {
    rail: "What it is",
    eyebrow: "What VitaMind is",
    titleA: "One platform,",
    titleB: "between you and your care.",
    statement:
      "VitaMind is a mental health support platform. Two AI companions stay with you between consultations, and a licensed clinician follows your care through what you choose to share.",
    highlight: ["mental", "health", "support", "platform.", "AI", "companions", "licensed", "clinician", "choose"],
    nodes: [
      { label: "You", title: "Everyday life", points: ["Check-in", "Journal", "Goals"] },
      { label: "VitaMind", title: "Mira and Lumina", points: ["Orient", "Follow", "Flag"] },
      { label: "Your clinician", title: "Clinical care", points: ["Reviews", "Decides", "Follows up"] },
    ],
    consent: "Only with your consent",
    rule: "AI guides and flags · the professional decides",
  },
  audience: {
    rail: "Who it is for",
    eyebrow: "Who it is for",
    titleA: "Three conditions,",
    titleB: "and the people who treat them.",
    intro: "VitaMind is for people living with ADHD, bipolar disorder or psychosis, and for the professionals and organisations who care for them.",
    people: {
      label: "For people",
      title: "Living with",
      conditions: [
        ["ADHD", "Spark helps organise the day"],
        ["Bipolar disorder", "A library of approved resources"],
        ["Psychosis", "Resources and a calm daily structure"],
      ],
      link: "Explore the care tracks",
    },
    unsure: { title: "Not sure yet?", line: "Mira's orientation helps you see which signals are worth discussing with a professional.", cta: "Start with Mira" },
    pros: {
      label: "For professionals",
      title: "And those who care for them",
      items: [
        ["Psychiatrists and psychologists", "Follow each patient between consultations."],
        ["Clinics and hospitals", "Organise follow-up across a care team."],
        ["Health authorities", "Consent-based, logged, built to be reviewed."],
      ],
      cta: "How professionals are involved",
    },
  },
  agents: {
    rail: "Mira & Lumina",
    eyebrow: "Two AI companions",
    titleA: "One to begin,",
    titleB: "one for every day.",
    intro: "Both come with your account, in English and Arabic. Neither one diagnoses: that stays with a licensed professional.",
    then: "Then, every day",
    mira: {
      when: "Once · about 10 minutes",
      role: "Orientation",
      lead: "A guided first conversation that notices what matters.",
      does: ["Up to ten questions in four short chapters", "A safety check the whole time", "A plain summary to bring to a clinician"],
      boundary: "An orientation, not a diagnosis.",
      cta: "Discover Mira",
    },
    lumina: {
      when: "Every day · under a minute",
      role: "Daily space",
      lead: "Your space between consultations, kept and understood.",
      does: ["A quick check-in and a private journal", "Your trends, compared with your own baseline", "A monthly report, shared only if you agree"],
      boundary: "Spark for ADHD · a resource library for bipolar disorder and psychosis.",
      cta: "Discover Lumina",
    },
  },
};

const ar: HomeStoryCopy = {
  heroMap: {
    label: "VitaMind في ثلاثة أجزاء",
    items: [
      { name: "ميرا", line: "التوجيه، مرة واحدة" },
      { name: "لومينا", line: "مساحتك اليومية" },
      { name: "المختصون", line: "القرار لهم دائماً" },
    ],
  },
  what: {
    rail: "ما هي",
    eyebrow: "ما هي VitaMind",
    titleA: "منصة واحدة،",
    titleB: "بينك وبين رعايتك.",
    statement:
      "VitaMind منصة دعم للصحة النفسية. رفيقان بالذكاء الاصطناعي يبقيان معك بين الاستشارات، ومختص مرخَّص يتابع رعايتك من خلال ما تختار مشاركته.",
    highlight: ["دعم", "للصحة", "النفسية.", "رفيقان", "بالذكاء", "الاصطناعي", "مختص", "مرخَّص", "تختار"],
    nodes: [
      { label: "أنت", title: "الحياة اليومية", points: ["الفحص اليومي", "المفكرة", "الأهداف"] },
      { label: "VitaMind", title: "ميرا ولومينا", points: ["توجّه", "تتابع", "تنبّه"] },
      { label: "مختصك", title: "الرعاية السريرية", points: ["يراجع", "يقرّر", "يتابع"] },
    ],
    consent: "بموافقتك فقط",
    rule: "الذكاء الاصطناعي يوجّه وينبّه · والمختص يقرّر",
  },
  audience: {
    rail: "لمن هي",
    eyebrow: "لمن هي",
    titleA: "ثلاث حالات،",
    titleB: "ومن يعتنون بأصحابها.",
    intro: "VitaMind لمن يعيشون مع اضطراب فرط الحركة وتشتت الانتباه أو الاضطراب ثنائي القطب أو الذهان، وللمختصين والمؤسسات التي ترعاهم.",
    people: {
      label: "للأشخاص",
      title: "من يعيشون مع",
      conditions: [
        ["فرط الحركة وتشتت الانتباه", "سبارك ينظّم يومك"],
        ["الاضطراب ثنائي القطب", "مكتبة موارد معتمدة"],
        ["الذهان", "موارد وبنية يومية هادئة"],
      ],
      link: "استكشف مسارات الرعاية",
    },
    unsure: { title: "لست متأكداً بعد؟", line: "يساعدك توجيه ميرا على رؤية الإشارات التي تستحق نقاشاً مع مختص.", cta: "ابدأ مع ميرا" },
    pros: {
      label: "للمختصين",
      title: "ومن يعتنون بهم",
      items: [
        ["الأطباء النفسيون والأخصائيون النفسيون", "متابعة كل مريض بين الاستشارات."],
        ["العيادات والمستشفيات", "تنظيم المتابعة ضمن فريق رعاية."],
        ["الجهات الصحية", "قائمة على الموافقة، مسجَّلة، ومصمَّمة لتُراجَع."],
      ],
      cta: "كيف يشارك المختصون",
    },
  },
  agents: {
    rail: "ميرا ولومينا",
    eyebrow: "رفيقان بالذكاء الاصطناعي",
    titleA: "واحدة للبداية،",
    titleB: "وأخرى لكل يوم.",
    intro: "كلتاهما ضمن حسابك، بالعربية والإنجليزية. ولا تشخّص أيّ منهما: التشخيص يبقى لمختص مرخَّص.",
    then: "ثم، كل يوم",
    mira: {
      when: "مرة واحدة · نحو 10 دقائق",
      role: "التوجيه",
      lead: "محادثة أولى موجَّهة تلتقط ما يهم.",
      does: ["حتى عشرة أسئلة في أربعة فصول قصيرة", "فحص أمان طوال الوقت", "ملخص واضح تحمله إلى مختص"],
      boundary: "توجيه، وليس تشخيصاً.",
      cta: "اكتشف ميرا",
    },
    lumina: {
      when: "كل يوم · أقل من دقيقة",
      role: "المساحة اليومية",
      lead: "مساحتك بين الاستشارات، محفوظة ومفهومة.",
      does: ["فحص يومي سريع ومفكرة خاصة", "اتجاهاتك مقارنةً بخطّك المرجعي", "تقرير شهري لا يُشارَك إلا بموافقتك"],
      boundary: "سبارك لفرط الحركة وتشتت الانتباه · ومكتبة موارد للاضطراب ثنائي القطب والذهان.",
      cta: "اكتشف لومينا",
    },
  },
};

export const homeStoryCopy: Record<Lang, HomeStoryCopy> = { en, ar };
