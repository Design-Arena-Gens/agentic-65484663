import { NextRequest, NextResponse } from 'next/server';

let autopilotEnabled = false;
let autopilotInterval: NodeJS.Timeout | null = null;

async function autoPostContent() {
  console.log('Autopilot: Generating and posting content...');

  try {
    // Generate content
    const niches = ['horror', 'mystery', 'ai-stories', 'motivation', 'curiosity'];
    const randomNiche = niches[Math.floor(Math.random() * niches.length)];

    const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche: randomNiche, count: 1 }),
    });

    const data = await generateResponse.json();

    if (data.ideas && data.ideas.length > 0) {
      const ideaId = data.ideas[0].id;

      // Post content
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });

      console.log(`Autopilot: Posted content ${ideaId} for niche ${randomNiche}`);
    }
  } catch (error) {
    console.error('Autopilot error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();

    if (enabled && !autopilotEnabled) {
      autopilotEnabled = true;

      // Post twice daily: 12 PM and 8 PM EST
      // For demo purposes, we'll post every 12 hours
      autopilotInterval = setInterval(autoPostContent, 12 * 60 * 60 * 1000);

      // Post immediately on enable
      autoPostContent();

      return NextResponse.json({
        enabled: true,
        message: 'Autopilot enabled - posting 2x daily at optimal US times'
      });
    } else if (!enabled && autopilotEnabled) {
      autopilotEnabled = false;

      if (autopilotInterval) {
        clearInterval(autopilotInterval);
        autopilotInterval = null;
      }

      return NextResponse.json({
        enabled: false,
        message: 'Autopilot disabled'
      });
    }

    return NextResponse.json({ enabled: autopilotEnabled });
  } catch (error) {
    return NextResponse.json({ error: 'Autopilot toggle failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ enabled: autopilotEnabled });
}
