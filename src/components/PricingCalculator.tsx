'use client'

import { useState, useEffect } from 'react';
import { ProcessedModelData } from '@/types/model';

interface PricingCalculatorProps {
  model: ProcessedModelData;
}

export default function PricingCalculator({ model }: PricingCalculatorProps) {
  const [inputTokens, setInputTokens] = useState(1);
  const [outputTokens, setOutputTokens] = useState(1);
  const [inputCost, setInputCost] = useState(0);
  const [outputCost, setOutputCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Conversion ratios based on OpenAI's official documentation
  // 1 token ~= 4 chars in English
  // 1 token ~= ¾ words
  // 100 tokens ~= 75 words
  const tokensPerWord = 4/3; // 1 word ≈ 1.33 tokens (or 1 token ≈ 0.75 words)

  useEffect(() => {
    const newInputCost = (inputTokens / 1000000) * (model.inputCost || 0);
    const newOutputCost = (outputTokens / 1000000) * (model.outputCost || 0);
    const newTotalCost = newInputCost + newOutputCost;

    setInputCost(newInputCost);
    setOutputCost(newOutputCost);
    setTotalCost(newTotalCost);
  }, [inputTokens, outputTokens, model.inputCost, model.outputCost]);

  const handleInputTokensChange = (value: number) => {
    setInputTokens(value);
  };

  const handleOutputTokensChange = (value: number) => {
    setOutputTokens(value);
  };

  // Calculate pricing per word and character
  const getWordPrice = (costPerMillionTokens: number) => {
    return (costPerMillionTokens / 1000000) * tokensPerWord;
  };



  // Calculate words and characters from tokens (using OpenAI ratios)
  const inputWords = Math.round(inputTokens * 0.75); // 1 token ≈ ¾ words
  const outputWords = Math.round(outputTokens * 0.75);
  const inputCharacters = Math.round(inputTokens * 4); // 1 token ≈ 4 chars
  const outputCharacters = Math.round(outputTokens * 4);

    return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side: Cost Information & Sliders */}
      <div className="space-y-4">
        {/* Cost Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Input Cost */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1 bg-blue-100 rounded-lg">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Input Cost</h3>
            </div>
            <p className="text-xl font-bold text-gray-900">
              ${model.inputCost || 0}
            </p>
            <p className="text-sm text-gray-500 mb-2">per million tokens</p>
            
            {/* Additional pricing units */}
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Per 1K words:</span>
                <span className="font-mono">${(getWordPrice(model.inputCost || 0) * 1000).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Output Cost */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1 bg-green-100 rounded-lg">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Output Cost</h3>
            </div>
            <p className="text-xl font-bold text-gray-900">
              ${model.outputCost || 0}
            </p>
            <p className="text-sm text-gray-500 mb-2">per million tokens</p>
            
            {/* Additional pricing units */}
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Per 1K words:</span>
                <span className="font-mono">${(getWordPrice(model.outputCost || 0) * 1000).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">Cost Calculator</h3>
          
          {/* Input Tokens Slider */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Input Tokens</label>
              <div className="text-right">
                <span className="text-sm text-gray-900 font-semibold">
                  {inputTokens.toLocaleString()} tokens
                </span>
                <div className="text-sm text-gray-500">
                  ≈ {inputWords.toLocaleString()} words
                </div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10000000"
              value={inputTokens}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
              onChange={(e) => handleInputTokensChange(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1</span>
              <span>10M</span>
            </div>
          </div>

          {/* Output Tokens Slider */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Output Tokens</label>
              <div className="text-right">
                <span className="text-sm text-gray-900 font-semibold">
                  {outputTokens.toLocaleString()} tokens
                </span>
                <div className="text-sm text-gray-500">
                  ≈ {outputWords.toLocaleString()} words
                </div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10000000"
              value={outputTokens}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer"
              onChange={(e) => handleOutputTokensChange(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1</span>
              <span>10M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Cost Results */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm h-fit">
        <h4 className="text-base font-semibold text-gray-800 mb-1">Estimated Cost</h4>
        <p className="text-sm text-gray-500 mb-4">Based on your token selection</p>
        
        <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ${totalCost.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Total Cost</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-sm text-gray-600">Input Cost:</span>
            <span className="font-mono font-medium text-gray-900 text-base">${inputCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-sm text-gray-600">Output Cost:</span>
            <span className="font-mono font-medium text-gray-900 text-base">${outputCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 font-medium mb-2">Cost Breakdown:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-medium text-gray-700 mb-1">Per Word</div>
              <div className="font-mono text-gray-900">${(totalCost / (inputWords + outputWords) || 0).toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-medium text-gray-700 mb-1">Per Character</div>
              <div className="font-mono text-gray-900">${(totalCost / (inputCharacters + outputCharacters) || 0).toFixed(6)}</div>
            </div>
          </div>
        </div>

        {/* Monthly Estimate */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Monthly estimate (5M input + 3M output):</p>
            <p className="text-lg font-bold text-gray-900 mb-1">
              ${((model.inputCost || 0) * 5 + (model.outputCost || 0) * 3).toFixed(2)}
            </p>
            <div className="text-sm text-gray-500">
              ≈ {Math.round(8000000 * 0.75).toLocaleString()} words
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 