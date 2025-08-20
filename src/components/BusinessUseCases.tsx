import { ProcessedModelData } from '@/types/model';
import { 
  PenTool, 
  MessageCircle, 
  Headphones, 
  Lightbulb, 
  Code, 
  Search
} from 'lucide-react';

interface BusinessUseCasesProps {
  model: ProcessedModelData;
}

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  suitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  suitabilityScore: number;
  reasons: string[];
  bestFor: string;
  requirements: string[];
}

function analyzeUseCases(model: ProcessedModelData): UseCase[] {
  // Extract performance metrics
  const mathScore = model.mathLiveBench !== '-' ? parseFloat(model.mathLiveBench.toString().replace('%', '')) : 0;
  const codeScore = model.codeLiveBench !== '-' ? parseFloat(model.codeLiveBench.toString().replace('%', '')) : 0;
  const arenaScore = model.codeLMArena !== '-' ? Number(model.codeLMArena) : 0;
  const isHighPerformance = model.operationalRank && model.operationalRank <= 15;
  const isGoodSafety = model.safetyRank && model.safetyRank <= 10;
  const isCostEffective = (model.inputCost || 0) + (model.outputCost || 0) <= 10;
  const hasLongContext = model.contextLength.includes('200,000') || model.contextLength.includes('M');

  // Helper function to determine suitability
  const getSuitability = (score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const useCases: UseCase[] = [
    // Content Creation
    {
      id: 'content-creation',
      title: 'Content Creation',
      description: 'Generate articles, blogs, and marketing copy',
      icon: PenTool,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      suitability: 'Excellent',
      suitabilityScore: 0,
      reasons: [],
      bestFor: 'Marketing teams, publishers, content agencies',
      requirements: ['High creativity', 'Brand voice consistency', 'Quality output']
    },
    // Chatbot
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Create conversational AI assistants',
      icon: MessageCircle,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      suitability: 'Excellent',
      suitabilityScore: 0,
      reasons: [],
      bestFor: 'Customer engagement, website assistants',
      requirements: ['Safety compliance', 'Natural conversation', 'Reliability']
    },
    // Customer Service
    {
      id: 'customer-service',
      title: 'Customer Service',
      description: 'Automate support and improve response times',
      icon: Headphones,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      suitability: 'Excellent',
      suitabilityScore: 0,
      reasons: [],
      bestFor: 'Support teams, customer success departments',
      requirements: ['High safety', 'Quick responses', 'Accurate information']
    },
    // Creative Projects
    {
      id: 'creative-projects',
      title: 'Creative Projects',
      description: 'Generate ideas, stories, and creative content',
      icon: Lightbulb,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      suitability: 'Excellent',
      suitabilityScore: 0,
      reasons: [],
      bestFor: 'Design teams, storytellers, game developers',
      requirements: ['Creative reasoning', 'Idea generation', 'Flexibility']
    },
    // Code Generation
    {
      id: 'code-generation',
      title: 'Code Generation',
      description: 'Create and debug programming code',
      icon: Code,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      suitability: 'Fair',
      suitabilityScore: 0,
      reasons: [],
      bestFor: 'Development teams, engineering departments',
      requirements: ['Strong coding ability', 'Multiple languages', 'Debugging skills']
    },
    // Research Assistant
    {
      id: 'research-assistant',
      title: 'Research Assistant',
      description: 'Analyze information and support research',
      icon: Search,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      suitability: 'Excellent',
      suitabilityScore: 0,
      reasons: [],
      bestFor: 'R&D departments, data analysis teams',
      requirements: ['Analytical capabilities', 'Information synthesis', 'Accuracy']
    }
  ];

  // Calculate suitability scores for each use case
  useCases.forEach(useCase => {
    let score = 50; // Base score
    const reasons: string[] = [];

    switch (useCase.id) {
      case 'content-creation':
        // High performance and safety boost content creation
        if (isHighPerformance) {
          score += 25;
          reasons.push('Excellent response quality');
        }
        if (isGoodSafety) {
          score += 15;
          reasons.push('Consistent brand voice alignment');
        }
        if (hasLongContext) {
          score += 10;
          reasons.push('Long-form content capability');
        }
        break;

      case 'chatbot':
        // Safety is crucial for chatbots
        if (isGoodSafety) {
          score += 30;
          reasons.push('High resilience against manipulation');
        }
        if (isHighPerformance) {
          score += 15;
          reasons.push('Natural conversational flow');
        }
        if (isCostEffective) {
          score += 5;
          reasons.push('Cost-effective for high volume');
        }
        break;

      case 'customer-service':
        // Safety and reliability are key
        if (isGoodSafety) {
          score += 30;
          reasons.push('Competent customer support');
        }
        if (isHighPerformance) {
          score += 15;
          reasons.push('Quick response generation');
        }
        if (isCostEffective) {
          score += 5;
          reasons.push('Scalable solution');
        }
        break;

      case 'creative-projects':
        // Performance and creativity matter most
        if (isHighPerformance) {
          score += 30;
          reasons.push('Superior creative reasoning');
        }
        if (hasLongContext) {
          score += 15;
          reasons.push('Idea expansion and brainstorming');
        }
        if (mathScore > 40) {
          score += 5;
          reasons.push('Logical creativity');
        }
        break;

      case 'code-generation':
        // Code performance is critical
        if (codeScore >= 40) {
          score += 35;
          reasons.push('Strong coding capabilities');
        } else if (codeScore >= 25) {
          score += 20;
          reasons.push('Functional code generation');
        } else if (codeScore >= 15) {
          score += 10;
          reasons.push('Basic code assistance');
        }
        if (arenaScore > 1250) {
          score += 10;
          reasons.push('Adaptable to multiple languages');
        }
        break;

      case 'research-assistant':
        // Analysis and reasoning capabilities
        if (mathScore >= 50) {
          score += 25;
          reasons.push('Strong analytical capabilities');
        }
        if (isHighPerformance) {
          score += 20;
          reasons.push('Information synthesis and summary');
        }
        if (hasLongContext) {
          score += 5;
          reasons.push('Handle large documents');
        }
        break;
    }

    // Apply cost penalty for expensive models in cost-sensitive use cases
    if (!isCostEffective && ['chatbot', 'customer-service'].includes(useCase.id)) {
      score -= 10;
    }

    // Cap the score at 100
    score = Math.min(100, score);
    
    useCase.suitabilityScore = score;
    useCase.suitability = getSuitability(score);
    useCase.reasons = reasons.length > 0 ? reasons : ['Standard capabilities for this use case'];
  });

  return useCases.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

export default function BusinessUseCases({ model }: BusinessUseCasesProps) {
  const useCases = analyzeUseCases(model);

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSuitabilityTextColor = (suitability: string) => {
    switch (suitability) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="lg:col-span-2">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => {
          const IconComponent = useCase.icon;
          return (
            <div key={useCase.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 ${useCase.iconBg} rounded-lg`}>
                  <IconComponent className={`h-6 w-6 ${useCase.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{useCase.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{useCase.description}</p>

              {/* Suitability */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Suitability:</span>
                  <span className={`text-sm font-bold ${getSuitabilityTextColor(useCase.suitability)}`}>
                    {useCase.suitability}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getSuitabilityColor(useCase.suitability)}`}
                    style={{ width: `${useCase.suitabilityScore}%` }}
                  ></div>
                </div>

                {/* Reasons */}
                <ul className="space-y-1">
                  {useCase.reasons.slice(0, 2).map((reason, index) => (
                    <li key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="bg-gray-50 rounded-lg p-3 mt-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Best for:</p>
                <p className="text-xs text-gray-600">{useCase.bestFor}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic text-center">
          This data is generated based on the model benchmarks available in public documentation.
        </p>
      </div>
    </div>
  );
} 