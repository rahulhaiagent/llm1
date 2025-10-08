import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - LLM Decision Hub',
  description: 'Learn about the Holistic AI LLM Decision Hub - helping senior leaders make confident, well-informed decisions about their LLM environment.',
  openGraph: {
    title: 'About the LLM Decision Hub - Holistic AI',
    description: 'Learn about the Holistic AI LLM Decision Hub - helping senior leaders make confident, well-informed decisions about their LLM environment.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 