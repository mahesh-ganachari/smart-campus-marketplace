import React from 'react';
import { BookOpen, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6 rounded-3xl mb-10 shadow-2xl">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>Exclusive for BCA Students on Campus</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Buy & Sell Used Books, Electronics & Lab Equipment{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Within Campus
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Pass down your semester textbooks, Arduino components, and lab gear directly to fellow batchmates. Fast, verified, and hassle-free.
        </p>

        {/* Feature Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Campus Roll Verified</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>0% Platform Commission</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Curated for BCA Specs</span>
          </div>
        </div>

      </div>
    </div>
  );
};
