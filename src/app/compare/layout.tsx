import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Model Comparison Tool - Compare LLMs Side by Side',
  description: 'Compare AI language models side by side. Analyze performance, pricing, safety, and capabilities of GPT-4, Claude, Gemini, DeepSeek and other LLMs with detailed comparison charts.',
  keywords: [
    'AI model comparison', 'LLM comparison tool', 'compare AI models', 'GPT-4 vs Claude',
    'AI model benchmark comparison', 'language model comparison', 'AI pricing comparison',
    'model performance comparison', 'AI safety comparison', 'LLM capabilities comparison'
  ],
  openGraph: {
    title: 'AI Model Comparison Tool - Compare LLMs Side by Side',
    description: 'Compare AI language models side by side. Analyze performance, pricing, safety, and capabilities of GPT-4, Claude, Gemini, DeepSeek and other LLMs.',
    url: 'https://llmleaderboard.ai/compare',
    siteName: 'LLM Leaderboard',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'AI Model Comparison Tool - Side by Side LLM Analysis',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Model Comparison Tool - Compare LLMs Side by Side',
    description: 'Compare AI language models side by side. Analyze performance, pricing, safety, and capabilities of major LLMs.',
    images: {
      url: '/hai-cover.png',
      alt: 'AI Model Comparison Tool - Side by Side LLM Analysis',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/compare',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 