"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { createChatId } from "@/lib/chat";
import { speakWithVoices, stopSpeaking, warmUpSpeech, type Lang } from "@/lib/i18n";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatResult } from "./ChatResult";

type Message = { role: "user" | "assistant"; content: string };

type Result = {
  primary: string;
  confidence: string;
  summary: string;
  signals: string[];
  recommendation: string;
};

function getStaticResponse(messages: Message[], lang: Lang): {
  response: string;
  result?: Result;
} {
  const userMessages = messages.filter((m) => m.role === "user");

  if (userMessages.length >= 3) {
    const responses: Record<Lang, { response: string; result: Result }> = {
      ar: {
        response: "شكراً لمشاركتك هذا معي. هذا ملخص موجز لجلسة اليوم.",
        result: {
          primary: "قلق خفيف إلى متوسط",
          confidence: "متوسط",
          summary: "من خلال المحادثة، تظهر مؤشرات على قلق مرتبط بضغوط حديثة مع صعوبة متكررة في التركيز وبعض الاضطراب في النوم.",
          signals: ["صعوبة متكررة في التركيز", "توتر داخلي مستمر", "اضطراب متقطع في النوم", "إجهاد ذهني متكرر"],
          recommendation: "قد يكون من المفيد التحدث مع أخصائي نفسي لإجراء تقييم أعمق، مع اعتماد تمارين تنفس وتهدئة خلال اليوم.",
        },
      },
      fr: {
        response: "Merci pour votre partage. Voici une synthèse courte de cette session.",
        result: {
          primary: "Anxiété légère à modérée",
          confidence: "modérée",
          summary: "La conversation fait ressortir un terrain anxieux probablement lié à des stresseurs récents, avec fatigue mentale et difficultés de concentration.",
          signals: ["Difficulté de concentration fréquente", "Charge mentale persistante", "Sommeil parfois perturbé", "Tension émotionnelle diffuse"],
          recommendation: "Une consultation avec un psychologue ou un professionnel de santé mentale pourrait vous aider à approfondir cette première orientation.",
        },
      },
      en: {
        response: "Thank you for opening up. Here is a short synthesis of this session.",
        result: {
          primary: "Mild to moderate anxiety",
          confidence: "moderate",
          summary: "The discussion suggests anxiety-related stress with recurring mental overload, concentration difficulty, and occasional sleep disruption.",
          signals: ["Frequent difficulty concentrating", "Persistent cognitive tension", "Intermittent sleep disruption", "Elevated worry response"],
          recommendation: "Consider a conversation with a licensed mental health professional and combine it with breathing or grounding techniques in the short term.",
        },
      },
    };

    return responses[lang] ?? responses.en;
  }

  const followUps: Record<Lang, string[]> = {
    ar: ["أنا أستمع لك. هل تقدر تحكيلي أكثر على شعورك هذه الفترة؟", "منذ متى بدأت هذه الأحاسيس أو الأعراض؟", "كيف تؤثر هذه الحالة على يومك أو نومك أو تركيزك؟"],
    fr: ["Je vous écoute. Pouvez-vous m'en dire plus sur ce que vous ressentez en ce moment ?", "Depuis quand ces sensations ou ces symptômes sont-ils présents ?", "Comment cela influence-t-il vos journées, votre sommeil ou votre concentration ?"],
    en: ["I'm listening. Can you tell me more about what you're feeling lately?", "How long have these sensations or symptoms been present?", "How is this affecting your days, sleep, or concentration?"],
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
  const welcomedRef = useRef(false);

  const displayedMessages =
    messages.length <= 1 && !result
      ? [{ role: "assistant" as const, content: diagnostic.welcome }]
      : messages;

  // Audio welcome - une seule fois
  useEffect(() => {
    if (welcomedRef.current) return;
    welcomedRef.current = true;
    if (!isSoundEnabled) return;
    warmUpSpeech();
    speakWithVoices(diagnostic.welcome, language);
    return () => stopSpeaking();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [loading, messages, isTyping, result]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    warmUpSpeech();
    setInput("");
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1500));
    setIsTyping(false);

    const { response, result: nextResult } = getStaticResponse(nextMessages, language);
    setMessages((cur) => [...cur, { role: "assistant", content: response }]);

    if (nextResult) {
      setResult(nextResult);
      if (isSoundEnabled) {
        setTimeout(() => speakWithVoices(`${diagnostic.closing} ${nextResult.recommendation}`, language), 250);
      }
    }
    setLoading(false);
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
      className="relative w-full bg-transparent text-on-background"
    >
      {/* Background Ambiance */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-tertiary/15 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-surface/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(187,27%,40%,0.06),transparent_25%),radial-gradient(circle_at_80%_15%,hsl(45,93%,47%,0.04),transparent_20%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      {!result ? (
        // --- Chat View ---
        <div className="relative z-10 mx-auto flex h-[100dvh] max-w-[100rem] flex-col px-4 sm:px-6 lg:px-8 pt-24 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="chat-view"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col min-h-0"
            >
              <ChatMessages
                scrollRef={scrollRef}
                messages={messages}
                displayedMessages={displayedMessages}
                isTyping={isTyping}
              />
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={send}
                loading={loading}
                chatId={chatId}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        // --- Result View ---
        <div className="relative z-10 min-h-screen pt-28 pb-12">
          <ChatResult
            result={result}
            chatId={chatId}
            onRestart={startFreshSession}
          />
        </div>
      )}
    </div>
  );
}
