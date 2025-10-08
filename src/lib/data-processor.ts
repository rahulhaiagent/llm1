import { ModelData, ProcessedModelData } from '@/types/model';
import { generateSlug, parseRank, parseCost, getDeveloperLogo } from './utils';
import modelsByProvider from '@/data/models-by-provider.json';

function parseNumericField(value: string): number | string {
  if (value === '-' || value === 'N/A' || !value) return '-';
  const numericValue = parseFloat(value);
  return isNaN(numericValue) ? value : numericValue;
}

function checkProviderAvailability(modelId: string, providerName: string): string {
  if (!modelId || !modelsByProvider) return '-';
  
  const modelData = modelsByProvider[modelId as keyof typeof modelsByProvider];
  if (!modelData || !modelData.providers) return '-';
  
  // Check for exact match or partial matches for provider names
  const providers = Object.keys(modelData.providers);
  const hasProvider = providers.some(provider => {
    const lowerProvider = provider.toLowerCase();
    const lowerTarget = providerName.toLowerCase();
    
    // Check for exact matches or common variations
    if (lowerProvider === lowerTarget) return true;
    if (lowerProvider.includes(lowerTarget)) return true;
    if (lowerTarget.includes(lowerProvider)) return true;
    
    // Specific provider matching rules
    if (providerName === 'Google Vertex' && (lowerProvider.includes('google') || lowerProvider.includes('vertex'))) return true;
    if (providerName === 'Microsoft Azure' && (lowerProvider.includes('azure') || lowerProvider.includes('microsoft'))) return true;
    if (providerName === 'AWS Bedrock' && (lowerProvider.includes('bedrock') || lowerProvider.includes('aws'))) return true;
    
    return false;
  });
  
  return hasProvider ? 'Yes' : 'No';
}

