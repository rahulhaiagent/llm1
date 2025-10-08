import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Your LLM - AI Model Performance Testing & Evaluation',
  description: 'Test and evaluate your AI language model performance with comprehensive benchmarks. Compare your LLM against industry standards for coding, math, safety, and general capabilities.',
  keywords: [
    'test LLM', 'AI model testing', 'LLM evaluation', 'AI benchmark testing',
    'model performance testing', 'AI model evaluation tool', 'LLM benchmarks',
    'AI testing platform', 'language model evaluation', 'custom AI testing'
  ],
  openGraph: {
    title: 'Test Your LLM - AI Model Performance Testing & Evaluation',
    description: 'Test and evaluate your AI language model performance with comprehensive benchmarks. Compare your LLM against industry standards.',
    url: 'https://llmleaderboard.ai/test-your-llm',
    siteName: 'LLM Decision Hub',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'Test Your LLM - AI Model Performance Testing',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test Your LLM - AI Model Performance Testing & Evaluation',
    description: 'Test and evaluate your AI language model performance with comprehensive benchmarks.',
    images: {
      url: '/hai-cover.png',
      alt: 'Test Your LLM - AI Model Performance Testing',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/test-your-llm',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TestYourLLMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 