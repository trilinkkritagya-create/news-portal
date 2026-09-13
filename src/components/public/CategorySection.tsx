"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { MockArticle, MockCategory } from "@/lib/mock-data";

interface CategorySectionProps {
  categories: MockCategory[];
  articles: MockArticle[];
}

function CategorySectionContent({
  categories,
  articles,
}: CategorySectionProps) {
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("category");

  const activeCategory = useMemo(() => {
    if (!activeCategorySlug) return null;
    return categories.find((c) => c.slug === activeCategorySlug) || null;
  }, [categories, activeCategorySlug]);

  const filteredArticles = useMemo(() => {
    if (!activeCategorySlug) return articles;
    return articles.filter(
      (a) =>
        a.category.slug === activeCategorySlug ||
        a.categoryId === activeCategorySlug
    );
  }, [articles, activeCategorySlug]);

  return (
    <section id="dispatches" className="py-4 border-b border-border/80 space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {activeCategory ? `${activeCategory.name} Dispatches` : "Latest Dispatches"}
            </h2>
            {activeCategory && (
              <Link
                href="/#dispatches"
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Clear Filter</span>
                <X className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeCategory
              ? activeCategory.description
              : "In-depth investigative reports, analyses, and breaking updates from our global newsroom."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>Showing {filteredArticles.length} of {articles.length} dispatches</span>
        </div>
      </div>

      {/* 3-Column Modern Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          return (
            <article
              key={article.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 hover:border-foreground/30 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-3.5">
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/80 bg-secondary">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    <Link href={`/dashboard/articles?id=${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Image
                    src={article.author.image}
                    alt={article.author.name}
                    width={20}
                    height={20}
                    unoptimized
                    className="h-5 w-5 rounded-full object-cover border border-border"
                  />
                  <span className="font-medium text-foreground text-[11px]">
                    {article.author.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>{article.readTime}</span>
                  <span>·</span>
                  <Link
                    href={`/dashboard/articles?id=${article.id}`}
                    className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 font-sans font-semibold"
                  >
                    <span>Read</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
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
    <Suspense fallback={<div className="py-12 text-center text-xs text-muted-foreground">Loading dispatches...</div>}>
      <CategorySectionContent {...props} />
    </Suspense>
  );
}
