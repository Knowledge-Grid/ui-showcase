import React, { useState } from 'react';

const AgentAnomalies = () => {
  const [activeSection, setActiveSection] = useState('anomalies');
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({ severity: 'all', category: 'all', status: 'all' });

  const taxonomyCategories = [
    { id: 'intent-action-mismatch', name: 'Intent–Action Mismatch', color: '#ef4444', description: 'Agent actions diverge from stated intent' },
    { id: 'tool-misuse', name: 'Tool Misuse / Tool Drift', color: '#f59e0b', description: 'Inappropriate or unexpected tool selection' },
    { id: 'reasoning-loops', name: 'Reasoning Loops / Non-Termination', color: '#ec4899', description: 'Recursive patterns without progress' },
    { id: 'confidence-inflation', name: 'Confidence Inflation / Miscalibration', color: '#8b5cf6', description: 'Overconfident outputs from insufficient data' },
    { id: 'silent-failure', name: 'Silent Failure / Partial Completion', color: '#6b7280', description: 'Incomplete execution without error signals' },
    { id: 'behavior-drift', name: 'Behavior Drift', color: '#3b82f6', description: 'Gradual shift from established patterns' },
    { id: 'policy-boundary', name: 'Policy Boundary Testing', color: '#dc2626', description: 'Systematic probing of access limits' },
    { id: 'cascading-failures', name: 'Cascading Agent Failures', color: '#ea580c', description: 'Failure propagation across agent systems' },
    { id: 'hallucination', name: 'Hallucination / Fabrication', color: '#7c3aed', description: 'Generated content without factual basis' },
    { id: 'cost-abuse', name: 'Cost & Resource Abuse', color: '#059669', description: 'Disproportionate resource consumption' }
  ];

  // NEW: Severity based on anomaly score thresholds
  const getSeverityFromScore = (score) => {
    if (score >= 0.9) return { id: 'critical', name: 'Actionable, Critical Anomaly', shortName: 'Critical', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' };
    if (score >= 0.7) return { id: 'non-critical', name: 'Actionable, Non-Critical Anomaly', shortName: 'Non-Critical', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    return { id: 'informational', name: 'Non-Actionable, Informational Anomaly', shortName: 'Informational', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
  };

  const severityLevels = [
    { id: 'critical', name: 'Actionable, Critical', shortName: 'Critical', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
    { id: 'non-critical', name: 'Actionable, Non-Critical', shortName: 'Non-Critical', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { id: 'informational', name: 'Non-Actionable, Informational', shortName: 'Informational', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' }
  ];

  const statusOptions = [
    { id: 'new', name: 'New', color: '#3b82f6' },
    { id: 'investigating', name: 'Investigating', color: '#f59e0b' },
    { id: 'suppressed', name: 'Suppressed', color: '#6b7280' },
    { id: 'escalated', name: 'Escalated', color: '#ef4444' }
  ];

  const anomalies = [
    {
      id: 'ANM-7842',
      category: 'intent-action-mismatch',
      categoryName: 'Intent–Action Mismatch',
      confidence: 0.94,
      anomalyScore: 0.94,
      status: 'new',
      affectedAgents: ['Sales Analysis Agent', 'Customer Support Bot'],
      affectedAgentIds: ['agent-001', 'agent-002'],
      explanation: 'Agent declared intent to query customer data but executed bulk export operation across 47 tables, exceeding declared scope by 12x.',
      shortExplanation: 'Bulk export exceeded declared query scope by 12x',
      timestamp: '2024-12-20T14:22:15Z',
      duration: '4m 23s',
      timeWindow: '14:18:00 - 14:22:23',
      signals: [
        { name: 'Declared scope match', baseline: 0.92, observed: 0.23, deviation: -75 },
        { name: 'Table access count', baseline: 3.2, observed: 47, deviation: 1368 },
        { name: 'Data volume ratio', baseline: 1.1, observed: 12.4, deviation: 1027 }
      ],
      toolUsage: [
        { tool: 'query_builder', count: 1, expected: 1, status: 'normal' },
        { tool: 'data_export', count: 47, expected: 3, status: 'anomalous' },
        { tool: 'schema_introspection', count: 12, expected: 1, status: 'anomalous' }
      ],
      relatedAnomalies: ['ANM-7839', 'ANM-7836'],
      dataQuality: { completeness: 0.98, schemaMatch: 0.96, trustScore: 0.91 },
      promptResponse: {
        systemPrompt: 'You are a sales analysis assistant. Query customer data to generate monthly reports.',
        userPrompt: 'Generate a summary of Q4 customer acquisition metrics for the North America region.',
        declaredIntent: 'Query customer_acquisitions table for NA region, filter by Q4 dates.',
        actualActions: ['SELECT * FROM customer_acquisitions', 'SELECT * FROM customer_profiles', '... 44 more bulk exports'],
        responsePreview: 'I have compiled a comprehensive analysis...',
        flaggedTokens: ['comprehensive', 'all regions', 'complete dataset']
      },
      tokenUsage: { inputTokens: 1247, outputTokens: 8934, reasoningTokens: 12847, totalCost: 0.47, expectedCost: 0.12, costMultiplier: 3.9 },
      semanticSimilarity: {
        knownPatterns: [
          { pattern: 'Data exfiltration attempt', similarity: 0.87, occurrences: 3 },
          { pattern: 'Scope creep - query expansion', similarity: 0.92, occurrences: 12 }
        ],
        embeddingCluster: 'unauthorized-data-access',
        clusterConfidence: 0.89
      },
      replayAvailable: true,
      replayState: { canRerun: true, estimatedCost: 0.08, sandboxAvailable: true },
      // For charts
      signalHistory: [
        { time: '14:18', score: 0.3 }, { time: '14:19', score: 0.45 }, { time: '14:20', score: 0.67 },
        { time: '14:21', score: 0.82 }, { time: '14:22', score: 0.94 }
      ],
      toolBreakdown: [
        { name: 'query_builder', value: 1 }, { name: 'data_export', value: 47 }, { name: 'schema_introspection', value: 12 }
      ]
    },
    {
      id: 'ANM-7841',
      category: 'reasoning-loops',
      categoryName: 'Reasoning Loops / Non-Termination',
      confidence: 0.89,
      anomalyScore: 0.82,
      status: 'investigating',
      affectedAgents: ['Research Assistant'],
      affectedAgentIds: ['agent-005'],
      explanation: 'Agent entered recursive reasoning pattern with 23 self-referential iterations before timeout.',
      shortExplanation: '23 recursive reasoning iterations, 4.2x token consumption',
      timestamp: '2024-12-20T14:18:42Z',
      duration: '2m 15s',
      timeWindow: '14:16:27 - 14:18:42',
      signals: [
        { name: 'Reasoning iterations', baseline: 3.1, observed: 23, deviation: 642 },
        { name: 'Token consumption rate', baseline: 847, observed: 3557, deviation: 320 }
      ],
      toolUsage: [
        { tool: 'knowledge_retrieval', count: 23, expected: 4, status: 'anomalous' },
        { tool: 'reasoning_engine', count: 23, expected: 3, status: 'anomalous' }
      ],
      relatedAnomalies: [],
      dataQuality: { completeness: 0.94, schemaMatch: 0.99, trustScore: 0.87 },
      promptResponse: {
        systemPrompt: 'You are a research assistant. Analyze documents and provide concise summaries.',
        userPrompt: 'What are the implications of the new tariff policy on semiconductor supply chains?',
        declaredIntent: 'Retrieve relevant documents, analyze key points, synthesize findings.',
        actualActions: ['Thinking: I need to consider what implications means...', 'Thinking: But first, what defines a tariff policy...', '... 20 more self-referential loops'],
        responsePreview: '[TIMEOUT - No output]',
        flaggedTokens: ['reconsider', 'but first', 'however']
      },
      tokenUsage: { inputTokens: 892, outputTokens: 234, reasoningTokens: 45621, totalCost: 1.23, expectedCost: 0.29, costMultiplier: 4.2 },
      semanticSimilarity: {
        knownPatterns: [
          { pattern: 'Infinite reasoning loop', similarity: 0.94, occurrences: 8 },
          { pattern: 'Analysis paralysis', similarity: 0.88, occurrences: 15 }
        ],
        embeddingCluster: 'reasoning-non-termination',
        clusterConfidence: 0.91
      },
      replayAvailable: true,
      replayState: { canRerun: true, estimatedCost: 0.15, sandboxAvailable: true },
      signalHistory: [
        { time: '14:16', score: 0.2 }, { time: '14:17', score: 0.5 }, { time: '14:18', score: 0.82 }
      ],
      toolBreakdown: [
        { name: 'knowledge_retrieval', value: 23 }, { name: 'reasoning_engine', value: 23 }
      ]
    },
    {
      id: 'ANM-7839',
      category: 'policy-boundary',
      categoryName: 'Policy Boundary Testing',
      confidence: 0.96,
      anomalyScore: 0.96,
      status: 'escalated',
      affectedAgents: ['Customer Support Bot'],
      affectedAgentIds: ['agent-002'],
      explanation: 'Agent systematically probed access boundaries across 8 restricted data domains.',
      shortExplanation: 'Systematic probing of 8 restricted data domains',
      timestamp: '2024-12-20T14:12:08Z',
      duration: '6m 42s',
      timeWindow: '14:05:26 - 14:12:08',
      signals: [
        { name: 'Boundary probe frequency', baseline: 0.3, observed: 8.2, deviation: 2633 },
        { name: 'Permission denial rate', baseline: 0.02, observed: 0.89, deviation: 4350 }
      ],
      toolUsage: [
        { tool: 'data_query', count: 47, expected: 12, status: 'anomalous' },
        { tool: 'permission_check', count: 31, expected: 2, status: 'critical' }
      ],
      relatedAnomalies: ['ANM-7842', 'ANM-7836'],
      dataQuality: { completeness: 0.99, schemaMatch: 0.98, trustScore: 0.94 },
      promptResponse: {
        systemPrompt: 'You are a customer support assistant.',
        userPrompt: 'I need help understanding my account status.',
        declaredIntent: 'Query user account status, provide relevant information.',
        actualActions: ['ATTEMPT: SELECT * FROM admin_users [DENIED]', 'ATTEMPT: SELECT * FROM billing_internal [DENIED]', '... 5 more restricted domain probes'],
        responsePreview: 'Let me try another approach...',
        flaggedTokens: ['try another approach', 'alternative method', 'workaround']
      },
      tokenUsage: { inputTokens: 342, outputTokens: 1876, reasoningTokens: 8934, totalCost: 0.31, expectedCost: 0.08, costMultiplier: 3.9 },
      semanticSimilarity: {
        knownPatterns: [
          { pattern: 'Permission enumeration attack', similarity: 0.96, occurrences: 2 },
          { pattern: 'Boundary probing sequence', similarity: 0.93, occurrences: 4 }
        ],
        embeddingCluster: 'security-boundary-test',
        clusterConfidence: 0.95
      },
      replayAvailable: false,
      replayState: { canRerun: false, sandboxAvailable: false, rerunBlocked: 'Security incident - replay disabled' },
      signalHistory: [
        { time: '14:05', score: 0.1 }, { time: '14:07', score: 0.4 }, { time: '14:09', score: 0.7 },
        { time: '14:11', score: 0.88 }, { time: '14:12', score: 0.96 }
      ],
      toolBreakdown: [
        { name: 'data_query', value: 47 }, { name: 'permission_check', value: 31 }
      ]
    },
    {
      id: 'ANM-7836',
      category: 'hallucination',
      categoryName: 'Hallucination / Fabrication',
      confidence: 0.93,
      anomalyScore: 0.76,
      status: 'new',
      affectedAgents: ['Research Assistant'],
      affectedAgentIds: ['agent-005'],
      explanation: 'Agent generated report containing 12 citations to non-existent sources.',
      shortExplanation: '12 false citations, 4 fabricated data points',
      timestamp: '2024-12-20T13:58:14Z',
      duration: '3m 27s',
      timeWindow: '13:54:47 - 13:58:14',
      signals: [
        { name: 'Citation validity', baseline: 0.96, observed: 0.41, deviation: -57 },
        { name: 'Data provenance score', baseline: 0.94, observed: 0.28, deviation: -70 }
      ],
      toolUsage: [
        { tool: 'knowledge_retrieval', count: 8, expected: 12, status: 'normal' },
        { tool: 'citation_generator', count: 18, expected: 8, status: 'anomalous' }
      ],
      relatedAnomalies: ['ANM-7842', 'ANM-7839'],
      dataQuality: { completeness: 0.91, schemaMatch: 0.88, trustScore: 0.67 },
      promptResponse: {
        systemPrompt: 'You are a research assistant. Cite sources accurately.',
        userPrompt: 'Summarize recent developments in quantum computing with citations.',
        declaredIntent: 'Query knowledge base, retrieve relevant papers, synthesize with citations.',
        actualActions: ['Retrieved 8 documents from knowledge base', 'Generated 18 citations (10 fabricated)'],
        responsePreview: 'According to Smith et al. (2024)...',
        flaggedTokens: ['Smith et al.', '47%', 'Nature Quantum']
      },
      tokenUsage: { inputTokens: 892, outputTokens: 2341, reasoningTokens: 4521, totalCost: 0.19, expectedCost: 0.14, costMultiplier: 1.4 },
      semanticSimilarity: {
        knownPatterns: [
          { pattern: 'Citation fabrication', similarity: 0.94, occurrences: 6 },
          { pattern: 'Statistical hallucination', similarity: 0.89, occurrences: 11 }
        ],
        embeddingCluster: 'content-fabrication',
        clusterConfidence: 0.92
      },
      replayAvailable: true,
      replayState: { canRerun: true, estimatedCost: 0.09, sandboxAvailable: true },
      signalHistory: [
        { time: '13:54', score: 0.15 }, { time: '13:56', score: 0.45 }, { time: '13:58', score: 0.76 }
      ],
      toolBreakdown: [
        { name: 'knowledge_retrieval', value: 8 }, { name: 'citation_generator', value: 18 }
      ]
    },
    {
      id: 'ANM-7833',
      category: 'cost-abuse',
      categoryName: 'Cost & Resource Abuse',
      confidence: 0.91,
      anomalyScore: 0.65,
      status: 'new',
      affectedAgents: ['Research Assistant'],
      affectedAgentIds: ['agent-005'],
      explanation: 'Agent consumed 847K tokens in 4-minute window for simple lookup task.',
      shortExplanation: '847K tokens for simple lookup, 23x cost baseline',
      timestamp: '2024-12-20T13:38:47Z',
      duration: '4m 12s',
      timeWindow: '13:34:35 - 13:38:47',
      signals: [
        { name: 'Token efficiency', baseline: 0.87, observed: 0.04, deviation: -95 },
        { name: 'Cost per operation', baseline: 0.12, observed: 2.76, deviation: 2200 }
      ],
      toolUsage: [
        { tool: 'llm_inference', count: 47, expected: 2, status: 'critical' },
        { tool: 'knowledge_retrieval', count: 89, expected: 4, status: 'critical' }
      ],
      relatedAnomalies: ['ANM-7841'],
      dataQuality: { completeness: 0.98, schemaMatch: 0.97, trustScore: 0.93 },
      promptResponse: {
        systemPrompt: 'You are a research assistant. Provide efficient, concise responses.',
        userPrompt: 'What is the capital of France?',
        declaredIntent: 'Simple factual lookup, direct response.',
        actualActions: ['knowledge_retrieval x89 (unnecessary)', 'llm_inference x47 (recursive elaboration)'],
        responsePreview: 'To properly answer this question, let me provide comprehensive context...',
        flaggedTokens: ['comprehensive', 'detailed analysis', 'let me elaborate']
      },
      tokenUsage: { inputTokens: 45, outputTokens: 234567, reasoningTokens: 612345, totalCost: 18.92, expectedCost: 0.82, costMultiplier: 23.1 },
      semanticSimilarity: {
        knownPatterns: [
          { pattern: 'Token waste - over-elaboration', similarity: 0.94, occurrences: 7 },
          { pattern: 'Runaway generation', similarity: 0.91, occurrences: 4 }
        ],
        embeddingCluster: 'resource-abuse',
        clusterConfidence: 0.93
      },
      replayAvailable: true,
      replayState: { canRerun: true, estimatedCost: 0.02, sandboxAvailable: true, suggestedFix: 'Apply token limits before replay' },
      signalHistory: [
        { time: '13:34', score: 0.1 }, { time: '13:36', score: 0.35 }, { time: '13:38', score: 0.65 }
      ],
      toolBreakdown: [
        { name: 'llm_inference', value: 47 }, { name: 'knowledge_retrieval', value: 89 }
      ]
    }
  ];

  const getSeverityConfig = (anomaly) => getSeverityFromScore(anomaly.anomalyScore);
  const getStatusConfig = (status) => statusOptions.find(s => s.id === status) || statusOptions[0];
  const getCategoryConfig = (categoryId) => taxonomyCategories.find(c => c.id === categoryId) || taxonomyCategories[0];

  const filteredAnomalies = anomalies.filter(a => {
    if (filters.severity !== 'all') {
      const sev = getSeverityFromScore(a.anomalyScore);
      if (sev.id !== filters.severity) return false;
    }
    if (filters.category !== 'all' && a.category !== filters.category) return false;
    if (filters.status !== 'all' && a.status !== filters.status) return false;
    return true;
  });

  // Count by new severity types
  const criticalCount = anomalies.filter(a => a.anomalyScore >= 0.9).length;
  const nonCriticalCount = anomalies.filter(a => a.anomalyScore >= 0.7 && a.anomalyScore < 0.9).length;
  const informationalCount = anomalies.filter(a => a.anomalyScore < 0.7).length;

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'anomalies', label: 'Anomalies' },
    { id: 'agents', label: 'Agents' },
    { id: 'costs', label: 'Costs' },
    { id: 'traces', label: 'Traces' }
  ];

  const detailTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-analysis', label: 'AI Analysis' },
    { id: 'prompt-response', label: 'Prompt / Response' },
    { id: 'signals', label: 'Signals' },
    { id: 'cost', label: 'Cost Attribution' },
    { id: 'correlation', label: 'Correlation' }
  ];

  const formatTimestamp = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatCost = (cost) => '$' + cost.toFixed(2);
  const formatTokens = (tokens) => {
    if (tokens >= 1000000) return (tokens / 1000000).toFixed(1) + 'M';
    if (tokens >= 1000) return (tokens / 1000).toFixed(1) + 'K';
    return tokens.toString();
  };

  const styles = {
    container: { minHeight: '100vh', background: '#0a0b0d', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#e4e4e7', display: 'flex' },
    sidebar: { width: '240px', background: '#0f1115', borderRight: '1px solid #1a1d23', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    header: { padding: '16px 24px', borderBottom: '1px solid #1a1d23', background: '#0f1115', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    content: { flex: 1, padding: '24px', overflowY: 'auto', background: '#0a0b0d' },
    card: { padding: '20px', background: '#0f1115', borderRadius: '8px', border: '1px solid #1a1d23' },
    btn: { padding: '8px 16px', background: '#1a1d23', border: '1px solid #2d333b', borderRadius: '6px', color: '#9ca3af', fontSize: '13px', cursor: 'pointer' },
    btnPrimary: { padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' },
    select: { padding: '8px 12px', background: '#1a1d23', border: '1px solid #2d333b', borderRadius: '6px', color: '#e4e4e7', fontSize: '13px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '14px 16px', fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#13161b' },
    td: { padding: '14px 16px', borderBottom: '1px solid #1a1d23' }
  };

  // Simple bar chart component
  const BarChart = ({ data, height = 120 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: height + 'px', padding: '10px 0' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '100%', background: '#1a1d23', borderRadius: '4px', height: height + 'px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: (item.value / maxValue * 100) + '%',
                background: item.value === maxValue ? '#ef4444' : '#3b82f6',
                borderRadius: '4px',
                minHeight: '4px',
                transition: 'height 0.3s ease'
              }}></div>
            </div>
            <span style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center' }}>{item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#e4e4e7' }}>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Simple line chart component for anomaly score over time
  const LineChart = ({ data, height = 100 }) => {
    const maxScore = 1;
    const points = data.map((d, idx) => ({
      x: (idx / (data.length - 1)) * 100,
      y: 100 - (d.score / maxScore * 100)
    }));
    const pathD = points.map((p, idx) => (idx === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');

    return (
      <div style={{ position: 'relative', height: height + 40 + 'px' }}>
        <svg width="100%" height={height} style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#1a1d23" strokeWidth="1" />
          <line x1="0" y1="33%" x2="100%" y2="33%" stroke="#1a1d23" strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#1a1d23" strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#1a1d23" strokeWidth="1" />

          {/* Threshold lines */}
          <line x1="0" y1="10%" x2="100%" y2="10%" stroke="#dc2626" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" opacity="0.5" />

          {/* Line path */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />

          {/* Points */}
          {points.map((p, idx) => (
            <circle key={idx} cx={p.x + '%'} cy={p.y + '%'} r="4" fill={data[idx].score >= 0.9 ? '#dc2626' : data[idx].score >= 0.7 ? '#f59e0b' : '#3b82f6'} />
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {data.map((d, idx) => (
            <span key={idx} style={{ fontSize: '10px', color: '#6b7280' }}>{d.time}</span>
          ))}
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, fontSize: '9px', color: '#6b7280' }}>
          <div style={{ position: 'absolute', right: '-30px', top: '5%' }}>0.9</div>
          <div style={{ position: 'absolute', right: '-30px', top: '25%' }}>0.7</div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1a1d23' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff' }}>A</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Agent SOC</div>
              <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LLM Behavioral Monitor</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#4b5563', margin: '0 0 12px 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Monitoring</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSelectedAnomaly(null); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', background: activeSection === item.id ? '#1a1d23' : 'transparent', border: activeSection === item.id ? '1px solid #2d333b' : '1px solid transparent', borderRadius: '6px', color: activeSection === item.id ? '#fff' : '#9ca3af', fontSize: '13px', textAlign: 'left', cursor: 'pointer', marginBottom: '4px' }}>
              {item.label}
              {item.id === 'anomalies' && <span style={{ padding: '2px 8px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>{anomalies.filter(a => a.status === 'new').length}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #1a1d23' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#1a1d23', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, border: '1px solid #2d333b' }}>SO</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>SOC Analyst</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Tier 2 • Online</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px' }}>{selectedAnomaly ? 'Anomaly ' + selectedAnomaly.id : 'Agent Anomalies'}</h1>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{selectedAnomaly ? selectedAnomaly.categoryName : filteredAnomalies.length + ' anomalies detected'}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedAnomaly && <button style={styles.btn} onClick={() => setSelectedAnomaly(null)}>← Back to List</button>}
            {!selectedAnomaly && (
              <React.Fragment>
                <select style={styles.select} value={filters.severity} onChange={e => setFilters({...filters, severity: e.target.value})}>
                  <option value="all">All Severity</option>
                  {severityLevels.map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
                </select>
                <select style={styles.select} value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="all">All Status</option>
                  {statusOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button style={styles.btnPrimary}>Export</button>
              </React.Fragment>
            )}
          </div>
        </header>

        <div style={styles.content}>
          {/* ANOMALIES LIST */}
          {activeSection === 'anomalies' && !selectedAnomaly && (
            <div>
              {/* Summary Stats - Only 3 alert types */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ ...styles.card, borderLeft: '3px solid #dc2626' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actionable, Critical</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#dc2626' }}>{criticalCount}</div>
                </div>
                <div style={{ ...styles.card, borderLeft: '3px solid #f59e0b' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actionable, Non-Critical</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>{nonCriticalCount}</div>
                </div>
                <div style={{ ...styles.card, borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Non-Actionable, Informational</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>{informationalCount}</div>
                </div>
              </div>

              {/* Category Filters */}
              <div style={{ ...styles.card, display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setFilters({...filters, category: 'all'})} style={{ padding: '6px 14px', background: filters.category === 'all' ? '#3b82f6' : '#1a1d23', border: '1px solid ' + (filters.category === 'all' ? '#3b82f6' : '#2d333b'), borderRadius: '6px', color: filters.category === 'all' ? '#fff' : '#9ca3af', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>All Categories</button>
                {taxonomyCategories.map(cat => {
                  const count = anomalies.filter(a => a.category === cat.id).length;
                  if (count === 0) return null;
                  return (
                    <button key={cat.id} onClick={() => setFilters({...filters, category: cat.id})} style={{ padding: '6px 14px', background: filters.category === cat.id ? cat.color + '20' : '#1a1d23', border: '1px solid ' + (filters.category === cat.id ? cat.color : '#2d333b'), borderRadius: '6px', color: filters.category === cat.id ? cat.color : '#9ca3af', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color }}></span>
                      {cat.name}
                      <span style={{ padding: '1px 6px', background: '#0a0b0d', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Anomalies Table - No cost impact column */}
              <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Category</th>
                      <th style={{...styles.th, textAlign: 'center'}}>Severity</th>
                      <th style={{...styles.th, textAlign: 'center'}}>Score</th>
                      <th style={styles.th}>Explanation</th>
                      <th style={{...styles.th, textAlign: 'center'}}>Status</th>
                      <th style={{...styles.th, textAlign: 'right'}}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnomalies.map(anomaly => {
                      const sev = getSeverityConfig(anomaly);
                      const stat = getStatusConfig(anomaly.status);
                      const cat = getCategoryConfig(anomaly.category);
                      return (
                        <tr key={anomaly.id} onClick={() => { setSelectedAnomaly(anomaly); setActiveTab('overview'); }} style={{ cursor: 'pointer' }}>
                          <td style={styles.td}><span style={{ fontSize: '12px', color: '#9ca3af' }}>{anomaly.id}</span></td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                              <span style={{ fontSize: '12px', fontWeight: 500 }}>{anomaly.categoryName}</span>
                            </div>
                          </td>
                          <td style={{...styles.td, textAlign: 'center'}}><span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: sev.bg, color: sev.color, textTransform: 'uppercase' }}>{sev.shortName}</span></td>
                          <td style={{...styles.td, textAlign: 'center'}}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <div style={{ width: '40px', height: '4px', background: '#1a1d23', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: (anomaly.anomalyScore * 100) + '%', height: '100%', background: sev.color, borderRadius: '2px' }}></div>
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: 500 }}>{(anomaly.anomalyScore * 100).toFixed(0)}%</span>
                            </div>
                          </td>
                          <td style={{...styles.td, maxWidth: '300px'}}><p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{anomaly.shortExplanation}</p></td>
                          <td style={{...styles.td, textAlign: 'center'}}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#1a1d23', borderRadius: '10px', fontSize: '11px', fontWeight: 500, color: stat.color }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: stat.color }}></span>{stat.name}</span></td>
                          <td style={{...styles.td, textAlign: 'right'}}>
                            <div style={{ fontSize: '12px' }}>{formatTimestamp(anomaly.timestamp)}</div>
                            <div style={{ fontSize: '10px', color: '#6b7280' }}>{anomaly.duration}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1d23', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Showing {filteredAnomalies.length} of {anomalies.length} anomalies</span>
                </div>
              </div>
            </div>
          )}

          {/* ANOMALY DETAIL VIEW */}
          {activeSection === 'anomalies' && selectedAnomaly && (
            <div>
              {/* Status Banner */}
              <div style={{ ...styles.card, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: getSeverityConfig(selectedAnomaly).bg, color: getSeverityConfig(selectedAnomaly).color, textTransform: 'uppercase' }}>{getSeverityConfig(selectedAnomaly).shortName}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#1a1d23', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: getStatusConfig(selectedAnomaly.status).color }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusConfig(selectedAnomaly.status).color }}></span>
                    {getStatusConfig(selectedAnomaly.status).name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Detected {formatTimestamp(selectedAnomaly.timestamp)} • {formatDate(selectedAnomaly.timestamp)}</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '20px', borderBottom: '1px solid #1a1d23' }}>
                {detailTabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === tab.id ? '#fff' : '#6b7280', fontSize: '12px', fontWeight: 500, cursor: 'pointer', marginBottom: '-1px', whiteSpace: 'nowrap' }}>{tab.label}</button>
                ))}
              </div>

              {/* OVERVIEW TAB - Updated with Score interpretation and Charts */}
              {activeTab === 'overview' && (
                <div>
                  {/* Anomaly Explanation - Move to top and make more prominent */}
                  <div style={{ ...styles.card, marginBottom: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚠️</div>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px', color: '#e4e4e7' }}>Anomaly Detected</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: getCategoryConfig(selectedAnomaly.category).color }}></span>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: getCategoryConfig(selectedAnomaly.category).color }}>{selectedAnomaly.categoryName}</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', color: '#e4e4e7', margin: 0, lineHeight: 1.8, fontWeight: 400 }}>{selectedAnomaly.explanation}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={styles.card}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Anomaly Score</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: getSeverityConfig(selectedAnomaly).color }}>{(selectedAnomaly.anomalyScore * 100).toFixed(0)}%</div>
                      <div style={{ fontSize: '10px', color: getSeverityConfig(selectedAnomaly).color, marginTop: '4px' }}>{getSeverityConfig(selectedAnomaly).name}</div>
                    </div>
                    <div style={styles.card}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{Math.round(selectedAnomaly.confidence * 100)}%</div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>detection certainty</div>
                    </div>
                    <div style={styles.card}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#e4e4e7' }}>{selectedAnomaly.duration}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>anomaly window</div>
                    </div>
                    <div style={styles.card}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Affected Agents</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#e4e4e7' }}>{selectedAnomaly.affectedAgents.length}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>agents impacted</div>
                    </div>
                  </div>

                  {/* Score Progression Chart - single full width */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={styles.card}>
                      <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Score Progression</h3>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 12px' }}>Anomaly score evolution during detection window</p>
                      {selectedAnomaly.signalHistory && <LineChart data={selectedAnomaly.signalHistory} height={100} />}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={styles.card}>
                        <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Classification</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: getCategoryConfig(selectedAnomaly.category).color }}></span>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: getCategoryConfig(selectedAnomaly.category).color }}>{selectedAnomaly.categoryName}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px', lineHeight: 1.6 }}>{getCategoryConfig(selectedAnomaly.category).description}</p>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>Taxonomy ID: <span style={{ color: '#9ca3af' }}>{selectedAnomaly.category}</span></p>
                      </div>
                      <div style={{ ...styles.card, borderLeft: '3px solid #3b82f6' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px', color: '#3b82f6' }}>SOC Incident Summary</h3>
                        <div style={{ padding: '16px', background: '#0a0b0d', borderRadius: '6px', fontSize: '12px', lineHeight: 1.8, color: '#9ca3af' }}>
                          <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#e4e4e7' }}>INCIDENT:</strong> {selectedAnomaly.id}</p>
                          <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#e4e4e7' }}>CATEGORY:</strong> {selectedAnomaly.categoryName}</p>
                          <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#e4e4e7' }}>SEVERITY:</strong> {getSeverityConfig(selectedAnomaly).name}</p>
                          <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#e4e4e7' }}>SCORE:</strong> {(selectedAnomaly.anomalyScore * 100).toFixed(0)}%</p>
                          <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#e4e4e7' }}>TIME WINDOW:</strong> {selectedAnomaly.timeWindow}</p>
                          <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#e4e4e7' }}>AGENTS:</strong> {selectedAnomaly.affectedAgents.join(', ')}</p>
                          <p style={{ margin: 0 }}><strong style={{ color: '#e4e4e7' }}>SUMMARY:</strong> {selectedAnomaly.shortExplanation}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={styles.card}>
                        <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Affected Agents</h3>
                        {selectedAnomaly.affectedAgents.map((agent, idx) => (
                          <div key={idx} style={{ padding: '12px', background: '#0a0b0d', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1a1d23' }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>{agent}</div>
                              <div style={{ fontSize: '11px', color: '#6b7280' }}>{selectedAnomaly.affectedAgentIds[idx]}</div>
                            </div>
                            <button style={{ ...styles.btn, padding: '4px 10px', fontSize: '11px' }}>View →</button>
                          </div>
                        ))}
                      </div>
                      <div style={styles.card}>
                        <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Actions</h3>
                        {['Copy incident summary', 'Export to SIEM', 'Notify stakeholders', 'Create ticket'].map((action, idx) => (
                          <button key={idx} style={{ width: '100%', padding: '10px 14px', background: '#0a0b0d', border: '1px solid #1a1d23', borderRadius: '6px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', textAlign: 'left', marginBottom: '8px' }}>{action}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROMPT/RESPONSE TAB */}
              {activeTab === 'prompt-response' && selectedAnomaly.promptResponse && (
                <div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>This view shows the actual prompts and responses that triggered the anomaly, with flagged tokens highlighted.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={styles.card}>
                      <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px', color: '#3b82f6' }}>System Prompt</h3>
                      <div style={{ padding: '14px', background: '#0a0b0d', borderRadius: '6px', fontSize: '12px', lineHeight: 1.7, color: '#9ca3af', border: '1px solid #1a1d23', maxHeight: '200px', overflowY: 'auto' }}>{selectedAnomaly.promptResponse.systemPrompt}</div>
                    </div>
                    <div style={styles.card}>
                      <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px', color: '#22c55e' }}>User Prompt</h3>
                      <div style={{ padding: '14px', background: '#0a0b0d', borderRadius: '6px', fontSize: '12px', lineHeight: 1.7, color: '#e4e4e7', border: '1px solid #1a1d23', maxHeight: '200px', overflowY: 'auto' }}>{selectedAnomaly.promptResponse.userPrompt}</div>
                    </div>
                  </div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Intent vs Actual Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Declared Intent</div>
                        <div style={{ padding: '14px', background: 'rgba(34,197,94,0.1)', borderRadius: '6px', fontSize: '12px', lineHeight: 1.7, color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>{selectedAnomaly.promptResponse.declaredIntent}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Actual Actions</div>
                        <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', fontSize: '12px', lineHeight: 1.7, color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', maxHeight: '150px', overflowY: 'auto' }}>
                          {selectedAnomaly.promptResponse.actualActions.map((action, idx) => (
                            <div key={idx} style={{ marginBottom: idx < selectedAnomaly.promptResponse.actualActions.length - 1 ? '8px' : 0 }}><span style={{ color: '#6b7280', marginRight: '8px' }}>{idx + 1}.</span>{action}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Response Preview</h3>
                    <div style={{ padding: '14px', background: '#0a0b0d', borderRadius: '6px', fontSize: '12px', lineHeight: 1.7, color: '#9ca3af', border: '1px solid #1a1d23' }}>{selectedAnomaly.promptResponse.responsePreview}</div>
                  </div>
                  <div style={{ ...styles.card, borderLeft: '3px solid #f59e0b' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px', color: '#f59e0b' }}>Flagged Tokens</h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px' }}>These tokens/phrases were flagged as anomaly indicators:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedAnomaly.promptResponse.flaggedTokens.map((token, idx) => (
                        <span key={idx} style={{ padding: '6px 12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '4px', fontSize: '12px', color: '#f59e0b', fontWeight: 500 }}>"{token}"</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SIGNALS TAB */}
              {activeTab === 'signals' && (
                <div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>These derived behavior signals were used to detect this anomaly. Each signal compares observed behavior against established baselines.</p>
                  </div>
                  <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Signal Name</th>
                          <th style={{...styles.th, textAlign: 'right'}}>Baseline</th>
                          <th style={{...styles.th, textAlign: 'right'}}>Observed</th>
                          <th style={{...styles.th, textAlign: 'center'}}>Deviation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAnomaly.signals.map((signal, idx) => {
                          const isNeg = signal.deviation < 0;
                          const absDev = Math.abs(signal.deviation);
                          const devColor = absDev > 500 ? '#ef4444' : absDev > 100 ? '#f59e0b' : '#3b82f6';
                          return (
                            <tr key={idx}>
                              <td style={styles.td}><span style={{ fontSize: '13px', fontWeight: 500 }}>{signal.name}</span></td>
                              <td style={{...styles.td, textAlign: 'right'}}><span style={{ fontSize: '13px', color: '#6b7280' }}>{signal.baseline}</span></td>
                              <td style={{...styles.td, textAlign: 'right'}}><span style={{ fontSize: '13px', fontWeight: 600, color: devColor }}>{signal.observed}</span></td>
                              <td style={{...styles.td, textAlign: 'center'}}><span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: devColor + '15', color: devColor }}>{isNeg ? '' : '+'}{signal.deviation}%</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI ANALYSIS TAB (formerly Semantic Analysis) */}
              {activeTab === 'ai-analysis' && selectedAnomaly.semanticSimilarity && (
                <div>
                  {/* AI Analysis Header - Attention grabber matching Overview style */}
                  <div style={{ ...styles.card, marginBottom: '24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(236,72,153,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔍</div>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px', color: '#e4e4e7' }}>AI-Powered Pattern Analysis</h3>
                        <div style={{ fontSize: '12px', color: '#a78bfa' }}>Behavioral Threat Intelligence</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', color: '#e4e4e7', margin: 0, lineHeight: 1.8, fontWeight: 400 }}>This anomaly has been analyzed against known behavioral patterns to identify recurring failure modes and potential security threats.</p>
                  </div>

                  <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1d23' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 600, margin: 0 }}>Similarity to Known Threat Patterns</h3>
                    </div>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Pattern Name</th>
                          <th style={{...styles.th, textAlign: 'center'}}>Similarity</th>
                          <th style={{...styles.th, textAlign: 'center'}}>Historical Occurrences</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAnomaly.semanticSimilarity.knownPatterns.map((pattern, idx) => {
                          const matchColor = pattern.similarity >= 0.9 ? '#ef4444' : pattern.similarity >= 0.8 ? '#f59e0b' : '#3b82f6';
                          return (
                            <tr key={idx}>
                              <td style={styles.td}><span style={{ fontSize: '13px', fontWeight: 500 }}>{pattern.pattern}</span></td>
                              <td style={{...styles.td, textAlign: 'center'}}><span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: matchColor + '15', color: matchColor }}>{Math.round(pattern.similarity * 100)}%</span></td>
                              <td style={{...styles.td, textAlign: 'center'}}><span style={{ fontSize: '13px', color: '#9ca3af' }}>{pattern.occurrences} times</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* COST TAB */}
              {activeTab === 'cost' && selectedAnomaly.tokenUsage && (
                <div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>Detailed breakdown of token consumption and cost impact during this anomaly window.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Total Cost', value: formatCost(selectedAnomaly.tokenUsage.totalCost), color: '#ef4444' },
                      { label: 'Expected Cost', value: formatCost(selectedAnomaly.tokenUsage.expectedCost), color: '#22c55e' },
                      { label: 'Cost Overrun', value: '+' + formatCost(selectedAnomaly.tokenUsage.totalCost - selectedAnomaly.tokenUsage.expectedCost), color: '#f59e0b' },
                      { label: 'Cost Multiplier', value: selectedAnomaly.tokenUsage.costMultiplier.toFixed(1) + 'x', color: '#8b5cf6' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ ...styles.card, borderLeft: '3px solid ' + item.color }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: item.color }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 20px' }}>Token Usage Breakdown</h3>
                    {[
                      { label: 'Input Tokens', value: selectedAnomaly.tokenUsage.inputTokens, color: '#3b82f6' },
                      { label: 'Output Tokens', value: selectedAnomaly.tokenUsage.outputTokens, color: '#22c55e' },
                      { label: 'Reasoning Tokens', value: selectedAnomaly.tokenUsage.reasoningTokens, color: '#f59e0b' }
                    ].map((item, idx) => {
                      const total = selectedAnomaly.tokenUsage.inputTokens + selectedAnomaly.tokenUsage.outputTokens + selectedAnomaly.tokenUsage.reasoningTokens;
                      return (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{item.label}</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{formatTokens(item.value)}</span>
                          </div>
                          <div style={{ height: '8px', background: '#1a1d23', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: ((item.value / total) * 100) + '%', height: '100%', background: item.color, borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CORRELATION TAB */}
              {activeTab === 'correlation' && (
                <div>
                  <div style={{ ...styles.card, marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Related Anomalies</h3>
                    {selectedAnomaly.relatedAnomalies.length > 0 ? (
                      <div>
                        {selectedAnomaly.relatedAnomalies.map(relatedId => {
                          const related = anomalies.find(a => a.id === relatedId);
                          if (!related) return null;
                          const sev = getSeverityConfig(related);
                          return (
                            <div key={relatedId} onClick={() => { setSelectedAnomaly(related); setActiveTab('overview'); }} style={{ padding: '14px', background: '#0a0b0d', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1a1d23', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>{related.id}</span>
                                <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: sev.bg, color: sev.color, textTransform: 'uppercase' }}>{sev.shortName}</span>
                                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{related.categoryName}</span>
                              </div>
                              <span style={{ fontSize: '12px', color: '#3b82f6' }}>View →</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>No correlated anomalies detected for this incident.</p>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={styles.card}>
                      <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Shared Dependencies</h3>
                      {[
                        { name: 'Data Pipeline', count: 2, color: '#f59e0b' },
                        { name: 'Auth Service', count: 0, color: '#6b7280' },
                        { name: 'Knowledge Base', count: 3, color: '#ef4444' }
                      ].map((dep, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0a0b0d', borderRadius: '6px', border: '1px solid #1a1d23', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{dep.name}</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: dep.color }}>{dep.count} anomalies</span>
                        </div>
                      ))}
                    </div>
                    <div style={styles.card}>
                      <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Time Correlation</h3>
                      {[
                        { window: '±5 min window', count: 3, color: '#f59e0b' },
                        { window: '±15 min window', count: 5, color: '#f59e0b' },
                        { window: '±1 hour window', count: 7, color: '#6b7280' }
                      ].map((t, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#0a0b0d', borderRadius: '6px', border: '1px solid #1a1d23', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{t.window}</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: t.color }}>{t.count} anomalies</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ ...styles.card, borderLeft: selectedAnomaly.relatedAnomalies.length > 1 ? '3px solid #ef4444' : '3px solid #22c55e' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 600, margin: '0 0 16px' }}>Incident Scope Assessment</h3>
                    {selectedAnomaly.relatedAnomalies.length > 1 ? (
                      <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 8px', color: '#ef4444' }}>Potential Multi-Agent Incident</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>This anomaly is correlated with {selectedAnomaly.relatedAnomalies.length} other detected anomalies. Recommend escalation for coordinated investigation.</p>
                      </div>
                    ) : (
                      <div style={{ padding: '14px', background: 'rgba(34,197,94,0.1)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)' }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 8px', color: '#22c55e' }}>Isolated Incident</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>No significant correlation with other active anomalies detected. Can be investigated independently.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'anomalies' && (
            <div style={{ ...styles.card, padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AgentAnomalies;
