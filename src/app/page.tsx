import { getCurrentUser } from "@/lib/auth/authLib";
import { MOCK_ARTICLES, MOCK_CATEGORIES } from "@/lib/mock-data";
import PublicHeader from "@/components/public/PublicHeader";
import BreakingTicker from "@/components/public/BreakingTicker";
import HeroLeadSection from "@/components/public/HeroLeadSection";
import CategorySection from "@/components/public/CategorySection";
import OpinionColumns from "@/components/public/OpinionColumns";
import NewsletterDispatch from "@/components/public/NewsletterDispatch";
import PublicFooter from "@/components/public/PublicFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Portal · Daily Global Intelligence & Reporting",
  description:
    "Independent reporting and insights on artificial intelligence, sovereign markets, deep space science, and contemporary culture.",
};

export default async function Home() {
  const user = await getCurrentUser();

  const breakingArticle =
    MOCK_ARTICLES.find((a) => a.isBreaking) || MOCK_ARTICLES[0];
  const leadStory = MOCK_ARTICLES[0];
  const secondaryStories = [MOCK_ARTICLES[1], MOCK_ARTICLES[2]];
  const trendingStories = [MOCK_ARTICLES[3], MOCK_ARTICLES[4]];
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary selection:text-white">
      {/* Modern Compact Header */}
      <PublicHeader user={user} />

      {/* Floating Breaking News Pill */}
      <BreakingTicker article={breakingArticle} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-5 space-y-8 lg:space-y-10">
        {/* 1. Hero Spotlight & Trending Stories */}
        <HeroLeadSection
          leadStory={leadStory}
          secondaryStories={secondaryStories}
          trendingStories={trendingStories}
        />

        {/* 2. Interactive Category Filter & Articles Grid */}
        <CategorySection
          categories={MOCK_CATEGORIES}
          articles={MOCK_ARTICLES}
        />

        {/* 3. Resident Columnist Voices */}
        <OpinionColumns />

        {/* 4. Modern Newsletter Card */}
        <NewsletterDispatch />
      </main>
      {/* Modern Minimalist Footer */}
      <PublicFooter />
    </div>
  );
}
