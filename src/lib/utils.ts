import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseRank(rank: string): number | null {
  if (rank === "N/A" || rank === "-" || !rank) return null;
  const match = rank.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function parsePercentage(value: string): number | null {
  if (value === "N/A" || value === "-" || !value) return null;
  const match = value.match(/(\d+(?:\.\d+)?)%/);
  return match ? parseFloat(match[1]) : null;
}

export function parseCost(cost: string): number | null {
  if (cost === "N/A" || cost === "-" || !cost) return null;
  const match = cost.match(/\$(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

export function getDeveloperLogo(developer: string): string {
  const logoMap: { [key: string]: string } = {
    'Anthropic': '/anthropic.png',
    'OpenAI': '/openai.png',
    'Google': '/gemini.png',
    'Meta': '/meta.png',
    'DeepSeek': '/deepseek.png',
    'Mistral': '/Mistral.png',
    'Alibaba': '/qwq.png',
    'Alibaba Cloud': '/qwq.png',
    'xAI': '/xai.png',
    'OpenRouter': '/open-router.jpeg',
    'Moonshot AI': '/Kimi-k2.png'
  };
  
  return logoMap[developer] || '';
} 