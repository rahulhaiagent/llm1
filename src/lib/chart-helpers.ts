import { ProcessedModelData } from '@/types/model';

// Organization color mapping
export function getOrganizationColor(developer: string): string {
  const colorMap: { [key: string]: string } = {
    'Anthropic': '#C4B5FD', // Light Purple
    'OpenAI': '#6EE7B7', // Light Green
    'Google': '#93C5FD', // Light Blue
    'Meta': '#FCA5A5', // Light Red
    'Mistral': '#FCD34D', // Light Amber
    'DeepSeek': '#67E8F9', // Light Cyan
    'xAI': '#A5B4FC', // Light Indigo
    'Cohere': '#F9A8D4', // Light Pink
  };
  
  return colorMap[developer] || '#D1D5DB'; // Light gray
}

// Helper function to extract organization models and prepare chart data
export function prepareChartData(
  models: ProcessedModelData[], 
  currentModel: ProcessedModelData, 
  metric: 'safety' | 'inputCost' | 'outputCost' | 'latency'
) {
  const organizationModels = models.filter(model => model.developer === currentModel.developer);
  
  const chartData = organizationModels
    .map(model => {
      let value: number | null = null;
      
      // Keep the full model name for display
      const displayName = model.name;

      switch (metric) {
        case 'safety':
          if (model.safeResponses && model.safeResponsesTotal) {
            const safeResponsesNum = typeof model.safeResponses === 'number' 
              ? model.safeResponses 
              : parseFloat(String(model.safeResponses));
            value = (safeResponsesNum / model.safeResponsesTotal) * 100;
          }
          break;
        case 'inputCost':
          value = model.inputCost;
          break;
        case 'outputCost':
          value = model.outputCost;
          break;
        case 'latency':
          if (model.latency && model.latency !== '-') {
            value = parseFloat(model.latency);
          }
          break;
      }

      return {
        name: model.name,
        displayName: displayName,
        value: value || 0,
        hasData: value !== null && value !== undefined && value > 0
      };
    })
    .filter(item => item.hasData)
    .sort((a, b) => {
      // Sort descending for most metrics, ascending for latency (lower is better)
      return metric === 'latency' ? a.value - b.value : b.value - a.value;
    });

  return chartData;
} 