import type { Lang } from "@/lib/i18n/config";

/**
 * Copy for the home page's section for clinics, hospitals and health authorities. It only says what the sections above
 * do not: who stays in charge, how patient information is governed, and what happens with a serious case. What
 * VitaMind is and what each side gets live in the hero and the bridge; the full trust pillars live on /trust.
 * `ar` is typed against the same shape as `en`. Every claim describes behaviour that exists in the product; AI guides
 * and flags, a licensed professional decides.
 */

type Pair = readonly [title: string, line: string];

export type HealthcareCopy = {
  /** Short label for the section rail. */
  rail: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  intro: string;
  /** What the professional does, in a few short lines. */
  charge: { title: string; points: readonly string[] };
  /** How patient information is governed, in three lines, and the link that opens the full page. */
  governance: { title: string; points: readonly string[]; link: string };
  escalation: { title: string; intro: string; stepLabel: string; steps: readonly Pair[] };
  /** Words inside the small illustrative previews (report, alert). */
  mock: { report: string; acknowledged: string; due: string };
};

const en: HealthcareCopy = {
  rail: "For clinicians",
  eyebrow: "For clinicians and health authorities",
  titleA: "AI guides and flags.",
  titleB: "The professional decides.",
  intro: "Everything VitaMind produces is built to be reviewed. A serious signal is never left to AI alone.",
  charge: {
    title: "The professional stays in charge",
    points: [
      "Receives weekly and monthly reports, each with its evidence and limits",
      "Reviews and acknowledges every report",
      "Adds notes and assigns exercises",
      "Makes every diagnostic and treatment decision",
    ],
  },
  governance: {
    title: "Patient information, governed",
    points: [
      "Shared by category, only with the patient's consent",
      "A pseudonymous patient code until care begins",
      "Every clinician and administrator access is logged",
    ],
    link: "Read how we protect patient information",
  },
  escalation: {
    title: "When a case is serious",
    intro: "Safety checks run throughout.",
    stepLabel: "Step",
    steps: [
      ["Detected", "A safety check flags an urgent signal."],
      ["Support shown", "The patient sees calm guidance and emergency resources."],
      ["Clinician alerted", "Logged with a response deadline."],
      ["A human follows up", "Unanswered items escalate to the clinic administrator."],
    ],
  },
  mock: { report: "Weekly report", acknowledged: "Reviewed · acknowledged", due: "Response due" },
};

const ar: HealthcareCopy = {
  rail: "للمختصين",
  eyebrow: "للمختصين والجهات الصحية",
  titleA: "الذكاء الاصطناعي يوجّه وينبّه.",
  titleB: "والمختص هو من يقرّر.",
  intro: "كل ما تنتجه VitaMind مصمَّم ليُراجَع. ولا تُترك الإشارة الخطيرة للذكاء الاصطناعي وحده.",
  charge: {
    title: "المختص هو المسؤول",
    points: [
      "يتلقى تقارير أسبوعية وشهرية، لكل منها أدلتها وحدودها",
      "يراجع كل تقرير ويؤكد استلامه",
      "يضيف الملاحظات ويُسند التمارين",
      "يتخذ كل قرار تشخيصي وعلاجي",
    ],
  },
  governance: {
    title: "معلومات المريض، بضوابط",
    points: [
      "تُشارَك حسب الفئة، وبموافقة المريض فقط",
      "رمز مريض مستعار إلى أن تبدأ الرعاية",
      "يُسجَّل كل وصول من المختصين والمسؤولين",
    ],
    link: "اقرأ كيف نحمي معلومات المرضى",
  },
  escalation: {
    title: "حين تكون الحالة خطيرة",
    intro: "فحوص الأمان تعمل طوال الوقت.",
    stepLabel: "الخطوة",
    steps: [
      ["الرصد", "فحص الأمان يرصد إشارة عاجلة."],
      ["إظهار الدعم", "يرى المريض إرشاداً هادئاً وموارد الطوارئ."],
      ["تنبيه المختص", "يُسجَّل الحدث بمهلة للاستجابة."],
      ["يتابع إنسان", "ما لا يُجاب عنه يُصعَّد إلى مدير العيادة."],
    ],
  },
  mock: { report: "التقرير الأسبوعي", acknowledged: "تمت المراجعة والتأكيد", due: "مهلة الاستجابة" },
};

export const healthcareCopy: Record<Lang, HealthcareCopy> = { en, ar };
