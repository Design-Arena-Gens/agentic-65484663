import { NextResponse } from 'next/server';

export async function GET() {
  const trends = {
    topics: [
      "AI Gone Wrong",
      "Unexplained Disappearances 2025",
      "True Crime Mysteries",
      "Haunted Places in America",
      "Creepy TikTok Stories",
      "Paranormal Encounters",
      "Urban Legends Explained",
      "Real Horror Stories",
      "Mysterious Events",
      "Scary Facts"
    ],
    hooks: [
      "You won't believe what happened next...",
      "This actually happened in 2025...",
      "Nobody talks about this...",
      "The truth they don't want you to know...",
      "Wait until you hear the ending...",
      "This will keep you up at night...",
      "I can't believe this is real...",
      "The most terrifying part is...",
      "This changed everything...",
      "Pay attention to what happens at 0:15..."
    ],
    sounds: [
      "Creepy Piano Melody (Trending)",
      "Suspenseful Horror Ambience",
      "Dark Mystery Theme",
      "Eerie Whispers Audio",
      "Heartbeat + Tension Build",
      "Retro Horror Synth",
      "True Crime Podcast Sound",
      "Mysterious Bell Chimes",
      "Deep Voice Narration Beat",
      "Scary Story Background Music"
    ],
    hashtags: [
      "#scary",
      "#horror",
      "#mystery",
      "#truecrime",
      "#creepy",
      "#paranormal",
      "#haunted",
      "#conspiracy",
      "#unexplained",
      "#terrifying",
      "#fyp",
      "#viral",
      "#storytime",
      "#scarystories",
      "#horrortok",
      "#mysterysolved",
      "#urbanlegend",
      "#ghoststories",
      "#creepypasta",
      "#nightmares"
    ]
  };

  return NextResponse.json(trends);
}
