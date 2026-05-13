export type Lang = "en" | "fr" | "ar";

export const LANGS: {
  code: Lang;
  label: string;
  flag: string;
  bcp47: string;
  dir: "ltr" | "rtl";
}[] = [
    { code: "en", label: "English", flag: "EN", bcp47: "en-US", dir: "ltr" },
    { code: "fr", label: "Français", flag: "FR", bcp47: "fr-FR", dir: "ltr" },
    { code: "ar", label: "العربية", flag: "AR", bcp47: "ar-TN", dir: "rtl" },
  ];

export const copy = {
  en: {
    brand: "VitaMind",
    nav: {
      badge: "Dynamic Mental Health Interface",
      signIn: "Sign in",
      signUp: "Create account",
      diagnostic: "Open diagnostic",
      backHome: "Back home",
    },
    home: {
      eyebrow: "Mental Health Diagnostic Assistant",
      titleA: "Meet VitaMind,",
      titleB: "your first step",
      titleC: "toward clarity",
      subtitle:
        "A calm, guided conversation space that helps users describe how they feel before a formal clinical evaluation.",
      chips: ["ADHD · ASRS-v1.1", "Bipolar · MDQ", "Psychosis · PQ-B", "Anxiety · GAD-7"],
      cta: "Start a diagnostic session",
      secondaryCta: "Create your account",
      disclaimer:
        "Not a medical diagnosis. VitaMind is a guidance experience and should complement licensed care.",
      featureTitle: "A more human first contact",
      featureBody:
        "Voice-ready, multilingual, and built to make the first step feel safer instead of colder.",
      previewTop: "Private conversational flow",
      previewBottom: "Session-ready UX for a modern mental wellness product.",
    },
    auth: {
      badge: "Secure wellness access",
      titleSignIn: "Welcome back",
      titleSignUp: "Create your sanctuary",
      subtitleSignIn: "Sign in to continue your guided diagnostic journey.",
      subtitleSignUp: "Build your account and start a calmer, more personalized experience.",
      nickname: "Nickname",
      nicknamePlaceholder: "Choose your nickname",
      email: "Email",
      emailPlaceholder: "hello@example.com",
      phone: "Phone number",
      phonePlaceholder: "+1 555 123 4567",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      signInButton: "Enter VitaMind",
      signUpButton: "Create my account",
      switchToSignIn: "Already have an account?",
      switchToSignUp: "Need an account?",
      switchSignInLink: "Sign in",
      switchSignUpLink: "Sign up",
      helperTitle: "Designed for trust",
      helperBody:
        "Clear visual hierarchy, gentle gradients, and a reassuring pace make the auth flow feel premium and calm.",
      highlights: ["Nickname-based access", "Lightweight onboarding", "Diagnostic session ready"],
      legal: "By continuing, you agree to use this experience responsibly and seek professional care when needed.",
      errors: {
        nickname: "Nickname is required.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone number.",
        password: "Password must contain at least 8 characters.",
        confirmPassword: "Passwords do not match.",
      },
    },
    diagnostic: {
      title: "Diagnostic session",
      subtitle: "A private guided conversation with Mira.",
      confidential: "Confidential interface · Non-medical guidance",
      restart: "Restart",
      mute: "Mute voice",
      unmute: "Enable voice",
      session: "Session ID",
      placeholder: "Type your answer…",
      send: "Send",
      thinking: "Mira is reflecting…",
      preparing: "Preparing your diagnostic session…",
      welcome:
        "Hello, I'm Mira. We'll talk for a few minutes. Take your time, there are no wrong answers. How have you been feeling lately?",
      closing:
        "Thank you for sharing this with me. Here is your orientation. Please remember that this is not a medical diagnosis.",
      orientation: "Orientation summary",
      profile: "Matching profile",
      confidenceLabel: "Match level",
      signals: "Key signals",
      next: "Suggested next step",
      medicalNote:
        "This result is only indicative. For any urgent concern, contact a licensed clinician or your local emergency services.",
      panelTitle: "How this session works",
      panelPoints: [
        "The chat collects a few guided answers.",
        "Language can change at any time.",
        "The generated session ID helps track the current flow.",
      ],
      sideCardTitle: "Care-first design",
      sideCardBody:
        "The diagnostic area is intentionally softer, more spacious, and less modal so it feels like a destination page rather than a popup.",
    },
    subscription: {
      selectPlan: "Choose your plan",
      mainHeading: "Choose your path",
      mainSubheading: "to wellness.",
      mainDescription: "Select the plan that fits your journey. All plans include a 7-day free trial.",
      popular: "Popular",
      features: "Features",
      basic: {
        name: "Basic",
        desc: "Essential tools for personal wellness.",
        features: [
          "3 diagnostic sessions/month",
          "Journal with text entries",
          "Session history & insights",
          "Email support",
        ],
        cta: "Choose Basic",
      },
      pro: {
        name: "Pro",
        desc: "Advanced therapeutic experience.",
        features: [
          "Unlimited diagnostic sessions",
          "Journal with voice & text",
          "Mira voice conversations",
          "Pattern analysis & reports",
          "Priority support",
        ],
        cta: "Choose Pro",
      },
      parents: {
        name: "Parents",
        desc: "For parents & family wellness.",
        features: [
          "All Pro features",
          "Up to 4 family profiles",
          "Family insights dashboard",
          "Shared journal option",
          "24/7 dedicated support",
        ],
        cta: "Choose Parents",
      },
      trialInfo: "Secure payment · Cancel anytime · 7-day free trial on all plans",
      ctaTitle: "Start your free trial.",
      ctaSubtitle: "No commitment. Cancel anytime.",
      ctaDescription: "Every plan includes 7 days free. Experience the full therapeutic journey with no risk.",
      continueToDashboard: "Continue to dashboard",
      securePrivate: "Secure & private",
      signIn: "Sign in",
    },
    dashboard: {
      welcome: "Welcome back",
      subtitle: "Your wellness space",
      description: "This is your private area. Journal, review past sessions, track your emotional patterns, and manage your subscription — all in one calm, cinematic interface.",
      open: "Open",
      quickActions: {
        writeJournal: "Write journal",
        journalDesc: "Express your thoughts freely",
        newConsultation: "New consultation",
        consultationDesc: "Start a guided session",
        viewHistory: "View history",
        historyDesc: "Review your progress",
      },
      sidebar: {
        welcome: "Welcome",
        journal: "Journal",
        history: "History",
        consultation: "Consultation",
        profile: "Profile",
        subscription: "Subscription",
        backHome: "Back home",
      },
      today: "Today",
      noEntry: "No journal entry yet today",
    },
  },
  fr: {
    brand: "VitaMind",
    nav: {
      badge: "Interface santé mentale dynamique",
      signIn: "Connexion",
      signUp: "Créer un compte",
      diagnostic: "Ouvrir le diagnostic",
      backHome: "Retour accueil",
    },
    home: {
      eyebrow: "Assistant de diagnostic en santé mentale",
      titleA: "Découvrez VitaMind,",
      titleB: "votre première étape",
      titleC: "vers plus de clarté",
      subtitle:
        "Un espace de conversation guidé et apaisant pour aider les utilisateurs à exprimer leur état avant une évaluation clinique formelle.",
      chips: ["TDAH · ASRS-v1.1", "Bipolaire · MDQ", "Psychose · PQ-B", "Anxiété · GAD-7"],
      cta: "Démarrer une session diagnostic",
      secondaryCta: "Créer votre compte",
      disclaimer:
        "Ce n’est pas un diagnostic médical. VitaMind est une expérience d’orientation qui complète un accompagnement professionnel.",
      featureTitle: "Un premier contact plus humain",
      featureBody:
        "Compatible voix, multilingue et conçu pour rendre la première étape plus rassurante et plus fluide.",
      previewTop: "Parcours conversationnel privé",
      previewBottom: "Une UX prête pour un produit bien-être moderne.",
    },
    auth: {
      badge: "Accès bien-être sécurisé",
      titleSignIn: "Bon retour",
      titleSignUp: "Créez votre espace",
      subtitleSignIn: "Connectez-vous pour poursuivre votre parcours diagnostic guidé.",
      subtitleSignUp: "Créez votre compte pour démarrer une expérience plus sereine et personnalisée.",
      nickname: "Pseudo",
      nicknamePlaceholder: "Choisissez votre pseudo",
      email: "E-mail",
      emailPlaceholder: "bonjour@exemple.com",
      phone: "Numéro de téléphone",
      phonePlaceholder: "+33 6 12 34 56 78",
      password: "Mot de passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Répétez votre mot de passe",
      signInButton: "Entrer dans VitaMind",
      signUpButton: "Créer mon compte",
      switchToSignIn: "Vous avez déjà un compte ?",
      switchToSignUp: "Vous avez besoin d’un compte ?",
      switchSignInLink: "Se connecter",
      switchSignUpLink: "S’inscrire",
      helperTitle: "Pensé pour inspirer confiance",
      helperBody:
        "Hiérarchie claire, dégradés doux et rythme visuel apaisant donnent au parcours d’authentification une vraie qualité premium.",
      highlights: ["Connexion par pseudo", "Onboarding léger", "Prêt pour une session diagnostic"],
      legal:
        "En continuant, vous acceptez d’utiliser cette expérience de manière responsable et de consulter un professionnel si nécessaire.",
      errors: {
        nickname: "Le pseudo est requis.",
        email: "Veuillez saisir une adresse e-mail valide.",
        phone: "Veuillez saisir un numéro de téléphone valide.",
        password: "Le mot de passe doit contenir au moins 8 caractères.",
        confirmPassword: "Les mots de passe ne correspondent pas.",
      },
    },
    diagnostic: {
      title: "Session diagnostic",
      subtitle: "Une conversation guidée et privée avec Mira.",
      confidential: "Interface confidentielle · Orientation non médicale",
      restart: "Recommencer",
      mute: "Couper la voix",
      unmute: "Activer la voix",
      session: "ID de session",
      placeholder: "Écrivez votre réponse…",
      send: "Envoyer",
      thinking: "Mira réfléchit…",
      preparing: "Préparation de votre session diagnostic…",
      welcome:
        "Bonjour, je suis Mira. Nous allons échanger quelques minutes. Prenez votre temps, il n’y a pas de mauvaise réponse. Comment vous sentez-vous en ce moment ?",
      closing:
        "Merci pour votre confiance. Voici votre orientation. Souvenez-vous que ceci ne constitue pas un diagnostic médical.",
      orientation: "Résumé d’orientation",
      profile: "Profil correspondant",
      confidenceLabel: "Niveau de correspondance",
      signals: "Signaux clés",
      next: "Prochaine étape suggérée",
      medicalNote:
        "Ce résultat est seulement indicatif. En cas d’urgence ou d’inquiétude importante, consultez un professionnel de santé ou les urgences locales.",
      panelTitle: "Comment fonctionne cette session",
      panelPoints: [
        "Le chat recueille quelques réponses guidées.",
        "La langue peut changer à tout moment.",
        "L’ID généré aide à suivre la session active.",
      ],
      sideCardTitle: "Un design pensé pour le soin",
      sideCardBody:
        "La zone diagnostic est volontairement plus spacieuse et moins modale afin de ressembler à une vraie page de destination.",
    },
    subscription: {
      selectPlan: "Choisissez votre plan",
      mainHeading: "Choisissez votre voie",
      mainSubheading: "vers le bien-être.",
      mainDescription: "Sélectionnez le plan qui correspond à votre parcours. Tous les plans incluent un essai gratuit de 7 jours.",
      popular: "Populaire",
      features: "Fonctionnalités",
      basic: {
        name: "Basique",
        desc: "Outils essentiels pour votre bien-être.",
        features: [
          "3 sessions diagnostic/mois",
          "Journal avec entrées texte",
          "Historique des sessions et aperçus",
          "Support par email",
        ],
        cta: "Choisir Basique",
      },
      pro: {
        name: "Pro",
        desc: "Expérience thérapeutique avancée.",
        features: [
          "Sessions diagnostiques illimitées",
          "Journal avec voix et texte",
          "Conversations vocales avec Mira",
          "Analyse des tendances et rapports",
          "Support prioritaire",
        ],
        cta: "Choisir Pro",
      },
      parents: {
        name: "Parents",
        desc: "Pour le bien-être des parents et de la famille.",
        features: [
          "Toutes les fonctionnalités Pro",
          "Jusqu'à 4 profils familiaux",
          "Tableau de bord des aperçus familiaux",
          "Option de journal partagé",
          "Support dédié 24/7",
        ],
        cta: "Choisir Parents",
      },
      trialInfo: "Paiement sécurisé · Annulation à tout moment · Essai gratuit de 7 jours sur tous les plans",
      ctaTitle: "Commencez votre essai gratuit.",
      ctaSubtitle: "Aucun engagement. Annulation à tout moment.",
      ctaDescription: "Chaque plan comprend 7 jours gratuits. Expérimentez le parcours thérapeutique complet sans risque.",
      continueToDashboard: "Continuer vers le tableau de bord",
      securePrivate: "Sécurisé et privé",
      signIn: "Se connecter",
    },
    dashboard: {
      welcome: "Bienvenue",
      subtitle: "Votre espace bien-être",
      description: "C'est votre espace privé. Rédigez dans votre journal, révisez vos sessions précédentes, suivez vos tendances émotionnelles et gérez votre abonnement — tout en un seul endroit calme et cinématique.",
      open: "Ouvrir",
      quickActions: {
        writeJournal: "Écrire un journal",
        journalDesc: "Exprimez vos pensées librement",
        newConsultation: "Nouvelle consultation",
        consultationDesc: "Commencer une session guidée",
        viewHistory: "Voir l'historique",
        historyDesc: "Passez en revue votre progression",
      },
      sidebar: {
        welcome: "Bienvenue",
        journal: "Journal",
        history: "Historique",
        consultation: "Consultation",
        profile: "Profil",
        subscription: "Abonnement",
        backHome: "Retour accueil",
      },
      today: "Aujourd'hui",
      noEntry: "Aucune entrée de journal pour aujourd'hui",
    },
  },
  ar: {
    brand: "VitaMind",
    nav: {
      badge: "واجهة صحة نفسية ديناميكية",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      diagnostic: "فتح التشخيص",
      backHome: "الرجوع للرئيسية",
    },
    home: {
      eyebrow: "مساعد التشخيص النفسي",
      titleA: "اكتشف VitaMind،",
      titleB: "أول خطوة",
      titleC: "نحو وضوح أكثر",
      subtitle:
        "مساحة محادثة هادئة وموجّهة تساعد المستخدم على التعبير عن حالته قبل التقييم السريري الرسمي.",
      chips: ["ADHD · ASRS-v1.1", "ثنائي القطب · MDQ", "الذهان · PQ-B", "القلق · GAD-7"],
      cta: "ابدأ جلسة التشخيص",
      secondaryCta: "إنشاء حساب",
      disclaimer:
        "هذا ليس تشخيصاً طبياً. VitaMind تجربة توجيهية تكمل الرعاية المهنية ولا تستبدلها.",
      featureTitle: "بداية أكثر إنسانية",
      featureBody:
        "متعدد اللغات، يدعم الصوت، ومصمم ليجعل الخطوة الأولى أكثر طمأنينة وسلاسة.",
      previewTop: "تجربة محادثة خاصة",
      previewBottom: "واجهة جاهزة لمنتج عافية عصري.",
    },
    auth: {
      badge: "دخول آمن لمساحة العافية",
      titleSignIn: "مرحباً بعودتك",
      titleSignUp: "أنشئ مساحتك",
      subtitleSignIn: "سجّل الدخول لمتابعة رحلة التشخيص الموجّهة.",
      subtitleSignUp: "أنشئ حسابك لبدء تجربة أكثر هدوءاً وتخصيصاً.",
      nickname: "الاسم المستعار",
      nicknamePlaceholder: "اختر اسماً مستعاراً",
      email: "البريد الإلكتروني",
      emailPlaceholder: "hello@example.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "+216 12 345 678",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أعد كتابة كلمة المرور",
      signInButton: "الدخول إلى VitaMind",
      signUpButton: "إنشاء الحساب",
      switchToSignIn: "لديك حساب بالفعل؟",
      switchToSignUp: "تحتاج إلى حساب؟",
      switchSignInLink: "تسجيل الدخول",
      switchSignUpLink: "إنشاء حساب",
      helperTitle: "مصمم ليبني الثقة",
      helperBody:
        "تدرج بصري واضح، ألوان هادئة، وإيقاع مريح يجعل تجربة الدخول أكثر أناقة وطمأنينة.",
      highlights: ["دخول بالاسم المستعار", "تهيئة سريعة", "جاهز لجلسة التشخيص"],
      legal:
        "بالمتابعة، أنت توافق على استخدام هذه التجربة بشكل مسؤول وطلب المساعدة المهنية عند الحاجة.",
      errors: {
        nickname: "الاسم المستعار مطلوب.",
        email: "يرجى إدخال بريد إلكتروني صالح.",
        phone: "يرجى إدخال رقم هاتف صالح.",
        password: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.",
        confirmPassword: "كلمتا المرور غير متطابقتين.",
      },
    },
    diagnostic: {
      title: "جلسة التشخيص",
      subtitle: "محادثة خاصة وموجّهة مع ميرا.",
      confidential: "واجهة سرية · توجيه غير طبي",
      restart: "إعادة البدء",
      mute: "كتم الصوت",
      unmute: "تفعيل الصوت",
      session: "معرّف الجلسة",
      placeholder: "اكتب إجابتك…",
      send: "إرسال",
      thinking: "ميرا تفكر…",
      preparing: "جاري تحضير جلسة التشخيص…",
      welcome:
        "مرحباً، أنا ميرا. سنتحدث لبضع دقائق. خذ وقتك، لا توجد إجابات خاطئة. كيف تشعر هذه الأيام؟",
      closing:
        "شكراً لمشاركتك. هذه هي خلاصة التوجيه. تذكّر أن هذا ليس تشخيصاً طبياً.",
      orientation: "ملخص التوجيه",
      profile: "الملف الأقرب",
      confidenceLabel: "مستوى التطابق",
      signals: "الإشارات الأساسية",
      next: "الخطوة التالية المقترحة",
      medicalNote:
        "هذه النتيجة إرشادية فقط. عند وجود قلق مهم أو حالة طارئة، تواصل مع مختص أو خدمات الطوارئ المحلية.",
      panelTitle: "كيف تعمل هذه الجلسة",
      panelPoints: [
        "المحادثة تجمع بعض الإجابات الموجّهة.",
        "يمكن تغيير اللغة في أي وقت.",
        "المعرّف المُنشأ يساعد على تتبع الجلسة الحالية.",
      ],
      sideCardTitle: "تصميم يضع الرعاية أولاً",
      sideCardBody:
        "منطقة التشخيص أكثر اتساعاً وأقل شبهًا بالنافذة المنبثقة حتى تبدو كصفحة حقيقية مريحة.",
    },
    subscription: {
      selectPlan: "اختر خطتك",
      mainHeading: "اختر طريقك",
      mainSubheading: "نحو العافية.",
      mainDescription: "اختر الخطة التي تناسب رحلتك. جميع الخطط تشمل تجربة مجانية لمدة 7 أيام.",
      popular: "الأكثر شيوعاً",
      features: "الميزات",
      basic: {
        name: "أساسي",
        desc: "الأدوات الأساسية لعافيتك الشخصية.",
        features: [
          "3 جلسات تشخيص/الشهر",
          "مذكرة مع إدخالات نصية",
          "سجل الجلسات والرؤى",
          "دعم البريد الإلكتروني",
        ],
        cta: "اختر أساسي",
      },
      pro: {
        name: "احترافي",
        desc: "تجربة علاجية متقدمة.",
        features: [
          "جلسات تشخيصية غير محدودة",
          "مذكرة مع صوت ونص",
          "محادثات صوتية مع ميرا",
          "تحليل الأنماط والتقارير",
          "دعم الأولويات",
        ],
        cta: "اختر احترافي",
      },
      parents: {
        name: "الآباء",
        desc: "لعافية الآباء والأسرة.",
        features: [
          "جميع ميزات الخطة الاحترافية",
          "ما يصل إلى 4 ملفات أسرية",
          "لوحة معلومات رؤى الأسرة",
          "خيار المذكرة المشتركة",
          "دعم مخصص 24/7",
        ],
        cta: "اختر الآباء",
      },
      trialInfo: "دفع آمن · إلغاء في أي وقت · تجربة مجانية لمدة 7 أيام لجميع الخطط",
      ctaTitle: "ابدأ تجربتك المجانية.",
      ctaSubtitle: "بدون التزام. إلغاء في أي وقت.",
      ctaDescription: "تتضمن كل خطة 7 أيام مجانية. جرب الرحلة العلاجية الكاملة بدون مخاطر.",
      continueToDashboard: "الاستمرار إلى لوحة التحكم",
      securePrivate: "آمن وخاص",
      signIn: "تسجيل الدخول",
    },
    dashboard: {
      welcome: "أهلا بعودتك",
      subtitle: "مساحة العافية الخاصة بك",
      description: "هذا هو مساحتك الخاصة. احتفظ بمذكرتك، راجع الجلسات السابقة، تابع أنماطك العاطفية، وأدر اشتراكك — كل شيء في مكان واحد هادئ وسينمائي.",
      open: "فتح",
      quickActions: {
        writeJournal: "كتابة المذكرة",
        journalDesc: "عبر عن أفكارك بحرية",
        newConsultation: "استشارة جديدة",
        consultationDesc: "ابدأ جلسة موجهة",
        viewHistory: "عرض السجل",
        historyDesc: "راجع تقدمك",
      },
      sidebar: {
        welcome: "مرحبا",
        journal: "المذكرة",
        history: "السجل",
        consultation: "الاستشارة",
        profile: "الملف الشخصي",
        subscription: "الاشتراك",
        backHome: "الرجوع للرئيسية",
      },
      today: "اليوم",
      noEntry: "لا توجد مدخلات مذكرة لهذا اليوم",
    },
  },
} as const;

