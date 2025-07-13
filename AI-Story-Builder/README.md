# 🎭 AI Story Builder

A sophisticated web application for generating compelling narratives through interactive character, setting, and theme selection. Built with modern web technologies and featuring both rule-based and AI-powered story generation capabilities.

## 🌟 Features

### Core Functionality
- **Interactive Story Generation**: Step-by-step wizard for creating structured narratives
- **Rich Character System**: Detailed character creation with personalities, goals, flaws, and backstories
- **Immersive World Building**: Comprehensive setting creation across multiple genres and environments
- **Theme Integration**: Complex theme system with conflict patterns and mood variations
- **Story Management**: Complete library system for organizing and managing generated stories

### Advanced Capabilities
- **Hybrid Generation Engine**: Combines rule-based algorithms with optional AI enhancement
- **Multiple AI Providers**: Support for OpenAI GPT-4, Anthropic Claude, and local LLMs
- **Narrative Perspectives**: First person, third person limited, and omniscient viewpoints
- **Dynamic Content**: Character-driven dialogue and personality-based story progression
- **Export Functionality**: Story export and sharing capabilities

## 🛠️ Tech Stack

### Frontend Framework
- **Vue 3** with Composition API for reactive component architecture
- **TypeScript** for type safety and enhanced developer experience
- **Vite** for fast development and optimized production builds

### State Management & Routing
- **Pinia** for centralized state management with TypeScript support
- **Vue Router** for client-side navigation and route management

### Architecture & Patterns
- **Component-Based Architecture**: Modular, reusable UI components
- **Store Pattern**: Centralized state management for characters, settings, themes, and stories
- **Service Layer**: Dedicated utilities for story generation and content creation
- **Type-Driven Development**: Comprehensive TypeScript interfaces and enums

### AI Integration
- **OpenAI API** integration for GPT-4 powered story generation
- **Anthropic Claude** support for sophisticated narrative creation
- **Local LLM Support** via Ollama or similar platforms
- **Graceful Fallback**: Enhanced rule-based generation when AI is unavailable

## 🏗️ Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── character/       # Character creation and management
│   ├── setting/         # World and environment building
│   ├── theme/           # Theme and conflict selection
│   ├── story/           # Story generation interface
│   ├── ai/              # AI configuration components
│   └── ui/              # Base UI components
├── stores/              # Pinia state management
│   ├── characterStore.ts
│   ├── settingStore.ts
│   ├── themeStore.ts
│   └── storyStore.ts
├── utils/               # Core business logic
│   ├── storyEngine.ts   # Rule-based story generation
│   ├── contentGenerator.ts # Enhanced content creation
│   └── aiStoryGenerator.ts # AI integration layer
├── types/               # TypeScript definitions
├── data/                # Sample data and templates
└── views/               # Main application views
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-story-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5174`

### Production Build

```bash
# Type-check, compile and minify
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage Guide

### Basic Story Creation

1. **Character Selection**: Create or choose characters with unique personalities, goals, and flaws
2. **Setting Definition**: Build immersive worlds with atmospheric details and key locations
3. **Theme Integration**: Select central themes and conflicts that will drive your narrative
4. **Story Generation**: Configure options and generate your complete story

### AI-Enhanced Generation

1. **Enable AI Assistance**: Check "Use AI assistance" in generation options
2. **Configure Provider**: Choose between OpenAI, Anthropic, or local models
3. **API Setup**: Add your API keys through the configuration interface
4. **Enhanced Output**: Generate stories with AI-powered narrative enhancement

### Story Management

- **Library View**: Browse and organize your generated stories
- **Search & Filter**: Find stories by title, genre, theme, or content
- **Export Options**: Share stories in various formats
- **Version Control**: Track story iterations and improvements

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for AI API configuration:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-4

# Anthropic Configuration
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### Local LLM Setup

For privacy-focused generation using local models:

1. Install [Ollama](https://ollama.ai/) or similar LLM server
2. Download a model: `ollama pull llama2`
3. Start the server: `ollama serve`
4. Configure in the AI settings interface

## 🎨 Development Methodology

### Design Principles
- **User-Centric Design**: Intuitive interfaces for creative workflows
- **Progressive Enhancement**: Graceful degradation from AI to rule-based generation
- **Type Safety**: Comprehensive TypeScript coverage for reliability
- **Component Modularity**: Reusable, testable component architecture

### Code Organization
- **Feature-Based Structure**: Components organized by domain functionality
- **Separation of Concerns**: Clear boundaries between UI, state, and business logic
- **Dependency Injection**: Configurable services for different generation strategies
- **Error Handling**: Robust error boundaries and fallback mechanisms

## 🎪 Use Cases

### Creative Writing
- **Author Assistance**: Generate story outlines and narrative structures
- **Writer's Block**: Overcome creative obstacles with AI-powered suggestions
- **Character Development**: Create complex, multi-dimensional characters
- **World Building**: Design immersive fictional environments

### Educational Applications
- **Creative Writing Courses**: Teaching narrative structure and character development
- **Literature Analysis**: Understanding story components and themes
- **Interactive Learning**: Hands-on exploration of storytelling elements

### Content Creation
- **Game Development**: Generate backstories and lore for games
- **Screenwriting**: Create structured narratives for film and television
- **Marketing**: Develop compelling brand narratives and case studies

## 🔮 Future Enhancements

- **Collaborative Editing**: Multi-user story creation and editing
- **Advanced AI Models**: Integration with latest language models
- **Visual Story Mapping**: Graphical story structure visualization
- **Audio Integration**: Text-to-speech and voice narration
- **Publishing Tools**: Direct export to popular publishing platforms

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

---

**Built with ❤️ using Vue 3, TypeScript, and modern web technologies**
