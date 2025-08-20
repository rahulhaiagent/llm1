import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enterprise AI Cost Optimizer - Reduce LLM Costs & Find Best Models',
  description: 'Optimize your enterprise AI costs with intelligent model recommendations. Find the most cost-effective LLMs for your business needs while maintaining performance and quality.',
  keywords: [
    'enterprise AI cost optimization', 'LLM cost reduction', 'AI cost calculator', 'enterprise AI savings',
    'business AI optimization', 'AI ROI calculator', 'LLM pricing optimization', 'enterprise AI strategy',
    'AI budget optimization', 'cost-effective AI models', 'enterprise LLM selection'
  ],
  openGraph: {
    title: 'Enterprise AI Cost Optimizer - Reduce LLM Costs & Find Best Models',
    description: 'Optimize your enterprise AI costs with intelligent model recommendations. Find the most cost-effective LLMs for your business needs.',
    url: 'https://llmleaderboard.ai/enterprise-cost-optimizer',
    siteName: 'LLM Leaderboard',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'Enterprise AI Cost Optimizer - Intelligent LLM Cost Reduction',
        type: 'image/png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI Cost Optimizer - Reduce LLM Costs & Find Best Models',
    description: 'Optimize your enterprise AI costs with intelligent model recommendations. Find cost-effective LLMs for your business.',
    images: {
      url: '/hai-cover.png',
      alt: 'Enterprise AI Cost Optimizer - Intelligent LLM Cost Reduction',
    },
  },
  alternates: {
    canonical: 'https://llmleaderboard.ai/enterprise-cost-optimizer',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function EnterpriseCostOptimizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 