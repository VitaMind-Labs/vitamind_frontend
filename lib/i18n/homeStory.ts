import type { Lang } from "@/lib/i18n/config";

/**
 * Copy for the home page's two story sections.
 *
 * - `homeBridgeCopy`: what VitaMind is and the gap it closes, in a handful of words, plus the three conditions it serves.
 * - `homeLoopCopy`: "how it works", the whole journey in four steps. It mirrors the product: create the account and
 *   consent, Mira's one orientation (up to ten questions, four chapters, safety on throughout), Lumina every day
 *   (check-in, private journal, Spark for ADHD or the library for bipolar disorder and psychosis), and the clinician the
 *   care team connects you with, who only sees what you share. Detail lives on /mira, /lumina and /trust.
 * `ar` is typed against the same shape as `en`, so a missing key fails the build.
 */

export type HomeBridgeCopy = {
  rail: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  intro: string;
  patient: { label: string; title: string; points: readonly string[] };
  clinician: { label: string; title: string; points: readonly string[] };
  /** The line carried across the bridge. */
  link: string;
  conditions: { label: string; items: readonly { name: string; line: string }[] };
};

const bridgeEn: HomeBridgeCopy = {
  rail: "Why VitaMind",
  eyebrow: "The gap we close",
  titleA: "Everyday life,",
  titleB: "connected to care.",
  intro: "Between two consultations, life goes on. VitaMind keeps it visible: to you first, and to your clinician when you choose.",
  patient: { label: "For people", title: "Understood, day by day", points: ["A daily check-in", "A private journal", "Support when it matters"] },
  clinician: { label: "For clinicians", title: "Seen earlier, more clearly", points: ["Trends from each patient's own baseline", "Alerts with response deadlines", "Reports shared only with consent"] },
  link: "AI guides and flags · the professional decides",
  conditions: {
    label: "Built for",
    items: [
      { name: "ADHD", line: "Spark helps organise the day" },
      { name: "Bipolar disorder", line: "A library of approved resources" },
      { name: "Psychosis", line: "Resources and a calm daily structure" },
    ],
  },
};

const bridgeAr: HomeBridgeCopy = {
  rail: "لماذا VitaMind",
  eyebrow: "الفجوة التي نسدّها",
  titleA: "حياتك اليومية،",
  titleB: "متصلة بالرعاية.",
  intro: "بين موعدين، تستمر الحياة. تُبقيها VitaMind مرئية: لك أولاً، ولمختصك حين تختار.",
  patient: { label: "للأشخاص", title: "مفهومون، يوماً بيوم", points: ["فحص يومي", "مفكرة خاصة", "دعم حين يلزم"] },
  clinician: { label: "للمختصين", title: "رؤية أبكر وأوضح", points: ["اتجاهات مقارنةً بالخط المرجعي لكل مريض", "تنبيهات بمهل للاستجابة", "تقارير لا تُشارَك إلا بموافقة"] },
  link: "الذكاء الاصطناعي يوجّه وينبّه · والمختص يقرّر",
  conditions: {
    label: "مصمَّمة لـ",
    items: [
      { name: "فرط الحركة وتشتت الانتباه", line: "سبارك ينظّم يومك" },
      { name: "الاضطراب ثنائي القطب", line: "مكتبة موارد معتمدة" },
      { name: "الذهان", line: "موارد وبنية يومية هادئة" },
    ],
  },
};

export const homeBridgeCopy: Record<Lang, HomeBridgeCopy> = { en: bridgeEn, ar: bridgeAr };

export type HomeLoopCopy = {
  /** Short label for the section rail. */
  rail: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  intro: string;
  steps: readonly { kicker: string; name: string; role: string; body: string; cta: string }[];
  /** One quiet line under the steps: which languages, and where to read how data is protected. */
  note: { text: string; link: string };
};

const en: HomeLoopCopy = {
  rail: "How it works",
  eyebrow: "How it works",
  titleA: "From first hello",
  titleB: "to continuous care.",
  intro: "Four steps. You decide what is shared, and when.",
  steps: [
    {
      kicker: "One minute",
      name: "Create your account",
      role: "",
      body: "Private from the start. You give your consent first; nothing reaches a clinician without your choice.",
      cta: "Create account",
    },
    {
      kicker: "Once · about 10 minutes",
      name: "Mira",
      role: "Orientation",
      body: "Up to ten questions in four short chapters, with a safety check all along. You leave with a plain summary to bring to a clinician. An orientation, not a diagnosis.",
      cta: "Meet Mira",
    },
    {
      kicker: "Every day · under a minute",
      name: "Lumina",
      role: "Daily space",
      body: "A check-in and a private journal. Spark organises the day for ADHD; a library of approved resources supports bipolar disorder and psychosis.",
      cta: "Meet Lumina",
    },
    {
      kicker: "Weekly and monthly · with consent",
      name: "Your clinician",
      role: "Care that continues",
      body: "Our care team connects you with a licensed clinician. They see only what you share, are alerted if signals worsen, and make every decision.",
      cta: "How care stays safe",
    },
  ],
  note: { text: "Private by design · English and Arabic", link: "How we protect your data" },
};

const ar: HomeLoopCopy = {
  rail: "كيف تعمل",
  eyebrow: "كيف تعمل",
  titleA: "من أول مرحباً",
  titleB: "إلى رعاية مستمرة.",
  intro: "أربع خطوات. وأنت من يقرّر ما يُشارَك ومتى.",
  steps: [
    {
      kicker: "دقيقة واحدة",
      name: "أنشئ حسابك",
      role: "",
      body: "خاص منذ البداية. تعطي موافقتك أولاً، ولا يصل شيء إلى مختص دون اختيارك.",
      cta: "إنشاء حساب",
    },
    {
      kicker: "مرة واحدة · نحو 10 دقائق",
      name: "ميرا",
      role: "التوجيه",
      body: "حتى عشرة أسئلة في أربعة فصول قصيرة، مع فحص أمان طوال الوقت. تخرج بملخص واضح تحمله إلى مختص. توجيه، وليس تشخيصاً.",
      cta: "تعرّف على ميرا",
    },
    {
      kicker: "كل يوم · أقل من دقيقة",
      name: "لومينا",
      role: "المساحة اليومية",
      body: "فحص يومي ومفكرة خاصة. سبارك ينظّم يومك في حالة فرط الحركة وتشتت الانتباه، ومكتبة موارد معتمدة تدعم الاضطراب ثنائي القطب والذهان.",
      cta: "تعرّف على لومينا",
    },
    {
      kicker: "أسبوعياً وشهرياً · بموافقتك",
      name: "مختصك",
      role: "رعاية مستمرة",
      body: "يربطك فريق الرعاية بمختص مرخَّص. لا يرى إلا ما تشاركه، ويُنبَّه إذا ساءت المؤشرات، ويتخذ كل قرار.",
      cta: "كيف نحافظ على الأمان",
    },
  ],
  note: { text: "خاص في التصميم · بالعربية والإنجليزية", link: "كيف نحمي بياناتك" },
};

export const homeLoopCopy: Record<Lang, HomeLoopCopy> = { en, ar };
