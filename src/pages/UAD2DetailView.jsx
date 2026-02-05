import React, { useState, useMemo } from 'react';
import { AlertTriangle, Shield, Activity, Layers, GitBranch, ChevronDown, ChevronRight, Info, TrendingUp, Database, Clock, Target, Zap, CheckCircle, Eye, Radio, Lightbulb, Copy } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Treemap, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const formatTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const alertData = {
  metadata: {
    domain: 'Network Security Logs',
    periodEnd: '2025-01-27T14:00:00Z',
    periodLength: 168,
    threshold: 50,
    totalPatternsScanned: 847,
    anomaliesDetected: 3,
  },
  alerts: [
    {
      id: 0,
      severity: { value: 91.62, credibility: 97.43 },
      responseRequired: 'IMMEDIATE',
      detectedAt: '2025-01-27T08:14:00Z',
      components: [
        { id: '01:0', core: 100.00 },
        { id: '02:0', core: 80.00 },
        { id: '03:0', core: 80.00 },
        { id: '04:0', core: 0.00 },
        { id: '05:0', core: 6.67 },
      ],
      patterns: [
        { id: '01:0', conditions: "device_type='FW' AND device_vendor='CiscoSystems' AND dstipint='172157043'", currentSupport: 70.00, baselineSupport: 0, firstSeen: '2025-01-27T08:14:00Z' },
        { id: '02:0', conditions: "dstipint='172157043' AND dstport='9100'", currentSupport: 67.50, baselineSupport: 0, firstSeen: '2025-01-27T08:15:00Z' },
        { id: '03:0', conditions: "dstport='9100' AND srcipint='171969797'", currentSupport: 60.00, baselineSupport: 0, firstSeen: '2025-01-27T08:14:00Z' },
        { id: '04:0', conditions: "device_vendor='PAN' AND dstipint='172157043'", currentSupport: 37.50, baselineSupport: 2.50, firstSeen: '2025-01-27T09:22:00Z' },
        { id: '05:0', conditions: "device_vendor='CiscoSystems' AND dstport='9100'", currentSupport: 50.00, baselineSupport: 0, firstSeen: '2025-01-27T08:16:00Z' },
      ],
      commonalities: [
        { field: 'dstipint', value: '172157043', frequency: '100%' },
        { field: 'srcipint', value: '171969797', frequency: '60%' },
        { field: 'dstport', value: '9100', frequency: '80%' },
        { field: 'device_type', value: 'FW', frequency: '40%' },
        { field: 'device_vendor', value: 'CiscoSystems', frequency: '60%' },
        { field: 'device_vendor', value: 'PAN', frequency: '20%' },
      ],
      explanation: "Massive, sudden activity from a single internal IP to a specific internal printer-like host/port pair suggests either malware using print services for propagation/exfiltration or a misused infrastructure device; the fact that the baseline is effectively zero yet the current volume is extremely high indicates a clear change in behavior that needs urgent triage. This kind of spike to a specific infrastructure endpoint can quickly be leveraged for lateral movement or data staging, so it warrants immediate investigation and containment.",
      technicalDetails: {
        attackVector: 'Internal Network - Print Services',
        affectedAssets: ['172157043 (Destination)', '171969797 (Source)'],
        protocols: ['Port 9100 (Raw Print)'],
        deviceTypes: ['Firewall (Cisco, PAN)'],
      },
      recommendedActions: {
        immediate: ['Isolate source IP 171969797 from network', 'Block port 9100 traffic temporarily', 'Capture network forensics'],
        midTerm: ['Analyze print server logs', 'Review firewall rules for print services', 'Scan for lateral movement indicators'],
        longTerm: ['Implement print service segmentation', 'Deploy print traffic monitoring', 'Update incident response playbooks'],
      }
    },
    {
      id: 1,
      severity: { value: 82.14, credibility: 81.25 },
      responseRequired: 'WITHIN HOURS',
      detectedAt: '2025-01-27T10:30:00Z',
      components: [{ id: '15:1', core: 100.00 }],
      patterns: [
        { id: '15:1', conditions: "device_type='FW' AND device_vendor='CiscoSystems' AND dstipint='172261442'", currentSupport: 100.00, baselineSupport: 0, firstSeen: '2025-01-27T10:30:00Z' },
        { id: '15:1', conditions: "dstipint='172261442'", currentSupport: 100.00, baselineSupport: 0, firstSeen: '2025-01-27T10:32:00Z' },
        { id: '15:1', conditions: "srcipint='171972912'", currentSupport: 100.00, baselineSupport: 0, firstSeen: '2025-01-27T10:31:00Z' },
      ],
      commonalities: [
        { field: 'dstipint', value: '172261442', frequency: '100%' },
        { field: 'srcipint', value: '171972912', frequency: '100%' },
        { field: 'device_type', value: 'FW', frequency: '100%' },
        { field: 'device_vendor', value: 'CiscoSystems', frequency: '100%' },
      ],
      explanation: "Huge firewall volume from one internal host to a specific internal destination with virtually zero baseline is consistent with beaconing, scanning, or data exfiltration toward an unusual internal endpoint.",
      technicalDetails: {
        attackVector: 'Internal Network - Lateral Movement',
        affectedAssets: ['172261442 (Destination)', '171972912 (Source)'],
        protocols: ['Multiple (via Firewall)'],
        deviceTypes: ['Firewall (Cisco)'],
      },
      recommendedActions: {
        immediate: ['Monitor source IP closely', 'Review destination host purpose'],
        midTerm: ['Correlate with authentication logs', 'Check for C2 indicators'],
        longTerm: ['Enhance internal traffic baselining', 'Deploy EDR on endpoints'],
      }
    },
    {
      id: 2,
      severity: { value: 74.97, credibility: 96.17 },
      responseRequired: 'WITHIN 24 HOURS',
      detectedAt: '2025-01-27T11:45:00Z',
      components: [
        { id: '08:1', core: 81.82 },
        { id: '11:0', core: 81.82 },
        { id: '12:0', core: 81.82 },
      ],
      patterns: [
        { id: '08:1', conditions: "device_type='AAA' AND dstipint='172047894' AND srcipint='1646'", currentSupport: 71.43, baselineSupport: 0, firstSeen: '2025-01-27T11:45:00Z' },
        { id: '11:0', conditions: "device_vendor='CISCO' AND dstipint='172047894' AND srcipint='1646'", currentSupport: 61.11, baselineSupport: 0, firstSeen: '2025-01-27T11:48:00Z' },
        { id: '12:0', conditions: "device_vendor='CISCO' AND dstipint='172047894' AND usr='Radius'", currentSupport: 53.17, baselineSupport: 0, firstSeen: '2025-01-27T11:52:00Z' },
      ],
      commonalities: [
        { field: 'usr', value: 'Radius', frequency: '50%' },
        { field: 'dstipint', value: '172047894', frequency: '100%' },
        { field: 'srcipint', value: '1646', frequency: '50%' },
        { field: 'device_vendor', value: 'CISCO', frequency: '50%' },
      ],
      explanation: "Very large spikes in AAA and RADIUS authentication-related patterns involving service accounts indicate potential password-spraying or brute-force authentication attacks.",
      technicalDetails: {
        attackVector: 'Authentication Infrastructure',
        affectedAssets: ['172047894 (AAA Server)', 'Radius Service Account'],
        protocols: ['Port 1813 (RADIUS Accounting)'],
        deviceTypes: ['AAA Server (Cisco)'],
      },
      recommendedActions: {
        immediate: ['Review failed authentication logs', 'Check Radius service account activity'],
        midTerm: ['Audit AAA server configurations', 'Implement rate limiting'],
        longTerm: ['Deploy MFA for service accounts', 'Enhance authentication monitoring'],
      }
    }
  ]
};

