"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  HeartHandshake,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { createChatId } from "@/lib/chat";
import { speak, stopSpeaking, type Lang } from "@/lib/i18n";

// --- Types ---
type Message = { role: "user" | "assistant"; content: string };

type Result = {
  primary: string;
  confidence: string;
  summary: string;
  signals: string[];
  recommendation: string;
};

// --- Composant Indicateur de Frappe (Pro) ---
const TypingIndicator = () => (
  <div className="flex gap-1.5 px-2 py-3 items-center h-10">
    <motion.span
      className="block w-2 h-2 bg-neutral-400 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
    />
    <motion.span
      className="block w-2 h-2 bg-neutral-400 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
    />
    <motion.span
      className="block w-2 h-2 bg-neutral-400 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

// --- Logique Mock (Inchangée mais nettoyée) ---
function getStaticResponse(messages: Message[], lang: Lang): {
  response: string;
  result?: Result;
} {
  const userMessages = messages.filter((message) => message.role === "user");

  if (userMessages.length >= 3) {
    if (lang === "ar") {
      return {
        response: "شكراً لمشاركتك هذا معي. هذا ملخص موجز لجلسة اليوم.",
        result: {
          primary: "قلق خفيف إلى متوسط",
          confidence: "متوسط",
          summary:
            "من خلال المحادثة، تظهر مؤشرات على قلق مرتبط بضغوط حديثة مع صعوبة متكررة في التركيز وبعض الاضطراب في النوم.",
          signals: [
            "صعوبة متكررة في التركيز",
            "توتر داخلي مستمر",
            "اضطراب متقطع في النوم",
            "إجهاد ذهني متكرر",
          ],
          recommendation:
            "قد يكون من المفيد التحدث مع أخصائي نفسي لإجراء تقييم أعمق، مع اعتماد تمارين تنفس وتهدئة خلال اليوم.",
        },
      };
    }

    if (lang === "fr") {
      return {
        response: "Merci pour votre partage. Voici une synthèse courte de cette session.",
        result: {
          primary: "Anxiété légère à modérée",
          confidence: "modérée",
          summary:
            "La conversation fait ressortir un terrain anxieux probablement lié à des stresseurs récents, avec fatigue mentale et difficultés de concentration.",
          signals: [
            "Difficulté de concentration fréquente",
            "Charge mentale persistante",
            "Sommeil parfois perturbé",
            "Tension émotionnelle diffuse",
          ],
          recommendation:
            "Une consultation avec un psychologue ou un professionnel de santé mentale pourrait vous aider à approfondir cette première orientation.",
        },
      };
    }

    return {
      response: "Thank you for opening up. Here is a short synthesis of this session.",
      result: {
        primary: "Mild to moderate anxiety",
        confidence: "moderate",
        summary:
          "The discussion suggests anxiety-related stress with recurring mental overload, concentration difficulty, and occasional sleep disruption.",
        signals: [
          "Frequent difficulty concentrating",
          "Persistent cognitive tension",
          "Intermittent sleep disruption",
          "Elevated worry response",
        ],
        recommendation:
          "Consider a conversation with a licensed mental health professional and combine it with breathing or grounding techniques in the short term.",
      },
    };
  }

  const followUps: Record<Lang, string[]> = {
    ar: [
      "أنا أستمع لك. هل تقدر تحكيلي أكثر على شعورك هذه الفترة؟",
      "منذ متى بدأت هذه الأحاسيس أو الأعراض؟",
      "كيف تؤثر هذه الحالة على يومك أو نومك أو تركيزك؟",
    ],
    fr: [
      "Je vous écoute. Pouvez-vous m'en dire plus sur ce que vous ressentez en ce moment ?",
      "Depuis quand ces sensations ou ces symptômes sont-ils présents ?",
      "Comment cela influence-t-il vos journées, votre sommeil ou votre concentration ?",
    ],
    en: [
      "I'm listening. Can you tell me more about what you're feeling lately?",
      "How long have these sensations or symptoms been present?",
      "How is this affecting your days, sleep, or concentration?",
    ],
  };

  const responses = followUps[lang] ?? followUps.en;
  const index = Math.min(Math.max(userMessages.length - 1, 0), responses.length - 1);

  return { response: responses[index] };
}

export function ChatExperience({ chatId }: { chatId: string }) {
  const router = useRouter();
  const { dictionary, language, direction } = useLanguage();
  const diagnostic = dictionary.diagnostic;
  const { isSoundEnabled } = useAudio();

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: diagnostic.welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const welcomedRef = useRef(false);

  // CSS scrollbar hiding via className
  const hideScrollbar = "scrollbar-hide -mx-4 px-4";

  const displayedMessages =
    messages.length <= 1 && !result
      ? [{ role: "assistant" as const, content: diagnostic.welcome }]
      : messages;

  // --- Effets Audio & Scroll (Logique préservée) ---
  useEffect(() => {
    if (welcomedRef.current) return;
    welcomedRef.current = true;
    const playWelcome = () => {
      if (isSoundEnabled) speak(diagnostic.welcome, language);
    };
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.getVoices().length === 0) {
        const handleVoicesChanged = () => {
          playWelcome();
          window.speechSynthesis.onvoiceschanged = null;
        };
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
        window.setTimeout(playWelcome, 650);
      } else {
        playWelcome();
      }
    }
    return () => stopSpeaking();
  }, [diagnostic.welcome, language, isSoundEnabled]);

  useEffect(() => {
    if (messages.length <= 1 && !result && isSoundEnabled) {
      speak(diagnostic.welcome, language);
    }
  }, [diagnostic.welcome, language, messages.length, isSoundEnabled, result]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [loading, messages, isTyping, result]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  // --- Logique d'envoi avec animation "Typing" ---
  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);
    setIsTyping(true);

    // Simulation latence réseau + réflexion
    await new Promise((resolve) => window.setTimeout(resolve, 1500));

    setIsTyping(false); // Cacher "l'IA écrit..."

    const { response, result: nextResult } = getStaticResponse(nextMessages, language);
    setMessages((current) => [...current, { role: "assistant", content: response }]);

    if (nextResult) {
      setResult(nextResult);
      if (isSoundEnabled) {
        window.setTimeout(() => {
          speak(`${diagnostic.closing} ${nextResult.recommendation}`, language);
        }, 250);
      }
    }

    setLoading(false);
  }

  function resetConversation() {
    stopSpeaking();
    setMessages([{ role: "assistant", content: diagnostic.welcome }]);
    setInput("");
    setResult(null);
    if (isSoundEnabled) window.setTimeout(() => speak(diagnostic.welcome, language), 220);
  }

  function startFreshSession() {
    stopSpeaking();
    router.replace(`/diagnostic?chatId=${createChatId()}`);
    setMessages([{ role: "assistant", content: diagnostic.welcome }]);
    setInput("");
    setResult(null);
  }

  return (
    <div
      dir={direction}
      className="relative min-h-screen  bg-[#F8F9FA] text-[#1a1a1a] selection:bg-neutral-200"
    >
      {/* CSS pour cacher la scrollbar proprement */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* --- Background Ambiance --- */}
      <div className="pointer-events-none fixed inset-0 z-0 ">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#E0E7FF]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#FAE8FF]/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-[#ECFCCB]/20 rounded-full blur-[100px]" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] opacity-[0.4]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8 h-screen flex flex-col mt-10">

        {/* --- Main Content Area --- */}
        <main className="flex-1 flex flex-col items-center justify-start w-full max-w-7xl mx-auto relative">

          {/* Si PAS de résultat : Afficher le Chat */}
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="chat-view"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
                className="w-full h-full flex flex-col"
              >
                {/* Zone de Messages avec overflow géré */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto pb-4 hide-scrollbar space-y-6"
                >
                  {/* Welcome Hero (Si premier message) */}
                  {messages.length <= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-10 px-4"
                    >
                      <div className="inline-block p-3 rounded-2xl bg-neutral-50 border border-neutral-100 shadow-sm mb-6">
                        <Sparkles className="h-6 w-6 text-neutral-800" />
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
                        {diagnostic.welcome}
                      </h1>
                      <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
                        {diagnostic.panelPoints[0]}
                      </p>
                    </motion.div>
                  )}

                  {/* Liste des messages */}
                  <div className="max-w-3xl mx-auto space-y-6">
                    <AnimatePresence initial={false}>
                      {displayedMessages.map((message, index) => (
                        // On saute le welcome message car il est géré au dessus
                        index > 0 && (
                          <motion.div
                            key={`${message.role}-${index}`}
                            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.role === "assistant" && (
                              <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 border border-white/50 flex items-center justify-center shrink-0">
                                <Sparkles className="h-4 w-4 text-neutral-600" />
                              </div>
                            )}

                            <div
                              className={`max-w-[80%] sm:max-w-[70%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm border
                                ${message.role === "user"
                                  ? "bg-neutral-900 text-white rounded-2xl rounded-tr-sm border-transparent"
                                  : "bg-white/80 backdrop-blur-md text-neutral-800 rounded-2xl rounded-tl-sm border-neutral-100"
                                }`}
                            >
                              {message.content}
                            </div>
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>

                    {/* Indicateur de frappe "Typing..." */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-start"
                        >
                          <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 border border-white/50 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-neutral-600" />
                          </div>
                          <div className="bg-white/80 backdrop-blur-md border border-neutral-100 rounded-2xl rounded-tl-sm px-2 py-2 shadow-sm">
                            <TypingIndicator />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Input Bar "Floating Island" */}
                <div className="py-6 pb-8">
                  <div className="relative mx-auto max-w-2xl group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-full opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative flex items-end gap-2 bg-white/90 backdrop-blur-xl border border-neutral-200/60 p-2 rounded-3xl shadow-lg shadow-neutral-200/50 transition-all focus-within:shadow-xl focus-within:border-neutral-300/80 focus-within:ring-4 focus-within:ring-neutral-100/50">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            void send();
                          }
                        }}
                        rows={1}
                        disabled={loading}
                        placeholder={diagnostic.placeholder}
                        className="max-h-32 min-h-[48px] w-full bg-transparent border-none px-4 py-3 text-[15px] text-neutral-900 placeholder-neutral-400 focus:ring-0 resize-none leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => void send()}
                        disabled={loading || !input.trim()}
                        className="mb-1 mr-1 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md transition-all duration-300 hover:bg-neutral-800 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <ArrowUp className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-center mt-3 text-xs text-neutral-400 font-medium">
                    {diagnostic.session} · {chatId.slice(0, 8)}
                  </p>
                </div>
              </motion.div>
            ) : (
              /* --- RÉSULTAT : Hors du chat, Design Dashboard --- */
              <motion.div
                key="result-view"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full pt-8 pb-12"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-3xl shadow-2xl shadow-indigo-100/50 ">
                  {/* Top Banner */}
                  <div className="bg-neutral-900/5 px-8 py-4 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                        {diagnostic.orientation}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">ID: {chatId.slice(0, 8)}</span>
                  </div>

                  <div className="p-8 sm:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* Left: Primary Result */}
                      <div className="lg:col-span-2 space-y-8">
                        <div>
                          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                            {diagnostic.profile}
                          </p>
                          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
                            {result.primary}
                          </h2>
                          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                            {diagnostic.confidenceLabel}: {result.confidence}
                          </div>
                        </div>

                        <div>
                          <p className="text-lg leading-relaxed text-neutral-600 font-light">
                            {result.summary}
                          </p>
                        </div>

                        <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <HeartHandshake className="h-4 w-4" />
                            {diagnostic.next}
                          </h3>
                          <p className="text-indigo-950/80 leading-7">
                            {result.recommendation}
                          </p>
                        </div>
                      </div>

                      {/* Right: Details & Signals */}
                      <div className="space-y-8">
                        <div>
                          <p className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-4">
                            {diagnostic.signals}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.signals.map((signal) => (
                              <span
                                key={signal}
                                className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 text-sm shadow-sm"
                              >
                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-100">
                          <p className="text-[10px] leading-5 text-neutral-400">
                            {diagnostic.medicalNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-neutral-50/50 px-8 py-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={startFreshSession}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {diagnostic.restart}
                    </button>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 hover:text-neutral-900 transition"
                    >
                      {dictionary.nav.backHome}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-sm font-bold text-neutral-900 mb-2">{diagnostic.panelTitle}</h4>
                    <p className="text-xs text-neutral-500 leading-5">
                      {diagnostic.panelPoints[0]} <br />
                      {diagnostic.panelPoints[1] || "Sécurité et confidentialité des données."}
                    </p>
                  </motion.div>
                  <motion.div
                    className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 mb-1">{diagnostic.sideCardTitle}</h4>
                      <p className="text-xs text-neutral-500">{diagnostic.sideCardBody}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </motion.div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}