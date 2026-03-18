# ChainForge

Visual node-based editor for building, testing, and debugging LLM prompt chains and agent workflows.

<!-- Add screenshot here -->

## Features

- **Flow Canvas** — Interactive ReactFlow-based node graph for designing LLM chains
- **Node Palette** — Drag-and-drop nodes for prompts, models, tools, conditionals, and outputs
- **Properties Panel** — Configure node parameters, prompts, and connections in detail
- **Debug Panel** — Step-through execution with input/output inspection at each node
- **Code Highlighting** — Syntax-highlighted code blocks with Prism React Renderer
- **Toolbar** — Save, load, run, and export workflow controls
- **Real-Time Execution** — Run chains and watch data flow through nodes live

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Flow Editor:** ReactFlow
- **Code Highlighting:** prism-react-renderer
- **Database:** Supabase (with SSR helpers)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project

### Installation

```bash
git clone <repo-url>
cd chainforge
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/
│   ├── flow-canvas.tsx
│   ├── node-palette.tsx
│   ├── properties-panel.tsx
│   ├── debug-panel.tsx
│   └── toolbar.tsx
├── store/            # Zustand flow store
└── lib/              # Utilities and Supabase client
```

