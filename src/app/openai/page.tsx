import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Cpu, Database, Shield, Calendar } from 'lucide-react';
import { processModelData } from '@/lib/data-processor';
import { ModelData } from '@/types/model';
import rawModelDataJson from '@/data/models.json';
import Navigation from '@/components/Navigation';

const rawModelData = rawModelDataJson as ModelData[];
const modelData = processModelData(rawModelData);

export default function OpenAIPage() {
  const developer = 'OpenAI';
  const developerModels = modelData.filter(model => model.developer === developer);

  const formatMetric = (value: string | number | null) => {
    if (value === null || value === '-' || value === '') return '-';
    return value;
  };

  // Get developer logo
  const developerLogo = `/logos/openai.png`;

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

                {/* Safety Score */}
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
          <div className="mt-12 text-center text-gray-500 text-sm">
            Showing all {developerModels.length} {developer} models available on the platform
          </div>
        )}
      </main>
    </div>
  );
} 