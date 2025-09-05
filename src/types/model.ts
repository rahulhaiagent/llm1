export interface ModelData {
  Model: string;
  ModelId: string;
  Description: string;
  "Meta-description": string;
  OperationalRank: string;
  SafetyRank: string;
  "Org.": string;
  Size: string;
  Released: string;
  CodeLMArena: string;
  MathLiveBench: string;
  GPQA: string;
  CodeLiveBench: string;
  CodeRankedAGI?: string;
  "Input Cost/M": string;
  "Output Cost/M": string;
  CutoffKnowledge: string | null;
  ContextLength: string;
  MaxOutputTokens?: string;
  License: string;
  APIReference?: string;
  Playground?: string;
  Documentation?: string;
  
  // New standardized safety fields
  total_prompts?: number;
  SafeResponses: number | string;
  UnsafeResponses: number | string;
  jailbreaking_prompts?: number;
  JailbreakingSafeResponses?: number | string;
  JailbreakingUnSafeResponses?: number | string;
  
  // Legacy fields (for backward compatibility during transition)
  SafetyPercentage?: number | null;
  JailbreakingResistancePercentage?: number | null;
  SafeResponsesTotal?: number;
  UnsafeResponsesTotal?: number;
  JailbreakingResistance?: number | string;
  JailbreakingResistanceTotal?: number;
  
  Latency: string;
  Multimodal: string;
  Reasoning: string;
  ProviderModelIds?: string[];
  Modalities?: {
    text?: {
      input?: boolean;
      output?: boolean;
    };
    image?: {
      input?: boolean;
      output?: boolean;
    };
    audio?: {
      input?: boolean;
      output?: boolean;
    };
  };
  Features?: {
    streaming?: boolean;
    function_calling?: boolean;
    structured_outputs?: boolean;
    fine_tuning?: boolean;
    distillation?: boolean;
    predicted_outputs?: boolean;
    multimodal?: boolean;
    reasoning?: boolean;
  };
  Tools?: {
    web_search?: boolean;
    file_search?: boolean;
    image_generation?: boolean;
    code_interpreter?: boolean;
    mcp?: boolean;
    computer_use?: boolean;
  };
  providers?: {
    [providerName: string]: {
      model_id: string;
      price_per_input_token: number;
      price_per_output_token?: number;
      price_per_cached_input_token?: number;
      throughput: number | string;
      latency: number | string;
      updated_at: string;
    };
  };
}

export interface ProcessedModelData {
  id: string;
  modelId: string;
  name: string;
  description: string;
  metaDescription: string;
  operationalRank: number | null;
  safetyRank: number | null;
  developer: string;
  developerLogo: string;
  size: string;
  released: string;
  codeLMArena: number | string;
  mathLiveBench: string;
  gpqa: string;
  codeLiveBench: string;
  codeRankedAGI: string;
  inputCost: number | null;
  outputCost: number | null;
  cutoffKnowledge: string;
  contextLength: string;
  maxOutputTokens?: string;
  license: string;
  apiReference?: string;
  playground?: string;
  documentation?: string;
  
  // Calculated percentages (dynamic)
  safetyPercentage: number | null;
  jailbreakingResistancePercentage: number | null;
  
  // New standardized safety fields
  totalPrompts: number | null;
  safeResponses: number | null;
  unsafeResponses: number | null;
  jailbreakingPrompts: number | null;
  jailbreakingSafeResponses: number | null;
  jailbreakingUnsafeResponses: number | null;
  
  // Legacy fields (for backward compatibility)
  safeResponsesTotal: number | null;
  unsafeResponsesTotal: number | null;
  jailbreakingResistance: number | null;
  jailbreakingResistanceTotal: number | null;
  
  latency: string;
  multimodal: string;
  reasoning: string;
  providerModelIds?: string[];
  googleVertexAvailable: string;
  azureAvailable: string;
  awsBedrockAvailable: string;
  modalities?: {
    text?: {
      input?: boolean;
      output?: boolean;
    };
    image?: {
      input?: boolean;
      output?: boolean;
    };
    audio?: {
      input?: boolean;
      output?: boolean;
    };
  };
  features?: {
    streaming?: boolean;
    function_calling?: boolean;
    structured_outputs?: boolean;
    fine_tuning?: boolean;
    distillation?: boolean;
    predicted_outputs?: boolean;
    multimodal?: boolean;
    reasoning?: boolean;
  };
  Features?: {
    streaming?: boolean;
    function_calling?: boolean;
    structured_outputs?: boolean;
    fine_tuning?: boolean;
    distillation?: boolean;
    predicted_outputs?: boolean;
    multimodal?: boolean;
    reasoning?: boolean;
  };
  tools?: {
    web_search?: boolean;
    file_search?: boolean;
    image_generation?: boolean;
    code_interpreter?: boolean;
    mcp?: boolean;
    computer_use?: boolean;
  };
  Tools?: {
    web_search?: boolean;
    file_search?: boolean;
    image_generation?: boolean;
    code_interpreter?: boolean;
    mcp?: boolean;
    computer_use?: boolean;
  };
}

export type SortField = 
  | 'name' 
  | 'developer' 
  | 'inputCost' 
  | 'outputCost' 
  | 'cutoffKnowledge' 
  | 'contextLength' 
  | 'license' 
  | 'safeResponses' 
  | 'unsafeResponses' 
  | 'jailbreakingResistance' 
  | 'operationalRank' 
  | 'safetyRank' 
  | 'size' 
  | 'released' 
  | 'codeLMArena' 
  | 'mathLiveBench' 
  | 'gpqa'
  | 'codeLiveBench'
  | 'codeRankedAGI'
  | 'latency'
  | 'multimodal'
  | 'reasoning'
  | 'googleVertexAvailable'
  | 'azureAvailable' 
  | 'awsBedrockAvailable'; 

// HubSpot types
declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
          onFormReady?: () => void;
          onFormSubmitted?: () => void;
        }) => void;
      };
    };
  }
} 