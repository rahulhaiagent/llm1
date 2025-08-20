import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Model Recommendations - Best LLMs for Your Use Case',
  description: 'Get AI model recommendations based on performance charts. Compare the safest, most affordable, best coding and math AI models including GPT-4, Claude, Gemini with interactive visualizations.',
  keywords: [
    'AI model recommendations', 'best AI models', 'LLM comparison charts', 'AI model performance',
    'safest AI models', 'affordable AI models', 'coding AI models', 'math AI models',
    'GPT-4 vs Claude', 'AI benchmarks', 'model selection guide'
  ],
  openGraph: {
    title: 'AI Model Recommendations - Best LLMs for Your Use Case',
    description: 'Get AI model recommendations based on performance charts. Compare the safest, most affordable, best coding and math AI models.',
    url: 'https://llmleaderboard.ai/recommendations',
    siteName: 'LLM Decision Hub',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'AI Model Recommendations - Interactive Performance Charts',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Model Recommendations - Best LLMs for Your Use Case',
    description: 'Get AI model recommendations based on performance charts. Compare safest, most affordable, best coding and math AI models.',
    images: {
      url: '/hai-cover.png',
      alt: 'AI Model Recommendations - Interactive Performance Charts',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/recommendations',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 