import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LLM Leaderboard - AI Model Rankings & Benchmarks',
  description: 'Compare the top AI language models with comprehensive rankings based on performance, safety, cost, and real-world benchmarks. See how GPT-4, Claude, Gemini, and other models stack up.',
  keywords: [
    'AI leaderboard', 'LLM ranking', 'language model comparison', 'AI model benchmarks', 
    'GPT-4 vs Claude', 'AI safety rankings', 'model performance metrics', 'LLM evaluation'
  ],
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

