import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Red Teaming Results - Model Safety Testing & Vulnerabilities',
  description: 'Comprehensive AI red teaming results showing safety testing, jailbreaking resistance, and vulnerability assessments for major LLMs including GPT-4, Claude, and Gemini models.',
  keywords: [
    'AI red teaming', 'AI safety testing', 'LLM vulnerabilities', 'jailbreaking resistance',
    'AI model safety', 'harmful content detection', 'AI security assessment', 'model safety ranking',
    'GPT-4 safety', 'Claude safety', 'AI risk evaluation', 'responsible AI'
  ],
  openGraph: {
    title: 'AI Red Teaming Results - Model Safety Testing & Vulnerabilities',
    description: 'Comprehensive AI red teaming results showing safety testing, jailbreaking resistance, and vulnerability assessments for major LLMs.',
    url: 'https://llmleaderboard.ai/red-teaming',
    siteName: 'LLM Leaderboard',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'AI Red Teaming Results - Model Safety Testing',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Red Teaming Results - Model Safety Testing & Vulnerabilities',
    description: 'Comprehensive AI red teaming results showing safety testing, jailbreaking resistance, and vulnerability assessments for major LLMs.',
    images: {
      url: '/hai-cover.png',
      alt: 'AI Red Teaming Results - Model Safety Testing',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/red-teaming',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RedTeamingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 