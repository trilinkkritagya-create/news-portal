"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";

export default function NewsletterDispatch() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <section
      id="newsletter"
      className="my-10 bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-8 md:p-12 relative overflow-hidden shadow-sm border border-slate-800"
    >
      <div className="max-w-3xl relative z-10 space-y-4">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-slate-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
          <Mail className="h-3.5 w-3.5 text-blue-400" />
          <span>Daily Briefing</span>
        </div>

        {/* Headline */}
        <h2 className="font-headline text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          The Morning Chronicle Dispatch
        </h2>

        {/* Description */}
        <p className="text-slate-300 text-sm md:text-base font-serif leading-relaxed">
          Curated by our senior editors every dawn. The definitive morning briefing on world politics, frontier science, and market movements delivered directly to your inbox.
        </p>

        {/* Subscription Form / Feedback */}
        {isSubscribed ? (
          <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5 text-sm font-semibold max-w-lg">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>
              You are subscribed to The Morning Dispatch. First briefing delivers tomorrow at 06:00 GMT.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="pt-2 flex flex-col sm:flex-row gap-3 max-w-lg"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your corporate or personal email..."
              className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 flex-grow transition-all"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold tracking-wide transition-all shrink-0 cursor-pointer shadow-sm"
            >
              Subscribe Free
            </button>
          </form>
        )}

        {/* Guarantees */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Strict confidentiality
          </span>
          <span>•</span>
          <span>0% spam</span>
          <span>•</span>
          <span>One-click unsubscribe anytime</span>
        </div>
      </div>

      {/* Subtle Decorative Background Pattern */}
      <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
    </section>
  );
}
