'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../../components/Navigation';
import { processModelData } from '@/lib/data-processor';
import { ModelData } from '@/types/model';
import rawModelDataJson from '@/data/models.json';
import VerticalBarChart from '@/components/VerticalBarChart';

const rawModelData = rawModelDataJson as ModelData[];
const modelData = processModelData(rawModelData);

export default function RecommendationsPage() {
  // State for selected models for each chart
  const [selectedPriceModels, setSelectedPriceModels] = useState<string[]>([]);
  const [selectedCodingModels, setSelectedCodingModels] = useState<string[]>([]);
  const [selectedMathModels, setSelectedMathModels] = useState<string[]>([]);

  // Handler for model selection/deselection
  const handleModelSelect = (modelId: string, currentSelected: string[], setSelected: (models: string[]) => void) => {
    if (currentSelected.includes(modelId)) {
      // Remove model if already selected
      setSelected(currentSelected.filter(id => id !== modelId));
    } else {
      // Add model if not selected and under limit
      if (currentSelected.length < 2) { // Max 2 additional models (5 default + 2 = 7 total)
        setSelected([...currentSelected, modelId]);
      }
    }
  };

  return (
    <div className="flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-grow mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leaderboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-normal mb-6 text-gray-900 tracking-tight leading-tight">AI Model Recommendations</h1>
          <p className="text-xl text-gray-700 mb-4 font-medium">
            Quickly identify the best-fit AI model for your specific use case.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Different use cases demand different strengths from an LLM. The model that excels at one task—like coding or customer service—may fall short in another. There&apos;s no one-size-fits-all solution, making it critical to choose the right model for your needs.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="space-y-12">
          {/* Safety Chart */}
          <VerticalBarChart 
            models={modelData}
            title="Safest AI Models"
            subtitle="Based on safety test results - Score % represents safety performance"
            metric="safety"
          />

          {/* Price Chart */}
          <VerticalBarChart 
            models={modelData}
            title="Most Affordable Models"
            subtitle="Input and output cost per million tokens (USD) - Lower is better"
            metric="price"
            selectedModels={selectedPriceModels}
            onModelSelect={(modelId) => handleModelSelect(modelId, selectedPriceModels, setSelectedPriceModels)}
            availableModels={modelData}
          />

          {/* Coding Chart */}
          <VerticalBarChart 
            models={modelData}
            title="Top Models for Coding"
            subtitle="Based on CodeLMArena scores - Higher is better"
            metric="coding"
            selectedModels={selectedCodingModels}
            onModelSelect={(modelId) => handleModelSelect(modelId, selectedCodingModels, setSelectedCodingModels)}
            availableModels={modelData}
          />

          {/* Math Chart */}
          <VerticalBarChart 
            models={modelData}
            title="Top Models for Math"
            subtitle="Based on MathLiveBench scores - Higher is better"
            metric="math"
            selectedModels={selectedMathModels}
            onModelSelect={(modelId) => handleModelSelect(modelId, selectedMathModels, setSelectedMathModels)}
            availableModels={modelData}
          />
        </div>
      </main>
    </div>
  );
} 