export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "ADMIN" | "AUTHOR" | "MEMBER";
  bio?: string;
  articlesCount?: number;
  joinedAt: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
}

export interface MockComment {
  id: string;
  articleId: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  categoryId: string;
  category: MockCategory;
  authorId: string;
  author: MockUser;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  views: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  readTime: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// ----------------------------------------------------
// Mock Categories
// ----------------------------------------------------
export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: "cat-1",
    name: "Technology",
    slug: "technology",
    description: "Latest trends in AI, computing, gadgets, and silicon.",
    articleCount: 42,
    color: "#3b82f6", // blue
  },
  {
    id: "cat-2",
    name: "World & Politics",
    slug: "world-politics",
    description: "Global diplomacy, international summits, and geopolitical shifts.",
    articleCount: 35,
    color: "#ef4444", // red
  },
  {
    id: "cat-3",
    name: "Business & Markets",
    slug: "business-markets",
    description: "Global economy, venture capital, stock markets, and startup insights.",
    articleCount: 28,
    color: "#10b981", // green
  },
  {
    id: "cat-4",
    name: "Science & Space",
    slug: "science-space",
    description: "Deep-space exploration, clean energy breakthroughs, and biotech.",
    articleCount: 19,
    color: "#8b5cf6", // purple
  },
  {
    id: "cat-5",
    name: "Sports & Athletics",
    slug: "sports",
    description: "Championship tournaments, football, athletics, and motorsports.",
    articleCount: 24,
    color: "#f59e0b", // amber
  },
  {
    id: "cat-6",
    name: "Culture & Arts",
    slug: "culture-arts",
    description: "Cinema, literature, design, architecture, and lifestyle.",
    articleCount: 16,
    color: "#ec4899", // pink
  },
];

// ----------------------------------------------------
// Mock Users (Admin, Authors, Members)
// ----------------------------------------------------
export const MOCK_USERS: MockUser[] = [
  {
    id: "usr-admin-1",
    name: "Alexander Vance",
    email: "alexander.vance@newsportal.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "ADMIN",
    bio: "Editor-in-Chief & Lead Platform Administrator.",
    articlesCount: 48,
    joinedAt: "2024-01-15",
  },
  {
    id: "usr-author-1",
    name: "Sophia Chen",
    email: "sophia.chen@chronicle.org",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "AUTHOR",
    bio: "Senior Tech Journalist covering Generative AI and Quantum Systems.",
    articlesCount: 32,
    joinedAt: "2024-03-10",
  },
  {
    id: "usr-author-2",
    name: "Marcus Sterling",
    email: "marcus.s@marketinsider.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "AUTHOR",
    bio: "Investigative Financial Analyst and Macro-Economics reporter.",
    articlesCount: 27,
    joinedAt: "2024-02-20",
  },
  {
    id: "usr-author-3",
    name: "Dr. Elena Rostova",
    email: "e.rostova@sciencereport.io",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "AUTHOR",
    bio: "Astrophysicist and freelance Science Communicator.",
    articlesCount: 14,
    joinedAt: "2024-04-05",
  },
  {
    id: "usr-member-1",
    name: "Liam O'Connor",
    email: "liam.reader@gmail.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "MEMBER",
    bio: "Avid daily reader and technology enthusiast.",
    articlesCount: 0,
    joinedAt: "2024-05-12",
  },
];

