'use client';

import { useState, useEffect } from 'react';

interface ContentIdea {
  id: string;
  viralIdea: string;
  script: string;
  visualPrompt: string;
  voiceoverText: string;
  caption: string;
  hashtags: string[];
  bestPostingTime: string;
  niche: string;
  generatedAt: string;
  imageUrl?: string;
  performance?: {
    watchTime?: number;
    saves?: number;
    shares?: number;
  };
}

export default function Home() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [autopilot, setAutopilot] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState('horror');
  const [trends, setTrends] = useState<any>(null);

  const niches = ['horror', 'mystery', 'ai-stories', 'motivation', 'curiosity'];

  useEffect(() => {
    fetchTrends();
    fetchIdeas();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/trends');
      const data = await response.json();
      setTrends(data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      const data = await response.json();
      setIdeas(data.ideas || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: selectedNiche, count: 3 }),
      });
      const data = await response.json();
      if (data.ideas) {
        setIdeas([...data.ideas, ...ideas]);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    }
    setLoading(false);
  };

  const toggleAutopilot = async () => {
    try {
      const response = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !autopilot }),
      });
      const data = await response.json();
      setAutopilot(data.enabled);
    } catch (error) {
      console.error('Error toggling autopilot:', error);
    }
  };

  const postContent = async (ideaId: string) => {
    try {
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });
      alert('Content posted successfully!');
    } catch (error) {
      console.error('Error posting content:', error);
      alert('Error posting content');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            AI Content Growth Agent
          </h1>
          <p className="text-gray-300 text-lg">
            Autonomous viral content generation for US audiences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Control Panel</h2>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Select Niche</label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {niches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche.charAt(0).toUpperCase() + niche.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg mb-4 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Generating...' : 'Generate 3 Ideas'}
            </button>

            <button
              onClick={toggleAutopilot}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${
                autopilot
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {autopilot ? '✓ Autopilot ON' : 'Autopilot OFF'}
            </button>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Status:</strong> {autopilot ? 'Auto-posting 2x daily' : 'Manual mode'}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Content Queue:</strong> {ideas.length} ideas
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow-xl border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Trending Now (US)</h2>
            {trends ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-pink-400 mb-2">Top Topics</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {trends.topics?.slice(0, 5).map((topic: string, i: number) => (
                      <li key={i}>• {topic}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-pink-400 mb-2">Viral Hooks</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {trends.hooks?.slice(0, 5).map((hook: string, i: number) => (
                      <li key={i}>• {hook}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-pink-400 mb-2">Hot Sounds</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {trends.sounds?.slice(0, 5).map((sound: string, i: number) => (
                      <li key={i}>• {sound}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-pink-400 mb-2">Top Hashtags</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {trends.hashtags?.slice(0, 5).map((tag: string, i: number) => (
                      <li key={i}>• {tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Loading trends...</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Generated Content</h2>

          {ideas.length === 0 ? (
            <p className="text-gray-400 text-center py-12">
              No content generated yet. Click "Generate 3 Ideas" to start.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-gray-700 rounded-lg p-5 border border-gray-600 hover:border-purple-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-purple-600 px-3 py-1 rounded-full">
                      {idea.niche}
                    </span>
                    <span className="text-xs text-gray-400">{idea.bestPostingTime}</span>
                  </div>

                  {idea.imageUrl && (
                    <img
                      src={idea.imageUrl}
                      alt="Content visual"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}

                  <h3 className="font-bold text-pink-400 mb-2 line-clamp-2">
                    {idea.viralIdea}
                  </h3>

                  <div className="bg-gray-800 p-3 rounded mb-3 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-300">{idea.script}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Visual Prompt:</p>
                    <p className="text-xs text-gray-300 line-clamp-2">{idea.visualPrompt}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Caption:</p>
                    <p className="text-sm text-gray-300">{idea.caption}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {idea.hashtags.slice(0, 6).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-800 text-blue-400 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => postContent(idea.id)}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
                  >
                    Post Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>AI Content Growth Agent • Autonomous Viral Content Generation</p>
        </footer>
      </div>
    </div>
  );
}
