"use client";

import Link from "next/link";
import { ArrowRight, HeartHandshake, RefreshCw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type Result = {
  primary: string;
  confidence: string;
  summary: string;
  signals: string[];
  recommendation: string;
};

interface ChatResultProps {
  result: Result;
  chatId: string;
  onRestart: () => void;
}

export function ChatResult({ result, chatId, onRestart }: ChatResultProps) {
  const { dictionary } = useLanguage();
  const diagnostic = dictionary.diagnostic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* Main Card - Clean white background */}
      <div className="bg-white border border-gray-200 rounded-3xl w-full shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 sm:px-8 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
              {diagnostic.orientation}
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">ID: {chatId.slice(0, 8)}</span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Diagnosis Title */}
              <div>
                <p className="text-xs font-semibold text-primary/70 uppercase tracking-wide mb-2">
                  {diagnostic.profile}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                  <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                    {result.primary}
                  </span>
                </h2>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-primary text-sm font-medium border border-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  {diagnostic.confidenceLabel}: {result.confidence}
                </div>
              </div>

              {/* Summary */}
              <div>
                <p className="text-base sm:text-lg leading-relaxed text-gray-600 font-light">
                  {result.summary}
                </p>
              </div>

              {/* Recommendation Card */}
              <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-200">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-tertiary shrink-0" />
                  {diagnostic.next}
                </h3>
                <p className="text-gray-700 leading-7 text-sm sm:text-base">
                  {result.recommendation}
                </p>
              </div>
            </div>

            {/* Right Column - Signals & Meta */}
            <div className="space-y-6">
              {/* Signals */}
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
                  {diagnostic.signals}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.signals.map((signal) => (
                    <span
                      key={signal}
                      className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm shadow-sm"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Note */}
              <div className="pt-5 border-t border-gray-200">
                <p className="text-[10px] leading-5 text-gray-400">
                  {diagnostic.medicalNote}
                </p>
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
            {diagnostic.restart}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:text-gray-900 transition"
          >
            {dictionary.nav.backHome}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Info Cards - Clean & Light */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h4 className="text-sm font-bold text-primary mb-2">{diagnostic.panelTitle}</h4>
          <p className="text-xs text-gray-500 leading-5">
            {diagnostic.panelPoints[0]} <br />
            {diagnostic.panelPoints[1] || "Sécurité et confidentialité des données."}
          </p>
        </motion.div>
        
        <motion.div
          className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h4 className="text-sm font-bold text-primary mb-1">{diagnostic.sideCardTitle}</h4>
            <p className="text-xs text-gray-500">{diagnostic.sideCardBody}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-100 text-primary flex items-center justify-center shrink-0 ml-3">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}