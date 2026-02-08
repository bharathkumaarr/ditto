# ✨ Ditto - The UI That Builds Itself

A generative AI-powered application that creates interactive UI components on the fly based on natural language prompts. Built with React, TypeScript, and the Tambo AI SDK.

**🚀 Live Demo:** [ditto-theta.vercel.app](https://ditto-theta.vercel.app)

---

## ⚡ Features

### 🎨 AI-Powered Component Generation
Describe what you need in plain English, and Ditto generates fully functional, styled components:

- **📊 Dashboard** - Analytics with metrics and charts
- **✅ Task Tracker** - Kanban board with drag-and-drop
- **📝 Notes Panel** - Sticky notes with drag-to-workflow transformation
- **⏱️ Timer** - Countdown timer and stopwatch with beautiful digit animations
- **🧘 Focus Mode** - Guided breathing exercises with visual feedback
- **📈 Readiness Score** - Visual assessment gauge for project/startup readiness
- **🎤 Pitch Generator** - Structured business pitch deck content
- **🎯 Task Prioritizer** - AI-powered task ranking by impact

### 🎭 Premium Design System
- **Visual Realism**: Multi-layered shadows, glassmorphism, and depth effects
- **Smooth Animations**: Powered by Framer Motion
- **Dark/Light Themes**: Toggle with `Alt + T`
- **Fully Responsive**: Works beautifully on mobile, tablet, and desktop

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + K` or `/` | Focus input |
| `Alt + T` | Toggle theme |
| `Esc` | Blur input |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [Tambo AI](https://tambo.ai/) | Generative UI SDK |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [Recharts](https://recharts.org/) | Data Visualization |
| [Zod](https://zod.dev/) | Schema Validation |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Tambo AI](https://tambo.ai/) API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ditto.git
   cd ditto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_TAMBO_API_KEY=your_tambo_api_key_here
   ```
   
   > 🔑 **Get your API key:** Sign up at [tambo.ai](https://tambo.ai/) and create a new project to get your API key.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
ditto/
├── src/
│   ├── components/         # UI Components
│   │   ├── Dashboard.tsx
│   │   ├── TaskTracker.tsx
│   │   ├── NotesPanel.tsx
│   │   ├── Timer.tsx
│   │   ├── FocusMode.tsx
│   │   ├── ReadinessScore.tsx
│   │   ├── PitchGenerator.tsx
│   │   └── TaskPrioritizer.tsx
│   ├── tambo/
│   │   └── registry.tsx    # Component registry for AI
│   ├── App.tsx             # Main application
│   ├── App.css             # Global styles
│   └── index.css           # Design tokens & variables
├── public/
├── .env                    # Environment variables (create this)
└── package.json
```

---

## 🎯 Usage Examples

Try these prompts in the app:

- *"Create a task tracker for my job applications"*
- *"I need a 5-minute timer for meditation"*
- *"Help me relax with a breathing exercise"*
- *"Analyze if my startup idea is ready for funding"*
- *"Generate a pitch for my food delivery app"*
- *"Prioritize my tasks for today"*

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Add the `VITE_TAMBO_API_KEY` environment variable in Vercel settings
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ and AI
</p>
