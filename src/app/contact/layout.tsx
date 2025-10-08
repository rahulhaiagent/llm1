import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | LLM Decision Hub',
  description: 'Get in touch with us for any inquiries about LLM evaluation, testing, or enterprise guidance. We\'re here to help with your AI needs.',
  keywords: 'contact, LLM evaluation, AI testing, enterprise AI, support',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
