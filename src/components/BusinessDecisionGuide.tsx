import { ProcessedModelData } from '@/types/model';
import { Shield, Zap, DollarSign } from 'lucide-react';

interface BusinessDecisionGuideProps {
  model: ProcessedModelData;
}

interface BusinessMetrics {
  safetyProfile: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
    description: string;
    rank: string | null;
    color: string;
  };
  performanceMetrics: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
    description: string;
    rank: string | null;
    color: string;
  };
  costEfficiency: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
    description: string;
    monthlyCost: string;
    color: string;
  };
  // Keeping roiImpact in the interface for now to avoid type errors, but we won't display it
  roiImpact: {
    timeSavings: string;
    costReduction: string;
    qualityImprovement: 'High' | 'Medium' | 'Low' | 'Unknown';
    overallRating: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  };
}

function analyzeBusinessMetrics(model: ProcessedModelData): BusinessMetrics {
  // Safety Profile Analysis
  const safetyProfile = (() => {
    if (model.safetyRank && model.safetyRank <= 3) {
      return {
        rating: 'Excellent' as const,
        description: `Outstanding safety compliance (${model.safeResponses || 0}%) with strong resistance to jailbreaking (${model.jailbreakingResistance || 0}%).`,
        rank: `#${model.safetyRank}`,
        color: 'text-green-800 bg-green-100'
      };
    } else if (model.safetyRank && model.safetyRank <= 10) {
      return {
        rating: 'Good' as const,
        description: `Strong safety measures with good compliance rates. Suitable for enterprise use.`,
        rank: `#${model.safetyRank}`,
        color: 'text-blue-800 bg-blue-100'
      };
    } else if (model.safeResponses && model.safeResponses >= 80) {
      return {
        rating: 'Good' as const,
        description: `Good safety compliance (${model.safeResponses}%) with adequate protection measures.`,
        rank: model.safetyRank ? `#${model.safetyRank}` : null,
        color: 'text-blue-800 bg-blue-100'
      };
    } else if (model.safeResponses && model.safeResponses >= 60) {
      return {
        rating: 'Fair' as const,
        description: `Moderate safety measures. Additional oversight recommended for sensitive applications.`,
        rank: model.safetyRank ? `#${model.safetyRank}` : null,
        color: 'text-yellow-800 bg-yellow-100'
      };
    } else if (model.safeResponses !== null) {
      return {
        rating: 'Poor' as const,
        description: `Limited safety measures. Not recommended for enterprise or sensitive applications.`,
        rank: model.safetyRank ? `#${model.safetyRank}` : null,
        color: 'text-red-800 bg-red-100'
      };
    } else {
      return {
        rating: 'Unknown' as const,
        description: `Safety assessment data not available. Conduct internal evaluation before deployment.`,
        rank: null,
        color: 'text-gray-800 bg-gray-100'
      };
    }
  })();

  // Performance Metrics Analysis
  const performanceMetrics = (() => {
    const mathScore = model.mathLiveBench !== '-' ? parseFloat(model.mathLiveBench.toString().replace('%', '')) : 0;
    const codeScore = model.codeLiveBench !== '-' ? parseFloat(model.codeLiveBench.toString().replace('%', '')) : 0;
    const arenaScore = model.codeLMArena !== '-' ? Number(model.codeLMArena) : 0;
    
    const avgPerformance = (mathScore + codeScore + (arenaScore > 1000 ? ((arenaScore - 1000) / 400) * 100 : 0)) / 3;
    
    if (model.operationalRank && model.operationalRank <= 10) {
      return {
        rating: 'Excellent' as const,
        description: `Top-tier performance across reasoning, mathematics, and coding. Ideal for complex tasks.`,
        rank: `#${model.operationalRank}`,
        color: 'text-purple-800 bg-purple-100'
      };
    } else if (model.operationalRank && model.operationalRank <= 25) {
      return {
        rating: 'Good' as const,
        description: `Strong performance in reasoning, mathematics, and coding. Suitable for most enterprise tasks.`,
        rank: `#${model.operationalRank}`,
        color: 'text-blue-800 bg-blue-100'
      };
    } else if (avgPerformance >= 40) {
      return {
        rating: 'Good' as const,
        description: `Solid performance across key metrics. Good for general business applications.`,
        rank: model.operationalRank ? `#${model.operationalRank}` : null,
        color: 'text-blue-800 bg-blue-100'
      };
    } else if (avgPerformance >= 20) {
      return {
        rating: 'Fair' as const,
        description: `Moderate performance. Suitable for basic tasks and cost-sensitive applications.`,
        rank: model.operationalRank ? `#${model.operationalRank}` : null,
        color: 'text-yellow-800 bg-yellow-100'
      };
    } else {
      return {
        rating: 'Poor' as const,
        description: `Limited performance capabilities. Consider for simple, non-critical tasks only.`,
        rank: model.operationalRank ? `#${model.operationalRank}` : null,
        color: 'text-red-800 bg-red-100'
      };
    }
  })();

  // Cost Efficiency Analysis
  const costEfficiency = (() => {
    const totalCost = (model.inputCost || 0) + (model.outputCost || 0);
    const monthlyCost = ((model.inputCost || 0) * 5 + (model.outputCost || 0) * 3).toFixed(2);
    
    if (totalCost <= 5) {
      return {
        rating: 'Excellent' as const,
        description: `Highly cost-effective with excellent context handling.`,
        monthlyCost: `$${monthlyCost}/mo (avg. use)`,
        color: 'text-green-800 bg-green-100'
      };
    } else if (totalCost <= 20) {
      return {
        rating: 'Good' as const,
        description: `Moderate cost with good value for performance.`,
        monthlyCost: `$${monthlyCost}/mo (avg. use)`,
        color: 'text-blue-800 bg-blue-100'
      };
    } else if (totalCost <= 50) {
      return {
        rating: 'Fair' as const,
        description: `Higher cost but may justify with premium features.`,
        monthlyCost: `$${monthlyCost}/mo (avg. use)`,
        color: 'text-yellow-800 bg-yellow-100'
      };
    } else if (totalCost > 50) {
      return {
        rating: 'Poor' as const,
        description: `Premium pricing. Ensure ROI justification for deployment.`,
        monthlyCost: `$${monthlyCost}/mo (avg. use)`,
        color: 'text-red-800 bg-red-100'
      };
    } else {
      return {
        rating: 'Unknown' as const,
        description: `Pricing information not available. Contact vendor for quotes.`,
        monthlyCost: `Contact vendor`,
        color: 'text-gray-800 bg-gray-100'
      };
    }
  })();

  // ROI Impact Analysis - Keep this logic for type compatibility, but we won't display it
  const roiImpact = (() => {
    const isHighPerformance = model.operationalRank && model.operationalRank <= 15;
    const isGoodSafety = model.safetyRank && model.safetyRank <= 10;
    const isCostEffective = (model.inputCost || 0) + (model.outputCost || 0) <= 20;
    
    let timeSavings = '15-25%';
    let costReduction = '5-10%';
    let qualityImprovement: 'High' | 'Medium' | 'Low' | 'Unknown' = 'Medium';
    let overallRating: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor' = 'Good';
    
    if (isHighPerformance && isGoodSafety) {
      timeSavings = '30-45%';
      costReduction = '15-25%';
      qualityImprovement = 'High';
      overallRating = 'Excellent';
    } else if (isHighPerformance || isGoodSafety) {
      timeSavings = '25-35%';
      costReduction = '10-20%';
      qualityImprovement = 'High';
      overallRating = 'Very Good';
    } else if (isCostEffective) {
      timeSavings = '20-30%';
      costReduction = '10-15%';
      qualityImprovement = 'Medium';
      overallRating = 'Good';
    } else if (model.operationalRank && model.operationalRank > 50) {
      timeSavings = '10-15%';
      costReduction = '5-8%';
      qualityImprovement = 'Low';
      overallRating = 'Fair';
    }
    
    return {
      timeSavings,
      costReduction,
      qualityImprovement,
      overallRating
    };
  })();

  return {
    safetyProfile,
    performanceMetrics,
    costEfficiency,
    roiImpact
  };
}

export default function BusinessDecisionGuide({ model }: BusinessDecisionGuideProps) {
  const metrics = analyzeBusinessMetrics(model);

  return (
    <div className="lg:col-span-2">

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Safety Profile */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Safety Profile</h3>
          </div>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {metrics.safetyProfile.description}
          </p>
          {metrics.safetyProfile.rank && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${metrics.safetyProfile.color}`}>
              Safety Rank: {metrics.safetyProfile.rank}
            </span>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {metrics.performanceMetrics.description}
          </p>
          {metrics.performanceMetrics.rank && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${metrics.performanceMetrics.color}`}>
              Performance Rank: {metrics.performanceMetrics.rank}
            </span>
          )}
        </div>

        {/* Cost Efficiency */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cost Efficiency</h3>
          </div>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {metrics.costEfficiency.description}
          </p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${metrics.costEfficiency.color}`}>
            {metrics.costEfficiency.monthlyCost}
          </span>
        </div>
      </div>

      {/* ROI Impact Section removed */}
    </div>
  );
} 