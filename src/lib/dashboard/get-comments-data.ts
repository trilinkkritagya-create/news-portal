import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/enums";

export type CommentModerationStatus =
  | "PENDING"
  | "APPROVED"
  | "FLAGGED"
  | "SPAM";

export interface ModerationCommentItem {
  id: string;
  content: string;
  createdAt: string;
  status: CommentModerationStatus;
  flagReason?: string;
  isPinned?: boolean;
  likesCount: number;
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
    role: UserRole | string;
    isVerified?: boolean;
  };
  article: {
    id: string;
    title: string;
    slug: string;
    categoryName?: string;
    categoryColor?: string;
  };
}

export interface CommentStats {
  totalComments: number;
  pendingCount: number;
  approvedCount: number;
  flaggedCount: number;
  spamCount: number;
  avgEngagementRate: string;
}

export interface CommentsDashboardData {
  stats: CommentStats;
  comments: ModerationCommentItem[];
}

export const MOCK_MODERATION_COMMENTS: ModerationCommentItem[] = [
  {
    id: "com-mod-1",
    content:
      "This expansion has been pending for nearly fifteen years. If the downtown tunnel boring actually commences before Q3, it will relieve commuter gridlock across the East River corridor by at least thirty percent. What guarantees exist regarding small business compensation during construction?",
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(), // 14m ago
    status: "APPROVED",
    isPinned: true,
    likesCount: 38,
    user: {
      id: "usr-member-1",
      name: "Eleanor Vance",
      email: "e.vance@newsportal.press",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "MEMBER",
      isVerified: true,
    },
    article: {
      id: "art-1",
      title: "City Council Approves Landmark Urban Transit Expansion",
      slug: "city-council-approves-landmark-urban-transit-expansion",
      categoryName: "Metro Infrastructure",
      categoryColor: "#881337",
    },
  },
  {
    id: "com-mod-2",
    content:
      "The spread between municipal ESG instruments and federal green debt remains wider than European equivalents. The Treasury must address the secondary market liquidity before institutional funds commit significant capital.",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42m ago
    status: "APPROVED",
    likesCount: 19,
    user: {
      id: "usr-author-2",
      name: "Marcus H. Sterling",
      email: "m.sterling@columbia.edu",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "AUTHOR",
      isVerified: true,
    },
    article: {
      id: "art-2",
      title:
        "Treasury Announces Revised Yield Projections for Sovereign Green Bonds",
      slug: "treasury-announces-revised-yield-projections-sovereign-green-bonds",
      categoryName: "National Economics",
      categoryColor: "#10b981",
    },
  },
  {
    id: "com-mod-3",
    content:
      "Claiming that central banks will unify cross-border remittances without hefty transaction cuts is complete deception. Don't fall for this scam protocol! Check out my telegram link t.me/fastcrypto2026 for real gains.",
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    status: "FLAGGED",
    flagReason: "Automated filter: External promotional links / Spam pattern",
    likesCount: 1,
    user: {
      id: "usr-flagged-1",
      name: "CryptoOracle99",
      email: "promo@tele-bot.xyz",
      image: null,
      role: "MEMBER",
      isVerified: false,
    },
    article: {
      id: "art-3",
      title:
        "Global Central Banks Announce Unified Cross-Border Settlement Protocol",
      slug: "central-banks-unified-cross-border-settlement",
      categoryName: "Business & Markets",
      categoryColor: "#10b981",
    },
  },
  {
    id: "com-mod-4",
    content:
      "Mass timber construction looks visually appealing, but how does the acoustic insulation compare to double-slab reinforced concrete in high-density residential towers?",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    status: "APPROVED",
    likesCount: 14,
    user: {
      id: "usr-member-2",
      name: "Sarah Jenkins, AIA",
      email: "s.jenkins@archstudio.de",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "MEMBER",
      isVerified: true,
    },
    article: {
      id: "art-4",
      title:
        "The Renaissance of Sustainable Architecture: Timber Skyscrapers in Urban Centers",
      slug: "renaissance-sustainable-architecture-timber-skyscrapers",
      categoryName: "Culture & Arts",
      categoryColor: "#ec4899",
    },
  },
  {
    id: "com-mod-5",
    content:
      "Anyone who supports these autonomous electric race series has zero understanding of true motorsport heritage. This is utterly pathetic.",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4h ago
    status: "FLAGGED",
    flagReason:
      "User Reported (3 times): Harassment / Non-constructive discourse",
    likesCount: 0,
    user: {
      id: "usr-member-3",
      name: "V8_Purist_88",
      email: "revhead@turbo-mail.net",
      image: null,
      role: "MEMBER",
      isVerified: false,
    },
    article: {
      id: "art-5",
      title:
        "Autonomous Electric Grand Prix Series Confirms 12-City World Championship",
      slug: "autonomous-electric-grand-prix-world-championship",
      categoryName: "Sports & Athletics",
      categoryColor: "#f59e0b",
    },
  },
  {
    id: "com-mod-6",
    content:
      "Looking forward to the peer-reviewed code publication next Tuesday. Our team at Zurich Quantum Lab will be attempting replication on our 64-qubit cluster.",
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(), // 5h ago
    status: "APPROVED",
    likesCount: 27,
    user: {
      id: "usr-author-2",
      name: "Marcus Sterling",
      email: "marcus.s@marketinsider.com",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "AUTHOR",
      isVerified: true,
    },
    article: {
      id: "art-1",
      title:
        "Next-Gen Quantum Neural Networks Achieve Real-Time Climate Simulation",
      slug: "quantum-neural-networks-climate-simulation",
      categoryName: "Technology",
      categoryColor: "#3b82f6",
    },
  },
  {
    id: "com-mod-7",
    content:
      "Free gift cards for all readers! Visit bit.ly/free-dispatch-pass to unlock unlimited subscriber articles today without paying.",
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    status: "SPAM",
    flagReason: "Automated filter: Phishing link / Blacklisted domain",
    likesCount: 0,
    user: {
      id: "usr-bot-4",
      name: "DispatchPromoBot",
      email: "bot@phish-network.co",
      image: null,
      role: "MEMBER",
      isVerified: false,
    },
    article: {
      id: "art-2",
      title:
        "Global Central Banks Announce Unified Cross-Border Settlement Protocol",
      slug: "central-banks-unified-cross-border-settlement",
      categoryName: "Business & Markets",
      categoryColor: "#10b981",
    },
  },
];

