import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, ExternalLink } from 'lucide-react'

// Import your design pages here
import UAD2DetailView from './pages/UAD2DetailView'
import AgentAnomalies from './pages/AgentAnomalies'
import HumanInTheLoop from './pages/HumanInTheLoop'
import DimensionalAnomalies from './pages/DimensionalAnomalies'
import AgentAnalyticsV2 from './pages/AgentAnalyticsV2'
import LLMObservability from './pages/LLMObservability'
import LeftNavVariations from './pages/LeftNavVariations'

// Register your designs here - just add new entries as you create them
const designs = [
  {
    path: '/uad2-detail',
    name: 'UAD 2.0 Detail View',
    description: 'Redesigned anomaly detection dashboard with modern UI, progress rings, and trend charts',
    component: UAD2DetailView,
  },
  {
    path: '/agent-anomalies',
    name: 'Agent Anomalies',
    description: 'Agent SOC dashboard for LLM behavioral monitoring and anomaly detection',
    component: AgentAnomalies,
  },
  {
    path: '/human-in-the-loop',
    name: 'Human-in-the-Loop Approvals',
    description: 'Review and approve agent actions with execution traces and batch operations',
    component: HumanInTheLoop,
  },
  {
    path: '/dimensional-anomalies',
    name: 'Dimensional Anomalies',
    description: 'Field-level and value-level anomaly detection with statistical analysis and sparklines',
    component: DimensionalAnomalies,
  },
  {
    path: '/agent-analytics-v2',
    name: 'Agent Analytics V2',
    description: 'Agent analytics dashboard with cost tracking, query traces, and tag management',
    component: AgentAnalyticsV2,
  },
  {
    path: '/llm-observability',
    name: 'LLM Observability',
    description: 'Monitor AI pipelines with trace exploration, session tracking, and detailed observation trees',
    component: LLMObservability,
  },
  {
    path: '/navigation-variants',
    name: 'Navigation Variants',
    description: 'Interactive navigation patterns: two-panel, multi-expand, accordion, and dropdown styles',
    component: LeftNavVariations,
  },
  // Add more designs like this:
  // {
  //   path: '/new-design',
  //   name: 'New Design Name',
  //   description: 'Description of what this design shows',
  //   component: NewDesignComponent,
  // },
]

function DesignIndex() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">UI Showcase</h1>
        <p className="text-slate-400 mb-8">Collection of UI designs and mockups</p>

        <div className="grid gap-4">
          {designs.map((design) => (
            <Link
              key={design.path}
              to={design.path}
              className="block p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {design.name}
                  </h2>
                  <p className="text-slate-400 mt-1">{design.description}</p>
                </div>
                <ExternalLink className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
              </div>
            </Link>
          ))}
        </div>

        {designs.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No designs yet. Add your first design to src/pages/</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BackToIndex() {
  const location = useLocation()

  if (location.pathname === '/') return null

  return (
    <Link
      to="/"
      className="fixed top-4 left-4 z-50 p-2 bg-slate-800/90 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors backdrop-blur-sm"
      title="Back to index"
    >
      <Home size={20} className="text-slate-300" />
    </Link>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <BackToIndex />
      <Routes>
        <Route path="/" element={<DesignIndex />} />
        {designs.map((design) => (
          <Route key={design.path} path={design.path} element={<design.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