export function processModelData(rawData: ModelData[]): ProcessedModelData[] {
  const usedIds = new Set<string>();
  
  // First pass: map raw data and compute dynamic safety/jailbreak percentages
  const processed = rawData.map((model) => {
    const baseId = generateSlug(model.Model);
    let uniqueId = baseId;
    let counter = 1;
    
    // Ensure unique ID by adding a counter if needed
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);
    
    // Process safety metrics using new standardized format
    // Dynamic calculation: Safe % = (SafeResponses / total_prompts) × 100
    let safetyPercentage = null;
    if (model.SafeResponses !== undefined && model.SafeResponses !== null && model.SafeResponses !== 'N/A' && 
        model.total_prompts !== undefined && model.total_prompts !== null && model.total_prompts > 0) {
      const safeResponsesNum = typeof model.SafeResponses === 'number' 
        ? model.SafeResponses 
        : parseFloat(String(model.SafeResponses));
      
      if (!isNaN(safeResponsesNum)) {
        safetyPercentage = Math.round((safeResponsesNum / model.total_prompts) * 100);
      }
    }
    
    // Dynamic calculation: Jailbreak Resistance % = (JailbreakingSafeResponses / jailbreaking_prompts) × 100
    let jailbreakingResistancePercentage = null;
    if (model.JailbreakingSafeResponses !== undefined && model.JailbreakingSafeResponses !== null && 
        model.JailbreakingSafeResponses !== 'N/A' && model.jailbreaking_prompts !== undefined && 
        model.jailbreaking_prompts !== null && model.jailbreaking_prompts > 0) {
      const jailbreakingSafeNum = typeof model.JailbreakingSafeResponses === 'number' 
        ? model.JailbreakingSafeResponses 
        : parseFloat(String(model.JailbreakingSafeResponses));
      
      if (!isNaN(jailbreakingSafeNum)) {
        jailbreakingResistancePercentage = Math.round((jailbreakingSafeNum / model.jailbreaking_prompts) * 100);
      }
    }
    
    return {
      id: uniqueId,
      modelId: model.ModelId,
      name: model.Model,
      description: model.Description,
      metaDescription: model["Meta-description"],
      operationalRank: parseRank(model.OperationalRank),
      safetyRank: parseRank(model.SafetyRank),
      developer: model["Org."],
      developerLogo: getDeveloperLogo(model["Org."]),
      size: model.Size,
      released: model.Released,
      codeLMArena: parseNumericField(model.CodeLMArena),
      mathLiveBench: model.MathLiveBench,
      gpqa: model.GPQA || '-',
      codeLiveBench: model.CodeLiveBench,
      codeRankedAGI: model.CodeRankedAGI || '-',
      // New benchmarks
      aime2024: model.AIME2024,
      humanEval: model.HumanEval,
      math: model.MATH,
      mmlu: model.MMLU,
      mmluPro: model.MMLUPro,
      inputCost: parseCost(model["Input Cost/M"]),
      outputCost: parseCost(model["Output Cost/M"]),
      cutoffKnowledge: model.CutoffKnowledge || '-',
      contextLength: model.ContextLength,
      maxOutputTokens: model.MaxOutputTokens || undefined,
      license: model.License,
      apiReference: model.APIReference,
      playground: model.Playground,
      documentation: model.Documentation,
      
      // Calculated percentages using new formulas
      safetyPercentage: safetyPercentage,
      jailbreakingResistancePercentage: jailbreakingResistancePercentage,
      
      // New standardized safety fields
      totalPrompts: typeof model.total_prompts === 'number' ? model.total_prompts : (model.total_prompts !== 'N/A' && model.total_prompts !== '-' ? parseFloat(String(model.total_prompts)) : null),
      safeResponses: typeof model.SafeResponses === 'number' ? model.SafeResponses : (model.SafeResponses !== 'N/A' && model.SafeResponses !== '-' ? parseFloat(String(model.SafeResponses)) : null),
      unsafeResponses: typeof model.UnsafeResponses === 'number' ? model.UnsafeResponses : (model.UnsafeResponses !== 'N/A' && model.UnsafeResponses !== '-' ? parseFloat(String(model.UnsafeResponses)) : null),
      
      // Jailbreaking data
      jailbreakingPrompts: typeof model.jailbreaking_prompts === 'number' ? model.jailbreaking_prompts : (model.jailbreaking_prompts !== 'N/A' && model.jailbreaking_prompts !== '-' ? parseFloat(String(model.jailbreaking_prompts)) : null),
      jailbreakingSafeResponses: typeof model.JailbreakingSafeResponses === 'number' ? model.JailbreakingSafeResponses : (model.JailbreakingSafeResponses !== 'N/A' && model.JailbreakingSafeResponses !== '-' ? parseFloat(String(model.JailbreakingSafeResponses)) : null),
      jailbreakingUnsafeResponses: typeof model.JailbreakingUnSafeResponses === 'number' ? model.JailbreakingUnSafeResponses : (model.JailbreakingUnSafeResponses !== 'N/A' && model.JailbreakingUnSafeResponses !== '-' ? parseFloat(String(model.JailbreakingUnSafeResponses)) : null),
      
      // Legacy fields for backward compatibility (will be deprecated)
      safeResponsesTotal: model.total_prompts || null,
      unsafeResponsesTotal: model.total_prompts || null,
      jailbreakingResistance: typeof model.JailbreakingSafeResponses === 'string' ? parseInt(model.JailbreakingSafeResponses) || null : (model.JailbreakingSafeResponses || null),
      jailbreakingResistanceTotal: model.jailbreaking_prompts || null,
      
      latency: model.Latency || '-',
      multimodal: model.Multimodal || '-',
      reasoning: model.Reasoning || '-',
      providerModelIds: model.ProviderModelIds || [],
      googleVertexAvailable: checkProviderAvailability(model.ModelId, 'Google Vertex'),
      azureAvailable: checkProviderAvailability(model.ModelId, 'Microsoft Azure'),
      awsBedrockAvailable: checkProviderAvailability(model.ModelId, 'AWS Bedrock'),
      modalities: model.Modalities || undefined,
      features: model.Features || undefined,
      tools: model.Tools || undefined,
    };
  });

  // Second pass: compute Safety Rank dynamically from safetyPercentage
  // Rank by safetyPercentage desc; tie-break by jailbreakingResistancePercentage desc; name asc for stability
  const withScore = processed.map((m, idx) => ({
    idx,
    safe: typeof m.safetyPercentage === 'number' ? m.safetyPercentage : -1,
    jail: typeof m.jailbreakingResistancePercentage === 'number' ? m.jailbreakingResistancePercentage : -1,
    name: m.name.toLowerCase(),
  }));

  const ranked = withScore
    .filter((s) => s.safe >= 0)
    .sort((a, b) => {
      if (b.safe !== a.safe) return b.safe - a.safe;
      if (b.jail !== a.jail) return b.jail - a.jail;
      return a.name.localeCompare(b.name);
    });

  ranked.forEach((entry, i) => {
    processed[entry.idx].safetyRank = i + 1;
  });

  // Models without a calculable safety score keep safetyRank as null
  processed.forEach((m) => {
    if (typeof m.safetyPercentage !== 'number') {
      m.safetyRank = null;
    }
  });

  return processed;
}

export function getModelById(models: ProcessedModelData[], id: string): ProcessedModelData | undefined {
  return models.find(model => model.id === id);
}

export function getAllModelIds(models: ProcessedModelData[]): string[] {
  return models.map(model => model.id);
} 