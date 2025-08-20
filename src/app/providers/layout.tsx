import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Model Providers - OpenAI, Anthropic, Google & More',
  description: 'Browse AI model providers and their offerings. Compare OpenAI, Anthropic, Google, Meta, DeepSeek and other LLM providers with pricing, models, and API capabilities.',
  keywords: [
    'AI model providers', 'LLM providers', 'OpenAI API', 'Anthropic Claude API',
    'Google AI models', 'AI API providers', 'language model providers', 'AI platform comparison',
    'machine learning APIs', 'AI service providers', 'LLM hosting', 'AI infrastructure'
  ],
  openGraph: {
    title: 'AI Model Providers - OpenAI, Anthropic, Google & More',
    description: 'Browse AI model providers and their offerings. Compare OpenAI, Anthropic, Google, Meta, DeepSeek and other LLM providers.',
    url: 'https://llmleaderboard.ai/providers',
    siteName: 'LLM Leaderboard',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'AI Model Providers - LLM Platform Comparison',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Model Providers - OpenAI, Anthropic, Google & More',
    description: 'Browse AI model providers and their offerings. Compare major LLM providers and their API capabilities.',
    images: {
      url: '/hai-cover.png',
      alt: 'AI Model Providers - LLM Platform Comparison',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/providers',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 