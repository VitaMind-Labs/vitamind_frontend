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
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/contexts/AudioContext";
import { speakDiagnosticText, stopDiagnosticVoice } from "../lib/voice";
import type { AssessmentResult, ChatReport } from "../types";
import { useState } from "react";

type Axis = {
  eyebrow: string;
  title: string;
  subtitle: string;
  label: string;
  result: AssessmentResult;
  color: string;
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

function getScoreColor(percent: number) {
  if (percent <= 25) return "bg-[#7da89e]"; // vert sage
  if (percent <= 50) return "bg-[#d4b37c]"; // beige/orange doux
  if (percent <= 75) return "bg-[#c9a96e]"; // orange
  return "bg-[#b87070]"; // rouge doux
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
      subtitle: "Bipolar spectrum",
      label: resultText.axes.bipolar.label,
      result: result.assessments.bipolar,
      color: getScoreColor(scorePercent(result.assessments.bipolar)),
    },
    {
      eyebrow: resultText.axes.asrs.eyebrow,
      title: resultText.axes.asrs.title,
      subtitle: "ADHD",
      label: resultText.axes.asrs.label,
      result: result.assessments.asrs,
      color: getScoreColor(scorePercent(result.assessments.asrs)),
    },
    {
      eyebrow: resultText.axes.psychosis.eyebrow,
      title: resultText.axes.psychosis.title,
      subtitle: "Psychosis risk",
      label: resultText.axes.psychosis.label,
      result: result.assessments.psychosis,
      color: getScoreColor(scorePercent(result.assessments.psychosis)),
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
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="w-full max-w-5xl mx-auto px-3 sm:px-4"
      dir={direction}
    >
      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[28px] w-full shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {resultText.header}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            ID: {chatId.slice(0, 8)}
          </span>
        </div>

        {/* Content */}
        <div className="px-5 sm:px-8 lg:px-10 pb-8 sm:pb-10 space-y-6">
          
          {/* Axes Grid — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {axes.map((axis, i) => {
              const percent = scorePercent(axis.result);
              
              return (
                <motion.div
                  key={axis.eyebrow}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-500"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {axis.eyebrow}
                  </p>
                  <h3 className="text-[15px] font-bold text-gray-800 mb-0.5">{axis.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{axis.subtitle}</p>
                  
                  <div className="flex items-end justify-between gap-2 mb-3">
                    <p className="text-3xl font-bold text-gray-700 tracking-tight">
                      {scoreText(axis.result)}
                    </p>
                    <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-[9px] text-gray-400 font-medium">
                      Generated score
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1 rounded-full bg-gray-100 overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.32, 0.72, 0, 1] }}
                      className={`h-full rounded-full ${axis.color}`}
                    />
                  </div>
                  
                  <p className="text-xs leading-5 text-gray-400">
                    {cleanPrediction(axis.result.prediction)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Analysis & Orientation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Report Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-2 text-primary mb-5">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  {resultText.analysisTitle}
                </h3>
              </div>
              
              <div className="space-y-4 text-sm leading-7 text-gray-500">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{resultText.summaryTitle}</p>
                  <div className="whitespace-pre-line space-y-2">
                    {result.summary.split('\n').map((line, idx) => {
                      const isPositive = line.includes('✅') || line.toLowerCase().includes('low probability') || line.toLowerCase().includes('negative screen');
                      const isWarning = line.includes('⚠️') || line.toLowerCase().includes('positive screen') || line.toLowerCase().includes('clinical evaluation');
                      return (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          {isPositive && <CheckCircle2 className="h-4 w-4 text-[#7da89e] mt-0.5 shrink-0" />}
                          {isWarning && <AlertTriangle className="h-4 w-4 text-[#d4b37c] mt-0.5 shrink-0" />}
                          {!isPositive && !isWarning && <div className="w-4 h-4 mt-0.5 shrink-0" />}
                          <span>{line.replace(/[✅⚠️]/g, '').trim()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {result.signals.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{resultText.signalsTitle}</p>
                    <ul className="space-y-2">
                      {result.signals.map((signal) => (
                        <li 
                          key={signal} 
                          className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-gray-600 flex items-start gap-2"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
                          {signal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recommended Orientation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5 flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                {resultText.orientationTitle}
              </h3>
              
              <div className="rounded-xl bg-gray-50/50 border border-gray-100 p-4 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{resultText.recommendationTitle}</p>
                <p className="text-sm leading-6 text-gray-600">
                  {result.recommendation}
                </p>
              </div>

              <div className="space-y-2.5 mt-auto">
                {isSoundEnabled && (
                   <Button
                     type="button"
                     variant="outline"
                     onClick={handleReadReport}
                     className="w-full rounded-xl text-sm"
                   >
                    {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                     {isReading ? resultText.stopReading : resultText.readAloud}
                   </Button>
                )}
                 <Button
                   type="button"
                   variant="default"
                   onClick={() => window.print()}
                   className="w-full"
                 >
                   <Download className="h-4 w-4" />
                   {resultText.download}
                 </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
           <Button
             type="button"
             variant="default"
             onClick={onRestart}
           >
             <RefreshCw className="h-4 w-4" />
             {resultText.restart}
           </Button>
           <Button asChild variant="outline">
             <Link href={signupHref}>
               {resultText.signupCta}
               <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
             </Link>
           </Button>
        </div>
      </div>

      {/* Bottom Info Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl bg-white/70 border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">{resultText.noteTitle}</h4>
          <p className="text-xs text-gray-400 leading-5">
            {resultText.noteBody}
          </p>
        </motion.div>

        <motion.div
          className="p-5 sm:p-6 rounded-2xl bg-white/70 border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm flex items-center justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">{resultText.privacyTitle}</h4>
            <p className="text-xs text-gray-400 leading-5">{resultText.privacyBody}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gray-100 text-primary flex items-center justify-center shrink-0 ml-3">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}