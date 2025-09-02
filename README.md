# AI Model Provider Comparison Dashboard

A comprehensive React TypeScript component for comparing AI model providers across pricing, latency, and throughput metrics. Built with a modern, responsive design inspired by the best practices in data visualization.

## 🚀 Features

- **📊 Comprehensive Data Display**: View detailed pricing and performance metrics for 80+ AI models
- **🔄 Interactive Sorting**: Sort providers by any metric (pricing, latency, throughput)
- **🎯 Model Selection**: Easy dropdown to switch between different AI models
- **📈 Summary Statistics**: Quick insights including lowest pricing, best latency, and highest throughput
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates**: Data reflects the latest pricing and performance information

## 🛡️ Safety & Security Testing

All jailbreaking and red teaming data is comprehensively tested by **Holistic AI**, ensuring:

- **🔒 Jailbreaking Resistance**: Models are tested against various prompt injection and safety bypass attempts
- **🎯 Red Team Evaluations**: Rigorous adversarial testing to identify potential vulnerabilities
- **📊 Safety Rankings**: Comprehensive safety scores based on resistance to harmful outputs
- **⚖️ Bias Assessment**: Evaluation of model responses for potential biases and harmful content
- **🔍 Comprehensive Testing**: Multi-layered approach including automated and human evaluation
- **📈 Continuous Monitoring**: Regular updates to safety assessments as models evolve

*Holistic AI's expertise in AI safety and security ensures that all safety metrics are thoroughly validated and reliable for enterprise decision-making.*

## 📋 Data Coverage

The dashboard includes data for major AI providers:

- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5, O1 series, O3 series, O4 series
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku, Claude 4 series
- **Google**: Gemini 1.5 Pro/Flash, Gemini 2.0/2.5 series
- **AWS Bedrock**: Multiple model variants across providers
- **Azure**: OpenAI models with Azure-specific pricing
- **Meta/Llama**: Llama 3.1/3.2/3.3/4 series across multiple providers
- **DeepSeek**: V2.5, V3, R1 models
- **Mistral AI**: Large, Small, Nemo, Codestral models
- **xAI**: Grok 2, Grok 3 series
- **And 10+ more providers**: Together, Fireworks, Sambanova, Groq, Hyperbolic, etc.

## 🛠 Installation

```bash
# Clone the repository
git clone [repository-url]
cd model-providers-dashboard

# Install dependencies
npm install

# Start the development server
npm start
```

## 📊 Usage

### Basic Component Usage

```typescript
import { ModelProviders } from './src/components/ModelProviders';
import './src/components/ModelProviders.css';

function App() {
  return (
    <div className="App">
      <ModelProviders />
    </div>
  );
}
```

### Demo Page Usage

```typescript
import { ProvidersDemo } from './src/pages/ProvidersDemo';

function App() {
  return <ProvidersDemo />;
}
```

## 🎨 Component Features

### Model Selection
- Dropdown with all 80+ available models
- Real-time data updates when switching models
- Alphabetically sorted for easy navigation

### Provider Comparison Table
- **Provider**: Company name with avatar
- **Input $/1M**: Cost per million input tokens
- **Output $/1M**: Cost per million output tokens  
- **Latency**: Response time in milliseconds
- **Throughput**: Processing speed in tokens per second
- **Updated**: Last data update timestamp

### Interactive Sorting
- Click any column header to sort
- Toggle between ascending/descending order
- Visual indicators for current sort column and direction

### Summary Statistics
- **Total Providers**: Number of providers for selected model
- **Lowest Input Price**: Most cost-effective input pricing
- **Best Latency**: Fastest response time available
- **Highest Throughput**: Maximum processing speed

## 🔧 Customization

### Styling
The component uses Tailwind CSS with custom CSS for enhanced styling. You can customize:

```css
/* Custom provider avatars */
.provider-avatar {
  /* Add custom provider logos */
}

/* Custom color schemes */
.stat-card.custom {
  background-color: #your-color;
}
```

### Data Format
The component expects data in this format:

```json
{
  "model-name": {
    "providers": {
      "Provider Name": {
        "model_id": "model-identifier",
        "price_per_input_token": 0.000001,
        "price_per_output_token": 0.000002,
        "throughput": 100,
        "latency": 0.5,
        "updated_at": "2024-01-01"
      }
    }
  }
}
```

## 📱 Responsive Design

- **Desktop**: Full table layout with all columns visible
- **Tablet**: Optimized spacing and responsive grid
- **Mobile**: Horizontal scroll for table, stacked summary cards

## 🔍 Search & Filter (Future Enhancement)

Planned features:
- Provider name search
- Price range filtering
- Performance threshold filtering
- Model category grouping

## 🛡 TypeScript Support

Full TypeScript support with defined interfaces:

```typescript
interface Provider {
  model_id: string;
  price_per_input_token: number;
  price_per_output_token: number;
  throughput: number;
  latency: number;
  updated_at: string;
}

interface ModelData {
  providers: Record<string, Provider>;
}
```

## 🎯 Performance

- **Fast Rendering**: Optimized with React.memo and useMemo
- **Minimal Re-renders**: Efficient state management
- **Lazy Loading**: Table virtualization for large datasets (future)

## 📈 Data Sources

Data is aggregated from multiple reliable sources:

- **Performance & Pricing**: Official provider documentation and APIs
- **Safety & Security**: Comprehensive testing and evaluation by **Holistic AI**
- **Jailbreaking Resistance**: Rigorous red team testing by Holistic AI security experts
- **Benchmark Scores**: External benchmarks including CodeLMArena, MathLiveBench, CodeLiveBench, and GPQA

All data is regularly updated to ensure accuracy. Pricing reflects per-million-token costs, latency shows average response times, throughput indicates maximum processing speeds, and safety metrics are validated through Holistic AI's comprehensive testing protocols.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙋‍♂️ Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS