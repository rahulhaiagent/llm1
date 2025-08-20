import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenAI Models - GPT-4, GPT-4o, GPT-4o mini | Performance & Pricing',
  description: 'Explore OpenAI AI models including GPT-4, GPT-4o, GPT-4o mini, and GPT-4.1. Compare performance benchmarks, pricing, safety ratings, and capabilities with detailed analysis.',
  keywords: [
    'OpenAI models', 'GPT-4', 'GPT-4o', 'GPT-4o mini', 'GPT-4.1',
    'OpenAI pricing', 'GPT performance benchmarks', 'OpenAI API', 'GPT comparison',
    'ChatGPT models', 'OpenAI capabilities', 'GPT safety ratings'
  ],
  openGraph: {
    title: 'OpenAI Models - GPT-4, GPT-4o, GPT-4o mini | Performance & Pricing',
    description: 'Explore OpenAI AI models including GPT-4, GPT-4o, GPT-4o mini with detailed performance benchmarks and pricing analysis.',
    url: 'https://llmleaderboard.ai/openai',
    siteName: 'LLM Leaderboard',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'OpenAI Models - GPT Performance Rankings',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAI Models - GPT-4, GPT-4o, GPT-4o mini | Performance & Pricing',
    description: 'Explore OpenAI AI models with detailed performance benchmarks and pricing analysis.',
    images: {
      url: '/hai-cover.png',
      alt: 'OpenAI Models - GPT Performance Rankings',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/openai',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function OpenAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 