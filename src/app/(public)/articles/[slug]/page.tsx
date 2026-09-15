import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, Bookmark, Share2 } from "lucide-react";
import { articleService } from "@/lib/services/article/article.service";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await articleService.getArticleBySlug(slug);
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Editorial Header Bar */}
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8 max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest font-bold">
          THE CHRONICLE · EDITORIAL EDITION
        </span>
      </header>

      {/* Main Article Reader Body */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Category & Status Chips */}
        <div className="flex items-center gap-2">
          {article.category ? (
            <span className="rounded border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              {article.category.name}
            </span>
          ) : (
            <span className="rounded border border-border bg-secondary px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              General News
            </span>
          )}
          <span className="text-muted-foreground text-xs font-mono">·</span>
          <span className="font-mono text-xs text-muted-foreground uppercase">
            {article.status}
          </span>
        </div>

        {/* Headline / Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold leading-tight text-foreground tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt Subdeck */}
        {article.excerpt && (
          <p className="text-lg sm:text-xl font-serif italic text-muted-foreground leading-relaxed border-l-2 border-primary pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Author Bylines & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground">
              {article.author?.name ? article.author.name.charAt(0) : "A"}
            </div>
            <div>
              <div className="font-bold text-foreground flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                {article.author?.name || "Staff Reporter"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {article.author?.role || "AUTHOR"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              3 min read
            </span>
          </div>
        </div>

        {/* Main Formatted HTML Body using dangerouslySetInnerHTML */}
        <article className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground font-sans">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>Article ID: {article.id}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 border border-border bg-card px-3 py-1.5 rounded hover:bg-secondary transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              type="button"
              className="flex items-center gap-1 border border-border bg-card px-3 py-1.5 rounded hover:bg-secondary transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
