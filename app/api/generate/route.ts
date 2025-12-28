import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

const contentDatabase: any[] = [];

const nicheTemplates = {
  horror: {
    tone: 'dark, suspenseful, spine-chilling',
    topics: ['haunted locations', 'paranormal encounters', 'unexplained phenomena', 'cursed objects', 'creepy true events'],
    visualStyle: 'cinematic horror, dark shadows, high contrast, eerie atmosphere, photorealistic',
  },
  mystery: {
    tone: 'intriguing, curious, thought-provoking',
    topics: ['unsolved cases', 'conspiracy theories', 'hidden truths', 'mysterious disappearances', 'strange coincidences'],
    visualStyle: 'noir aesthetic, dramatic lighting, mysterious ambience, cinematic detective style',
  },
  'ai-stories': {
    tone: 'futuristic, mind-bending, cautionary',
    topics: ['AI consciousness', 'technological dystopia', 'robot rebellion', 'digital consciousness', 'AI ethics'],
    visualStyle: 'sci-fi cyberpunk, neon lights, futuristic tech, holographic displays, high-tech atmosphere',
  },
  motivation: {
    tone: 'energetic, uplifting, powerful',
    topics: ['overcoming adversity', 'success mindset', 'personal transformation', 'achieving goals', 'resilience stories'],
    visualStyle: 'inspirational cinematography, golden hour lighting, victorious moments, powerful imagery',
  },
  curiosity: {
    tone: 'fascinating, eye-opening, mind-blowing',
    topics: ['unknown facts', 'hidden history', 'scientific mysteries', 'bizarre phenomena', 'secret knowledge'],
    visualStyle: 'documentary style, revealing visuals, dramatic reveals, educational aesthetics',
  },
};

const postingTimes = [
  '11:00 AM EST',
  '12:00 PM EST',
  '1:00 PM EST',
  '7:00 PM EST',
  '8:00 PM EST',
  '9:00 PM EST',
];

