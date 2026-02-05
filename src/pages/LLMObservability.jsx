import React, { useState, useMemo, useCallback } from 'react';
import { Search, ChevronDown, ChevronRight, Star, Eye, Layers, Zap, Settings, Database, Cpu, Sparkles, Clock, DollarSign, FileText, AlertTriangle, CheckCircle, XCircle, Bug, ArrowLeft, BarChart3, List, GitBranch } from 'lucide-react';

const generateId = () => Math.random().toString(36).substring(2, 15);
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const generateObservations = (traceId) => {
  const obs = [];
  const baseTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
  const rootId = generateId();
  obs.push({ id: rootId, traceId, parentObservationId: null, type: 'SPAN', name: 'chat-completion', startTime: baseTime.toISOString(), endTime: new Date(baseTime.getTime() + 3500).toISOString(), level: 'DEFAULT', metadata: { environment: 'production' }, input: { messages: [{ role: 'user', content: 'What is the weather today?' }] }, output: { response: "I don't have access to real-time weather data..." } });
  obs.push({ id: generateId(), traceId, parentObservationId: rootId, type: 'RETRIEVER', name: 'vector-search', startTime: new Date(baseTime.getTime() + 50).toISOString(), endTime: new Date(baseTime.getTime() + 250).toISOString(), level: 'DEFAULT', input: { query: 'weather information' }, output: { documents: [{ id: 'doc1', content: 'Weather API documentation...' }] }, metadata: { index: 'knowledge-base', topK: 5 } });
  const genId = generateId();
  obs.push({ id: genId, traceId, parentObservationId: rootId, type: 'GENERATION', name: 'gpt-4o-mini', startTime: new Date(baseTime.getTime() + 300).toISOString(), endTime: new Date(baseTime.getTime() + 3200).toISOString(), completionStartTime: new Date(baseTime.getTime() + 800).toISOString(), level: 'DEFAULT', model: 'gpt-4o-mini', modelParameters: { temperature: 0.7, maxTokens: 1024 }, input: { messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: 'What is the weather today?' }] }, output: { message: { role: 'assistant', content: "I don't have access to real-time weather data." } }, usage: { promptTokens: 145, completionTokens: 52, totalTokens: 197 }, calculatedTotalCost: 0.00032, calculatedInputCost: 0.00022, calculatedOutputCost: 0.0001 });
  if (Math.random() > 0.5) obs.push({ id: generateId(), traceId, parentObservationId: genId, type: 'TOOL', name: 'get_current_time', startTime: new Date(baseTime.getTime() + 1000).toISOString(), endTime: new Date(baseTime.getTime() + 1050).toISOString(), level: 'DEFAULT', input: { timezone: 'UTC' }, output: { time: '2026-01-06T14:30:00Z' } });
  return obs;
};