const getSeverityConfig = (value) => {
  if (value >= 85) return { color: 'text-red-400', bg: 'bg-red-500', bgMuted: 'bg-red-500/10', border: 'border-red-500/30', label: 'CRITICAL', category: 'Actionable, Critical Anomaly' };
  if (value >= 70) return { color: 'text-orange-400', bg: 'bg-orange-500', bgMuted: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'HIGH', category: 'Actionable, Non-Critical Anomaly' };
  if (value >= 50) return { color: 'text-yellow-400', bg: 'bg-yellow-500', bgMuted: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'MEDIUM', category: 'Actionable, Non-Critical Anomaly' };
  return { color: 'text-emerald-400', bg: 'bg-emerald-500', bgMuted: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'LOW', category: 'Non-Actionable, Informational Anomaly' };
};

const HelpTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="p-1 text-slate-500 hover:text-blue-400 transition-colors">
        <Info size={14} />
      </button>
      {show && (
        <div className="absolute z-50 w-64 p-3 text-xs bg-slate-800 border border-slate-700 rounded-lg shadow-xl -left-28 top-6">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">{text}</p>
        </div>
      )}
    </div>
  );
};

const CardHeader = ({ title, helpText, icon: Icon, iconColor = 'text-blue-400' }) => (
  <div className="flex justify-between items-start mb-4">
    <div className="flex items-center gap-2 flex-1">
      {Icon && <Icon size={18} className={iconColor} />}
      {typeof title === 'string' ? <h3 className="text-white font-semibold">{title}</h3> : title}
    </div>
    {helpText && <HelpTooltip text={helpText} />}
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label, highlight }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 ${active ? (highlight ? 'text-white border-purple-400 bg-gradient-to-r from-purple-500/20 to-blue-500/20' : 'text-blue-400 border-blue-400 bg-blue-500/5') : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'}`}>
    <Icon size={16} />
    {label}
  </button>
);

