import type { Lang } from "@/lib/i18n/config";
import type { PatientTrack } from "@/lib/api/patient-types";

/**
 * Home's right-hand panel adapts to the patient's track:
 *  - ADHD → Spark, a compact task list;
 *  - anyone else not yet oriented → Lumina as a simple chat;
 *  - bipolar, schizophrenia, psychosis → three articles picked for how they are doing.
 * "PSYCHOSIS" is accepted for the day Mira can orient to it; today it maps to the same content.
 *
 * The articles below are static. `ContentProvider` is the seam: swap `contentProvider` for one
 * that asks Lumina (or the backend) for personalised picks and nothing else changes.
 */
export type HomeTrack = PatientTrack | "PSYCHOSIS";
export type HomePanelMode = "chat" | "reads" | "spark";

/** Bipolar / schizophrenia / psychosis read; ADHD (when the backend grants Spark) plans with Spark; anyone else gets Lumina's chat. */
export function homePanelMode(track: HomeTrack, hasSpark = false): HomePanelMode {
  if (track === "BIPOLAR" || track === "SCHIZOPHRENIA" || track === "PSYCHOSIS") return "reads";
  return hasSpark ? "spark" : "chat";
}

/** Home shows exactly this many curated articles. */
export const HOME_ARTICLE_COUNT = 3;

export type Article = {
  id: string;
  minutes: number;
  tone: "teal" | "sage" | "gold" | "rose";
  title: string;
  summary: string;
  sections: { heading?: string; body: string }[];
};

export interface ContentProvider {
  articlesFor(track: HomeTrack, language: Lang): Article[];
}

type Bilingual = { en: Article; ar: Article };

