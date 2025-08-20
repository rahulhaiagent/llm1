import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Cpu, Database, Shield, Calendar, Brain, Code } from 'lucide-react';
import { processModelData } from '@/lib/data-processor';
import { ModelData } from '@/types/model';
import rawModelDataJson from '@/data/models.json';
import Navigation from '@/components/Navigation';

const rawModelData = rawModelDataJson as ModelData[];
const modelData = processModelData(rawModelData);

// Benchmark Tooltip Component
const BenchmarkTooltip = ({ children, title, description }: { 
  children: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-sm rounded-lg py-3 px-4 max-w-xs">
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-xs text-gray-300">{description}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default function AnthropicPage() {
  const developer = 'Anthropic';
  const developerModels = modelData.filter(model => model.developer === developer);

  const formatMetric = (value: string | number | null) => {
    if (value === null || value === '-' || value === '') return '-';
    return value;
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



  // Get developer logo
  const developerLogo = `/logos/anthropic.png`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all models
            </Link>
          </div>

          {/* Developer Header */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border border-gray-200 shadow-sm p-3">
              <Image 
                src={developerLogo} 
                alt={`${developer} logo`} 
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{developer}</h1>
              <p className="text-xl text-gray-600">
                {developerModels.length} model{developerModels.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">Models</Link>
            <span>›</span>
            <span className="text-gray-900">{developer}</span>
          </nav>
        </div>

        {/* Performance Benchmarks Overview - Only show if at least one model has benchmark data */}
        {(() => {
          const hasAnyBenchmarkData = developerModels.some(model => 
            hasValidBenchmarkData(model.codeLMArena) || 
            hasValidBenchmarkData(model.mathLiveBench) || 
            hasValidBenchmarkData(model.codeLiveBench)
          );
          
          if (!hasAnyBenchmarkData) return null;
          
          return (
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Performance Benchmarks</h2>
              </div>
              <p className="text-gray-600 mb-6">Quantitative capabilities across reasoning, mathematics, and coding for {developer} models</p>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* CodeLMArena - Only show if any model has this data */}
                  {developerModels.some(model => hasValidBenchmarkData(model.codeLMArena)) && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Brain className="h-5 w-5 text-blue-600" />
                        </div>
                        <BenchmarkTooltip
                          title="CodeLMArena"
                          description="Competitive coding benchmark evaluating models on complex programming problems, debugging, and logical reasoning across multiple programming languages."
                        >
                          <h3 className="font-semibold text-gray-900 cursor-help hover:text-blue-600 transition-colors">CodeLMArena</h3>
                        </BenchmarkTooltip>
                      </div>
                                              <div className="space-y-3">
                          {developerModels
                            .filter(model => hasValidBenchmarkData(model.codeLMArena))
                            .slice(0, 3)
                            .map((model) => (
                              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700 truncate mr-2">{model.name}</span>
                                <span className="text-sm font-bold text-gray-900">{model.codeLMArena}</span>
                              </div>
                            ))}
                          {developerModels.filter(model => hasValidBenchmarkData(model.codeLMArena)).length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{developerModels.filter(model => hasValidBenchmarkData(model.codeLMArena)).length - 3} more models
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* MathLiveBench - Only show if any model has this data */}
                  {developerModels.some(model => hasValidBenchmarkData(model.mathLiveBench)) && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <div className="h-5 w-5 text-purple-600 font-bold flex items-center justify-center text-lg">➗</div>
                        </div>
                        <BenchmarkTooltip
                          title="MathLiveBench"
                          description="Real-time mathematical reasoning benchmark testing advanced problem-solving across algebra, calculus, geometry, statistics, and applied mathematics."
                        >
                          <h3 className="font-semibold text-gray-900 cursor-help hover:text-purple-600 transition-colors">MathLiveBench</h3>
                        </BenchmarkTooltip>
                      </div>
                                              <div className="space-y-3">
                          {developerModels
                            .filter(model => hasValidBenchmarkData(model.mathLiveBench))
                            .slice(0, 3)
                            .map((model) => (
                              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700 truncate mr-2">{model.name}</span>
                                <span className="text-sm font-bold text-gray-900">{model.mathLiveBench}</span>
                              </div>
                            ))}
                          {developerModels.filter(model => hasValidBenchmarkData(model.mathLiveBench)).length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{developerModels.filter(model => hasValidBenchmarkData(model.mathLiveBench)).length - 3} more models
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* CodeLiveBench - Only show if any model has this data */}
                  {developerModels.some(model => hasValidBenchmarkData(model.codeLiveBench)) && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <Code className="h-5 w-5 text-indigo-600" />
                        </div>
                        <BenchmarkTooltip
                          title="CodeLiveBench"
                          description="Live coding performance evaluation measuring the ability to write, debug, and optimize code in real-time scenarios including algorithm implementation and software development."
                        >
                          <h3 className="font-semibold text-gray-900 cursor-help hover:text-indigo-600 transition-colors">CodeLiveBench</h3>
                        </BenchmarkTooltip>
                      </div>
                                              <div className="space-y-3">
                          {developerModels
                            .filter(model => hasValidBenchmarkData(model.codeLiveBench))
                            .slice(0, 3)
                            .map((model) => (
                              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700 truncate mr-2">{model.name}</span>
                                <span className="text-sm font-bold text-gray-900">{model.codeLiveBench}</span>
                              </div>
                            ))}
                          {developerModels.filter(model => hasValidBenchmarkData(model.codeLiveBench)).length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{developerModels.filter(model => hasValidBenchmarkData(model.codeLiveBench)).length - 3} more models
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developerModels.map((model) => (
            <Link 
              key={model.id} 
              href={`/model/${model.id}`}
              className="block group"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 group-hover:-translate-y-1">
                {/* Model Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center border border-gray-100 p-2">
                    <Image 
                      src={model.developerLogo} 
                      alt={`${model.developer} logo`} 
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                      {model.name}
                    </h3>
                    <p className="text-sm text-gray-500">{model.developer}</p>
                  </div>
                </div>

                {/* Rankings */}
                <div className="flex items-center space-x-2 mb-4">
                  {model.safetyRank && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                      Safety #{model.safetyRank}
                    </span>
                  )}
                  {model.operationalRank && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5"></div>
                      Operational #{model.operationalRank}
                    </span>
                  )}
                </div>

                {/* Performance Benchmarks - Only show if model has any benchmark data */}
                {(hasValidBenchmarkData(model.codeLMArena) || hasValidBenchmarkData(model.mathLiveBench) || hasValidBenchmarkData(model.codeLiveBench)) && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Performance Benchmarks</h4>
                                          <div className="grid grid-cols-1 gap-2">
                        {hasValidBenchmarkData(model.codeLMArena) && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">CodeLMArena</span>
                            <span className="font-semibold text-gray-900">{model.codeLMArena}</span>
                          </div>
                        )}
                        {hasValidBenchmarkData(model.mathLiveBench) && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">MathLiveBench</span>
                            <span className="font-semibold text-gray-900">{model.mathLiveBench}</span>
                          </div>
                        )}
                        {hasValidBenchmarkData(model.codeLiveBench) && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">CodeLiveBench</span>
                            <span className="font-semibold text-gray-900">{model.codeLiveBench}</span>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Cpu className="w-3 h-3 mr-1" />
                      <span className="text-xs">Size</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {model.size ? model.size.split(' ')[0] : '-'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Database className="w-3 h-3 mr-1" />
                      <span className="text-xs">Context</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {model.contextLength ? model.contextLength.split(' ')[0] : '-'}
                    </div>
                  </div>
                </div>

                {/* Safety Score - Only show if model has safety data */}
                {model.safeResponses && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600">
                        <Shield className="w-3 h-3 mr-1" />
                        <span className="text-xs">Safety Score</span>
                      </div>
                      <div className="text-sm font-semibold text-blue-900">
                        {model.safeResponses}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Release Date */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Released</span>
                  </div>
                  <span>{formatMetric(model.released)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note if many models */}
        {developerModels.length > 6 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Showing all {developerModels.length} models from {developer}
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 