const MetricCard = ({ title, value, subtitle, helpText, icon: Icon, color = 'text-blue-400', children }) => (
  <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
    <CardHeader title={title} helpText={helpText} icon={Icon} iconColor={color} />
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    {children}
  </div>
);

const ProgressBar = ({ value, color = 'bg-blue-500', height = 'h-2' }) => (
  <div className={`${height} bg-slate-700 rounded-full overflow-hidden`}>
    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

const PatternRow = ({ pattern, isExpanded, onToggle }) => {
  const anomalyRatio = pattern.baselineSupport === 0 ? '∞' : (pattern.currentSupport / pattern.baselineSupport).toFixed(1);
  return (
    <div className="border border-slate-700/50 rounded-lg overflow-hidden mb-2 bg-slate-800/20">
      <div className="p-4 cursor-pointer hover:bg-slate-800/40 transition-colors" onClick={onToggle}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            <code className="text-xs text-cyan-400 font-mono">{pattern.id}</code>
            <div className="flex flex-wrap gap-1 flex-1">
              {pattern.conditions.split(' AND ').map((cond, i) => (
                <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">{cond}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right w-20">
              <p className="text-emerald-400 font-semibold">{pattern.currentSupport.toFixed(1)}%</p>
              <p className="text-slate-500 text-xs">Current</p>
            </div>
            <div className="text-right w-20">
              <p className="text-slate-400">{pattern.baselineSupport.toFixed(1)}%</p>
              <p className="text-slate-500 text-xs">Baseline</p>
            </div>
            <div className="text-right w-16">
              <p className={`font-bold ${anomalyRatio === '∞' ? 'text-red-400' : 'text-orange-400'}`}>{anomalyRatio}x</p>
              <p className="text-slate-500 text-xs">Spike</p>
            </div>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-slate-400 text-xs uppercase mb-3">Pattern Conditions</h4>
              {pattern.conditions.split(' AND ').map((cond, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <code className="text-sm text-slate-300 bg-slate-800 px-2 py-1 rounded">{cond}</code>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-slate-400 text-xs uppercase mb-3">Volume Analysis</h4>
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between"><span className="text-slate-400 text-sm">Current</span><span className="text-emerald-400 font-medium">{pattern.currentSupport.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-slate-400 text-sm">Baseline</span><span className="text-slate-300">{pattern.baselineSupport.toFixed(2)}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineEvent = ({ event, isLast }) => {
  const colors = { warning: { dot: 'bg-amber-500', text: 'text-amber-400' }, info: { dot: 'bg-blue-500', text: 'text-blue-400' }, success: { dot: 'bg-emerald-500', text: 'text-emerald-400' }, error: { dot: 'bg-red-500', text: 'text-red-400' } };
  const c = colors[event.type] || colors.info;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${c.dot} ${event.isActive ? 'animate-pulse' : ''}`} />
        {!isLast && <div className="w-0.5 h-full bg-slate-700 mt-2" />}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-semibold ${c.text}`}>{event.title}</span>
          {event.isActive && <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full animate-pulse">Active</span>}
        </div>
        <p className="text-slate-500 text-sm">{event.time}</p>
        <p className="text-slate-400 text-sm mt-1">{event.description}</p>
      </div>
    </div>
  );
};

const CustomTreemapContent = ({ x, y, width, height, name, value }) => {
  if (!width || !height || width < 50 || height < 30) return null;
  const displayName = name || '';
  const displayValue = value || 0;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#3b82f6" stroke="#1e293b" strokeWidth={2} rx={4} />
      <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="#fff" fontSize={11}>{displayName.length > 20 ? displayName.slice(0, 20) + '...' : displayName}</text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#94a3b8" fontSize={10}>{displayValue}%</text>
    </g>
  );
};

export default function UAD2DetailView() {
  const [selectedAlertId, setSelectedAlertId] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPatterns, setExpandedPatterns] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);

  const selectedAlert = alertData.alerts.find(a => a.id === selectedAlertId);
  const severityConfig = getSeverityConfig(selectedAlert.severity.value);
  const togglePattern = (id) => setExpandedPatterns(prev => ({ ...prev, [id]: !prev[id] }));

  const radarData = useMemo(() => {
    const avgConditionsPerPattern = selectedAlert.patterns.reduce((sum, p) => {
      return sum + p.conditions.split(' AND ').length;
    }, 0) / selectedAlert.patterns.length;

    return [
      { metric: 'Severity', value: selectedAlert.severity.value, fullMark: 100 },
      { metric: 'Credibility', value: selectedAlert.severity.credibility, fullMark: 100 },
      { metric: 'Patterns', value: Math.min(selectedAlert.patterns.length * 20, 100), fullMark: 100 },
      { metric: 'Avg Conditions', value: Math.min(avgConditionsPerPattern * 25, 100), fullMark: 100 },
    ];
  }, [selectedAlert]);

  const featureFrequency = useMemo(() => selectedAlert.commonalities.map(c => ({ name: `${c.field}=${c.value}`, value: parseInt(c.frequency) })), [selectedAlert]);
  const patternDistribution = useMemo(() => selectedAlert.patterns.map(p => ({ name: p.id, current: p.currentSupport, baseline: p.baselineSupport })), [selectedAlert]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${severityConfig.bgMuted} ${severityConfig.border} border`}>
                <AlertTriangle className={severityConfig.color} size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-white">Anomaly #{selectedAlert.id}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityConfig.bg} text-white`}>{severityConfig.label}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">Detected by Unsupervised Anomaly Detection System</p>
              </div>
            </div>
          </div>
          <div className={`mt-4 p-4 rounded-lg ${severityConfig.bgMuted} ${severityConfig.border} border`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={severityConfig.color} size={20} />
              <div>
                <p className="text-white font-medium mb-1">What's Happening?</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The system detected <strong className="text-white">{selectedAlert.patterns.length} anomalous patterns</strong> with <strong className="text-white">{selectedAlert.patterns.filter(p => p.baselineSupport === 0).length} new activity types</strong> (zero baseline).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={Activity} label="Overview" />
            <TabButton active={activeTab === 'ai-analysis'} onClick={() => setActiveTab('ai-analysis')} icon={Lightbulb} label="AI Analysis" highlight />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={Layers} label="Patterns" />
            <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={Clock} label="Timeline" />
            <TabButton active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')} icon={Shield} label="Recommendations" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Anomaly Severity" value={severityConfig.category} helpText="Severity level based on pattern analysis" icon={Activity} color={severityConfig.color}>
                <div className="mt-3"><ProgressBar value={selectedAlert.severity.value} color={severityConfig.bg} /><p className="text-slate-500 text-xs mt-2">Level: {selectedAlert.severity.value.toFixed(1)}%</p></div>
              </MetricCard>
              <MetricCard
                title="Time Since Detection"
                value={(() => {
                  const detected = new Date(selectedAlert.detectedAt);
                  const now = new Date();
                  const diffMs = now - detected;
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffDays = Math.floor(diffHours / 24);
                  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
                  return `${diffHours}h ${Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))}m`;
                })()}
                subtitle={`Detected ${formatTimestamp(selectedAlert.detectedAt)}`}
                helpText="Time elapsed since this anomaly was first detected"
                icon={Clock}
                color="text-emerald-400"
              />
              <MetricCard title="Pattern Count" value={selectedAlert.patterns.length} subtitle="Anomalous patterns" helpText="Total unique patterns detected" icon={Database} color="text-purple-400">
                <div className="mt-3"><ProgressBar value={selectedAlert.patterns.length * 10} color="bg-purple-500" /><p className="text-slate-500 text-xs mt-2">{selectedAlert.patterns.length} of 10 max</p></div>
              </MetricCard>
              <MetricCard title="Credibility" value={`${selectedAlert.severity.credibility.toFixed(1)}%`} subtitle="Detection confidence" helpText="Confidence in detection accuracy" icon={CheckCircle} color="text-cyan-400">
                <div className="mt-3"><ProgressBar value={selectedAlert.severity.credibility} color="bg-cyan-500" /></div>
              </MetricCard>
            </div>

            {/* Representative Pattern */}
            {(() => {
              const topComponent = selectedAlert.components.reduce((max, c) => c.core > max.core ? c : max, selectedAlert.components[0]);
              const representativePattern = selectedAlert.patterns.find(p => p.id === topComponent.id) || selectedAlert.patterns[0];
              return (
                <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
                  <CardHeader
                    title="Most Representative Pattern"
                    helpText={`This pattern best represents the overall anomaly distribution.\n\nIt was selected because it has the highest core score (${topComponent.core.toFixed(1)}%), indicating it is most central to the anomaly cluster.`}
                    icon={Target}
                    iconColor="text-amber-400"
                  />
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-sm">Pattern Query</span>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">{representativePattern.currentSupport.toFixed(1)}% Event Share</p>
                        <p className="text-slate-500 text-xs">Baseline: {representativePattern.baselineSupport.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="bg-slate-950 rounded-lg p-3 border border-slate-700">
                      <code className="text-emerald-400 font-mono text-sm break-all">{representativePattern.conditions}</code>
                    </div>
                  </div>

                  {/* Collapsible Explanation */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
                    >
                      {showExplanation ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <span>How to interpret this pattern</span>
                    </button>
                    {showExplanation && (
                      <div className="mt-3 p-4 bg-slate-900/30 rounded-lg border border-slate-700/30 text-sm text-slate-400 leading-relaxed space-y-3">
                        <p>
                          <strong className="text-slate-300">What is this?</strong> This system detects volumetric multi-dimensional anomalies by analyzing combinations of log field values (e.g., source IP + destination port + device type) across your environment.
                        </p>
                        <p>
                          <strong className="text-slate-300">Why does it matter?</strong> The pattern shown above represents a specific combination of conditions that has either <em>never been observed before</em> (zero baseline) or is occurring at a <em>significantly higher volume</em> than historical norms.
                        </p>
                        <p>
                          <strong className="text-slate-300">How to interpret:</strong> A baseline of 0% means this exact combination of field values has no historical precedent—it's a completely new behavioral signature. A non-zero baseline with high current event share indicates an abnormal spike in activity that exceeds expected thresholds.
                        </p>
                        <p>
                          <strong className="text-slate-300">Next steps:</strong> Investigate the specific field values in this pattern. Determine if this represents legitimate activity (e.g., new system deployment) or potentially malicious behavior requiring response.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <CardHeader title="Anomaly Characteristics" helpText={`This chart visualizes four key metrics:\n\n• Severity: The calculated severity score (0-100) based on pattern analysis\n\n• Credibility: Confidence level in the detection accuracy (0-100)\n\n• Patterns: Number of distinct pattern sets detected (${selectedAlert.patterns.length} patterns, normalized to 0-100)\n\n• Avg Conditions: Average number of key=value conditions per pattern (higher = more specific patterns)`} icon={Target} iconColor="text-cyan-400" />
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar name="Metrics" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* AI ANALYSIS TAB */}
        {activeTab === 'ai-analysis' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-5 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><Lightbulb className="text-purple-400" size={24} /></div>
                  <div><h2 className="text-xl font-semibold text-white">AI Analysis</h2><p className="text-slate-400 text-sm">Automated analysis powered by machine learning</p></div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm"><Clock size={14} /><span>Generated: Just now</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
                <CardHeader title={<span className="text-purple-400 font-semibold">AI Analysis Reasoning</span>} helpText="AI-generated context and insights" icon={Lightbulb} iconColor="text-purple-400" />
                <div className={`p-4 rounded-lg ${severityConfig.bgMuted} ${severityConfig.border} border`}>
                  <p className="text-slate-200 leading-relaxed text-base">{selectedAlert.explanation}</p>
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
                <CardHeader title={<span className={severityConfig.color}>Risk Assessment</span>} helpText="Severity classification and confidence" icon={Shield} iconColor={severityConfig.color} />
                <div className={`p-4 rounded-lg ${severityConfig.bgMuted} ${severityConfig.border} border text-center mb-4`}>
                  <p className={`text-2xl font-bold ${severityConfig.color} mb-2`}>{severityConfig.category}</p>
                  <p className="text-slate-400 text-sm mb-2">Severity Level</p>
                  <ProgressBar value={selectedAlert.severity.value} color={severityConfig.bg} />
                  <p className={`text-sm mt-2 ${severityConfig.color}`}>Level: {selectedAlert.severity.value.toFixed(1)}%</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center"><p className="text-2xl font-bold text-cyan-400">{selectedAlert.severity.credibility.toFixed(1)}%</p><p className="text-slate-500 text-sm">Credibility</p></div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center"><p className={`text-lg font-bold ${severityConfig.color}`}>{selectedAlert.responseRequired}</p><p className="text-slate-500 text-sm">Response Time</p></div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PATTERNS TAB */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* Summary Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
                <p className="text-3xl font-bold text-blue-400">{selectedAlert.patterns.length}</p>
                <p className="text-slate-500 text-sm">Total Patterns</p>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
                <p className="text-3xl font-bold text-red-400">{selectedAlert.patterns.filter(p => p.baselineSupport === 0).length}</p>
                <p className="text-slate-500 text-sm">New Activity</p>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-center items-start gap-1">
                  <p className="text-3xl font-bold text-emerald-400">{Math.max(...selectedAlert.patterns.map(p => p.currentSupport)).toFixed(0)}%</p>
                  <HelpTooltip text="The highest event share among all detected patterns. Note: A single event can match multiple patterns, so event shares may overlap and don't sum to 100%." />
                </div>
                <p className="text-slate-500 text-sm text-center">Max Event Share</p>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
                <p className="text-3xl font-bold text-purple-400">{selectedAlert.commonalities.length}</p>
                <p className="text-slate-500 text-sm">Commonalities</p>
              </div>
            </div>

            {/* Charts Row - Bar Chart + Top Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
                <CardHeader title="Pattern Support Comparison" helpText="Current vs baseline support for each pattern" icon={Activity} iconColor="text-blue-400" />
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patternDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Bar dataKey="current" name="Current" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="baseline" name="Baseline" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
                <CardHeader title="Top Features" helpText="Most frequently occurring features across patterns" icon={TrendingUp} iconColor="text-emerald-400" />
                <div className="space-y-4 h-72 overflow-y-auto pr-2">
                  {selectedAlert.commonalities.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 text-sm font-medium">{c.field}={c.value}</span>
                        <span className="text-emerald-400 text-sm font-semibold">{c.frequency}</span>
                      </div>
                      <ProgressBar value={parseInt(c.frequency)} color="bg-emerald-500" height="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Distribution TreeMap */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <CardHeader title="Feature Distribution" helpText="Visual representation of feature frequency" icon={GitBranch} iconColor="text-purple-400" />
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap data={featureFrequency} dataKey="value" nameKey="name" content={<CustomTreemapContent />} />
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expandable Patterns with Full Context */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-cyan-400" />
                  <h3 className="text-white font-semibold">Detected Patterns Detail</h3>
                </div>
                <span className="text-slate-500 text-sm">{selectedAlert.patterns.length} patterns detected</span>
              </div>

              <div className="space-y-3">
                {selectedAlert.patterns.map((p, i) => {
                  const isExpanded = expandedPatterns[`${p.id}-${i}`];
                  const ratio = p.baselineSupport === 0 ? '∞' : (p.currentSupport / p.baselineSupport).toFixed(1);
                  const conditions = p.conditions.split(' AND ').map(cond => {
                    const [key, value] = cond.split('=');
                    return { key: key.trim(), value: value?.replace(/'/g, '').trim() || '' };
                  });
                  const isNewActivity = p.baselineSupport === 0;

                  // Generate pattern-level analysis based on the combination of conditions
                  const getPatternAnalysis = () => {
                    const hasFirewall = conditions.some(c => c.key === 'device_type' && c.value === 'FW');
                    const hasPrintPort = conditions.some(c => c.key === 'dstport' && c.value === '9100');
                    const hasDestIP = conditions.some(c => c.key === 'dstipint');
                    const hasSourceIP = conditions.some(c => c.key === 'srcipint');
                    const hasAAA = conditions.some(c => c.key === 'device_type' && c.value === 'AAA');
                    const hasRadius = conditions.some(c => c.key === 'usr' && c.value === 'Radius');
                    const hasCisco = conditions.some(c => c.key === 'device_vendor' && (c.value === 'CiscoSystems' || c.value === 'CISCO'));
                    const hasPAN = conditions.some(c => c.key === 'device_vendor' && c.value === 'PAN');

                    // Print service attack pattern
                    if (hasPrintPort && hasDestIP) {
                      return {
                        title: 'Print Service Exploitation Pattern',
                        description: 'This pattern captures traffic to port 9100 (RAW print protocol) targeting a specific internal host. The combination of firewall logs with print service traffic to a single destination suggests potential lateral movement via print spooler vulnerabilities, data exfiltration through print services, or abuse of misconfigured print infrastructure.',
                        riskFactors: [
                          'Port 9100 is commonly exploited for PrintNightmare and similar vulnerabilities',
                          'Single destination IP indicates targeted activity rather than scanning',
                          'Firewall visibility confirms traffic is crossing network boundaries'
                        ],
                        recommendation: 'Immediately investigate the destination host for signs of compromise. Check print spooler service status and recent print jobs. Review for any data exfiltration indicators.'
                      };
                    }

                    // Authentication attack pattern
                    if (hasAAA || hasRadius) {
                      return {
                        title: 'Authentication Infrastructure Attack Pattern',
                        description: 'This pattern captures anomalous authentication-related activity involving AAA servers and/or RADIUS protocol. The surge in authentication events to specific infrastructure suggests potential credential stuffing, password spraying, brute force attempts, or compromised service accounts.',
                        riskFactors: [
                          'AAA/RADIUS infrastructure is critical for network access control',
                          'Volume spike indicates automated attack or compromised credentials',
                          'Service account involvement suggests potential privilege escalation path'
                        ],
                        recommendation: 'Review authentication logs for failed attempts. Check service account activity and recent changes. Implement rate limiting if not already in place.'
                      };
                    }

                    // Lateral movement pattern
                    if (hasFirewall && hasDestIP && hasSourceIP) {
                      return {
                        title: 'Internal Lateral Movement Pattern',
                        description: 'This pattern shows significant traffic between two internal hosts captured by firewall logs. The specific source-destination pair with zero historical baseline indicates new communication channels that could represent attacker lateral movement, compromised host beaconing, or unauthorized internal scanning.',
                        riskFactors: [
                          'New source-destination pair not seen in baseline',
                          'Firewall logs indicate policy-relevant traffic',
                          'Volume suggests sustained connection rather than incidental traffic'
                        ],
                        recommendation: 'Investigate both source and destination hosts. Check for malware indicators, unauthorized services, and recent configuration changes.'
                      };
                    }

                    // Firewall anomaly pattern
                    if (hasFirewall && (hasCisco || hasPAN)) {
                      return {
                        title: 'Firewall Traffic Anomaly Pattern',
                        description: 'This pattern captures unusual firewall activity from enterprise security infrastructure. The volume spike through monitored firewall devices indicates significant traffic pattern changes that warrant investigation for potential policy violations or security incidents.',
                        riskFactors: [
                          'Enterprise firewall visibility indicates policy-significant traffic',
                          'Vendor-specific detection helps correlate across security stack',
                          'Volume anomaly exceeds normal operational baseline'
                        ],
                        recommendation: 'Review firewall logs for the specific traffic. Check for policy changes or new applications. Correlate with other security tools.'
                      };
                    }

                    // Generic pattern
                    return {
                      title: 'Anomalous Activity Pattern',
                      description: 'This pattern represents a combination of conditions that has shown significant deviation from historical baseline. The specific field values together define a unique behavioral signature that requires investigation.',
                      riskFactors: [
                        'Pattern deviation from established baseline',
                        'Multiple correlated conditions increase confidence',
                        'Volume indicates sustained anomalous activity'
                      ],
                      recommendation: 'Investigate the specific hosts and services involved. Review logs for additional context and correlate with other security events.'
                    };
                  };

                  const patternAnalysis = getPatternAnalysis();

                  return (
                    <div key={i} className={`border rounded-xl overflow-hidden transition-all ${isNewActivity ? 'border-red-500/50 bg-red-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
                      {/* Header Row */}
                      <div className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors" onClick={() => togglePattern(`${p.id}-${i}`)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                            <div>
                              <div className="flex items-center gap-2">
                                <code className="text-cyan-400 font-mono font-bold">{p.id}</code>
                                {isNewActivity ? (
                                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-semibold flex items-center gap-1">
                                    <AlertTriangle size={12} /> NEW ACTIVITY
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full font-semibold">
                                    {ratio}x SPIKE
                                  </span>
                                )}
                                <span className="text-slate-500 text-sm ml-2">{patternAnalysis.title}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-emerald-400 font-bold text-lg">{p.currentSupport.toFixed(1)}%</p>
                              <p className="text-slate-500 text-xs">Event Share</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-400 font-semibold">{p.baselineSupport.toFixed(1)}%</p>
                              <p className="text-slate-500 text-xs">Baseline</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-slate-700/50 bg-slate-900/50">
                          {/* Raw Pattern Query */}
                          <div className="p-4 border-b border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <Database size={16} className="text-slate-400" />
                                Raw Pattern Query
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(p.conditions);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs rounded-lg transition-colors"
                              >
                                <Copy size={12} />
                                Copy Query
                              </button>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-700">
                              <code className="text-emerald-400 font-mono text-sm break-all">{p.conditions}</code>
                            </div>
                          </div>

                          {/* Pattern Analysis */}
                          <div className={`p-4 ${isNewActivity ? 'bg-red-500/5' : 'bg-orange-500/5'}`}>
                            <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isNewActivity ? 'text-red-400' : 'text-orange-400'}`}>
                              <AlertTriangle size={16} />
                              {patternAnalysis.title}
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {patternAnalysis.description}
                            </p>
                          </div>

                          {/* Pattern Conditions - Simple Display */}
                          <div className="p-4 border-t border-slate-700/50">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <Layers size={16} className="text-purple-400" />
                              Pattern Conditions
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {conditions.map((cond, j) => (
                                <div key={j} className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/30">
                                  <span className="text-slate-400 text-sm">{cond.key}</span>
                                  <span className="text-slate-500 text-sm mx-1">=</span>
                                  <code className="text-cyan-400 text-sm font-medium">{cond.value}</code>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Volume Analysis */}
                          <div className="p-4 border-t border-slate-700/50">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <TrendingUp size={16} className="text-emerald-400" />
                              Volume Analysis
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-slate-400">Current Event Share</span>
                                  <span className="text-emerald-400 font-bold">{p.currentSupport.toFixed(2)}%</span>
                                </div>
                                <ProgressBar value={p.currentSupport} color="bg-emerald-500" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-slate-400">Historical Baseline</span>
                                  <span className="text-slate-400 font-bold">{p.baselineSupport.toFixed(2)}%</span>
                                </div>
                                <ProgressBar value={p.baselineSupport > 0 ? (p.baselineSupport / p.currentSupport * 100) : 0} color="bg-slate-500" />
                              </div>
                            </div>
                            <p className="text-slate-500 text-sm mt-3">
                              {isNewActivity
                                ? '⚠️ Zero baseline means this exact pattern combination was never observed in the historical period. This is a completely new behavioral signature.'
                                : `📈 Volume increased by ${ratio}x compared to historical average. This exceeds the anomaly detection threshold.`
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
              <CardHeader title="Event Timeline" helpText="Chronological sequence of events including pattern detections" icon={Clock} iconColor="text-blue-400" />
              <div className="mt-4">
                {[
                  { title: 'Anomaly Detection Started', time: formatTimestamp(selectedAlert.detectedAt), description: 'Initial detection based on pattern emergence', type: 'warning' },
                  ...selectedAlert.patterns
                    .slice()
                    .sort((a, b) => new Date(a.firstSeen) - new Date(b.firstSeen))
                    .map((p) => ({
                      title: `Pattern ${p.id} Detected`,
                      time: formatTimestamp(p.firstSeen),
                      description: `${p.conditions} — Current: ${p.currentSupport.toFixed(1)}% | Baseline: ${p.baselineSupport.toFixed(1)}%${p.baselineSupport === 0 ? ' (New Activity)' : ` (${(p.currentSupport / p.baselineSupport).toFixed(1)}x spike)`}`,
                      type: p.baselineSupport === 0 ? 'error' : 'warning',
                    })),
                  { title: 'Analysis Period End', time: formatTimestamp(alertData.metadata.periodEnd), description: 'End of monitoring period for this analysis', type: 'success' },
                  { title: selectedAlert.responseRequired === 'IMMEDIATE' ? 'Still Active' : 'Monitoring', time: 'Current', description: selectedAlert.responseRequired === 'IMMEDIATE' ? 'Ongoing and being monitored' : 'Under observation', type: selectedAlert.responseRequired === 'IMMEDIATE' ? 'error' : 'info', isActive: selectedAlert.responseRequired === 'IMMEDIATE' },
                ].map((e, i, arr) => <TimelineEvent key={i} event={e} isLast={i === arr.length - 1} />)}
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 rounded-xl p-5 border-2 border-red-500/30">
              <CardHeader title="Immediate Actions Required" helpText="Complete within the first hour" icon={AlertTriangle} iconColor="text-red-400" />
              <div className="space-y-3">
                {selectedAlert.recommendedActions.immediate.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center"><span className="text-red-400 text-xs font-bold">{i + 1}</span></div>
                    <p className="text-slate-200">{a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-5 border-2 border-amber-500/30">
              <CardHeader title="Mid-term Mitigation" helpText="Actions for next 24 hours" icon={Clock} iconColor="text-amber-400" />
              <div className="space-y-3">
                {selectedAlert.recommendedActions.midTerm.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center"><span className="text-amber-400 text-xs font-bold">{i + 1}</span></div>
                    <p className="text-slate-200">{a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-5 border-2 border-blue-500/30">
              <CardHeader title="Long-term Improvements" helpText="Strategic improvements" icon={TrendingUp} iconColor="text-blue-400" />
              <div className="space-y-3">
                {selectedAlert.recommendedActions.longTerm.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-xs font-bold">{i + 1}</span></div>
                    <p className="text-slate-200">{a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