const MOOD: Bilingual[] = [
  {
    en: {
      id: "sleep-rhythm", minutes: 3, tone: "teal", title: "Why a steady sleep rhythm matters",
      summary: "Sleep is one of the earliest places a change shows up — and one of the easiest to protect.",
      sections: [
        { body: "For many people who live with mood swings, changes in sleep are among the first signals that things are shifting. Needing much less sleep, or much more, is worth noticing." },
        { heading: "Small anchors help", body: "Going to bed and getting up at similar times — even on weekends — gives your body a steady beat. A wind-down routine and dimmer light in the last hour of the day can make that easier." },
        { heading: "Tell your care team", body: "If your sleep changes for several days in a row, mention it to your clinician. Logging your hours in your daily check-in makes that conversation much easier." },
      ],
    },
    ar: {
      id: "sleep-rhythm", minutes: 3, tone: "teal", title: "لماذا يهمّ إيقاع نوم ثابت",
      summary: "النوم من أوائل الأماكن التي يظهر فيها التغيّر — ومن أسهلها حمايةً.",
      sections: [
        { body: "لدى كثيرين ممن يعيشون مع تقلّبات المزاج، يكون تغيّر النوم من أولى الإشارات إلى أن شيئًا ما يتحوّل. الحاجة إلى نوم أقل بكثير أو أكثر بكثير أمر يستحق الانتباه." },
        { heading: "مراسٍ صغيرة تساعد", body: "النوم والاستيقاظ في أوقات متقاربة — حتى في العطلات — يمنح جسمك إيقاعًا ثابتًا. وروتين هدوء وإضاءة خافتة في آخر ساعة من اليوم قد يسهّلان ذلك." },
        { heading: "أخبر فريق رعايتك", body: "إذا تغيّر نومك عدة أيام متتالية فاذكر ذلك لمعالجك. وتسجيل ساعات نومك في الفحص اليومي يجعل هذا الحديث أسهل بكثير." },
      ],
    },
  },
  {
    en: {
      id: "early-signs", minutes: 4, tone: "gold", title: "Learning your own early signs",
      summary: "You know your patterns better than anyone. Naming them early gives you more choices.",
      sections: [
        { body: "Early signs are the small, personal changes that tend to come before a harder stretch: sleeping less, talking faster, spending more, pulling away, or losing your routine." },
        { heading: "Write yours down", body: "Think back to the last difficult period. What was the first thing you or someone close to you noticed? That is one of your early signs." },
        { heading: "Make a small plan", body: "Decide in advance who you will tell and what you will do first — an earlier bedtime, a call to your clinician, a quieter week. Plans made on a good day are easier to follow on a hard one." },
      ],
    },
    ar: {
      id: "early-signs", minutes: 4, tone: "gold", title: "تعلّم علاماتك المبكرة",
      summary: "أنت تعرف أنماطك أفضل من أي أحد. وتسميتها مبكرًا تمنحك خيارات أكثر.",
      sections: [
        { body: "العلامات المبكرة هي تغيّرات صغيرة وشخصية تسبق عادةً فترة أصعب: نوم أقل، أو كلام أسرع، أو إنفاق أكثر، أو ابتعاد عن الناس، أو فقدان الروتين." },
        { heading: "دوّن علاماتك", body: "تذكّر آخر فترة صعبة. ما أول ما لاحظتَه أنت أو شخص قريب منك؟ هذه إحدى علاماتك المبكرة." },
        { heading: "ضع خطة صغيرة", body: "قرّر مسبقًا من ستخبره وماذا ستفعل أولًا — نوم أبكر، أو اتصال بمعالجك، أو أسبوع أهدأ. الخطط التي تُوضع في يوم جيد يسهل اتباعها في يوم صعب." },
      ],
    },
  },
  {
    en: {
      id: "pacing", minutes: 3, tone: "sage", title: "Pacing your energy through the day",
      summary: "Steady beats intense. A few habits that keep energy from spiking and crashing.",
      sections: [
        { body: "When energy runs high it is tempting to do everything at once; when it runs low, nothing at all. Pacing means choosing a middle path on purpose." },
        { heading: "Plan in blocks", body: "Split the day into a few short blocks with a break after each. On high-energy days, stop the block on time. On low-energy days, do only the first small step." },
        { heading: "Protect the basics", body: "Regular meals, daylight, movement and a fixed bedtime are unglamorous — and they are the foundation everything else stands on." },
      ],
    },
    ar: {
      id: "pacing", minutes: 3, tone: "sage", title: "تنظيم طاقتك خلال اليوم",
      summary: "الثبات أفضل من الحدّة. عادات قليلة تمنع الطاقة من الارتفاع الحاد ثم الانهيار.",
      sections: [
        { body: "حين ترتفع الطاقة يغري أن تنجز كل شيء دفعة واحدة، وحين تنخفض لا شيء إطلاقًا. التنظيم يعني اختيار الطريق الوسط عن قصد." },
        { heading: "خطّط في فترات", body: "قسّم اليوم إلى فترات قصيرة تعقب كلًّا منها استراحة. في أيام الطاقة العالية أنهِ الفترة في وقتها. وفي أيام الطاقة المنخفضة اكتفِ بالخطوة الصغيرة الأولى." },
        { heading: "احمِ الأساسيات", body: "وجبات منتظمة وضوء النهار وحركة وموعد نوم ثابت أمور بسيطة — لكنها الأساس الذي يقوم عليه كل شيء آخر." },
      ],
    },
  },
];

