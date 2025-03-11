# AI Chat Interface

A modern, responsive web application that provides seamless access to multiple AI models through Puter.js integration. This project combines the power of Next.js with the simplicity of Puter.js to create an intuitive chat interface for AI interactions.

## Marketing Overview

### Key Features

- **Multi-Model Support**: Access to 17+ cutting-edge AI models from leading providers:
  - OpenAI (GPT-4O Mini, GPT-4O, O3-Mini, O1-Mini)
  - Anthropic (Claude 3.5 Sonnet)
  - Google (Gemini 2.0 Flash, Gemini 1.5 Flash)
  - Mistral AI (Mistral Large, Pixtral Large, Codestral)
  - Together.ai (Meta-Llama 3.1 series)
  - And more!

- **User-Friendly Interface**:
  - Clean, modern design with dark mode support
  - Real-time response streaming
  - Intuitive model selection
  - Responsive layout for all devices

- **Enhanced User Experience**:
  - Smart keyboard shortcuts (Enter to send, Shift+Enter for new line)
  - Loading states and error handling
  - Beautiful animations and transitions
  - Accessibility-focused design

### Benefits

- **No API Keys Required**: Start using advanced AI models instantly
- **Zero Configuration**: Works out of the box with Puter.js
- **Cross-Platform**: Works seamlessly across all modern browsers
- **Enterprise-Ready**: Built with scalability and reliability in mind

## Technical Documentation

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ChatInput.tsx      # Handles user input and submission
│   │   ├── ModelSelector.tsx  # AI model selection dropdown
│   │   ├── PuterScript.tsx   # Puter.js integration component
│   │   └── ResponseDisplay.tsx# AI response rendering
│   ├── layout.tsx            # Root layout with Puter.js initialization
│   └── page.tsx              # Main application page
```

### Components

#### ChatInput
- Handles text input with support for multiline
- Implements Enter/Shift+Enter keyboard shortcuts
- Manages loading states and submission
- Props: `onSubmit`, `isLoading`

#### ModelSelector
- Provides dropdown interface for AI model selection
- Includes vendor information for each model
- Supports disabled states during processing
- Props: `selectedModel`, `onSelect`, `disabled`

#### ResponseDisplay
- Renders AI responses with proper formatting
- Handles loading states with skeleton UI
- Supports dark mode
- Props: `response`, `isLoading`

#### PuterScript
- Client-side component for Puter.js initialization
- Handles script loading and error states
- Ensures proper script injection timing

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Puter.js v2
- **Font**: Inter (via next/font)

### Available Models

| Model | Provider | Description |
|-------|----------|-------------|
| gpt-4o-mini | OpenAI | Default model for general use |
| claude-3-5-sonnet | Anthropic | Advanced language model |
| gemini-2.0-flash | Google | Fast, powerful model |
| mistral-large-latest | Mistral AI | Large language model |
| codestral-latest | Mistral AI | Code-specialized model |
| meta-llama/Meta-Llama-3.1 | Together.ai | Various sizes (8B/70B/405B) |
| grok-beta | xAI | Beta access to Grok |

### Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd openmanus-interface-v2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

### Features Implementation Details

#### Dark Mode
- System preference detection
- Smooth transitions
- Consistent styling across components

#### Error Handling
- Comprehensive error messages
- Graceful fallbacks
- Debug information in development

#### Response Processing
- Smart response format detection
- Support for various AI model response structures
- Markdown and code formatting

#### Function Calling - Weather
The interface implements a sophisticated function calling system for weather queries:

- **Real-time Weather Data**: Integrates with OpenWeather API for accurate weather information
- **Supported Cities**: Paris, London, New York, Tokyo (expandable)
- **Smart City Detection**: 
  - Direct mentions: "What's the weather in London?"
  - Context inference: "Is it cold in Paris today?"
  - Pattern matching: Extracts city names from various query formats
- **Response Processing**:
  - Async/await implementation for proper Promise handling
  - Graceful error handling for API failures
  - User-friendly responses for unsupported cities
- **Technical Features**:
  - Temperature in Celsius with weather description
  - Automatic API response formatting
  - Built-in rate limiting and error handling
  - Fallback responses for API failures

**Example Interactions:**
- "How's the weather in Tokyo?"
- "What's the temperature in Paris?"
- "Is it raining in London?"
- "New York weather forecast"

**Implementation Details:**
- Uses OpenWeather API with metric units
- Handles both direct function calls and natural language queries
- Provides informative error messages for unknown cities
- Supports both explicit and implicit weather-related queries

### Performance Optimizations

- Next.js App Router for optimal routing
- Client-side component splitting
- Efficient state management
- Responsive design practices

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