const generateMockTraces = (count = 50) => {
  const names = ['chat-completion', 'rag-query', 'code-assistant', 'summarization', 'translation', 'classification', 'extraction', 'qa-chain', 'agent-task', 'document-analysis'];
  const users = ['user_123', 'user_456', 'user_789', 'user_abc', null];
  const sessions = ['session_a', 'session_b', 'session_c', null];
  const tags = ['production', 'staging', 'test', 'important', 'review'];
  return Array.from({ length: count }, (_, i) => {
    const id = generateId();
    const hasError = Math.random() < 0.1;
    const observations = generateObservations(id);
    const totalTokens = observations.reduce((sum, o) => sum + (o.usage?.totalTokens || 0), 0);
    const promptTokens = observations.reduce((sum, o) => sum + (o.usage?.promptTokens || 0), 0);
    const completionTokens = observations.reduce((sum, o) => sum + (o.usage?.completionTokens || 0), 0);
    const totalCost = observations.reduce((sum, o) => sum + (o.calculatedTotalCost || 0), 0);
    const starts = observations.map((o) => new Date(o.startTime).getTime());
    const ends = observations.filter((o) => o.endTime).map((o) => new Date(o.endTime).getTime());
    const latency = ends.length > 0 ? (Math.max(...ends) - Math.min(...starts)) / 1000 : 0;
    return { id, name: names[Math.floor(Math.random() * names.length)], timestamp: hoursAgo(Math.random() * 72), userId: users[Math.floor(Math.random() * users.length)], sessionId: sessions[Math.floor(Math.random() * sessions.length)], tags: tags.filter(() => Math.random() > 0.7), metadata: { environment: Math.random() > 0.5 ? 'production' : 'staging' }, input: { query: 'Sample input ' + (i + 1) }, output: { response: 'Sample response ' + (i + 1) }, bookmarked: Math.random() > 0.85, latency, totalCost, promptTokens, completionTokens, totalTokens, level: hasError ? 'ERROR' : Math.random() > 0.9 ? 'WARNING' : 'DEFAULT', observationCount: observations.length, observations };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const generateDetailedObservations = (traceId) => {
  const obs = [];
  const baseTime = new Date();
  const agentId = generateId();
  obs.push({ id: agentId, traceId, parentObservationId: null, type: 'AGENT', name: 'ReAct Agent', startTime: baseTime.toISOString(), endTime: new Date(baseTime.getTime() + 8500).toISOString(), level: 'DEFAULT', metadata: { agentType: 'ReAct' }, input: { task: 'Research AI news' }, output: { result: 'Key AI developments found...' } });
  const t1 = generateId();
  obs.push({ id: t1, traceId, parentObservationId: agentId, type: 'SPAN', name: 'thought-1', startTime: new Date(baseTime.getTime() + 100).toISOString(), endTime: new Date(baseTime.getTime() + 600).toISOString(), level: 'DEFAULT', input: { thought: 'Search for AI news' }, output: { action: 'search' } });
  obs.push({ id: generateId(), traceId, parentObservationId: t1, type: 'TOOL', name: 'web_search', startTime: new Date(baseTime.getTime() + 650).toISOString(), endTime: new Date(baseTime.getTime() + 1500).toISOString(), level: 'DEFAULT', input: { query: 'AI news 2026' }, output: { results: [{ title: 'AI Breakthrough' }] }, metadata: { searchEngine: 'Bing' } });
  const t2 = generateId();
  obs.push({ id: t2, traceId, parentObservationId: agentId, type: 'SPAN', name: 'thought-2', startTime: new Date(baseTime.getTime() + 1600).toISOString(), endTime: new Date(baseTime.getTime() + 2100).toISOString(), level: 'DEFAULT', input: { thought: 'Read article' }, output: { action: 'read' } });
  obs.push({ id: generateId(), traceId, parentObservationId: t2, type: 'TOOL', name: 'url_reader', startTime: new Date(baseTime.getTime() + 2150).toISOString(), endTime: new Date(baseTime.getTime() + 2800).toISOString(), level: 'DEFAULT', input: { url: 'https://example.com' }, output: { content: 'Article content...' } });
  obs.push({ id: generateId(), traceId, parentObservationId: agentId, type: 'GENERATION', name: 'gpt-4o', startTime: new Date(baseTime.getTime() + 3100).toISOString(), endTime: new Date(baseTime.getTime() + 5500).toISOString(), completionStartTime: new Date(baseTime.getTime() + 3800).toISOString(), level: 'DEFAULT', model: 'gpt-4o', modelParameters: { temperature: 0.3, maxTokens: 2048 }, input: { messages: [{ role: 'system', content: 'You are a research assistant.' }, { role: 'user', content: 'Summarize AI news...' }] }, output: { message: { role: 'assistant', content: 'Key AI developments:\n\n1. Medical AI breakthrough\n2. New reasoning capabilities' } }, usage: { promptTokens: 1245, completionTokens: 324, totalTokens: 1569 }, calculatedTotalCost: 0.0234, promptName: 'research-summarizer', promptVersion: 2 });
  obs.push({ id: generateId(), traceId, parentObservationId: agentId, type: 'EVENT', name: 'task-completed', startTime: new Date(baseTime.getTime() + 5600).toISOString(), endTime: new Date(baseTime.getTime() + 5600).toISOString(), level: 'DEFAULT', metadata: { status: 'success' } });
  if (Math.random() > 0.5) obs.push({ id: generateId(), traceId, parentObservationId: agentId, type: 'SPAN', name: 'retry-attempt', startTime: new Date(baseTime.getTime() + 6000).toISOString(), endTime: new Date(baseTime.getTime() + 6500).toISOString(), level: 'WARNING', statusMessage: 'Rate limit reached' });
  return obs;
};

const generateMockSessions = (count = 20) => {
  const traces = generateMockTraces(100);
  return Array.from({ length: count }, () => {
    const sessionId = `session_${generateId()}`;
    const sessionTraces = traces.filter(() => Math.random() > 0.6).slice(0, Math.floor(Math.random() * 10) + 1).map((t) => ({ ...t, sessionId }));
    const totalCost = sessionTraces.reduce((s, t) => s + t.totalCost, 0);
    const totalTokens = sessionTraces.reduce((s, t) => s + t.totalTokens, 0);
    const inputTokens = sessionTraces.reduce((s, t) => s + t.promptTokens, 0);
    const outputTokens = sessionTraces.reduce((s, t) => s + t.completionTokens, 0);
    const timestamps = sessionTraces.map((t) => new Date(t.timestamp).getTime());
    const firstTrace = timestamps.length ? new Date(Math.min(...timestamps)).toISOString() : hoursAgo(24);
    const lastTrace = timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : hoursAgo(1);
    const duration = timestamps.length > 1 ? (Math.max(...timestamps) - Math.min(...timestamps)) / 1000 : 0;
    return { id: sessionId, createdAt: firstTrace, bookmarked: Math.random() > 0.85, traceCount: sessionTraces.length, userIds: [...new Set(sessionTraces.map((t) => t.userId).filter(Boolean))], totalCost, totalTokens, inputTokens, outputTokens, firstTrace, lastTrace, duration, traces: sessionTraces };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const buildObservationTree = (observations) => {
  const nodeMap = new Map();
  const roots = [];
  observations.forEach((o) => nodeMap.set(o.id, { observation: o, children: [], depth: 0 }));
  observations.forEach((o) => {
    const node = nodeMap.get(o.id);
    if (o.parentObservationId && nodeMap.has(o.parentObservationId)) {
      const parent = nodeMap.get(o.parentObservationId);
      parent.children.push(node);
      node.depth = parent.depth + 1;
    } else roots.push(node);
  });
  const sort = (nodes) => { nodes.sort((a, b) => new Date(a.observation.startTime) - new Date(b.observation.startTime)); nodes.forEach((n) => sort(n.children)); };
  sort(roots);
  return roots;
};

const MOCK_TRACES = generateMockTraces(50);
const MOCK_SESSIONS = generateMockSessions(20);

const formatLatency = (s) => s < 1 ? `${Math.round(s * 1000)}ms` : `${s.toFixed(2)}s`;
const formatCost = (c) => c < 0.001 ? '<$0.001' : c < 0.01 ? `$${c.toFixed(4)}` : `$${c.toFixed(3)}`;
const formatTokens = (t) => t >= 1000 ? `${(t / 1000).toFixed(1)}k` : t.toString();
const formatDuration = (s) => s < 60 ? `${Math.round(s)}s` : s < 3600 ? `${Math.round(s / 60)}m` : `${(s / 3600).toFixed(1)}h`;
const formatDateTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatTimeAgo = (d) => { const s = Math.floor((Date.now() - new Date(d)) / 1000); if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; };

const typeConfig = {
  GENERATION: { icon: Sparkles, color: '#A78BFA' },
  SPAN: { icon: Layers, color: '#22D3EE' },
  EVENT: { icon: Zap, color: '#FBBF24' },
  TOOL: { icon: Settings, color: '#34D399' },
  RETRIEVER: { icon: Database, color: '#60A5FA' },
  AGENT: { icon: Cpu, color: '#F472B6' },
};

const TypeIcon = ({ type, size = 18 }) => {
  const c = typeConfig[type] || typeConfig.SPAN;
  const Icon = c.icon;
  return <div className="inline-flex items-center justify-center rounded" style={{ width: size + 10, height: size + 10, backgroundColor: `${c.color}22` }}><Icon size={size} style={{ color: c.color }} /></div>;
};

const levelConfig = {
  DEBUG: { icon: Bug, cls: 'bg-zinc-700 text-zinc-300' },
  DEFAULT: { icon: CheckCircle, cls: 'bg-emerald-500/20 text-emerald-400' },
  WARNING: { icon: AlertTriangle, cls: 'bg-amber-500/20 text-amber-400' },
  ERROR: { icon: XCircle, cls: 'bg-red-500/20 text-red-400' },
};

const LevelBadge = ({ level }) => {
  const c = levelConfig[level] || levelConfig.DEFAULT;
  const Icon = c.icon;
  const labels = { DEBUG: 'Debug', DEFAULT: 'Success', WARNING: 'Warning', ERROR: 'Error' };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm font-medium ${c.cls}`}><Icon size={15} />{labels[level]}</span>;
};

const getLevelColor = (l) => ({ DEBUG: '#71717A', DEFAULT: '#34D399', WARNING: '#FBBF24', ERROR: '#F87171' })[l] || '#34D399';

const IOPreview = ({ input, output, metadata }) => {
  const [mode, setMode] = useState('pretty');
  const has = { input: input != null, output: output != null, meta: metadata && Object.keys(metadata).length > 0 };
  if (!has.input && !has.output && !has.meta) return <p className="text-zinc-500 italic">No data</p>;

  const Msg = ({ m }) => {
    const colors = { system: 'border-amber-500/30 bg-amber-500/10', user: 'border-blue-500/30 bg-blue-500/10', assistant: 'border-emerald-500/30 bg-emerald-500/10', tool: 'border-cyan-500/30 bg-cyan-500/10' };
    return <div className={`border rounded-lg p-3 ${colors[m.role?.toLowerCase()] || 'border-zinc-700 bg-zinc-800/50'}`}><span className="text-xs font-semibold uppercase text-zinc-400">{m.role}</span><p className="mt-1.5 text-zinc-200 whitespace-pre-wrap leading-relaxed">{m.content}</p></div>;
  };

  const Pretty = ({ data }) => {
    if (Array.isArray(data) && data[0]?.role) return <div className="space-y-2">{data.map((m, i) => <Msg key={i} m={m} />)}</div>;
    if (data?.messages) return <div className="space-y-2">{data.messages.map((m, i) => <Msg key={i} m={m} />)}</div>;
    if (data?.message?.role || data?.role) return <Msg m={data?.message || data} />;
    if (typeof data === 'string') return <pre className="p-3 bg-zinc-800/50 border border-zinc-700 rounded text-zinc-300 whitespace-pre-wrap font-mono">{data}</pre>;
    if (typeof data === 'object') return <div className="space-y-2">{Object.entries(data).map(([k, v]) => <div key={k} className="flex gap-3"><span className="text-zinc-500 w-28 flex-shrink-0">{k}</span><span className="text-zinc-300 font-mono">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span></div>)}</div>;
    return <span className="text-zinc-300 font-mono">{String(data)}</span>;
  };

  const Json = ({ data }) => <pre className="p-4 bg-zinc-900 border border-zinc-700 rounded text-zinc-400 overflow-auto max-h-72 font-mono text-sm">{JSON.stringify(data, null, 2)}</pre>;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-zinc-700 pb-2">
        <button onClick={() => setMode('pretty')} className={`px-3 py-1.5 rounded text-sm ${mode === 'pretty' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}>Formatted</button>
        <button onClick={() => setMode('json')} className={`px-3 py-1.5 rounded text-sm ${mode === 'json' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}>JSON</button>
      </div>
      {has.input && <div><h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Input</h4>{mode === 'pretty' ? <Pretty data={input} /> : <Json data={input} />}</div>}
      {has.output && <div><h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Output</h4>{mode === 'pretty' ? <Pretty data={output} /> : <Json data={output} />}</div>}
      {has.meta && <div><h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Metadata</h4>{mode === 'pretty' ? <div className="flex flex-wrap gap-2">{Object.entries(metadata).map(([k, v]) => <span key={k} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm"><span className="text-zinc-500">{k}:</span> <span className="text-zinc-300">{String(v)}</span></span>)}</div> : <Json data={metadata} />}</div>}
    </div>
  );
};

const TraceTree = ({ tree, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(() => { const ids = new Set(); const collect = (n) => n.forEach((x) => { ids.add(x.observation.id); collect(x.children); }); collect(tree); return ids; });
  const toggle = useCallback((id) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);

  const Node = ({ node }) => {
    const { observation: o, children, depth } = node;
    const hasKids = children.length > 0;
    const open = expanded.has(o.id);
    const sel = selectedId === o.id;
    const dur = o.endTime ? new Date(o.endTime) - new Date(o.startTime) : null;

    return (
      <div>
        <div onClick={() => onSelect(o)} className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer ${sel ? 'bg-violet-500/20 border-l-2 border-violet-500' : 'hover:bg-zinc-800 border-l-2 border-transparent'}`} style={{ marginLeft: depth * 20 }}>
          <div className="w-5">{hasKids && <button onClick={(e) => { e.stopPropagation(); toggle(o.id); }} className="hover:bg-zinc-700 rounded p-0.5">{open ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}</button>}</div>
          <TypeIcon type={o.type} size={16} />
          <span className={`flex-grow truncate ${sel ? 'text-white font-medium' : 'text-zinc-300'} ${o.level === 'ERROR' ? 'text-red-400' : ''}`}>{o.name}</span>
          {o.level !== 'DEFAULT' && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLevelColor(o.level) }} />}
          {o.model && <span className="px-2 py-0.5 bg-zinc-700 rounded text-xs text-zinc-400">{o.model}</span>}
          {dur !== null && <span className="text-xs text-zinc-500 font-mono w-16 text-right">{dur < 1000 ? `${dur}ms` : `${(dur / 1000).toFixed(2)}s`}</span>}
          {o.calculatedTotalCost != null && <span className="text-xs text-zinc-500 font-mono w-16 text-right">{formatCost(o.calculatedTotalCost)}</span>}
          {o.usage && <span className="text-xs text-zinc-500 font-mono w-14 text-right">{o.usage.totalTokens}t</span>}
        </div>
        {hasKids && open && <div className="border-l border-zinc-700" style={{ marginLeft: depth * 20 + 14 }}>{children.map((c) => <Node key={c.observation.id} node={c} />)}</div>}
      </div>
    );
  };

  return <div className="font-mono">{tree.map((n) => <Node key={n.observation.id} node={n} />)}</div>;
};

const TraceTimeline = ({ tree, observations, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(() => { const ids = new Set(); const collect = (n) => n.forEach((x) => { ids.add(x.observation.id); collect(x.children); }); collect(tree); return ids; });
  const bounds = useMemo(() => { const starts = observations.map((o) => new Date(o.startTime).getTime()); const ends = observations.filter((o) => o.endTime).map((o) => new Date(o.endTime).getTime()); const min = Math.min(...starts); const max = ends.length ? Math.max(...ends) : min + 1000; return { min, max, total: max - min }; }, [observations]);
  const toggle = useCallback((id) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const ticks = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ pos: (i / 5) * 100, label: bounds.total * i / 5 < 1000 ? `${Math.round(bounds.total * i / 5)}ms` : `${(bounds.total * i / 5 / 1000).toFixed(1)}s` })), [bounds]);

  const Row = ({ node }) => {
    const { observation: o, children, depth } = node;
    const hasKids = children.length > 0;
    const open = expanded.has(o.id);
    const sel = selectedId === o.id;
    const start = new Date(o.startTime).getTime();
    const end = o.endTime ? new Date(o.endTime).getTime() : start + 100;
    const left = ((start - bounds.min) / bounds.total) * 100;
    const width = ((end - start) / bounds.total) * 100;
    const color = typeConfig[o.type]?.color || '#22D3EE';

    return (
      <div>
        <div onClick={() => onSelect(o)} className={`flex items-center py-2 cursor-pointer ${sel ? 'bg-violet-500/10' : 'hover:bg-zinc-800/50'}`}>
          <div className="flex items-center gap-1.5 w-52 flex-shrink-0 pr-2" style={{ paddingLeft: depth * 16 }}>
            <div className="w-5">{hasKids && <button onClick={(e) => { e.stopPropagation(); toggle(o.id); }}>{open ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}</button>}</div>
            <TypeIcon type={o.type} size={14} />
            <span className={`truncate ${sel ? 'text-white font-medium' : 'text-zinc-400'}`}>{o.name}</span>
          </div>
          <div className="flex-grow relative h-6">
            {[...Array(5)].map((_, i) => <div key={i} className="absolute top-0 bottom-0 border-r border-zinc-800" style={{ left: `${(i + 1) * 20}%` }} />)}
            <div className="absolute top-1.5 h-3 rounded hover:scale-y-150 transition-transform" style={{ left: `${Math.max(0, left)}%`, width: `${Math.max(0.5, Math.min(width, 100 - left))}%`, backgroundColor: o.level === 'ERROR' ? getLevelColor('ERROR') : color, opacity: sel ? 1 : 0.7 }} />
          </div>
          <span className="w-16 text-right text-xs text-zinc-500 font-mono pr-2">{end - start < 1000 ? `${end - start}ms` : `${((end - start) / 1000).toFixed(1)}s`}</span>
        </div>
        {hasKids && open && children.map((c) => <Row key={c.observation.id} node={c} />)}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center border-b border-zinc-700 pb-2 mb-2">
        <div className="w-52" />
        <div className="flex-grow relative h-6">{ticks.map((t, i) => <span key={i} className="absolute text-xs text-zinc-600 -translate-x-1/2" style={{ left: `${t.pos}%` }}>{t.label}</span>)}</div>
        <div className="w-16" />
      </div>
      {tree.map((n) => <Row key={n.observation.id} node={n} />)}
    </div>
  );
};

const ObservationDetailPanel = ({ observation: o }) => {
  const dur = o.endTime ? new Date(o.endTime) - new Date(o.startTime) : null;
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2"><TypeIcon type={o.type} size={20} /><h3 className="text-lg font-semibold text-white">{o.name}</h3><LevelBadge level={o.level} /></div>
        <p className="text-sm text-zinc-500 font-mono">ID: {o.id}</p>
        {o.statusMessage && <div className={`mt-3 p-3 rounded ${o.level === 'ERROR' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>{o.statusMessage}</div>}
      </div>
      {o.model && <div><h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Model</h4><div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded border border-violet-500/30"><Sparkles size={15} /> {o.model}</span>{o.modelParameters?.temperature != null && <span className="px-3 py-1.5 border border-zinc-700 rounded text-zinc-400">temp: {o.modelParameters.temperature}</span>}{o.modelParameters?.maxTokens && <span className="px-3 py-1.5 border border-zinc-700 rounded text-zinc-400">max: {o.modelParameters.maxTokens}</span>}</div></div>}
      {o.promptName && <div><h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Prompt</h4><div className="flex gap-2"><span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30"><FileText size={15} /> {o.promptName}</span>{o.promptVersion && <span className="px-3 py-1.5 border border-zinc-700 rounded text-zinc-400">v{o.promptVersion}</span>}</div></div>}
      <div><h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wide">Metrics</h4><div className="grid grid-cols-3 gap-4">{dur !== null && <div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><Clock size={15} /> Duration</div><p className="text-lg font-semibold text-white">{dur < 1000 ? `${dur}ms` : `${(dur / 1000).toFixed(2)}s`}</p></div>}{o.calculatedTotalCost != null && <div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><DollarSign size={15} /> Cost</div><p className="text-lg font-semibold text-white">{formatCost(o.calculatedTotalCost)}</p></div>}{o.usage && <div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><FileText size={15} /> Tokens</div><p className="text-lg font-semibold text-white">{o.usage.totalTokens}</p><p className="text-sm text-zinc-500">{o.usage.promptTokens} in / {o.usage.completionTokens} out</p></div>}</div></div>
      <div className="border-t border-zinc-800 pt-5"><IOPreview input={o.input} output={o.output} metadata={o.metadata} /></div>
    </div>
  );
};

const TraceDetailPanel = ({ trace: t }) => (
  <div className="space-y-5">
    <div><div className="flex items-center gap-2 mb-2"><h3 className="text-lg font-semibold text-white">{t.name}</h3><LevelBadge level={t.level} />{t.bookmarked && <Star size={18} className="text-amber-400 fill-amber-400" />}</div><p className="text-sm text-zinc-500 font-mono">ID: {t.id}</p></div>
    {t.tags?.length > 0 && <div><h4 className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Tags</h4><div className="flex flex-wrap gap-2">{t.tags.map((tag) => <span key={tag} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">{tag}</span>)}</div></div>}
    <div><h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wide">Metrics</h4><div className="grid grid-cols-2 gap-4"><div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><Clock size={15} /> Latency</div><p className="text-lg font-semibold text-white">{formatLatency(t.latency)}</p></div><div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><DollarSign size={15} /> Cost</div><p className="text-lg font-semibold text-white">{formatCost(t.totalCost)}</p></div><div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><FileText size={15} /> Tokens</div><p className="text-lg font-semibold text-white">{t.totalTokens}</p><p className="text-sm text-zinc-500">{t.promptTokens} in / {t.completionTokens} out</p></div><div><div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-1"><Layers size={15} /> Observations</div><p className="text-lg font-semibold text-white">{t.observationCount}</p></div></div></div>
    <div className="border-t border-zinc-800 pt-5"><h4 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wide">Details</h4><div className="space-y-2"><div className="flex gap-4"><span className="text-zinc-500 w-28">Timestamp</span><span className="text-zinc-300 font-mono">{formatDateTime(t.timestamp)}</span></div>{t.userId && <div className="flex gap-4"><span className="text-zinc-500 w-28">User</span><span className="text-zinc-300 font-mono">{t.userId}</span></div>}{t.sessionId && <div className="flex gap-4"><span className="text-zinc-500 w-28">Session</span><span className="text-zinc-300 font-mono">{t.sessionId}</span></div>}</div></div>
    <div className="border-t border-zinc-800 pt-5"><IOPreview input={t.input} output={t.output} metadata={t.metadata} /></div>
  </div>
);

const TracesListView = ({ onSelectTrace }) => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const filtered = useMemo(() => {
    let r = [...MOCK_TRACES];
    if (search) { const q = search.toLowerCase(); r = r.filter((t) => t.name.toLowerCase().includes(q) || t.id.includes(q)); }
    if (level !== 'all') r = r.filter((t) => t.level === level);
    return r;
  }, [search, level]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" placeholder="Search traces..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500" /></div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-violet-500"><option value="all">All Levels</option><option value="DEFAULT">Success</option><option value="WARNING">Warning</option><option value="ERROR">Error</option></select>
      </div>
      <p className="text-sm text-zinc-500">{filtered.length} of {MOCK_TRACES.length} traces</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="text-left text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800"><th className="p-3 w-10"></th><th className="p-3">Status</th><th className="p-3">Time</th><th className="p-3">Name</th><th className="p-3 text-right">Latency</th><th className="p-3 text-right">Tokens</th><th className="p-3 text-right">Cost</th><th className="p-3">Tags</th><th className="p-3"></th></tr></thead>
          <tbody>
            {filtered.slice(0, 20).map((t) => (
              <tr key={t.id} onClick={() => onSelectTrace(t)} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer">
                <td className="p-3"><Star size={16} className={t.bookmarked ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'} /></td>
                <td className="p-3"><LevelBadge level={t.level} /></td>
                <td className="p-3 text-zinc-400 font-mono">{formatDateTime(t.timestamp)}</td>
                <td className="p-3"><div className="text-white font-medium">{t.name}</div><div className="text-sm text-zinc-600 font-mono mt-0.5">{t.id.substring(0, 12)}...</div></td>
                <td className="p-3 text-right text-zinc-300 font-mono">{formatLatency(t.latency)}</td>
                <td className="p-3 text-right text-zinc-300 font-mono">{formatTokens(t.totalTokens)}</td>
                <td className="p-3 text-right text-zinc-300 font-mono">{formatCost(t.totalCost)}</td>
                <td className="p-3"><div className="flex gap-1.5">{t.tags.slice(0, 2).map((tag) => <span key={tag} className="px-2 py-0.5 bg-zinc-800 rounded text-sm text-zinc-400">{tag}</span>)}{t.tags.length > 2 && <span className="px-2 py-0.5 border border-zinc-700 rounded text-sm text-zinc-500">+{t.tags.length - 2}</span>}</div></td>
                <td className="p-3"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors"><Eye size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TraceDetailView = ({ trace, onBack }) => {
  const [viewMode, setViewMode] = useState('tree');
  const [selectedObs, setSelectedObs] = useState(null);
  const observations = useMemo(() => generateDetailedObservations(trace.id), [trace.id]);
  const tree = useMemo(() => buildObservationTree(observations), [observations]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700"><ArrowLeft size={18} /> Back</button>
        <h2 className="text-xl font-semibold text-white">{trace.name}</h2>
        <LevelBadge level={trace.level} />
        {trace.bookmarked && <Star size={18} className="text-amber-400 fill-amber-400" />}
      </div>
      <div className="flex gap-4" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
          <div className="border-b border-zinc-800 p-2 flex gap-1 bg-zinc-900/50">
            <button onClick={() => setViewMode('tree')} className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${viewMode === 'tree' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><GitBranch size={16} /> Tree</button>
            <button onClick={() => setViewMode('timeline')} className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${viewMode === 'timeline' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><BarChart3 size={16} /> Timeline</button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {viewMode === 'tree' ? <TraceTree tree={tree} selectedId={selectedObs?.id} onSelect={setSelectedObs} /> : <TraceTimeline tree={tree} observations={observations} selectedId={selectedObs?.id} onSelect={setSelectedObs} />}
          </div>
        </div>
        <div className="w-[440px] flex-shrink-0 bg-zinc-900 rounded-xl border border-zinc-800 overflow-auto p-5">
          {selectedObs ? (
            <div><div className="flex items-center justify-between mb-4"><h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Observation</h3><button onClick={() => setSelectedObs(null)} className="text-sm text-violet-400 hover:text-violet-300">Show Trace →</button></div><ObservationDetailPanel observation={selectedObs} /></div>
          ) : (
            <div><h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-4">Trace Details</h3><TraceDetailPanel trace={trace} /></div>
          )}
        </div>
      </div>
    </div>
  );
};

const SessionsListView = ({ onSelectSession }) => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => search ? MOCK_SESSIONS.filter((s) => s.id.includes(search.toLowerCase()) || s.userIds.some((u) => u.toLowerCase().includes(search.toLowerCase()))) : MOCK_SESSIONS, [search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input type="text" placeholder="Search sessions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500" /></div>
      <p className="text-sm text-zinc-500">{filtered.length} of {MOCK_SESSIONS.length} sessions</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="text-left text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800"><th className="p-3 w-10"></th><th className="p-3">Session ID</th><th className="p-3">Created</th><th className="p-3 text-center">Traces</th><th className="p-3">Users</th><th className="p-3 text-right">Duration</th><th className="p-3 text-right">Tokens</th><th className="p-3 text-right">Cost</th><th className="p-3"></th></tr></thead>
          <tbody>
            {filtered.slice(0, 15).map((s) => (
              <tr key={s.id} onClick={() => onSelectSession(s)} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer">
                <td className="p-3"><Star size={16} className={s.bookmarked ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'} /></td>
                <td className="p-3 text-zinc-300 font-mono">{s.id}</td>
                <td className="p-3 text-zinc-400">{formatTimeAgo(s.createdAt)}</td>
                <td className="p-3 text-center"><span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded font-medium">{s.traceCount}</span></td>
                <td className="p-3">{s.userIds.length ? <span className="text-zinc-400 font-mono">{s.userIds[0]}{s.userIds.length > 1 && <span className="text-zinc-600 ml-1">+{s.userIds.length - 1}</span>}</span> : <span className="text-zinc-600">—</span>}</td>
                <td className="p-3 text-right text-zinc-300 font-mono">{formatDuration(s.duration)}</td>
                <td className="p-3 text-right text-zinc-300 font-mono">{formatTokens(s.totalTokens)}</td>
                <td className="p-3 text-right text-zinc-300 font-mono">{formatCost(s.totalCost)}</td>
                <td className="p-3"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded"><Eye size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SessionDetailView = ({ session, onBack, onSelectTrace }) => (
  <div className="space-y-5">
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700"><ArrowLeft size={18} /> Back</button>
      <h2 className="text-xl font-semibold text-white">Session: {session.id}</h2>
      {session.bookmarked && <Star size={18} className="text-amber-400 fill-amber-400" />}
    </div>
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-5">Overview</h3>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div><p className="text-sm text-zinc-500 mb-1">Traces</p><p className="text-3xl font-bold text-white">{session.traceCount}</p></div>
        <div><p className="text-sm text-zinc-500 mb-1">Duration</p><p className="text-3xl font-bold text-white">{formatDuration(session.duration)}</p></div>
        <div><p className="text-sm text-zinc-500 mb-1">Cost</p><p className="text-3xl font-bold text-white">{formatCost(session.totalCost)}</p></div>
        <div><p className="text-sm text-zinc-500 mb-1">Tokens</p><p className="text-3xl font-bold text-white">{formatTokens(session.totalTokens)}</p><p className="text-sm text-zinc-500 mt-1">{formatTokens(session.inputTokens)} in / {formatTokens(session.outputTokens)} out</p></div>
      </div>
      <div className="border-t border-zinc-800 pt-5 space-y-2">
        <div className="flex gap-4"><span className="text-zinc-500 w-28">Created</span><span className="text-zinc-300 font-mono">{formatDateTime(session.createdAt)}</span></div>
        <div className="flex gap-4"><span className="text-zinc-500 w-28">Last trace</span><span className="text-zinc-300 font-mono">{formatTimeAgo(session.lastTrace)}</span></div>
        {session.userIds.length > 0 && <div className="flex gap-4 items-center"><span className="text-zinc-500 w-28">Users</span><div className="flex gap-2">{session.userIds.map((u) => <span key={u} className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded font-mono">{u}</span>)}</div></div>}
      </div>
    </div>
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-5">Traces</h3>
      <table className="w-full">
        <thead><tr className="text-left text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800"><th className="p-3">Status</th><th className="p-3">Name</th><th className="p-3 text-right">Latency</th><th className="p-3 text-right">Tokens</th><th className="p-3 text-right">Cost</th><th className="p-3"></th></tr></thead>
        <tbody>
          {session.traces.slice(0, 10).map((t) => (
            <tr key={t.id} onClick={() => onSelectTrace(t)} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer">
              <td className="p-3"><LevelBadge level={t.level} /></td>
              <td className="p-3"><div className="text-white">{t.name}</div><div className="text-sm text-zinc-600 font-mono mt-0.5">{t.id.substring(0, 12)}...</div></td>
              <td className="p-3 text-right text-zinc-300 font-mono">{formatLatency(t.latency)}</td>
              <td className="p-3 text-right text-zinc-300 font-mono">{formatTokens(t.totalTokens)}</td>
              <td className="p-3 text-right text-zinc-300 font-mono">{formatCost(t.totalCost)}</td>
              <td className="p-3"><button className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded"><Eye size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function LLMObservability() {
  const [view, setView] = useState('traces');
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Sparkles size={20} /></div>
              <div><h1 className="text-lg font-semibold">LLM Observability</h1><p className="text-sm text-zinc-500">Monitor your AI pipelines</p></div>
            </div>
            <nav className="flex gap-1">
              <button onClick={() => { setView('traces'); setSelectedTrace(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${view === 'traces' || view === 'traceDetail' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><List size={18} /> Traces</button>
              <button onClick={() => { setView('sessions'); setSelectedSession(null); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${view === 'sessions' || view === 'sessionDetail' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><Layers size={18} /> Sessions</button>
            </nav>
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          {view === 'traces' && <TracesListView onSelectTrace={(t) => { setSelectedTrace(t); setView('traceDetail'); }} />}
          {view === 'traceDetail' && selectedTrace && <TraceDetailView trace={selectedTrace} onBack={() => { setSelectedTrace(null); setView('traces'); }} />}
          {view === 'sessions' && <SessionsListView onSelectSession={(s) => { setSelectedSession(s); setView('sessionDetail'); }} />}
          {view === 'sessionDetail' && selectedSession && <SessionDetailView session={selectedSession} onBack={() => { setSelectedSession(null); setView('sessions'); }} onSelectTrace={(t) => { setSelectedTrace(t); setView('traceDetail'); }} />}
        </div>
      </div>
    </div>
  );
}
