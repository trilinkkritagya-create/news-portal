"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MockArticle, MockCategory } from "@/lib/mock-data";

interface CategorySectionProps {
  categories: MockCategory[];
  articles: MockArticle[];
}

function CategorySectionContent({
  categories,
  articles,
}: CategorySectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("category");

  const filteredArticles = useMemo(() => {
    if (!activeCategorySlug) return articles;
    return articles.filter(
      (a) =>
        a.category.slug === activeCategorySlug ||
        a.categoryId === activeCategorySlug
    );
  }, [articles, activeCategorySlug]);

  const handleCategorySelect = (slug: string | null) => {
    if (!slug) {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?category=${slug}`, { scroll: false });
    }
  };

  return (
    <section
      id="dispatches"
      className="border-t-2 border-foreground pt-8 space-y-6 scroll-mt-20"
    >
      {/* Header & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase block">
            Special Coverage
          </span>
          <h2 className="font-headline text-2xl md:text-3xl font-black text-foreground">
            In-Depth Dispatches
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleCategorySelect(null)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${!activeCategorySlug
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
          >
            All Dispatches
          </button>
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Broadsheet Article Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          return (
            <article
              key={article.id}
              className="bg-card p-5 rounded-lg border border-border flex flex-col justify-between hover:shadow-md hover:border-border/80 transition-all duration-200 group"
            >
              <div className="space-y-3">
                {/* Visual Thumbnail */}
                {article.featuredImage && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 border border-border/80 mb-1">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Eyebrow & Category */}
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className="font-bold tracking-wider uppercase"
                    style={{ color: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    {article.readTime}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-headline text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors cursor-pointer">
                  <Link href={`/dashboard/articles?id=${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                {/* Deck Excerpt */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  {article.author.image && (
                    <Image
                      src={article.author.image}
                      alt={article.author.name}
                      width={22}
                      height={22}
                      unoptimized
                      className="h-5 w-5 rounded-full object-cover border border-border"
                    />
                  )}
                  <span>
                    By <strong className="text-foreground">{article.author.name}</strong>
                  </span>
                </div>

                <Link
                  href={`/dashboard/articles?id=${article.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <span>Dispatch</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function CategorySection(props: CategorySectionProps) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-muted-foreground">
          Loading dispatches...
        </div>
      }
    >
      <CategorySectionContent {...props} />
    </Suspense>
  );
}