// ----------------------------------------------------
// Mock Articles
// ----------------------------------------------------
export const MOCK_ARTICLES: MockArticle[] = [
  {
    id: "art-1",
    title: "Next-Gen Quantum Neural Networks Achieve Real-Time Climate Simulation",
    slug: "quantum-neural-networks-climate-simulation",
    excerpt:
      "A landmark collaboration of international researchers has unveiled a hybrid quantum processor capable of forecasting atmospheric turbulence with unprecedented precision.",
    content: `
# A New Paradigm in Climate Modeling

Scientists at the International Climate Informatics Institute have announced a breakthrough in applying quantum neural networks (QNN) to complex fluid dynamics and planetary climate forecasting.

## The Quantum Advantage
Traditional supercomputers often take weeks to simulate high-resolution atmospheric boundary layers. By leveraging 128 logical qubits running specialized tensor algorithms, the new architecture reduces computation time to under 18 minutes.

> "We are witnessing the fusion of quantum computation and predictive meteorology. This will save countless lives through early typhoon and flood warnings."
> — *Dr. Elena Rostova*

### Key Milestones:
1. **Sub-kilometer resolution:** Predicting local extreme weather events 48 hours in advance.
2. **Energy efficiency:** 90% less electricity consumption compared to legacy petascale nodes.
3. **Open Access:** Code and weights released for global non-profit climate agencies.
    `,
    featuredImage:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&auto=format&fit=crop&q=80",
    status: "PUBLISHED",
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    authorId: "usr-author-1",
    author: MOCK_USERS[1],
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    views: 34290,
    likesCount: 1840,
    commentsCount: 236,
    sharesCount: 512,
    readTime: "5 min read",
    publishedAt: "2026-09-12T08:30:00.000Z",
    createdAt: "2026-09-12T06:00:00.000Z",
    updatedAt: "2026-09-12T09:15:00.000Z",
    tags: ["Quantum Computing", "AI", "Climate Tech", "Innovation"],
  },
  {
    id: "art-2",
    title: "Global Central Banks Announce Unified Cross-Border Settlement Protocol",
    slug: "central-banks-unified-cross-border-settlement",
    excerpt:
      "A coalition of 45 central banking authorities has finalized standard rules for zero-friction cross-border settlements, cutting transaction fees by over 80%.",
    content: `
Financial regulators across Asia, Europe, and the Americas have ratified Project Meridian, establishing a decentralized messaging layer for sovereign currencies.

### Impact on Global Trade
- Frictionless real-time remittances
- Instant corporate treasury reconciliation
- Elimination of intermediary clearing bottlenecks
    `,
    featuredImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
    status: "PUBLISHED",
    categoryId: "cat-3",
    category: MOCK_CATEGORIES[2],
    authorId: "usr-author-2",
    author: MOCK_USERS[2],
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    views: 21800,
    likesCount: 940,
    commentsCount: 118,
    sharesCount: 340,
    readTime: "4 min read",
    publishedAt: "2026-09-11T14:15:00.000Z",
    createdAt: "2026-09-11T12:00:00.000Z",
    updatedAt: "2026-09-11T15:00:00.000Z",
    tags: ["Economy", "Banking", "Fintech", "Global Markets"],
  },
  {
    id: "art-3",
    title: "Deep Ocean Probe Unveils Thriving Ecosystem Powered by Geothermal Vents",
    slug: "deep-ocean-probe-geothermal-ecosystem",
    excerpt:
      "Submersible 'Nautilus-X' returns with high-definition footage of previously undiscovered bioluminescent species flourishing 7,000 meters beneath the Mariana Trench.",
    content: `
A team of marine biologists and oceanographers have recorded over 30 new species adapted to survive in extreme hydrostatic pressures without sunlight.
    `,
    featuredImage:
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1200&auto=format&fit=crop&q=80",
    status: "PUBLISHED",
    categoryId: "cat-4",
    category: MOCK_CATEGORIES[3],
    authorId: "usr-author-3",
    author: MOCK_USERS[3],
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    views: 18450,
    likesCount: 1220,
    commentsCount: 94,
    sharesCount: 410,
    readTime: "6 min read",
    publishedAt: "2026-09-10T19:00:00.000Z",
    createdAt: "2026-09-10T17:30:00.000Z",
    updatedAt: "2026-09-10T19:00:00.000Z",
    tags: ["Marine Biology", "Space & Science", "Deep Ocean", "Discovery"],
  },
  {
    id: "art-4",
    title: "The Renaissance of Sustainable Architecture: Timber Skyscrapers in Urban Centers",
    slug: "renaissance-sustainable-architecture-timber-skyscrapers",
    excerpt:
      "How mass timber engineered wood is overtaking concrete and steel to build resilient, carbon-negative towers in the world's most populous cities.",
    content: `
Engineered mass timber is transforming contemporary urban skylines from Tokyo to Zurich, offering seismic resilience while capturing thousands of tons of atmospheric carbon.
    `,
    featuredImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    status: "PUBLISHED",
    categoryId: "cat-6",
    category: MOCK_CATEGORIES[5],
    authorId: "usr-admin-1",
    author: MOCK_USERS[0],
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    views: 9200,
    likesCount: 650,
    commentsCount: 42,
    sharesCount: 180,
    readTime: "4 min read",
    publishedAt: "2026-09-09T11:20:00.000Z",
    createdAt: "2026-09-09T09:00:00.000Z",
    updatedAt: "2026-09-09T11:20:00.000Z",
    tags: ["Architecture", "Sustainability", "Design", "Urbanism"],
  },
  {
    id: "art-5",
    title: "Autonomous Electric Grand Prix Series Confirms 12-City World Championship",
    slug: "autonomous-electric-grand-prix-world-championship",
    excerpt:
      "Self-driving electric hypercars will race wheel-to-wheel at speeds exceeding 320 km/h with software algorithms written by university engineering teams.",
    content: `
The FIA-backed Autonomous Racing League has published its 2027 calendar featuring bespoke street circuits across Singapore, Monaco, London, and Las Vegas.
    `,
    featuredImage:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80",
    status: "PUBLISHED",
    categoryId: "cat-5",
    category: MOCK_CATEGORIES[4],
    authorId: "usr-author-2",
    author: MOCK_USERS[2],
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    views: 14300,
    likesCount: 880,
    commentsCount: 67,
    sharesCount: 290,
    readTime: "3 min read",
    publishedAt: "2026-09-08T16:45:00.000Z",
    createdAt: "2026-09-08T14:10:00.000Z",
    updatedAt: "2026-09-08T16:45:00.000Z",
    tags: ["Motorsport", "EVs", "Autonomy", "Tech"],
  },
  {
    id: "art-6",
    title: "Draft: The Future of Synthetic Biology in Precision Agriculture",
    slug: "draft-synthetic-biology-precision-agriculture",
    excerpt:
      "An in-depth investigation into genetically bioengineered drought-resistant crops and autonomous soil microbiome management.",
    content: "Content is currently being drafted by author.",
    featuredImage:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&auto=format&fit=crop&q=80",
    status: "DRAFT",
    categoryId: "cat-4",
    category: MOCK_CATEGORIES[3],
    authorId: "usr-author-1",
    author: MOCK_USERS[1],
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    views: 0,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    readTime: "7 min read",
    publishedAt: "",
    createdAt: "2026-09-13T02:00:00.000Z",
    updatedAt: "2026-09-13T04:30:00.000Z",
    tags: ["AgriTech", "Biology", "Draft"],
  },
];