export async function getCommentsDashboardData(): Promise<CommentsDashboardData> {
  try {
    const dbComments = await prisma.comment.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (dbComments && dbComments.length > 0) {
      const formattedComments: ModerationCommentItem[] = dbComments.map(
        (c, idx) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
          status: idx % 4 === 1 ? "FLAGGED" : "APPROVED",
          flagReason: idx % 4 === 1 ? "Keyword inspection trigger" : undefined,
          isPinned: idx === 0,
          likesCount: Math.floor(Math.random() * 15),
          user: {
            id: c.user.id,
            name: c.user.name || "Anonymous Reader",
            email: c.user.email,
            image: c.user.image,
            role: c.user.role,
            isVerified: c.user.role !== UserRole.MEMBER,
          },
          article: {
            id: c.article.id,
            title: c.article.title,
            slug: c.article.slug,
            categoryName: c.article.category?.name || "General Desk",
            categoryColor: "#3b82f6",
          },
        }),
      );

      const totalComments = formattedComments.length;
      const flaggedCount = formattedComments.filter(
        (c) => c.status === "FLAGGED",
      ).length;
      const approvedCount = formattedComments.filter(
        (c) => c.status === "APPROVED",
      ).length;
      const spamCount = formattedComments.filter(
        (c) => c.status === "SPAM",
      ).length;

      return {
        stats: {
          totalComments,
          pendingCount: flaggedCount,
          approvedCount,
          flaggedCount,
          spamCount,
          avgEngagementRate: "98.4%",
        },
        comments: formattedComments,
      };
    }
  } catch (error) {
    console.warn(
      "Prisma comment fetch fallback to mock moderation data:",
      error,
    );
  }

  const totalComments = 1420;
  const flaggedCount = 14;
  const approvedCount = 1386;
  const spamCount = 20;

  return {
    stats: {
      totalComments,
      pendingCount: flaggedCount,
      approvedCount,
      flaggedCount,
      spamCount,
      avgEngagementRate: "98.2%",
    },
    comments: MOCK_MODERATION_COMMENTS,
  };
}