const PSYCHOSIS: Bilingual[] = [
  {
    en: {
      id: "gentle-routine", minutes: 3, tone: "teal", title: "A gentle daily routine",
      summary: "A predictable day gives your mind fewer things to hold at once.",
      sections: [
        { body: "Routine is not about doing more. It is about making the day predictable, so your mind has fewer decisions to carry and more room to rest." },
        { heading: "Start with three anchors", body: "Pick three things that happen at about the same time each day — for example waking up, a meal, and going to bed. Add more only when these feel easy." },
        { heading: "Keep it kind", body: "Missing a day is not failing. Return to the anchors the next day. Ticking them off in your daily check-in helps you and your care team see what is working." },
      ],
    },
    ar: {
      id: "gentle-routine", minutes: 3, tone: "teal", title: "روتين يومي لطيف",
      summary: "اليوم المتوقَّع يترك لعقلك أشياء أقل ليحملها دفعة واحدة.",
      sections: [
        { body: "الروتين ليس أن تفعل أكثر، بل أن تجعل اليوم متوقَّعًا، فيحمل عقلك قرارات أقل ويجد مساحة أكبر للراحة." },
        { heading: "ابدأ بثلاث مراسٍ", body: "اختر ثلاثة أمور تحدث في وقت متقارب كل يوم — مثل الاستيقاظ ووجبة والنوم. لا تُضِف غيرها إلا حين تصبح هذه سهلة." },
        { heading: "كن لطيفًا مع نفسك", body: "تفويت يوم ليس فشلًا. عُد إلى المراسي في اليوم التالي. وتسجيلها في فحصك اليومي يساعدك ويساعد فريق رعايتك على رؤية ما ينفع." },
      ],
    },
  },
  {
    en: {
      id: "grounding", minutes: 3, tone: "sage", title: "Grounding when things feel unusual",
      summary: "Simple ways to come back to the present when thoughts or senses feel overwhelming.",
      sections: [
        { body: "Sometimes thoughts race, sounds seem louder, or things feel unreal. Grounding gently brings your attention back to the room you are actually in." },
        { heading: "Try 5-4-3-2-1", body: "Name five things you can see, four you can touch, three you can hear, two you can smell and one you can taste. Go slowly." },
        { heading: "Reach out", body: "If these experiences are new, stronger, or frightening, contact your clinician or someone you trust. If you feel unsafe, call your local emergency number right away." },
      ],
    },
    ar: {
      id: "grounding", minutes: 3, tone: "sage", title: "التأريض حين تبدو الأمور غير مألوفة",
      summary: "طرق بسيطة للعودة إلى اللحظة الحاضرة حين تربكك الأفكار أو الحواس.",
      sections: [
        { body: "أحيانًا تتسارع الأفكار أو تبدو الأصوات أعلى أو تبدو الأشياء غير حقيقية. يعيد التأريض انتباهك بلطف إلى الغرفة التي أنت فيها فعلًا." },
        { heading: "جرّب 5-4-3-2-1", body: "سمِّ خمسة أشياء تراها وأربعة تلمسها وثلاثة تسمعها واثنين تشمّهما وواحدًا تتذوقه. تمهّل." },
        { heading: "اطلب العون", body: "إذا كانت هذه التجارب جديدة أو أقوى أو مخيفة فتواصل مع معالجك أو شخص تثق به. وإذا شعرتَ بعدم الأمان فاتصل برقم الطوارئ المحلي فورًا." },
      ],
    },
  },
  {
    en: {
      id: "connection", minutes: 3, tone: "gold", title: "Staying connected, without pressure",
      summary: "Connection can be small, on your terms, and still count.",
      sections: [
        { body: "It is common to want more quiet when things are hard. It is also common for isolation to make things heavier. The goal is not more socialising — it is a little contact that feels safe." },
        { heading: "Make it small", body: "A short message, a walk with someone, or sitting in the same room counts. Choose the smallest version that feels okay today." },
        { heading: "Choose your people", body: "Think of one or two people who listen without judging. You can tell them what helps and what does not." },
      ],
    },
    ar: {
      id: "connection", minutes: 3, tone: "gold", title: "البقاء على تواصل دون ضغط",
      summary: "يمكن للتواصل أن يكون صغيرًا وبشروطك وأن يظل مهمًّا.",
      sections: [
        { body: "من الشائع أن ترغب في مزيد من الهدوء حين تصعب الأمور، ومن الشائع أيضًا أن تزيد العزلة الأمر ثقلًا. الهدف ليس مزيدًا من الاختلاط، بل قدر قليل من التواصل الذي تشعر معه بالأمان." },
        { heading: "اجعله صغيرًا", body: "رسالة قصيرة أو مشي مع شخص أو الجلوس في الغرفة نفسها كلها تُحتسب. اختر أصغر صيغة تناسبك اليوم." },
        { heading: "اختر من حولك", body: "فكّر في شخص أو اثنين يصغيان دون حكم. يمكنك أن تخبرهما بما يساعدك وما لا يساعدك." },
      ],
    },
  },
];

export const contentProvider: ContentProvider = {
  articlesFor(track, language) {
    const source = track === "BIPOLAR" ? MOOD : PSYCHOSIS;
    return source.slice(0, HOME_ARTICLE_COUNT).map((item) => item[language]);
  },
};
