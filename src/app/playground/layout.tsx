import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Playground | LLM Decision Hub',
  description: 'Test and compare multiple AI models simultaneously. Compare responses from ChatGPT, Claude, Gemini, and more in real-time with your own API keys.',
  keywords: 'AI playground, model comparison, ChatGPT, Claude, Gemini, API testing, multi-model testing',
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
