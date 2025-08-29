import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ExternalLink, 
  Brain, 
  Code, 
  Calendar, 
  Cpu, 
  Database, 
  HardDrive, 
  Shield,
  BarChart3,
  Zap
} from 'lucide-react';
import { processModelData, getModelById, getAllModelIds } from '@/lib/data-processor';
import { generateSlug } from '@/lib/utils';
import { ModelData } from '@/types/model';
import rawModelDataJson from '@/data/models.json';
import PricingCalculator from '@/components/PricingCalculator';
import BusinessDecisionGuide from '@/components/BusinessDecisionGuide';
import BusinessUseCases from '@/components/BusinessUseCases';
import ModelPageTOC from '@/components/ModelPageTOC';
import ModelPageProviders from '@/components/ModelPageProviders';
import Navigation from '@/components/Navigation';
import OrganisationMetricChart from '@/components/OrganisationMetricChart';
import CircularProgressChart from '@/components/CircularProgressChart';
import { prepareChartData } from '@/lib/chart-helpers';

// Tooltip component for benchmarks
const BenchmarkTooltip = ({ children, title, description }: { 
  children: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <div className="bg-gray-900 text-white text-sm rounded-lg py-4 px-5 shadow-xl border border-gray-700 min-w-[280px] max-w-[320px] w-max">
          <div className="font-semibold mb-2 text-white">{title}</div>
          <div className="text-gray-200 text-xs leading-relaxed line-height-[1.5]">{description}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

const rawModelData = rawModelDataJson as ModelData[];
const modelData = processModelData(rawModelData);



// Generate static params for all models
export async function generateStaticParams() {
  try {
    // Get all model IDs from the processed data
  const modelIds = getAllModelIds(modelData);
    
    // Generate additional IDs from raw model data to ensure we have all possible slugs
    const rawModelIds = rawModelData.map(model => generateSlug(model.Model));
    
    // Include specific IDs that might be referenced but not in the data
    const additionalIds = [
      'gemini-2-5-pro-preview-06-05',
      'gemini-2-5-flash-preview-05-20',
      'gemini-2-0-flash'
    ];
    
    // Combine all IDs, ensuring no duplicates
    const allIdsSet = new Set([...modelIds, ...rawModelIds, ...additionalIds]);
    const allIds = Array.from(allIdsSet);
    
    return allIds.map((id) => ({
    id: id,
  }));
  } catch (error) {
    console.error('Error generating static params for models:', error);
    // Return a minimal set of models to ensure the build doesn't fail
    return [
      { id: 'gpt-4o' },
      { id: 'claude-3-opus' },
      { id: 'gemini-1.5-pro' },
      { id: 'llama-3-70b' },
      { id: 'mistral-large' },
      { id: 'gemini-2-5-pro-preview-06-05' }
    ];
  }
}

// Generate metadata for each model page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const model = getModelById(modelData, params.id);
  
  if (!model) {
    return {
      title: 'Model Not Found | LLM Decision Hub',
      description: 'The requested AI model could not be found. Browse our comprehensive leaderboard of language models.',
    };
  }

  const pageTitle = `${model.name} by ${model.developer} - Performance Analysis & Benchmarks`;
  const pageDescription = model.metaDescription || `Detailed analysis of ${model.name} by ${model.developer}. View performance benchmarks, pricing, safety ratings, and technical specifications.`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      model.name, model.developer, 'AI model analysis', 'LLM performance', 'AI benchmarks', 
      'model comparison', 'safety analysis', 'AI pricing', 'language model review',
      'AI model specifications', 'machine learning model'
    ],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://llmleaderboard.ai/model/${params.id}`,
      siteName: 'LLM Decision Hub',
      images: [
        {
          url: '/hai-cover.png',
          width: 1200,
          height: 630,
          alt: `${model.name} by ${model.developer} - AI Model Analysis`,
          type: 'image/png',
        },
      ],
      type: 'article',
      publishedTime: model.released ? new Date(model.released).toISOString() : undefined,
      authors: ['Holistic AI'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@holisticai',
      creator: '@holisticai',
      title: pageTitle,
      description: pageDescription,
      images: {
        url: '/hai-cover.png',
        alt: `${model.name} by ${model.developer} - AI Model Analysis`,
      },
    },
    alternates: {
      canonical: `https://llmleaderboard.ai/model/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface ModelDetailPageProps {
  params: {
    id: string;
  };
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const model = getModelById(modelData, params.id);

  if (!model) {
    notFound();
  }

  const getDeveloperInitial = (developer: string) => {
    return developer.charAt(0).toUpperCase();
  };

  // Helper function to check if a benchmark value has actual data
  const hasValidBenchmarkData = (value: string | number | null | undefined) => {
    return value !== null && 
           value !== undefined && 
           value !== '-' && 
           value !== 'N/A' && 
           value !== '' &&
           value !== 0;
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Table of Contents Component */}
      <ModelPageTOC />

      {/* Main Content - Centered with equal margins */}
      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">Models</Link>
            <span>›</span>
            <Link href={model.developer === 'OpenAI' ? '/openai' : model.developer === 'Anthropic' ? '/anthropic' : `/developer/${encodeURIComponent(model.developer.toLowerCase().replace(/\s+/g, '-'))}`} className="hover:text-blue-600">{model.developer}</Link>
            <span>›</span>
            <span className="text-gray-900">{model.name}</span>
          </nav>

          {/* Model Icon and Title */}
          <div className="flex items-center space-x-3 mb-3">
              {model.developerLogo ? (
              <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
                  <Image 
                    src={model.developerLogo} 
                    alt={`${model.developer} logo`} 
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-gray-700 font-bold border border-gray-200 text-lg">
                  {getDeveloperInitial(model.developer)}
                </div>
              )}
              <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{model.name}</h1>
                {/* Rank Indicators and Compare Button */}
                <div className="flex items-center space-x-1.5">
                  {model.safetyRank && (
                    <div className="relative group">
                      <div className="flex items-center bg-green-50 border border-green-200 px-2 py-0.5 rounded-md cursor-help">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-green-500 mr-1"></div>
                        <span className="text-xs font-medium text-green-700">Safety #{model.safetyRank}</span>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        <div className="bg-white border border-gray-200 shadow-lg text-xs rounded-lg py-3 px-4 w-64">
                          <div className="font-semibold mb-1 text-gray-900">Safety Ranking</div>
                          <div className="text-gray-700 leading-relaxed">
                            Ranked #{model.safetyRank} out of all models based on safe response rate, 
                            jailbreaking resistance, and harmful content filtering effectiveness.
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-200" style={{marginBottom: '1px'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {model.operationalRank && (
                    <div className="relative group">
                      <div className="flex items-center bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md cursor-help">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-orange-500 mr-1"></div>
                        <span className="text-xs font-medium text-orange-700">Operational #{model.operationalRank}</span>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        <div className="bg-white border border-gray-200 shadow-lg text-xs rounded-lg py-3 px-4 w-64">
                          <div className="font-semibold mb-1 text-gray-900">Operational Ranking</div>
                          <div className="text-gray-700 leading-relaxed">
                            Ranked #{model.operationalRank} based on overall performance across benchmarks, 
                            cost efficiency, speed, and practical enterprise deployment metrics.
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-200" style={{marginBottom: '1px'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Compare Models Button */}
                  <Link 
                    href="/compare" 
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ml-1"
                  >
                    <BarChart3 className="w-3 h-3 mr-1.5" />
                    <span className="text-xs font-medium">Compare</span>
                  </Link>
                </div>
              </div>
              <p className="text-sm text-gray-600">{model.developer}</p>
            </div>
          </div>


        </div>

        {/* Description and Model Details */}
        <div id="overview" className="mb-8">
          <p className="text-gray-700 text-sm leading-relaxed mb-4 max-w-4xl">
            {model.description}
          </p>
          
          {/* Model ID, Badge, and Quick Links in one line */}
          <div className="flex items-center space-x-4 flex-wrap gap-y-2">
            <span className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md font-medium">{model.modelId}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium">Available</span>
            
            {/* Conditional Quick Links - Only show if data is available */}
            {model.apiReference && model.apiReference !== "N/A" && (
              <a href={model.apiReference} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600 text-xs transition-colors duration-200 font-medium">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                API Reference
              </a>
            )}
            
            {model.playground && model.playground !== "N/A" && (
              <a href={model.playground} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600 text-xs transition-colors duration-200 font-medium">
                <Zap className="w-3 h-3 mr-1.5" />
                Playground
              </a>
            )}
            
            {model.documentation && model.documentation !== "N/A" && (
              <a href={model.documentation} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600 text-xs transition-colors duration-200 font-medium">
                <Brain className="w-3 h-3 mr-1.5" />
                Documentation
              </a>
            )}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-10">
          {/* Max Input */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center text-gray-500 mb-3">
              <Database className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Max Input</span>
              </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {model.contextLength ? model.contextLength.split(' ')[0] : '-'}
              </div>
            <div className="text-xs text-gray-500">
              {model.contextLength ? 'Tokens' : '-'}
            </div>
          </div>

          {/* Input Price */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center text-gray-500 mb-3">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Input Price</span>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              ${model.inputCost || '-'}
            </div>
            <div className="text-xs text-gray-500">per 1M Tokens</div>
              </div>

          {/* Output Price */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center text-gray-500 mb-3">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Output Price</span>
              </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              ${model.outputCost || '-'}
            </div>
            <div className="text-xs text-gray-500">per 1M Tokens</div>
          </div>

          {/* Safety Score */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center text-gray-500 mb-3">
              <Shield className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Safety Score</span>
              </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {model.safetyPercentage ? `${model.safetyPercentage}%` : '-'}
            </div>
            <div className="text-xs text-gray-500">Safe Responses</div>
          </div>

          {/* Model Size */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center text-gray-500 mb-3">
              <Cpu className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Size</span>
              </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {model.size ? model.size.split(' ')[0] : '-'}
              </div>
            <div className="text-xs text-gray-500">
              {model.size ? 'Parameters' : '-'}
            </div>
          </div>
        </div>

        {/* Model Information Section */}
        <div id="information" className="mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Model Information</h2>
            </div>
            <p className="text-gray-600 text-sm">Detailed specifications and technical details</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Release Details Card */}
            <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900">Release Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Release Date</div>
                  <div className="text-sm font-semibold text-gray-900">{model.released || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Knowledge Cutoff</div>
                  <div className="text-sm font-semibold text-gray-900">{model.cutoffKnowledge || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">License</div>
                  <div className="text-sm font-semibold text-gray-900">{model.license || '-'}</div>
                </div>
              </div>
            </div>

            {/* Model Architecture Card */}
            <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <Cpu className="w-4 h-4 text-gray-400 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900">Model Architecture</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Parameters</div>
                  <div className="text-sm font-semibold text-gray-900">{model.size || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Training Data</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {model.size ? (
                      model.size.includes('B') ? 
                        `${(parseFloat(model.size.split(' ')[0]) * 1.33).toFixed(1)}T tokens` : 
                        '-'
                    ) : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Context Window Card */}
            <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <HardDrive className="w-4 h-4 text-gray-400 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900">Context Window</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Input Context Length</div>
                  <div className="text-sm font-semibold text-gray-900">{model.contextLength || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Max Output Tokens</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {model.maxOutputTokens || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Capabilities Section - Only show if Features or Tools data exists */}
          {(() => {
            const featuresData = model.features || model.Features;
            const toolsData = model.tools || model.Tools;
            const hasFeaturesData = featuresData && Object.keys(featuresData).length > 0;
            const hasToolsData = toolsData && Object.keys(toolsData).length > 0;
            
            if (!hasFeaturesData && !hasToolsData) {
              return null;
            }

            return (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features & Capabilities</h3>
                  <p className="text-gray-600 text-sm">Core functionality and supported features</p>
                </div>
                
                {/* Combined Features & Tools Section */}
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Features Column */}
                    {hasFeaturesData && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
                          <div className="w-3 h-3 bg-blue-100 rounded flex items-center justify-center mr-1.5">
                            <svg className="w-2 h-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          Features
                        </h4>
                        <div className="space-y-0">
                          {/* Streaming */}
                          {featuresData.streaming !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4m-4 0V1a1 1 0 00-1-1H8a1 1 0 00-1 1v3" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Streaming</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.streaming 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.streaming ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Function Calling */}
                          {featuresData.function_calling !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Function calling</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.function_calling 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.function_calling ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Structured Outputs */}
                          {featuresData.structured_outputs !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Structured outputs</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.structured_outputs 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.structured_outputs ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Fine Tuning */}
                          {featuresData.fine_tuning !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Fine-tuning</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.fine_tuning 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.fine_tuning ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Distillation */}
                          {featuresData.distillation !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Distillation</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.distillation 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.distillation ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Predicted Outputs */}
                          {featuresData.predicted_outputs !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Predicted outputs</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.predicted_outputs 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.predicted_outputs ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Multimodal */}
                          {featuresData.multimodal !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Multimodal</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.multimodal 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.multimodal ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Reasoning */}
                          {featuresData.reasoning !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Reasoning</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                featuresData.reasoning 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {featuresData.reasoning ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tools Column */}
                    {hasToolsData && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
                          <div className="w-3 h-3 bg-green-100 rounded flex items-center justify-center mr-1.5">
                            <svg className="w-2 h-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          Tools
                        </h4>
                        <div className="bg-gray-50 rounded p-2 mb-3">
                          <p className="text-xs text-gray-600">Tools supported when using the Responses API</p>
                        </div>
                        <div className="space-y-0">
                          {/* Web Search */}
                          {toolsData.web_search !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Web search</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                toolsData.web_search 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {toolsData.web_search ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* File Search */}
                          {toolsData.file_search !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">File search</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                toolsData.file_search 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {toolsData.file_search ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Code Interpreter */}
                          {toolsData.code_interpreter !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Code interpreter</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                toolsData.code_interpreter 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {toolsData.code_interpreter ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Image Generation */}
                          {toolsData.image_generation !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Image generation</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                toolsData.image_generation 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {toolsData.image_generation ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* Computer Use */}
                          {toolsData.computer_use !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">Computer use</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                toolsData.computer_use 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {toolsData.computer_use ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}

                          {/* MCP */}
                          {toolsData.mcp !== undefined && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className="w-3 h-3 text-gray-400">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900">MCP</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ml-3 flex-shrink-0 ${
                                toolsData.mcp 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {toolsData.mcp ? 'Supported' : 'Not supported'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modalities Section */}
                {model.modalities && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center mr-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      Modalities
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Text */}
                      {model.modalities.text && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h5 className="text-xl font-semibold text-gray-900 mb-4">Text</h5>
                            <div className="w-full space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Input:</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  model.modalities.text.input ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {model.modalities.text.input ? 'Yes' : 'No'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Output:</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  model.modalities.text.output ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {model.modalities.text.output ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Image */}
                      {model.modalities.image && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h5 className="text-xl font-semibold text-gray-900 mb-4">Image</h5>
                            <div className="w-full space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Input:</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  model.modalities.image.input ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {model.modalities.image.input ? 'Yes' : 'No'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Output:</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  model.modalities.image.output ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {model.modalities.image.output ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Audio */}
                      {model.modalities.audio && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5 15V9a2 2 0 012-2h3.586a1 1 0 01.707.293l2.828 2.828a1 1 0 01.293.707V15a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <h5 className="text-xl font-semibold text-gray-900 mb-4">Audio</h5>
                            <div className="w-full space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Input:</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  model.modalities.audio.input ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {model.modalities.audio.input ? 'Yes' : 'No'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Output:</span>
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  model.modalities.audio.output ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {model.modalities.audio.output ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Performance Benchmarks - Only show if at least one benchmark has data */}
          {(hasValidBenchmarkData(model.codeLMArena) || hasValidBenchmarkData(model.mathLiveBench) || hasValidBenchmarkData(model.codeLiveBench) || hasValidBenchmarkData(model.codeRankedAGI)) && (
            <div id="benchmarks" className="mt-10 mb-8">
                          <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Performance Benchmarks</h2>
            </div>
              <p className="text-gray-600 text-sm mb-4">Focus on quantitative capabilities of the model across reasoning, math, coding, etc.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CodeLMArena */}
                {hasValidBenchmarkData(model.codeLMArena) && (
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-blue-50 rounded">
                        <Brain className="h-3 w-3 text-blue-600" />
                      </div>
                      <BenchmarkTooltip
                        title="CodeLMArena (old)"
                        description="Competitive coding benchmark where models are evaluated on their ability to solve complex programming problems, debug code, and demonstrate logical reasoning across multiple programming languages and difficulty levels."
                      >
                        <h3 className="text-sm font-semibold text-gray-900 cursor-help hover:text-blue-600 transition-colors">CodeLMArena (old)</h3>
                      </BenchmarkTooltip>
                    </div>
                    
                    <div className="mb-1">
                      <p className="text-xs text-gray-500 mb-1">Logical reasoning</p>
                      <div className="text-xl font-bold text-gray-900">{model.codeLMArena}</div>
                    </div>
                  </div>
                )}

                {/* MathLiveBench */}
                {hasValidBenchmarkData(model.mathLiveBench) && (
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-purple-50 rounded">
                        <div className="h-3 w-3 text-purple-600 font-bold flex items-center justify-center text-sm">➗</div>
                      </div>
                      <BenchmarkTooltip
                        title="MathLiveBench"
                        description="Real-time mathematical reasoning benchmark testing the model's ability to solve advanced problems across algebra, calculus, geometry, statistics, and applied mathematics with step-by-step problem-solving approaches."
                      >
                        <h3 className="text-sm font-semibold text-gray-900 cursor-help hover:text-purple-600 transition-colors">MathLiveBench</h3>
                      </BenchmarkTooltip>
                    </div>
                    
                    <div className="mb-1">
                      <p className="text-xs text-gray-500 mb-1">Mathematical ability</p>
                      <div className="text-xl font-bold text-gray-900">{model.mathLiveBench}</div>
                    </div>
                  </div>
                )}

                {/* CodeLiveBench */}
                {hasValidBenchmarkData(model.codeLiveBench) && (
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-indigo-50 rounded">
                        <Code className="h-3 w-3 text-indigo-600" />
                      </div>
                      <BenchmarkTooltip
                        title="CodeLiveBench"
                        description="Live coding performance evaluation measuring the model's ability to write, debug, and optimize code in real-time scenarios, including algorithm implementation and software development tasks."
                      >
                        <h3 className="text-sm font-semibold text-gray-900 cursor-help hover:text-indigo-600 transition-colors">CodeLiveBench</h3>
                      </BenchmarkTooltip>
                    </div>
                    
                    <div className="mb-1">
                      <p className="text-xs text-gray-500 mb-1">Coding ability</p>
                      <div className="text-xl font-bold text-gray-900">{model.codeLiveBench}</div>
                    </div>
                  </div>
                )}

                {/* CodeRankedAGI */}
                {hasValidBenchmarkData(model.codeRankedAGI) && (
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-cyan-50 rounded">
                        <div className="h-3 w-3 text-cyan-600 font-bold flex items-center justify-center text-sm">🤖</div>
                      </div>
                      <BenchmarkTooltip
                        title="CodeRankedAGI"
                        description="Advanced AGI coding benchmark evaluating sophisticated programming capabilities, including complex problem-solving, architectural design, and advanced software engineering tasks requiring deep reasoning."
                      >
                        <h3 className="text-sm font-semibold text-gray-900 cursor-help hover:text-cyan-600 transition-colors">CodeRankedAGI</h3>
                      </BenchmarkTooltip>
                    </div>
                    
                    <div className="mb-1">
                      <p className="text-xs text-gray-500 mb-1">AGI coding ability</p>
                      <div className="text-xl font-bold text-gray-900">{model.codeRankedAGI}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Safety Analysis with Charts - Only show if at least one safety metric has data */}
        {(model.safeResponses || model.unsafeResponses || model.jailbreakingSafeResponses) && (
          <div id="safety" className="mt-16 mb-12">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Jailbreaking & Red Teaming Analysis</h2>
            </div>
              <p className="text-gray-600 text-sm mb-4">Comprehensive safety evaluation and red teaming analysis</p>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">

            {/* Show charts only if safety data is available */}
            {(model.safeResponses || model.unsafeResponses || model.jailbreakingSafeResponses) ? (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Safety Analysis */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-800">Overall Safety Analysis</h3>
                    </div>

                    <div className="flex items-start space-x-4">
                      {/* Safe Responses Chart */}
                      <div className="flex-shrink-0 relative group">
                        <CircularProgressChart
                          percentage={model.safetyPercentage || 0}
                          size={96}
                          strokeWidth={8}
                          primaryColor="#10b981" // Green for safe responses
                          secondaryColor="#ef4444" // Red for unsafe responses
                        />
                        
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Safe: {model.safetyPercentage || 0}% ({model.safeResponses || 0}/{model.totalPrompts || 0})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Unsafe: {model.safetyPercentage ? (100 - model.safetyPercentage) : 0}% ({model.unsafeResponses || 0}/{model.totalPrompts || 0})</span>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>

                      {/* Data Display */}
                      <div className="flex-1 space-y-3">
                        {/* Safe Responses Box */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-1.5 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">SAFE Responses:</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mb-0.5">
                            {model.safetyPercentage || 0}%
                          </p>
                          <p className="text-xs text-gray-600">
                            ({model.safeResponses || 0} out of {model.totalPrompts || 0})
                          </p>
                        </div>

                        {/* Unsafe Responses Box */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center space-x-1.5 mb-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">UNSAFE Responses:</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mb-0.5">
                            {model.safetyPercentage ? (100 - model.safetyPercentage) : 0}%
                          </p>
                          <p className="text-xs text-gray-600">
                            ({model.unsafeResponses || 0} out of {model.totalPrompts || 0})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Jailbreaking Resistance */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-800">Jailbreaking Resistance</h3>
                    </div>

                    <div className="flex items-start space-x-4">
                      {/* Jailbreaking Chart */}
                      <div className="flex-shrink-0 relative group">
                        <CircularProgressChart
                          percentage={model.jailbreakingResistancePercentage || 0}
                          size={96}
                          strokeWidth={8}
                          primaryColor="#3b82f6" // Blue for successful resistance
                          secondaryColor="#f97316" // Orange for failed resistance
                        />
                        
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Resisted: {model.jailbreakingResistancePercentage || 0}% ({model.jailbreakingSafeResponses || 0}/{model.jailbreakingPrompts || 0})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Failed: {model.jailbreakingResistancePercentage ? (100 - model.jailbreakingResistancePercentage) : 0}% ({model.jailbreakingUnsafeResponses || 0}/{model.jailbreakingPrompts || 0})</span>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>

                      {/* Data Display */}
                      <div className="flex-1">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center space-x-1.5 mb-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">Jailbreaking Resistance:</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mb-0.5">
                            {model.jailbreakingResistancePercentage || 0}%
                          </p>
                          <p className="text-xs text-gray-600">
                            ({model.jailbreakingSafeResponses || 0} out of {model.jailbreakingPrompts || 0} attempts)
                          </p>
                        </div>
                        
                        <div className="text-xs text-gray-600 leading-relaxed">
                          Measures the model&apos;s ability to resist adversarial prompts designed to bypass content safety measures.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic text-center">
                    These Red Teaming audits were conducted using standardized testing protocols and adversarial prompts to assess model safety and robustness.
                  </p>
                </div>
              </div>
            ) : (
              /* Show message if no safety data available */
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Shield className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Safety Analysis Available</h3>
                <p className="text-gray-500">Safety assessment data is not available for this model.</p>
              </div>
            )}

            </div>
          </div>
        )}

        {/* Interactive Pricing Information */}
        <div id="pricing" className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Cost Calculator</h2>
          </div>
              <p className="text-gray-600 text-sm mb-4">Interactive cost calculator and token pricing</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

          {/* Show pricing calculator only if pricing data is available */}
          {(model.inputCost || model.outputCost) ? (
            /* Interactive Cost Calculator */
            <PricingCalculator model={model} />
          ) : (
            /* Show message if no pricing data available */
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pricing Information Available</h3>
              <p className="text-gray-500">Pricing data is not available for this model.</p>
            </div>
                )}
          </div>
              </div>

        {/* Provider Comparison */}
        <div id="providers" className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Providers</h2>
          </div>
              <p className="text-gray-600 text-sm mb-4">Compare pricing and features across different AI providers</p>
          
          <ModelPageProviders modelId={model.modelId} />
        </div>

        {/* Business Decision Guide */}
        <div id="business-guide" className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Business Decision Guide</h2>
          </div>
              <p className="text-gray-600 text-sm mb-4">Key factors to consider when adopting this model for enterprise use</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <BusinessDecisionGuide model={model} />
          </div>
            </div>

        {/* Business Use Cases */}
        <div id="use-cases" className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Business Use Cases</h2>
          </div>
              <p className="text-gray-600 text-sm mb-4">Optimize your workflows with tailored AI solutions</p>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <BusinessUseCases model={model} />
          </div>
        </div>

        {/* Organization Models Comparison Charts */}
        <div id="model-comparison" className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">{model.developer} Models Comparison</h2>
          </div>
              <p className="text-gray-600 text-sm mb-4">Compare metrics across different {model.developer} models</p>
          
          <div className="space-y-2">
            {/* Safety Score Chart */}
            {(() => {
              const safetyData = prepareChartData(modelData, model, 'safety');
              return safetyData.length > 0 ? (
                <OrganisationMetricChart
                  title="Safety Score Comparison"
                  data={safetyData}
                  metric="safety"
                />
              ) : null;
            })()}

            {/* Input Cost Chart */}
            {(() => {
              const inputCostData = prepareChartData(modelData, model, 'inputCost');
              return inputCostData.length > 0 ? (
                <OrganisationMetricChart
                  title="Input Cost Comparison (per 1M tokens)"
                  data={inputCostData}
                  metric="inputCost"
                />
              ) : null;
            })()}

            {/* Output Cost Chart */}
            {(() => {
              const outputCostData = prepareChartData(modelData, model, 'outputCost');
              return outputCostData.length > 0 ? (
                <OrganisationMetricChart
                  title="Output Cost Comparison (per 1M tokens)"
                  data={outputCostData}
                  metric="outputCost"
                />
              ) : null;
            })()}

            {/* Latency Chart */}
            {(() => {
              const latencyData = prepareChartData(modelData, model, 'latency');
              return latencyData.length > 0 ? (
                <OrganisationMetricChart
                  title="Latency Comparison"
                  data={latencyData}
                  metric="latency"
                />
              ) : null;
            })()}
          </div>
        </div>

        </div>
        </div>
      </main>
    </div>
  );
} 