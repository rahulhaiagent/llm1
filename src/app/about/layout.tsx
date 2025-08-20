import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - LLM Leaderboard',
  description: 'Learn about the Holistic AI LLM Leaderboard - helping senior leaders make confident, well-informed decisions about their LLM environment.',
  openGraph: {
    title: 'About the LLM Leaderboard - Holistic AI',
    description: 'Learn about the Holistic AI LLM Leaderboard - helping senior leaders make confident, well-informed decisions about their LLM environment.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 