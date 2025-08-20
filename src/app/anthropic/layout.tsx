import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anthropic AI Models - Claude 3.5 Sonnet, Haiku & More | Performance Rankings',
  description: 'Explore Anthropic AI models including Claude 3.5 Sonnet, Claude 3.7 Sonnet, and Claude Haiku. Compare performance, safety ratings, pricing, and capabilities with detailed benchmarks.',
  keywords: [
    'Anthropic AI models', 'Claude 3.5 Sonnet', 'Claude 3.7 Sonnet', 'Claude Haiku',
    'Claude AI comparison', 'Anthropic Claude pricing', 'Claude performance benchmarks',
    'Claude safety ratings', 'Anthropic models comparison', 'Claude API capabilities'
  ],
  openGraph: {
    title: 'Anthropic AI Models - Claude 3.5 Sonnet, Haiku & More',
    description: 'Explore Anthropic AI models including Claude 3.5 Sonnet, Claude 3.7 Sonnet, and Claude Haiku with detailed performance benchmarks.',
    url: 'https://llmleaderboard.ai/anthropic',
    siteName: 'LLM Decision Hub',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'Anthropic AI Models - Claude Performance Rankings',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anthropic AI Models - Claude 3.5 Sonnet, Haiku & More',
    description: 'Explore Anthropic AI models with detailed performance benchmarks and safety ratings.',
    images: {
      url: '/hai-cover.png',
      alt: 'Anthropic AI Models - Claude Performance Rankings',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/anthropic',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AnthropicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 