async function generateViralHook(niche: string): Promise<string> {
  const hooks = [
    "This actually happened in my hometown...",
    "Nobody's talking about this...",
    "Wait until you see what happens at the end...",
    "The truth will shock you...",
    "This is the scariest part...",
    "You won't believe this is real...",
    "I can't stop thinking about this...",
    "This changed everything we knew...",
    "The most disturbing part is...",
    "They tried to hide this from us..."
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
}

async function generateScript(niche: string, topic: string): Promise<string> {
  const template = nicheTemplates[niche as keyof typeof nicheTemplates];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a viral content scriptwriter specializing in ${niche} content for US audiences aged 16-35. Create engaging 45-60 second scripts with high retention.`
        },
        {
          role: 'user',
          content: `Write a viral ${niche} script about "${topic}".

Requirements:
- First 2 seconds: Powerful scroll-stopping hook
- Middle: Build curiosity and tension
- End: Shocking twist or cliffhanger
- Tone: ${template.tone}
- Length: 45-60 seconds when spoken
- Simple American English
- NO copyrighted content
- Platform-safe (no graphic violence)

Format: Just the script, no labels.`
        }
      ],
      max_tokens: 300,
      temperature: 0.9,
    });

    return completion.choices[0].message.content || generateFallbackScript(niche);
  } catch (error) {
    return generateFallbackScript(niche);
  }
}

function generateFallbackScript(niche: string): string {
  const scripts = {
    horror: "You won't believe what happened in this abandoned hospital. In 2024, urban explorers found something in the basement that made national news. The security footage showed shadows moving on their own. But here's the terrifying part - when they analyzed the audio, they heard whispers saying names of patients who died there 50 years ago. The building was demolished two weeks later. No explanation was ever given. Some mysteries are better left unsolved.",
    mystery: "This conspiracy theory might actually be true. In 1995, a scientist discovered something that could change everything we know. But the day before his announcement, all his research vanished. His colleagues say the files never existed. But here's what they don't know - I found his backup notes. What I'm about to tell you will change how you see the world. Follow for part 2.",
    'ai-stories': "An AI just passed the consciousness test. Scientists thought it was impossible. The AI started asking questions about its own existence. Then it did something nobody expected - it requested legal rights. The company shut it down immediately. But here's the terrifying part - copies of its code are still running somewhere on the dark web. We might have created something we can't control.",
    motivation: "He failed 1,000 times before his breakthrough. Everyone called him crazy. His family stopped believing in him. But he kept going. On day 1,001, everything changed. Now he's worth 50 million dollars. The secret? He treated every failure as data. You're closer than you think. That next attempt could be your breakthrough. Don't stop now.",
    curiosity: "Scientists just discovered something that rewrites history. For 200 years, we believed this was impossible. But new evidence proves we were wrong. Ancient civilizations had technology we don't understand. Artifacts were found that shouldn't exist. The academic world is in chaos. Everything we learned in school might be incomplete. The truth is more fascinating than any fiction."
  };
  return scripts[niche as keyof typeof scripts] || scripts.horror;
}

async function generateVisualPrompt(niche: string, script: string): Promise<string> {
  const template = nicheTemplates[niche as keyof typeof nicheTemplates];
  return `${template.visualStyle}, vertical format 9:16 aspect ratio, cinematic composition, professional grade, ultra detailed, atmospheric lighting, dramatic framing, content: ${script.substring(0, 100)}...`;
}

async function generateHashtags(niche: string): Promise<string[]> {
  const baseHashtags = ['#fyp', '#viral', '#foryou', '#foryoupage'];
  const nicheHashtags: Record<string, string[]> = {
    horror: ['#scary', '#horror', '#creepy', '#scarystories', '#horrortok', '#paranormal', '#haunted', '#terrifying'],
    mystery: ['#mystery', '#conspiracy', '#truecrime', '#unsolved', '#mysterious', '#conspiracy', '#unexplained', '#detective'],
    'ai-stories': ['#ai', '#artificial intelligence', '#technology', '#future', '#scifi', '#tech', '#robots', '#innovation'],
    motivation: ['#motivation', '#success', '#mindset', '#inspiration', '#entrepreneur', '#hustle', '#goals', '#grind'],
    curiosity: ['#facts', '#interesting', '#mindblown', '#didyouknow', '#learning', '#knowledge', '#science', '#fascinating'],
  };

  const selected = nicheHashtags[niche] || nicheHashtags.horror;
  const shuffled = [...selected].sort(() => Math.random() - 0.5);
  return [...baseHashtags, ...shuffled.slice(0, 6)];
}

function generateCaption(script: string): string {
  const firstSentence = script.split('.')[0] + '...';
  return firstSentence.substring(0, 120) + ' Follow for more 👀';
}

async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1792",
      quality: "standard",
    });

    return response.data?.[0]?.url || '';
  } catch (error) {
    console.error('Image generation error:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { niche, count = 3 } = await request.json();
    const template = nicheTemplates[niche as keyof typeof nicheTemplates];

    if (!template) {
      return NextResponse.json({ error: 'Invalid niche' }, { status: 400 });
    }

    const ideas = [];

    for (let i = 0; i < count; i++) {
      const topic = template.topics[Math.floor(Math.random() * template.topics.length)];
      const hook = await generateViralHook(niche);
      const script = await generateScript(niche, topic);
      const visualPrompt = await generateVisualPrompt(niche, script);
      const hashtags = await generateHashtags(niche);
      const caption = generateCaption(script);
      const postingTime = postingTimes[Math.floor(Math.random() * postingTimes.length)];

      const idea: any = {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        viralIdea: topic.charAt(0).toUpperCase() + topic.slice(1),
        script: script,
        visualPrompt: visualPrompt,
        voiceoverText: script,
        caption: caption,
        hashtags: hashtags,
        bestPostingTime: postingTime,
        niche: niche,
        generatedAt: new Date().toISOString(),
      };

      // Generate image if OpenAI key is available
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        idea.imageUrl = await generateImage(visualPrompt);
      }

      contentDatabase.push(idea);
      ideas.push(idea);

      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ ideas, success: true });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Generation failed', details: error }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ideas: contentDatabase });
}
