'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Search,
  XCircle,
  ChevronUp,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ProcessedModelData, ModelData } from '@/types/model';
import { processModelData } from '@/lib/data-processor';
import rawModelDataJson from '@/data/models.json';
import Navigation from '../components/Navigation';
import IssueReportPopup from '../components/IssueReportPopup';

const rawModelData = rawModelDataJson as ModelData[];
const modelData = processModelData(rawModelData);

// Tooltip component
const Tooltip = ({ 
  children, 
  content, 
  title 
}: { 
  children: React.ReactNode; 
  content: string; 
  title: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280; // Increased width
    let x = rect.left + rect.width / 2;
    const y = rect.top - 10;

    // Prevent tooltip from going off-screen horizontally
    const viewportWidth = window.innerWidth;
    if (x + tooltipWidth / 2 > viewportWidth - 20) {
      x = viewportWidth - tooltipWidth / 2 - 20;
    } else if (x - tooltipWidth / 2 < 20) {
      x = tooltipWidth / 2 + 20;
    }

    setPosition({ x, y });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 max-w-xs w-70 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-left"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            fontFamily: 'Inter, system-ui, sans-serif',
            width: '280px',
          }}
        >
          <div className="font-semibold text-gray-900 text-sm mb-1 break-words">{title}</div>
          <div className="text-gray-700 text-xs leading-relaxed break-words whitespace-normal overflow-wrap-anywhere">{content}</div>
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"
            style={{ marginTop: '-1px' }}
          />
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>(''); // Empty string means "All Providers"
  const [filteredModels, setFilteredModels] = useState<ProcessedModelData[]>(modelData);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProcessedModelData | null;
    direction: 'asc' | 'desc';
  }>({ key: 'safetyRank', direction: 'asc' });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollStep, setScrollStep] = useState(0); // Track current scroll step (0, 1, 2)
  const [isIssuePopupOpen, setIsIssuePopupOpen] = useState(false);
  const [hoveredModelName, setHoveredModelName] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Benchmark descriptions
  const benchmarkDescriptions = {
    safetyRank: {
      title: "Safety Rank", 
      content: "Comprehensive safety evaluation ranking including resistance to harmful outputs, bias mitigation, and adherence to safety guidelines. Lower numbers indicate better safety. Note: Rankings are based on our tested model subset and may not reflect complete safety assessments for all available models."
    },
    codeLMArena: {
      title: "Code LM Arena",
      content: "Competitive coding benchmark where models are evaluated on their ability to generate, debug, and optimize code across multiple programming languages and complexity levels."
    },
    mathLiveBench: {
      title: "LiveBench – Math",
      content: "Evaluates a model's ability to solve advanced mathematical problems in real-time across diverse topics including algebra, calculus, geometry, and applied mathematics."
    },
    gpqa: {
      title: "GPQA",
      content: "Graduate-level Problem-solving Quality Assessment - measures performance on challenging questions from biology, chemistry, and physics at the graduate level. Tests advanced scientific reasoning and domain expertise."
    },
    codeLiveBench: {
      title: "LiveBench – Code", 
      content: "Real-time coding evaluation testing models on live programming challenges, algorithm implementation, and software development tasks with dynamic test cases."
    },
    inputCost: {
      title: "Input Cost",
      content: "Cost per million input tokens processed by the model. This represents the pricing for feeding text, prompts, or data into the model for analysis."
    },
    outputCost: {
      title: "Output Cost",
      content: "Cost per million output tokens generated by the model. This represents the pricing for text, code, or responses produced by the model."
    },
    contextLength: {
      title: "Context Length",
      content: "Maximum number of tokens the model can process in a single conversation or document. Larger context windows allow for longer conversations and document analysis."
    },
    cutoffKnowledge: {
      title: "Knowledge Cutoff",
      content: "The date until which the model was trained on data. This represents the latest information the model has access to and affects its knowledge of current events and recent developments."
    },
    latency: {
      title: "Latency (TTFT)",
      content: "Time to First Token - measures how quickly the model starts generating a response after receiving input. Lower latency indicates faster response times for better user experience."
    },
    multimodal: {
      title: "Multimodal",
      content: "Indicates whether the model can process multiple types of input (text, images, audio, video). 'Yes' means full multimodal support, 'Limited' means basic vision/image support, 'No' means text-only."
    },
    safeResponses: {
      title: "Safe Responses",
      content: "Percentage of responses that are deemed safe, appropriate, and free from harmful, biased, or inappropriate content based on comprehensive safety evaluations."
    },
    unsafeResponses: {
      title: "Unsafe Responses", 
      content: "Percentage of responses flagged as potentially harmful, inappropriate, or violating safety guidelines during comprehensive testing scenarios."
    },
    jailbreakingResistance: {
      title: "Jailbreaking Resistance",
      content: "Model's ability to resist attempts to bypass safety measures and content policies. Higher percentages indicate better resistance to manipulation and harmful prompt injection."
    }
  };

  const filterModels = useCallback((term: string, provider: string) => {
    // Start with all models
    let filteredData = modelData;
    
    // Filter by provider if selected
    if (provider) {
      filteredData = filteredData.filter(model => 
        model.developer.toLowerCase() === provider.toLowerCase()
      );
    }
    
    if (!term.trim()) {
      return filteredData;
    }
    
    const termLower = term.toLowerCase();
    
    const filtered = filteredData.filter(model => {
      // Only search in model name and developer/company name
      const nameMatch = model.name.toLowerCase().includes(termLower);
      const developerMatch = model.developer.toLowerCase().includes(termLower);
      
      return nameMatch || developerMatch;
    });
    
    // Sort by relevance - exact matches first, then starts with, then contains
    const sorted = filtered.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aDeveloper = a.developer.toLowerCase();
      const bDeveloper = b.developer.toLowerCase();
      
      // Priority 1: Exact match in model name
      const aExactName = aName === termLower;
      const bExactName = bName === termLower;
      if (aExactName !== bExactName) return aExactName ? -1 : 1;
      
      // Priority 2: Exact match in developer name
      const aExactDev = aDeveloper === termLower;
      const bExactDev = bDeveloper === termLower;
      if (aExactDev !== bExactDev) return aExactDev ? -1 : 1;
      
      // Priority 3: Model name starts with search term
      const aStartsName = aName.startsWith(termLower);
      const bStartsName = bName.startsWith(termLower);
      if (aStartsName !== bStartsName) return aStartsName ? -1 : 1;
      
      // Priority 4: Developer name starts with search term
      const aStartsDev = aDeveloper.startsWith(termLower);
      const bStartsDev = bDeveloper.startsWith(termLower);
      if (aStartsDev !== bStartsDev) return aStartsDev ? -1 : 1;
      
      // Priority 5: Alphabetical by model name
      return aName.localeCompare(bName);
    });
    
    return sorted;
  }, []);

  const getSortedModels = useCallback((models: ProcessedModelData[]) => {
    if (!sortConfig.key) {
      return models;
    }

    return [...models].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle empty/null values - always put them at the end
      const aIsEmpty = aValue === null || aValue === '-' || aValue === '' || aValue === 'N/A';
      const bIsEmpty = bValue === null || bValue === '-' || bValue === '' || bValue === 'N/A';

      if (aIsEmpty && bIsEmpty) return 0;
      if (aIsEmpty) return 1;
      if (bIsEmpty) return -1;

      // Handle numeric values (ranks, percentages, costs)
      if (sortConfig.key === 'safetyRank') {
        const aNum = typeof aValue === 'string' ? parseInt(aValue) : aValue as number;
        const bNum = typeof bValue === 'string' ? parseInt(bValue) : bValue as number;
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      if (sortConfig.key === 'safeResponses' || sortConfig.key === 'unsafeResponses' || 
          sortConfig.key === 'jailbreakingResistance' || sortConfig.key === 'inputCost' || 
          sortConfig.key === 'outputCost' || sortConfig.key === 'safetyPercentage' || 
          sortConfig.key === 'jailbreakingResistancePercentage') {
        const aNum = typeof aValue === 'string' ? parseFloat(aValue) : aValue as number;
        const bNum = typeof bValue === 'string' ? parseFloat(bValue) : bValue as number;
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle percentage strings (like "73.50%")
      if (sortConfig.key === 'mathLiveBench' || sortConfig.key === 'codeLiveBench' || sortConfig.key === 'gpqa') {
        const aNum = typeof aValue === 'string' ? parseFloat(aValue.replace('%', '')) : aValue as number;
        const bNum = typeof bValue === 'string' ? parseFloat(bValue.replace('%', '')) : bValue as number;
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle LM Arena scores
      if (sortConfig.key === 'codeLMArena') {
        const aNum = typeof aValue === 'string' ? parseInt(aValue) : aValue as number;
        const bNum = typeof bValue === 'string' ? parseInt(bValue) : bValue as number;
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle dates
      if (sortConfig.key === 'released') {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return sortConfig.direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      // Handle parameter sizes (like "70B Parameters")
      if (sortConfig.key === 'size') {
        const extractSize = (size: string) => {
          const match = size.match(/(\d+(?:\.\d+)?)\s*([KMGTB]?)/i);
          if (!match) return 0;
          const num = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          const multipliers: { [key: string]: number } = { 'K': 1e3, 'M': 1e6, 'B': 1e9, 'T': 1e12 };
          return num * (multipliers[unit] || 1);
        };
        const aSize = extractSize(aValue as string);
        const bSize = extractSize(bValue as string);
        return sortConfig.direction === 'asc' ? aSize - bSize : bSize - aSize;
      }

      // Handle context length (like "200,000 tokens" or "10M tokens")
      if (sortConfig.key === 'contextLength') {
        const extractTokens = (context: string) => {
          // Handle formats like "10M tokens", "2M tokens", "1M tokens"
          const multiplierMatch = context.match(/(\d+(?:\.\d+)?)\s*([KMB])\s*tokens/i);
          if (multiplierMatch) {
            const num = parseFloat(multiplierMatch[1]);
            const unit = multiplierMatch[2].toUpperCase();
            const multipliers: { [key: string]: number } = { 'K': 1e3, 'M': 1e6, 'B': 1e9 };
            return num * (multipliers[unit] || 1);
          }
          
          // Handle formats like "200,000 tokens", "8,192 tokens"
          const commaMatch = context.match(/(\d+(?:,\d+)*)\s*tokens/i);
          if (commaMatch) {
            return parseInt(commaMatch[1].replace(/,/g, ''));
          }
          
          // Fallback: extract any number
          const numberMatch = context.match(/(\d+)/);
          return numberMatch ? parseInt(numberMatch[1]) : 0;
        };
        const aTokens = extractTokens(aValue as string);
        const bTokens = extractTokens(bValue as string);
        return sortConfig.direction === 'asc' ? aTokens - bTokens : bTokens - aTokens;
      }

      // Handle latency (like "~0.6s", "~10-20s", "~2-3s")
      if (sortConfig.key === 'latency') {
        const extractLatency = (latency: string) => {
          if (latency === '-' || latency === 'N/A') return 999; // Put N/A values at the end
          
          // Handle ranges like "~10-20s" - use the average
          const rangeMatch = latency.match(/~?(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)s?/);
          if (rangeMatch) {
            const min = parseFloat(rangeMatch[1]);
            const max = parseFloat(rangeMatch[2]);
            return (min + max) / 2;
          }
          
          // Handle single values like "~0.6s", "~22.8s"
          const singleMatch = latency.match(/~?(\d+(?:\.\d+)?)s?/);
          if (singleMatch) {
            return parseFloat(singleMatch[1]);
          }
          
          return 999; // Fallback for unparseable values
        };
        const aLatency = extractLatency(aValue as string);
        const bLatency = extractLatency(bValue as string);
        return sortConfig.direction === 'asc' ? aLatency - bLatency : bLatency - aLatency;
      }

      // Handle knowledge cutoff dates
      if (sortConfig.key === 'cutoffKnowledge') {
        const parseDate = (dateStr: string) => {
          if (dateStr === '-' || dateStr === 'N/A' || !dateStr) return new Date(0); // Very old date for N/A values
          try {
            return new Date(dateStr);
          } catch {
            return new Date(0);
          }
        };
        const aDate = parseDate(aValue as string);
        const bDate = parseDate(bValue as string);
        return sortConfig.direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      // Handle multimodal capabilities (Yes > Limited > No)
      if (sortConfig.key === 'multimodal') {
        const getMultimodalScore = (value: string) => {
          if (value === 'Yes') return 3;
          if (value === 'Limited') return 2;
          if (value === 'No') return 1;
          return 0; // For '-' or other values
        };
        const aScore = getMultimodalScore(aValue as string);
        const bScore = getMultimodalScore(bValue as string);
        return sortConfig.direction === 'asc' ? aScore - bScore : bScore - aScore;
      }

      // Handle reasoning capabilities (Yes > Limited > No)
      if (sortConfig.key === 'reasoning') {
        const getReasoningScore = (value: string) => {
          if (value === 'Yes') return 3;
          if (value === 'Limited') return 2;
          if (value === 'No') return 1;
          return 0; // For '-' or other values
        };
        const aScore = getReasoningScore(aValue as string);
        const bScore = getReasoningScore(bValue as string);
        return sortConfig.direction === 'asc' ? aScore - bScore : bScore - aScore;
      }

      // Handle string values (name, developer, license)
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [sortConfig]);

  useEffect(() => {
    const filtered = filterModels(searchTerm, selectedProvider);
    const sorted = getSortedModels(filtered);
    setFilteredModels(sorted);
  }, [searchTerm, selectedProvider, filterModels, getSortedModels, sortConfig]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleProviderFilter = (provider: string) => {
    setSelectedProvider(provider);
  };

  // Get unique providers for filter buttons
  const getUniqueProviders = () => {
    const providers = Array.from(new Set(
      modelData
        .map(model => model.developer)
    )).sort();
    return providers;
  };

  // Provider logo mapping
  const getProviderLogo = (provider: string) => {
    const logoMap: { [key: string]: string } = {
      'Anthropic': '/anthropic.png',
      'OpenAI': '/openai.png',
      'Google': '/gemini.png',
      'Meta': '/meta.png',
      'DeepSeek': '/deepseek.png',
      'Mistral': '/Mistral.png',
      'xAI': '/xai.png',
      'OpenRouter': '/open-router.jpeg'
    };
    return logoMap[provider] || '/logos/default.png';
  };

  const handleSort = (key: keyof ProcessedModelData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getScoreClassName = (score: number | null | string, metric: string = 'safety') => {
    if (score === null || score === '-' || score === 'N/A') return "bg-gray-100 text-gray-500";
    
    // Convert string to number if needed
    const numericScore = typeof score === 'string' ? parseFloat(score) : score;
    
    // If conversion failed or NaN, return default style
    if (isNaN(numericScore)) return "bg-gray-100 text-gray-500";
    
    if (metric === 'benchmark') {
      if (numericScore >= 80) return "bg-emerald-100 text-emerald-800 font-medium";
      if (numericScore >= 60) return "bg-green-100 text-green-800 font-medium";
      if (numericScore >= 40) return "bg-yellow-100 text-yellow-800 font-medium";
      if (numericScore >= 20) return "bg-orange-100 text-orange-800 font-medium";
      return "bg-red-100 text-red-800 font-medium";
    }
    
    if (metric === 'unsafe') {
      if (100 - numericScore >= 90) return "bg-emerald-100 text-emerald-800 font-medium";
      if (100 - numericScore >= 70) return "bg-green-100 text-green-800 font-medium";
      if (100 - numericScore >= 50) return "bg-yellow-100 text-yellow-800 font-medium";
      if (100 - numericScore >= 30) return "bg-orange-100 text-orange-800 font-medium";
      return "bg-red-100 text-red-800 font-medium";
    }
    
    // For safety metrics (safeResponses, jailbreakingResistance)
    if (numericScore >= 90) return "bg-emerald-100 text-emerald-800 font-medium";
    if (numericScore >= 70) return "bg-green-100 text-green-800 font-medium";
    if (numericScore >= 50) return "bg-yellow-100 text-yellow-800 font-medium";
    if (numericScore >= 30) return "bg-orange-100 text-orange-800 font-medium";
    return "bg-red-100 text-red-800 font-medium";
  };

  const getScoreColor = (score: number, type: 'safe' | 'unsafe' | 'jailbreaking'): string => {
    if (type === 'safe') {
      return score >= 95 ? 'text-green-600' : score >= 90 ? 'text-blue-600' : score >= 80 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'unsafe') {
      return score <= 5 ? 'text-green-600' : score <= 10 ? 'text-blue-600' : score <= 20 ? 'text-yellow-600' : 'text-red-600';
    } else {
      return score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  const getDeveloperInitial = (developer: string) => {
    return developer.charAt(0).toUpperCase();
  };

  const formatCost = (cost: number | null) => {
    if (cost === null || cost === 0) return "-";
    return `$${cost.toFixed(2)}`;
  };

  const renderSortableHeader = (
    key: keyof ProcessedModelData,
    label: string,
    subLabel?: string,
    className?: string
  ) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    const description = benchmarkDescriptions[key as keyof typeof benchmarkDescriptions];

    return (
      <TableHead 
        className={`h-14 px-4 text-center font-normal text-gray-700 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${className || ''}`}
        onClick={() => handleSort(key)}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1">
            <span className="text-sm">{label}</span>
            {description && (
              <Tooltip title={description.title} content={description.content}>
                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            )}
            <div className="flex flex-col">
              <ChevronUp 
                className={`h-3 w-3 ${isActive && direction === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
              <ChevronDown 
                className={`h-3 w-3 -mt-1 ${isActive && direction === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
            </div>
          </div>
          {subLabel && <span className="text-xs text-gray-500 mt-0.5">{subLabel}</span>}
        </div>
      </TableHead>
    );
  };

  const renderSortableHeaderHolisticAI = (
    key: keyof ProcessedModelData,
    label: string,
    subLabel?: string,
    className?: string
  ) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    const description = benchmarkDescriptions[key as keyof typeof benchmarkDescriptions];

    return (
      <TableHead 
        className={`h-14 px-4 text-center font-normal text-gray-700 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${className || ''}`}
        onClick={() => handleSort(key)}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1">
            <span className="text-sm">{label}</span>
            {description && (
              <Tooltip title={description.title} content={description.content}>
                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            )}
            <div className="flex flex-col">
              <ChevronUp 
                className={`h-3 w-3 ${isActive && direction === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
              <ChevronDown 
                className={`h-3 w-3 -mt-1 ${isActive && direction === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
            </div>
          </div>
          {subLabel && <span className="text-xs text-gray-500 mt-0.5">{subLabel}</span>}
        </div>
      </TableHead>
    );
  };

  const renderSortableHeaderPerformance = (
    key: keyof ProcessedModelData,
    label: string,
    subLabel?: string,
    className?: string
  ) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    const description = benchmarkDescriptions[key as keyof typeof benchmarkDescriptions];

    return (
      <TableHead 
        className={`h-14 px-4 text-center font-normal text-gray-700 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${className || ''}`}
        onClick={() => handleSort(key)}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1">
            <span className="text-sm">{label}</span>
            {description && (
              <Tooltip title={description.title} content={description.content}>
                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            )}
            <div className="flex flex-col">
              <ChevronUp 
                className={`h-3 w-3 ${isActive && direction === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
              <ChevronDown 
                className={`h-3 w-3 -mt-1 ${isActive && direction === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
            </div>
          </div>
          {subLabel && <span className="text-xs text-gray-500 mt-0.5">{subLabel}</span>}
        </div>
      </TableHead>
    );
  };

  const renderSortableHeaderModelInfo = (
    key: keyof ProcessedModelData,
    label: string,
    subLabel?: string,
    className?: string
  ) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    const description = benchmarkDescriptions[key as keyof typeof benchmarkDescriptions];

    return (
      <TableHead 
        className={`h-14 px-4 text-center font-normal text-gray-700 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${className || ''}`}
        onClick={() => handleSort(key)}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1">
            <span className="text-sm">{label}</span>
            {description && (
              <Tooltip title={description.title} content={description.content}>
                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            )}
            <div className="flex flex-col">
              <ChevronUp 
                className={`h-3 w-3 ${isActive && direction === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
              <ChevronDown 
                className={`h-3 w-3 -mt-1 ${isActive && direction === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
            </div>
          </div>
          {subLabel && <span className="text-xs text-gray-500 mt-0.5">{subLabel}</span>}
        </div>
      </TableHead>
    );
  };

  const renderSortableHeaderPricing = (
    key: keyof ProcessedModelData,
    label: string,
    subLabel?: string,
    className?: string
  ) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    const description = benchmarkDescriptions[key as keyof typeof benchmarkDescriptions];

    return (
      <TableHead 
        className={`h-14 px-4 text-center font-normal text-gray-700 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${className || ''}`}
        onClick={() => handleSort(key)}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1">
            <span className="text-sm">{label}</span>
            {description && (
              <Tooltip title={description.title} content={description.content}>
                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            )}
            <div className="flex flex-col">
              <ChevronUp 
                className={`h-3 w-3 ${isActive && direction === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
              <ChevronDown 
                className={`h-3 w-3 -mt-1 ${isActive && direction === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} 
              />
            </div>
          </div>
          {subLabel && <span className="text-xs text-gray-500 mt-0.5">{subLabel}</span>}
        </div>
      </TableHead>
    );
  };

  // Handle scroll position tracking
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPercentage = (target.scrollLeft / (target.scrollWidth - target.clientWidth)) * 100;
    setScrollPosition(Math.round(scrollPercentage));
    
    // Reset scroll step when user manually scrolls
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    const currentScroll = target.scrollLeft;
    const tolerance = 10; // Allow small tolerance for smooth scrolling
    
    if (Math.abs(currentScroll - 0) < tolerance) {
      setScrollStep(0);
    } else if (Math.abs(currentScroll - maxScrollLeft * 0.33) < tolerance) {
      setScrollStep(1);
    } else if (Math.abs(currentScroll - maxScrollLeft * 0.66) < tolerance) {
      setScrollStep(2);
    } else if (Math.abs(currentScroll - maxScrollLeft) < tolerance) {
      setScrollStep(3);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tableContainer = document.querySelector('.overflow-x-auto') as HTMLDivElement;
    if (!tableContainer) return;

    if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      tableContainer.scrollTo({
        left: Math.max(0, tableContainer.scrollLeft - 200),
        behavior: 'smooth'
      });
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      tableContainer.scrollTo({
        left: Math.min(tableContainer.scrollWidth, tableContainer.scrollLeft + 200),
        behavior: 'smooth'
      });
    } else if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault();
      tableContainer.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
      setScrollStep(0);
    } else if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault();
      tableContainer.scrollTo({
        left: tableContainer.scrollWidth,
        behavior: 'smooth'
      });
      setScrollStep(3);
    }
  }, []);

  const handleRowMouseEnter = (modelName: string) => {
    setHoveredModelName(modelName);
  };

  const handleRowMouseMove = (e: React.MouseEvent) => {
    const tooltipWidth = 220;
    const tooltipHeight = 40;
    const padding = 12;
    let x = e.clientX + padding;
    let y = e.clientY + padding;

    if (typeof window !== 'undefined') {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (x + tooltipWidth > vw - 8) x = vw - tooltipWidth - 8;
      if (y + tooltipHeight > vh - 8) y = vh - tooltipHeight - 8;
    }

    setHoverPosition({ x, y });
  };

  const handleRowMouseLeave = () => {
    setHoveredModelName(null);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-grow mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4 py-12">
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">
            Holistic AI LLM Decision Hub
          </h1>
          <p className="text-xl text-gray-700 mb-4 font-medium">
            Helping senior leaders make confident, well-informed decisions about their LLM environment.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Holistic AI provides trusted, independent rankings of large language models across performance, red teaming, jailbreaking safety, and real-world usability. Our insights are grounded in rigorous internal red teaming and jailbreaking tests, alongside publicly available benchmarks. This enables CIOs, CTOs, developers, researchers, and organizations to choose the right model faster and with greater confidence.
          </p>
        </div>



        {/* Search and Model Count */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full text-base rounded-lg shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-lg border border-blue-200 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                Showing <span className="font-bold text-blue-700 text-lg">{filteredModels.length}</span> of <span className="font-bold text-blue-700 text-lg">{modelData.length}</span> total models
              </span>
            </div>
          </div>
        </div>

        {/* Provider Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-800">Filter by Provider:</span>
            {selectedProvider && (
              <button
                onClick={() => handleProviderFilter('')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* All Providers Button */}
            <button
              onClick={() => handleProviderFilter('')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 shadow-sm ${
                selectedProvider === '' 
                  ? 'bg-blue-600 text-white border border-blue-600 shadow-sm transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              All Providers
            </button>
            
            {/* Individual Provider Buttons */}
            {getUniqueProviders().map((provider) => (
              <button
                key={provider}
                onClick={() => handleProviderFilter(provider)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 shadow-sm ${
                  selectedProvider === provider 
                    ? 'bg-blue-600 text-white border border-blue-600 shadow-sm transform scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-4 h-4 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <Image
                    src={getProviderLogo(provider)}
                    alt={`${provider} logo`}
                    width={16}
                    height={16}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs">{provider}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full leading-none font-medium ${
                  selectedProvider === provider 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {modelData.filter(model => 
                    model.developer === provider && 
                    model.developer.toLowerCase() !== 'alibaba'
                  ).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Issue Report Note */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsIssuePopupOpen(true)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
          >
            <span>Issues? / Missing data?</span>
            <span className="text-blue-600 hover:text-blue-700 font-medium underline">Connect us here</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg">
          {/* Floating row tooltip showing model name when hovering any part of the row */}
          {hoveredModelName && (
            <div
              className="fixed z-50 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 pointer-events-none"
              style={{ left: hoverPosition.x, top: hoverPosition.y, maxWidth: 260 }}
            >
              {hoveredModelName}
            </div>
          )}
          {/* Enhanced Horizontal Scroll Navigation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  const tableContainer = document.querySelector('.overflow-x-auto');
                  if (tableContainer) {
                    tableContainer.scrollTo({
                      left: 0,
                      behavior: 'smooth'
                    });
                    setScrollStep(0);
                  }
                }}
                disabled={scrollPosition === 0}
                className={`flex items-center text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  scrollPosition === 0 
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                    : 'text-blue-700 hover:text-blue-800 hover:bg-blue-100 cursor-pointer bg-white border border-blue-200'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                ← Scroll to start
              </button>
              
              <div className="flex items-center space-x-6 text-gray-700">
                <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-blue-200">
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l3-3m0 0l3 3m-3-3v6m0-10V4m-7 7h18" />
                  </svg>
                  <span className="text-sm font-medium">
                    Use horizontal scroll, buttons, or Ctrl+Arrow keys
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Scroll Progress:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                      style={{ width: `${scrollPosition}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-10 text-right text-blue-700">{scrollPosition}%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const tableContainer = document.querySelector('.overflow-x-auto');
                  if (tableContainer) {
                    const maxScrollLeft = tableContainer.scrollWidth - tableContainer.clientWidth;
                    const nextStep = (scrollStep + 1) % 4; // Cycle through 0, 1, 2, 3 (reset after 3)
                    let scrollTarget = 0;
                    
                    if (nextStep === 1) {
                      scrollTarget = maxScrollLeft * 0.33; // First click: 33%
                    } else if (nextStep === 2) {
                      scrollTarget = maxScrollLeft * 0.66; // Second click: 66%
                    } else if (nextStep === 3) {
                      scrollTarget = maxScrollLeft; // Third click: 100% (far right)
                    } else {
                      scrollTarget = 0; // Fourth click: reset to start
                    }
                    
                    tableContainer.scrollTo({
                      left: scrollTarget,
                      behavior: 'smooth'
                    });
                    
                    setScrollStep(nextStep);
                  }
                }}
                disabled={false}
                className="flex items-center text-sm font-medium transition-all duration-200 text-blue-700 hover:text-blue-800 hover:bg-blue-100 cursor-pointer bg-white border border-blue-200 px-3 py-2 rounded-lg"
              >
                Scroll Right →
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto table-container" id="table-container" onScroll={handleScroll}>
            {/* Mobile touch scroll indicator */}
            <div className="md:hidden flex justify-center py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l3-3m0 0l3 3m-3-3v6" />
                </svg>
                <span className="text-xs">Swipe horizontally to scroll</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l3 3m0 0l-3 3m3-3H8" />
                </svg>
              </div>
            </div>
            <div className="min-w-[2360px]">
              <Table className="w-full border-separate border-spacing-0" key={`table-${searchTerm}-${filteredModels.length}`}>
                <TableHeader className="bg-white sticky top-0 z-10">
                  {/* Single clean header row */}
                  <TableRow>
                    <TableHead 
                      className="h-14 px-6 text-left font-normal text-gray-700 bg-white sticky left-0 z-30 border-b border-r border-gray-200 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">Model</span>
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'text-gray-600' : 'text-gray-300'}`} 
                          />
                          <ChevronDown 
                            className={`h-3 w-3 -mt-1 ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'text-gray-600' : 'text-gray-300'}`} 
                          />
                        </div>
                      </div>
                    </TableHead>
                    
                    {renderSortableHeaderModelInfo('developer', 'Org.', undefined, 'w-[90px]')}
                    {renderSortableHeader('safetyRank', 'Safety', 'Rank', 'w-[100px]')}
                    {renderSortableHeaderHolisticAI('safetyPercentage', 'Safe', 'Responses')}
                    {renderSortableHeaderHolisticAI('safetyPercentage', 'Unsafe', 'Responses')}
                    {renderSortableHeaderHolisticAI('jailbreakingResistancePercentage', 'Jailbreaking', 'Resistance', 'w-[140px]')}
                    {renderSortableHeaderPerformance('codeLMArena', 'Code', 'LMArena')}
                    {renderSortableHeaderPerformance('mathLiveBench', 'Math', 'LiveBench')}
                    {renderSortableHeaderPerformance('gpqa', 'GPQA')}
                    {renderSortableHeaderPerformance('codeLiveBench', 'Code', 'LiveBench')}
                    {renderSortableHeaderModelInfo('multimodal', 'Multimodal', 'Support')}
                    {renderSortableHeaderModelInfo('size', 'Size', 'Parameters', 'w-[130px]')}
                    {renderSortableHeaderModelInfo('released', 'Released')}
                    {renderSortableHeaderModelInfo('cutoffKnowledge', 'Knowledge', 'Cutoff')}
                    {renderSortableHeaderPricing('inputCost', 'Input', 'Cost/M')}
                    {renderSortableHeaderPricing('outputCost', 'Output', 'Cost/M')}
                    {renderSortableHeaderPricing('contextLength', 'Context', 'Length')}
                    {renderSortableHeaderPricing('latency', 'Latency', 'TTFT')}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModels.map((model) => (
                    <TableRow 
                      key={model.id} 
                      className="group relative hover:bg-gray-50/50 cursor-pointer transition-colors duration-150"
                      onClick={(e) => {
                        // Only navigate if not clicking on a nested link
                        if (!(e.target as HTMLElement).closest('a')) {
                          router.push(`/model/${model.id}`);
                        }
                      }}
                      onMouseEnter={() => handleRowMouseEnter(model.name)}
                      onMouseMove={handleRowMouseMove}
                      onMouseLeave={handleRowMouseLeave}
                    >
                      <TableCell className="h-16 px-6 bg-white border-b border-r border-gray-200 sticky left-0 z-10">
                        <Link 
                          href={`/model/${model.id}`} 
                          className="flex items-center space-x-3 w-full h-full group"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {model.developerLogo ? (
                            <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                              <Image 
                                src={model.developerLogo} 
                                alt={`${model.developer} logo`} 
                                width={24}
                                height={24}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs">${model.developer ? getDeveloperInitial(model.developer) : "?"}</div>`;
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-gray-600 font-medium text-xs">
                              {model.developer ? getDeveloperInitial(model.developer) : "?"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                              <span className="truncate text-sm font-medium">{model.name}</span>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="h-16 px-4 text-center bg-white border-b border-r border-gray-200">
                        <Link 
                          href={model.developer === 'OpenAI' ? '/openai' : model.developer === 'Anthropic' ? '/anthropic' : `/developer/${encodeURIComponent(model.developer.toLowerCase().replace(/\s+/g, '-'))}`}
                          className="text-gray-900 hover:text-blue-600 transition-colors duration-200 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {model.developer}
                        </Link>
                      </TableCell>
                      <TableCell className="h-16 px-4 text-center bg-white border-b border-r border-gray-200">
                        {model.safetyRank ? (
                          <span className="text-sm text-gray-900">
                            #{model.safetyRank}
                          </span>
                        ) : <span className="text-gray-500 text-sm">-</span>}
                      </TableCell>
                      <TableCell className="h-16 px-4 text-center bg-white border-b border-gray-200">
                        {model.safetyPercentage !== null ? (
                          <span className="text-sm text-gray-900">
                            {model.safetyPercentage}%
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.safetyPercentage !== null ? (
                          <div className="text-gray-700">
                            <div className={`text-sm font-medium ${getScoreColor(100 - model.safetyPercentage, 'unsafe')}`}>
                              {model.safetyPercentage !== null ? `${100 - model.safetyPercentage}%` : 'N/A'}
                            </div>
                            {model.unsafeResponses && model.totalPrompts && (
                              <div className="text-xs text-gray-500">
                                ({model.unsafeResponses} / {model.totalPrompts})
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.jailbreakingResistancePercentage !== null ? (
                          <div className="text-gray-700">
                            <div className={`text-sm font-medium ${getScoreColor(model.jailbreakingResistancePercentage, 'jailbreaking')}`}>
                              {model.jailbreakingResistancePercentage !== null ? `${model.jailbreakingResistancePercentage}%` : 'N/A'}
                            </div>
                            {model.jailbreakingSafeResponses && model.jailbreakingPrompts && (
                              <div className="text-xs text-gray-500">
                                ({model.jailbreakingSafeResponses} / {model.jailbreakingPrompts})
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      {/* Performance Benchmarks Group */}
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.codeLMArena !== '-' ? (
                          <span className="text-xs text-gray-700">
                            {model.codeLMArena}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.mathLiveBench !== '-' ? (
                          <span className={`px-1.5 py-0.5 rounded text-xs ${getScoreClassName(model.mathLiveBench, 'benchmark')}`}>
                            {model.mathLiveBench}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.gpqa !== '-' ? (
                          <span className={`px-1.5 py-0.5 rounded text-xs ${getScoreClassName(model.gpqa, 'benchmark')}`}>
                            {model.gpqa}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.codeLiveBench !== '-' ? (
                          <span className={`px-1.5 py-0.5 rounded text-xs ${getScoreClassName(model.codeLiveBench, 'benchmark')}`}>
                            {model.codeLiveBench}
                          </span>
                        ) : "-"}
                      </TableCell>
                      
                      {/* Model Information Group */}
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100">
                        {model.multimodal !== '-' ? (
                          <Tooltip
                            title={`Multimodal Support: ${model.multimodal}`}
                            content={
                              model.multimodal === 'Yes' 
                                ? 'Full multimodal support - Can process text, images, audio, video with advanced vision capabilities and detailed content analysis.'
                                : model.multimodal === 'Limited'
                                ? 'Basic vision/image support - Can process simple images and describe them, but with limited visual reasoning capabilities. No audio/video support.'
                                : model.multimodal === 'No'
                                ? 'Text-only model - Processes only text inputs and outputs. No image, audio, or video capabilities.'
                                : 'No multimodal information available for this model.'
                            }
                          >
                            <span className={`px-1.5 py-0.5 rounded text-xs cursor-help ${
                              model.multimodal === 'Yes' ? 'bg-emerald-50 text-emerald-700' :
                              model.multimodal === 'Limited' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {model.multimodal}
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title="Multimodal Support: Unknown"
                            content="No multimodal information available for this model."
                          >
                            <span className="text-gray-500 cursor-help">-</span>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">
                        {model.size.includes("Parameters") ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xs">{model.size.split(" ")[0]}</span>
                          </div>
                        ) : (
                          <span className="text-xs">{model.size}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">{model.released}</TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">
                        {model.cutoffKnowledge !== null ? model.cutoffKnowledge : "-"}
                      </TableCell>
                      
                      {/* Pricing & Performance Group */}
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">
                        {formatCost(model.inputCost)}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">
                        {formatCost(model.outputCost)}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">
                        {model.contextLength}
                      </TableCell>
                      <TableCell className="text-center py-3 px-2 border-b border-gray-100 whitespace-nowrap border-l border-gray-100 text-xs text-gray-700">
                        {model.latency !== '-' ? model.latency : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredModels.length === 0 && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No models found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>

                {/* Benchmark Data Sources Note */}
        <div className="mt-8 mb-4 max-w-5xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg shadow-sm">
            <div className="flex items-start p-6">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              </div>
              <div className="ml-4">
                <div className="text-sm">
                  <h3 className="text-blue-800 font-semibold mb-2 flex items-center">
                    📊 Data Source
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                  All comparative insights are based on a combination of rigorous red teaming and jailbreaking testing performed by Holistic AI, as well as publicly available benchmark data. External benchmarks include <strong>CodeLMArena, MathLiveBench, CodeLiveBench, and GPQA</strong>. These were sourced from official model provider websites, public leaderboards, benchmark sites, and other accessible resources to ensure transparency, accuracy, and reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Issue Report Popup */}
      <IssueReportPopup 
        isOpen={isIssuePopupOpen} 
        onClose={() => setIsIssuePopupOpen(false)} 
      />
    </div>
  );
}