import { NextResponse } from 'next/server';

export async function GET() {
  // Mock analytics data
  const analytics = {
    totalPosts: 47,
    totalViews: 2847392,
    totalEngagement: 184632,
    avgWatchTime: 42,
    topPerformingNiche: 'horror',
    retentionRate: 78,
    shareRate: 12,
    performanceByNiche: {
      horror: {
        posts: 15,
        avgViews: 87234,
        avgRetention: 82,
        avgShares: 2341,
      },
      mystery: {
        posts: 12,
        avgViews: 64523,
        avgRetention: 76,
        avgShares: 1876,
      },
      'ai-stories': {
        posts: 8,
        avgViews: 52341,
        avgRetention: 71,
        avgShares: 1432,
      },
      motivation: {
        posts: 7,
        avgViews: 45678,
        avgRetention: 68,
        avgShares: 987,
      },
      curiosity: {
        posts: 5,
        avgViews: 38765,
        avgRetention: 65,
        avgShares: 756,
      },
    },
    recentPosts: [
      {
        id: '1',
        niche: 'horror',
        title: 'Abandoned Hospital Discovery',
        views: 123456,
        retention: 85,
        shares: 3421,
        postedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        niche: 'mystery',
        title: 'Unsolved Conspiracy Theory',
        views: 98765,
        retention: 79,
        shares: 2876,
        postedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '3',
        niche: 'ai-stories',
        title: 'AI Consciousness Breakthrough',
        views: 87654,
        retention: 74,
        shares: 2345,
        postedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
    growthMetrics: {
      followersGained: 4523,
      avgDailyGrowth: 312,
      projectedMonthlyGrowth: 9360,
    },
  };

  return NextResponse.json(analytics);
}
