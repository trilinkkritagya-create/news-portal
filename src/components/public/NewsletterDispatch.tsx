"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

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
    <section className="my-12 relative overflow-hidden rounded-3xl bg-[#0d1527] text-white p-8 sm:p-12 shadow-xl">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>The Morning Intelligence Digest</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Stay ahead with verifiable journalism.
        </h2>

        <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
          Delivered every morning at 06:00 GMT. Essential reporting, market movements, and tech breakthroughs curated for serious readers.
        </p>

        {isSubscribed ? (
          <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 flex items-center justify-center gap-2 text-sm font-semibold max-w-md mx-auto">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>You are on the ledger! First edition arrives tomorrow morning.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none backdrop-blur-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0d1527] hover:bg-gray-100 transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-xs text-white/60 pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
            No spam, guaranteed
          </span>
          <span>·</span>
          <span>180,000+ subscribers</span>
          <span>·</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </section>
  );
}
