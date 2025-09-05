import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - LLM Decision Hub',
  description: 'Get in touch with the Holistic AI team. Submit your LLM for testing, ask about our evaluation methodology, or get guidance on selecting the right model for your enterprise.',
  openGraph: {
    title: 'Contact Us - LLM Decision Hub',
    description: 'Get in touch with the Holistic AI team. Submit your LLM for testing, ask about our evaluation methodology, or get guidance on selecting the right model for your enterprise.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
