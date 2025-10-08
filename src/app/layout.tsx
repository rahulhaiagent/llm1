import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import StructuredData from '@/components/SEO/StructuredData'

import dynamic from 'next/dynamic'

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'LLM Decision Hub - AI Model Rankings & Benchmarks | Holistic AI',
    template: '%s | LLM Decision Hub'
  },
  description: 'Compare AI language models with comprehensive rankings based on performance, safety, cost, and real-world benchmarks. Find the best LLM for your needs - GPT-4, Claude, Gemini & more.',
  keywords: [
    'AI leaderboard', 'LLM comparison', 'AI model ranking', 'language model benchmarks', 
    'GPT-4', 'Claude', 'Gemini', 'AI safety', 'model performance', 'AI cost analysis',
    'machine learning models', 'artificial intelligence comparison', 'LLM evaluation'
  ],
  authors: [{ name: 'Holistic AI', url: 'https://holisticai.com' }],
  creator: 'Holistic AI',
  publisher: 'Holistic AI',
  applicationName: 'LLM Decision Hub',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://llmleaderboard.ai'),
  alternates: {
    canonical: 'https://llmleaderboard.ai',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://llmleaderboard.ai',
    title: 'LLM Decision Hub - AI Model Rankings & Benchmarks',
    description: 'Compare AI language models with comprehensive rankings based on performance, safety, cost, and real-world benchmarks. Find the best LLM for your needs.',
    siteName: 'LLM Decision Hub',
    images: [
      {
        url: '/hai-cover.png',
        width: 1200,
        height: 630,
        alt: 'LLM Decision Hub - AI Model Rankings and Benchmarks by Holistic AI',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@holisticai',
    creator: '@holisticai',
    title: 'LLM Decision Hub - AI Model Rankings & Benchmarks',
    description: 'Compare AI language models with comprehensive rankings based on performance, safety, cost, and real-world benchmarks.',
    images: {
      url: '/hai-cover.png',
      alt: 'LLM Decision Hub - AI Model Rankings and Benchmarks',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/hai-favicon.png',
    apple: '/hai-favicon.png',
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/hai-favicon.png" />
        <meta name="theme-color" content="#3b82f6" />
        <StructuredData
          type="organization"
          data={{
            organization: {
              name: 'Holistic AI',
              url: 'https://holisticai.com',
              logo: 'https://llmleaderboard.ai/hai-cover.png',
              sameAs: [
                'https://twitter.com/holisticai',
                'https://linkedin.com/company/holistic-ai',
              ],
            },
          }}
        />
        <StructuredData
          type="website"
          data={{
            name: 'LLM Decision Hub',
            description: 'Compare AI language models with comprehensive rankings based on performance, safety, cost, and real-world benchmarks.',
            url: 'https://llmleaderboard.ai',
            publisher: {
              name: 'Holistic AI',
              logo: 'https://llmleaderboard.ai/hai-cover.png',
            },
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  )
} 