export function getDirection(lang: Lang) {
  return LANGS.find((item) => item.code === lang)?.dir ?? "ltr";
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesLoaded = false;

function getSpeechVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) voicesLoaded = true;
  return voices;
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = getSpeechVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const handler = () => {
      const updated = getSpeechVoices();
      if (updated.length > 0) {
        resolve(updated);
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
    window.speechSynthesis.onvoiceschanged = handler;
    setTimeout(() => {
      const fallback = getSpeechVoices();
      resolve(fallback);
      window.speechSynthesis.onvoiceschanged = null;
    }, 3000);
  });
}

/** Warm up speech synthesis — call on first user gesture to bypass Chrome autoplay policy */
export function warmUpSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const dummy = new SpeechSynthesisUtterance("");
    dummy.volume = 0;
    window.speechSynthesis.speak(dummy);
    window.speechSynthesis.cancel();
  } catch { /* ignore */ }
}

export function speak(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    const target = LANGS.find((item) => item.code === lang)?.bcp47 ?? "en-US";
    utterance.lang = target;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = getSpeechVoices();
    if (voices.length > 0) {
      const langPrefix = target.split("-")[0];
      const matchedVoice =
        voices.find((voice) => voice.lang.toLowerCase() === target.toLowerCase()) ||
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith(langPrefix) &&
          voice.lang.includes("-"),
        ) ||
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith(langPrefix),
        );
      if (matchedVoice) utterance.voice = matchedVoice;
    }

    utterance.onend = () => { currentUtterance = null; };
    utterance.onerror = () => { currentUtterance = null; };

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn("Speech synthesis unavailable", error);
  }
}

export async function speakWithVoices(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  if (voicesLoaded) {
    speak(text, lang);
    return;
  }

  const voices = await loadVoices();
  if (voices.length > 0) voicesLoaded = true;
  speak(text, lang);
}

export function stopSpeaking() {
  currentUtterance = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export const t = (lang: Lang) => copy[lang];
