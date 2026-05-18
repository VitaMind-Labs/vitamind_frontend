"use client";

import Link from "next/link";
import {
  ArrowRight,
  Download,
  HeartHandshake,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { speakDiagnosticText, stopDiagnosticVoice } from "@/lib/diagnosticVoice";
import type { AssessmentResult, ChatReport } from "@/hooks/useDiagnosticChat";
import { useState } from "react";

type Axis = {
  eyebrow: string;
  title: string;
  label: string;
  result: AssessmentResult;
  tone: "amber" | "slate";
};

interface ChatResultProps {
  result: ChatReport;
  chatId: string;
  onRestart: () => void;
}

function scoreText(result: AssessmentResult) {
  return `${result.score}/${result.max}`;
}

function scorePercent(result: AssessmentResult) {
  if (!result.max) return 0;
  return Math.min(100, Math.round((result.score / result.max) * 100));
}

function cleanPrediction(prediction: string) {
  return prediction.replace(/[✅⚠️]/g, "").trim();
}

function reportSpeechText(result: ChatReport) {
  return [
    result.summary,
    result.signals.join(". "),
    result.recommendation,
  ]
    .filter(Boolean)
    .join(". ");
}

export function ChatResult({ result, chatId, onRestart }: ChatResultProps) {
  const { dictionary, language, direction } = useLanguage();
  const { isSoundEnabled } = useAudio();
  const [isReading, setIsReading] = useState(false);
  const resultText = dictionary.diagnostic.result;
  const axes: Axis[] = [
    {
      eyebrow: resultText.axes.bipolar.eyebrow,
      title: resultText.axes.bipolar.title,
      label: resultText.axes.bipolar.label,
      result: result.assessments.bipolar,
      tone: "amber",
    },
    {
      eyebrow: resultText.axes.asrs.eyebrow,
      title: resultText.axes.asrs.title,
      label: resultText.axes.asrs.label,
      result: result.assessments.asrs,
      tone: "amber",
    },
    {
      eyebrow: resultText.axes.psychosis.eyebrow,
      title: resultText.axes.psychosis.title,
      label: resultText.axes.psychosis.label,
      result: result.assessments.psychosis,
      tone: "slate",
    },
  ];
  const signupHref = `/auth/signup?sessionId=${encodeURIComponent(chatId)}&redirect=${encodeURIComponent("/dashboard")}`;

  async function handleReadReport() {
    if (isReading) {
      stopDiagnosticVoice();
      setIsReading(false);
      return;
    }

    setIsReading(true);
    await speakDiagnosticText(reportSpeechText(result), language);
    setIsReading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6"
      dir={direction}
    >
      {/* Main Card - Clean white background */}
      <div className="bg-white border border-[rgba(81,133,145,0.06)] rounded-3xl w-full shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-b border-[rgba(81,133,145,0.04)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
              {resultText.header}
            </span>
          </div>
            <span className="text-xs font-mono text-on-background/60">ID: {chatId.slice(0, 8)}</span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-10">
          
          {/* Axes Grid - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {axes.map((axis) => {
              const isAmber = axis.tone === "amber";
              const barColor = isAmber ? "bg-primary" : "bg-gray-400";
              const scoreColor = isAmber ? "text-primary" : "text-gray-500";

              return (
                <motion.div
                  key={axis.eyebrow}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    {axis.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{axis.title}</h3>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm text-on-background/70">{axis.label}</p>
                          <p className={`mt-1 text-3xl font-bold ${scoreColor === 'text-primary' ? 'text-primary' : 'text-on-background'}`}>
                        {scoreText(axis.result)}
                      </p>
                    </div>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">
                      {resultText.scoreSource}
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${scorePercent(axis.result)}%` }}
                    />
                  </div>
                  <p className="mt-3 min-h-[40px] text-xs leading-5 text-on-background/70">
                    {cleanPrediction(axis.result.prediction)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Analysis & Orientation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analysis Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-[rgba(81,133,145,0.06)]">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    {resultText.analysisTitle}
                  </h3>
                </div>
                <div className="space-y-4 text-sm leading-7 text-on-background/70 sm:text-base">
                  <div>
                    <p className="font-semibold text-on-background">{resultText.summaryTitle}</p>
                    <p className="mt-1 whitespace-pre-line">{result.summary}</p>
                  </div>
                  {result.signals.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-900">{resultText.signalsTitle}</p>
                      <ul className="mt-2 space-y-2">
                        {result.signals.map((signal) => (
                          <li key={signal} className="rounded-xl border border-[rgba(81,133,145,0.06)] bg-white px-4 py-3 text-on-background/80">
                            {signal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Orientation Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-[rgba(81,133,145,0.06)]">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4" />
                  {resultText.orientationTitle}
                </h3>
                <div className="space-y-4 text-sm leading-6 text-on-background/70">
                  <p>
                    <span className="font-semibold text-on-background">{resultText.recommendationTitle}: </span>
                    {result.recommendation}
                  </p>
                </div>
                {isSoundEnabled && (
                  <button
                    type="button"
                    onClick={handleReadReport}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl border border-primary/20 bg-white text-primary text-sm font-semibold shadow-sm hover:bg-primary/5 transition"
                  >
                    {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isReading ? resultText.stopReading : resultText.readAloud}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition"
                >
                  <Download className="h-4 w-4" />
                  {resultText.download}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition"
          >
            <RefreshCw className="h-4 w-4" />
            {resultText.restart}
          </button>
          <Link
            href={signupHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[rgba(81,133,145,0.06)] text-on-background text-sm font-medium hover:border-[rgba(81,133,145,0.12)] hover:text-on-background transition"
          >
            {resultText.signupCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Info Cards - Clean & Light */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl bg-white border border-[rgba(81,133,145,0.06)] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h4 className="text-sm font-bold text-primary mb-2">{resultText.noteTitle}</h4>
          <p className="text-xs text-on-background/70 leading-5">
            {resultText.noteBody}
          </p>
        </motion.div>
        
        <motion.div
          className="p-5 sm:p-6 rounded-2xl bg-white border border-[rgba(81,133,145,0.06)] shadow-sm flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h4 className="text-sm font-bold text-primary mb-1">{resultText.privacyTitle}</h4>
            <p className="text-xs text-on-background/70">{resultText.privacyBody}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-100 text-primary flex items-center justify-center shrink-0 ml-3">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