// ----------------------------------------------------
// Mock Comments
// ----------------------------------------------------
export const MOCK_COMMENTS: MockComment[] = [
  {
    id: "com-1",
    articleId: "art-1",
    user: {
      id: "usr-member-1",
      name: "Liam O'Connor",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    content:
      "The potential for reducing calculation times from weeks down to minutes is staggering. This could completely change disaster management protocols.",
    createdAt: "2026-09-12T10:14:00.000Z",
    likesCount: 24,
  },
  {
    id: "com-2",
    articleId: "art-1",
    user: {
      id: "usr-author-2",
      name: "Marcus Sterling",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    content:
      "Fantastic article Sophia! Looking forward to seeing the open-source repository release.",
    createdAt: "2026-09-12T11:45:00.000Z",
    likesCount: 12,
  },
];

// ----------------------------------------------------
// Mock Dashboard Statistics (Role-Specific)
// ----------------------------------------------------
export const MOCK_ADMIN_DASHBOARD = {
  stats: {
    totalArticles: 142,
    publishedArticles: 128,
    draftArticles: 14,
    totalUsers: 3840,
    activeAuthors: 24,
    monthlyViews: 489200,
    pendingApprovals: 5,
    todayEngagementRate: "+18.4%",
  },
  viewsChart: [
    { day: "Mon", views: 42000, uniqueVisitors: 28000 },
    { day: "Tue", views: 58000, uniqueVisitors: 39000 },
    { day: "Wed", views: 71000, uniqueVisitors: 48000 },
    { day: "Thu", views: 64000, uniqueVisitors: 44000 },
    { day: "Fri", views: 89000, uniqueVisitors: 61000 },
    { day: "Sat", views: 95000, uniqueVisitors: 68000 },
    { day: "Sun", views: 70200, uniqueVisitors: 49000 },
  ],
  categoryDistribution: [
    { category: "Technology", count: 42, percentage: 30 },
    { category: "World & Politics", count: 35, percentage: 25 },
    { category: "Business & Markets", count: 28, percentage: 20 },
    { category: "Science & Space", count: 19, percentage: 13 },
    { category: "Sports", count: 18, percentage: 12 },
  ],
  recentPendingArticles: [
    {
      id: "art-pending-1",
      title: "Breakthrough in Room-Temperature Superconductors Under Review",
      authorName: "Sophia Chen",
      category: "Technology",
      submittedAt: "2 hours ago",
      status: "PENDING_REVIEW",
    },
    {
      id: "art-pending-2",
      title: "Venture Capital Inflows Hit New Quarterly High in Energy Sector",
      authorName: "Marcus Sterling",
      category: "Business",
      submittedAt: "4 hours ago",
      status: "PENDING_REVIEW",
    },
  ],
};

export const MOCK_AUTHOR_DASHBOARD = {
  stats: {
    myArticlesCount: 32,
    totalViews: 148500,
    totalLikes: 8920,
    totalComments: 1140,
    draftsInProgress: 2,
    avgReadTime: "4.8 min",
  },
  performanceChart: [
    { month: "Apr", views: 18000 },
    { month: "May", views: 24000 },
    { month: "Jun", views: 31000 },
    { month: "Jul", views: 29000 },
    { month: "Aug", views: 42000 },
    { month: "Sep", views: 48500 },
  ],
  myRecentArticles: MOCK_ARTICLES.filter((a) => a.authorId === "usr-author-1"),
};

export const MOCK_MEMBER_DASHBOARD = {
  stats: {
    bookmarkedCount: 8,
    likedCount: 23,
    commentsPosted: 14,
    readingStreakDays: 12,
  },
  savedArticles: [
    MOCK_ARTICLES[0],
    MOCK_ARTICLES[1],
    MOCK_ARTICLES[2],
    MOCK_ARTICLES[3],
    MOCK_ARTICLES[4],
    MOCK_ARTICLES[5],
  ],
  readingHistory: [
    { article: MOCK_ARTICLES[0], readAt: "Today, 10:30 AM", progress: "100%" },
    { article: MOCK_ARTICLES[2], readAt: "Yesterday, 8:15 PM", progress: "100%" },
    { article: MOCK_ARTICLES[4], readAt: "Sep 10, 2026", progress: "60%" },
  ],
  recommendedForYou: [MOCK_ARTICLES[1], MOCK_ARTICLES[3], MOCK_ARTICLES[5]],
};
