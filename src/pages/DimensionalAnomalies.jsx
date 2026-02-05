import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, AlertTriangle, Layers, Hash, Clock, Globe, Database, Terminal, Activity, X, Copy, Lightbulb, Target, Zap, Filter, BookOpen, Eye, BarChart3, Shield, HelpCircle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, AlertCircle, GitBranch, PieChart, Sigma, Download } from 'lucide-react';

const ANOMALY_CATEGORIES = {
  DISTRIBUTION: { name: 'Distribution', icon: BarChart3, color: '#a78bfa', description: 'Statistical distribution anomalies' },
  CARDINALITY: { name: 'Cardinality', icon: Database, color: '#60a5fa', description: 'Unique value count anomalies' },
  RATE: { name: 'Rate', icon: Activity, color: '#f472b6', description: 'Event rate anomalies' },
  NULLITY: { name: 'Nullity', icon: XCircle, color: '#fbbf24', description: 'Null/empty value anomalies' },
  PATTERN: { name: 'Pattern', icon: Terminal, color: '#22d3ee', description: 'Structural pattern anomalies' }
};

// Alert type mapping
const ALERT_TYPES = {
  HIGH: { label: 'Actionable, Critical Anomaly', color: '#f87171', bg: 'rgba(127, 29, 29, 0.5)', border: 'rgba(185, 28, 28, 0.5)' },
  MEDIUM: { label: 'Actionable, Non-Critical Anomaly', color: '#fbbf24', bg: 'rgba(120, 53, 15, 0.5)', border: 'rgba(180, 83, 9, 0.5)' },
  LOW: { label: 'Non-Actionable, Informational Anomaly', color: '#60a5fa', bg: 'rgba(30, 58, 138, 0.4)', border: 'rgba(59, 130, 246, 0.5)' },
  NORMAL: { label: 'Normal', color: '#9ca3af', bg: '#1f2937', border: '#374151' }
};

const generateValueAnomalies = () => [
  { id: 'login-fail', field: 'user.login_status', value: 'fail', displayKey: 'user.login_status:fail', anomaly: 'HIGH', category: 'authentication', change: '+125%', changeDirection: 'up', baseline: '8%', current: '18%', eventCount: '432K', detectedAt: '14 min ago', message: 'Login failures spiking significantly above baseline', checks: [{ name: 'Frequency Spike', status: 'CRITICAL', detail: 'Value frequency increased from 8% → 18% of field events', category: 'RATE' }, { name: 'Velocity Change', status: 'WARNING', detail: 'Rate of change: +2.3%/min (threshold: 0.5%/min)', category: 'RATE' }] },
  { id: 'geo-cn', field: 'geo.country_code', value: 'CN', displayKey: 'geo.country_code:CN', anomaly: 'HIGH', category: 'geo', change: '+344%', changeDirection: 'up', baseline: '1.8%', current: '8%', eventCount: '648K', detectedAt: '31 min ago', message: 'Traffic from China increased dramatically', checks: [{ name: 'Frequency Spike', status: 'CRITICAL', detail: 'Value frequency increased from 1.8% → 8% of field events', category: 'RATE' }] },
  { id: 'geo-ru', field: 'geo.country_code', value: 'RU', displayKey: 'geo.country_code:RU', anomaly: 'HIGH', category: 'geo', change: '+525%', changeDirection: 'up', baseline: '0.8%', current: '5%', eventCount: '405K', detectedAt: '28 min ago', message: 'Traffic from Russia increased dramatically', checks: [{ name: 'Frequency Spike', status: 'CRITICAL', detail: 'Value frequency increased from 0.8% → 5% of field events', category: 'RATE' }] },
  { id: 'http-500', field: 'http.status_code', value: '500', displayKey: 'http.status_code:500', anomaly: 'MEDIUM', category: 'http', change: '+300%', changeDirection: 'up', baseline: '2%', current: '8%', eventCount: '984K', detectedAt: '42 min ago', message: 'Internal server errors spiking', checks: [{ name: 'Frequency Spike', status: 'WARNING', detail: 'Value frequency increased from 2% → 8% of field events', category: 'RATE' }] },
  { id: 'error-connrefused', field: 'error.message', value: 'Connection refused', displayKey: 'error.message:Connection refused', anomaly: 'HIGH', category: 'errors', change: '+167%', changeDirection: 'up', baseline: '15%', current: '40%', eventCount: '440K', detectedAt: '16 min ago', message: 'Connection refused now dominant error type', checks: [{ name: 'Frequency Spike', status: 'CRITICAL', detail: 'Value frequency increased from 15% → 40% of field events', category: 'RATE' }, { name: 'Rank Change', status: 'WARNING', detail: 'Moved from #3 to #1 most frequent error', category: 'DISTRIBUTION' }, { name: 'Cardinality Shift', status: 'INFO', detail: 'Error cardinality increased by 8% in last hour', category: 'CARDINALITY' }] }
];

const generateFieldData = () => [
  {
    name: 'user.login_status', type: 'enum', cardinality: '5', signal: 95, anomaly: 'HIGH',
    description: 'Authentication result for user login attempts',
    examples: ['success', 'fail', 'timeout', 'locked', 'mfa_required'],
    distribution: { success: 67, fail: 18, timeout: 8, locked: 4, mfa_required: 3 },
    trend: 'up', lastSeen: '2s ago', eventCount: '2.4M', category: 'authentication',
    insight: 'High failure rate detected - 18% of logins failing. Consider investigating brute force attempts.',
    decision: 'Create alert for login failure spikes above 10%',
    anomalyChecks: [
      { category: 'DISTRIBUTION', name: 'Value Distribution Shift', status: 'CRITICAL', message: '"fail" value increased from 8% → 18% baseline', detail: 'Jensen-Shannon divergence: 0.34 (threshold: 0.15)', baseline: { fail: 8, success: 82, timeout: 5, locked: 3, mfa_required: 2 }, current: { fail: 18, success: 67, timeout: 8, locked: 4, mfa_required: 3 }, detectedAt: '14 min ago', sparkline: [8, 9, 8, 10, 12, 14, 16, 18], thresholdLine: 10 },
      { category: 'RATE', name: 'Event Rate Spike', status: 'WARNING', message: 'Login attempts up 156% from 24h baseline', detail: 'Current: 4,200 events/min | Baseline: 1,640 events/min | σ: +3.2', baseline: 1640, current: 4200, detectedAt: '23 min ago', sparkline: [1600, 1650, 1700, 2100, 2800, 3400, 3900, 4200], thresholdLine: 2500 },
      { category: 'CARDINALITY', name: 'Value Count Stable', status: 'PASS', message: 'Unique value count unchanged at 5', detail: 'No new login status values detected', detectedAt: null, sparkline: null, thresholdLine: null }
    ],
    anomalyTimeline: [{ time: '23 min ago', event: 'Rate spike detected', severity: 'WARNING' }, { time: '14 min ago', event: 'Distribution shift confirmed', severity: 'CRITICAL' }, { time: '8 min ago', event: 'Anomaly escalated to HIGH', severity: 'CRITICAL' }],
    anomalyDetails: {
      statistical: { stdDeviation: { value: 3.2, threshold: 2.0, status: 'critical' }, meanShift: { value: '+125%', baseline: '8%', status: 'critical' }, medianShift: { value: '+89%', baseline: '6%', status: 'warning' }, p95Breach: { value: '18%', threshold: '12%', status: 'critical' }, p99Breach: { value: '22%', threshold: '15%', status: 'critical' }, ksTest: { value: 0.34, threshold: 0.15, status: 'critical' }, jsDivergence: { value: 0.28, threshold: 0.10, status: 'critical' }, psi: { value: 0.42, threshold: 0.25, status: 'critical' } },
      cardinality: { explosion: { detected: false, change: 'N/A', status: 'normal' }, collapse: { detected: false, change: 'N/A', status: 'normal' }, drift: { detected: false, rate: 'N/A', status: 'normal' } },
      rateVolume: { eventRateSpike: { value: '+156%', baseline: '1,640/min', current: '4,200/min', status: 'critical' }, eventRateDrop: { detected: false, status: 'normal' }, seasonalityViolation: { detected: true, status: 'warning' } }
    }
  },
  {
    name: 'geo.country_code', type: 'enum', cardinality: '195', signal: 68, anomaly: 'HIGH',
    description: 'ISO 3166-1 alpha-2 country code from GeoIP lookup',
    examples: ['US', 'GB', 'JP', 'DE', 'FR', 'CN', 'RU'],
    distribution: { 'US': 45, 'GB': 15, 'DE': 12, 'JP': 10, 'CN': 8, 'RU': 5, 'other': 5 },
    trend: 'up', lastSeen: '1s ago', eventCount: '8.1M', category: 'geo',
    insight: 'Unusual spike in traffic from CN and RU (+340% from baseline).',
    decision: 'Implement geo-blocking or enhanced monitoring for flagged regions',
    anomalyChecks: [
      { category: 'DISTRIBUTION', name: 'Geographic Distribution Shift', status: 'CRITICAL', message: 'CN traffic increased from 1.8% → 8% of total', detail: 'PSI score: 0.42 (threshold: 0.20) indicating severe distribution shift', baseline: { 'US': 52, 'GB': 18, 'DE': 14, 'JP': 12, 'CN': 1.8, 'RU': 0.8, 'other': 1.4 }, current: { 'US': 45, 'GB': 15, 'DE': 12, 'JP': 10, 'CN': 8, 'RU': 5, 'other': 5 }, detectedAt: '31 min ago', sparkline: [1.8, 2.1, 2.8, 4.2, 5.5, 6.8, 7.4, 8.0], thresholdLine: 3 },
      { category: 'RATE', name: 'Request Velocity by Region', status: 'WARNING', message: 'CN request rate: 2,400/min (baseline: 540/min)', detail: 'Potential coordinated activity detected', baseline: 540, current: 2400, detectedAt: '31 min ago', sparkline: [540, 620, 850, 1200, 1600, 1900, 2200, 2400], thresholdLine: 1000 },
      { category: 'CARDINALITY', name: 'New Country Codes', status: 'INFO', message: '2 new country codes detected this week', detail: 'KP (North Korea) and XX (Unknown) first observed', detectedAt: '45 min ago', sparkline: null, thresholdLine: null }
    ],
    anomalyTimeline: [{ time: '31 min ago', event: 'CN distribution shift detected', severity: 'CRITICAL' }, { time: '28 min ago', event: 'RU traffic anomaly confirmed', severity: 'CRITICAL' }],
    anomalyDetails: {
      statistical: { stdDeviation: { value: 4.8, threshold: 2.0, status: 'critical' }, meanShift: { value: '+344%', baseline: '1.8%', status: 'critical' }, medianShift: { value: '+280%', baseline: '1.2%', status: 'critical' }, p95Breach: { value: '8%', threshold: '4%', status: 'critical' }, p99Breach: { value: '12%', threshold: '6%', status: 'critical' }, ksTest: { value: 0.42, threshold: 0.15, status: 'critical' }, jsDivergence: { value: 0.38, threshold: 0.10, status: 'critical' }, psi: { value: 0.52, threshold: 0.25, status: 'critical' } },
      cardinality: { explosion: { detected: true, change: '+2 new', status: 'warning' }, collapse: { detected: false, change: 'N/A', status: 'normal' }, drift: { detected: false, rate: 'N/A', status: 'normal' } },
      rateVolume: { eventRateSpike: { value: '+344%', baseline: '540/min', current: '2,400/min', status: 'critical' }, eventRateDrop: { detected: false, status: 'normal' }, seasonalityViolation: { detected: true, status: 'critical' } }
    }
  },
  {
    name: 'error.message', type: 'string', cardinality: '12.4K', signal: 92, anomaly: 'HIGH',
    description: 'Error message text from application logs',
    examples: ['Connection refused', 'Timeout exceeded', 'Authentication failed', 'Out of memory'],
    distribution: { 'Connection refused': 40, 'Timeout': 30, 'Auth failed': 20, 'OOM': 10 },
    trend: 'up', lastSeen: '3s ago', eventCount: '1.1M', category: 'errors',
    insight: 'Error volume up 156% in last hour. "Connection refused" is top error.',
    decision: 'Investigate downstream service connectivity issues',
    anomalyChecks: [
      { category: 'RATE', name: 'Error Volume Spike', status: 'CRITICAL', message: 'Error rate at 4,200/min (baseline: 1,640/min)', detail: '+156% increase | σ deviation: +4.2 | Threshold: σ > 3', baseline: 1640, current: 4200, detectedAt: '18 min ago', sparkline: [1640, 1720, 2100, 2600, 3100, 3500, 3900, 4200], thresholdLine: 2500 },
      { category: 'DISTRIBUTION', name: 'Error Type Distribution', status: 'WARNING', message: '"Connection refused" now 40% of errors (was 15%)', detail: 'Suggests downstream service outage or network partition', baseline: { 'Connection refused': 15, 'Timeout': 25, 'Auth failed': 35, 'OOM': 25 }, current: { 'Connection refused': 40, 'Timeout': 30, 'Auth failed': 20, 'OOM': 10 }, detectedAt: '16 min ago', sparkline: [15, 18, 22, 28, 32, 36, 38, 40], thresholdLine: 25 },
      { category: 'CARDINALITY', name: 'Error Template Explosion', status: 'WARNING', message: 'Unique error patterns increased 8% in last hour', detail: '12,400 unique patterns (was 11,480) | 3 new error templates detected', baseline: 11480, current: 12400, detectedAt: '22 min ago', sparkline: [11480, 11550, 11700, 11900, 12050, 12200, 12320, 12400], thresholdLine: 12000 }
    ],
    anomalyTimeline: [{ time: '18 min ago', event: 'Error volume spike triggered', severity: 'CRITICAL' }, { time: '16 min ago', event: 'Distribution shift detected', severity: 'WARNING' }],
    anomalyDetails: {
      statistical: { stdDeviation: { value: 4.2, threshold: 2.0, status: 'critical' }, meanShift: { value: '+156%', baseline: '1,640/min', status: 'critical' }, medianShift: { value: '+142%', baseline: '1,580/min', status: 'critical' }, p95Breach: { value: '4,800/min', threshold: '2,800/min', status: 'critical' }, p99Breach: { value: '5,200/min', threshold: '3,200/min', status: 'critical' }, ksTest: { value: 0.38, threshold: 0.15, status: 'critical' }, jsDivergence: { value: 0.32, threshold: 0.10, status: 'critical' }, psi: { value: 0.48, threshold: 0.25, status: 'critical' } },
      cardinality: { explosion: { detected: true, change: '+8%', status: 'warning' }, collapse: { detected: false, change: 'N/A', status: 'normal' }, drift: { detected: true, rate: '+920/hour', status: 'warning' } },
      rateVolume: { eventRateSpike: { value: '+156%', baseline: '1,640/min', current: '4,200/min', status: 'critical' }, eventRateDrop: { detected: false, status: 'normal' }, seasonalityViolation: { detected: true, status: 'critical' } }
    }
  },
  {
    name: 'http.status_code', type: 'int', cardinality: '48', signal: 82, anomaly: 'MEDIUM',
    description: 'HTTP response status code from web servers',
    examples: ['200', '404', '500', '403', '502'],
    distribution: { '200': 72, '404': 12, '500': 8, '403': 5, '502': 3 },
    trend: 'up', lastSeen: '1s ago', eventCount: '12.3M', category: 'http',
    insight: '500 errors trending up 23% - backend service degradation likely.',
    decision: 'Set up SLO monitoring for 5xx error rate < 1%',
    anomalyChecks: [
      { category: 'DISTRIBUTION', name: '5xx Error Rate', status: 'WARNING', message: '5xx errors at 11% (baseline: 3%)', detail: 'Status 500: 8% | Status 502: 3% | Combined exceeds 5% threshold', baseline: { '200': 85, '404': 8, '500': 2, '403': 4, '502': 1 }, current: { '200': 72, '404': 12, '500': 8, '403': 5, '502': 3 }, detectedAt: '42 min ago', sparkline: [3, 3, 4, 5, 6, 8, 10, 11], thresholdLine: 5 },
      { category: 'RATE', name: 'Request Rate Increase', status: 'INFO', message: 'Request volume up 45% from baseline', detail: 'May be contributing to error increase', baseline: 8500, current: 12325, detectedAt: '1h ago', sparkline: null, thresholdLine: null },
      { category: 'CARDINALITY', name: 'New Status Codes', status: 'INFO', message: '1 new status code detected', detail: 'Status 529 (Site Overloaded) first observed', detectedAt: '38 min ago', sparkline: null, thresholdLine: null }
    ],
    anomalyTimeline: [{ time: '42 min ago', event: '5xx error threshold breached', severity: 'WARNING' }],
    anomalyDetails: {
      statistical: { stdDeviation: { value: 2.1, threshold: 2.0, status: 'warning' }, meanShift: { value: '+267%', baseline: '3%', status: 'warning' }, medianShift: { value: '+180%', baseline: '2.5%', status: 'warning' }, p95Breach: { value: '11%', threshold: '8%', status: 'warning' }, p99Breach: { value: '14%', threshold: '10%', status: 'warning' }, ksTest: { value: 0.18, threshold: 0.15, status: 'warning' }, jsDivergence: { value: 0.14, threshold: 0.10, status: 'warning' }, psi: { value: 0.22, threshold: 0.25, status: 'normal' } },
      cardinality: { explosion: { detected: true, change: '+1 new', status: 'normal' }, collapse: { detected: false, change: 'N/A', status: 'normal' }, drift: { detected: false, rate: 'N/A', status: 'normal' } },
      rateVolume: { eventRateSpike: { value: '+45%', baseline: '8,500/min', current: '12,325/min', status: 'warning' }, eventRateDrop: { detected: false, status: 'normal' }, seasonalityViolation: { detected: false, status: 'normal' } }
    }
  },
  {
    name: 'network.src_ip', type: 'ipv4', cardinality: '2.4M', signal: 88, anomaly: 'LOW',
    description: 'Source IP address of incoming network connection',
    examples: ['10.0.1.34', '192.168.1.1', '172.16.0.5'],
    distribution: { '10.x.x.x': 45, '192.168.x.x': 30, '172.16.x.x': 20, 'external': 5 },
    trend: 'stable', lastSeen: '1s ago', eventCount: '8.1M', category: 'network',
    insight: 'High cardinality field - 2.4M unique IPs. Useful for threat hunting.',
    decision: 'Good candidate for IP reputation enrichment',
    anomalyChecks: [
      { category: 'CARDINALITY', name: 'Cardinality Growth', status: 'PASS', message: 'Unique value count within expected range', detail: 'Growth rate: +0.8%/day | Expected: +0.5-1.2%/day', detectedAt: null, sparkline: null, thresholdLine: null },
      { category: 'DISTRIBUTION', name: 'Subnet Distribution', status: 'PASS', message: 'IP class distribution stable', detail: 'Chi-squared p-value: 0.72 (threshold: 0.05)', detectedAt: null, sparkline: null, thresholdLine: null },
      { category: 'RATE', name: 'Connection Rate', status: 'PASS', message: 'Connection rate within normal bounds', detail: 'Current: 13,670/min | Baseline: 13,400/min | +2%', detectedAt: null, sparkline: null, thresholdLine: null }
    ],
    anomalyTimeline: [],
    anomalyDetails: {
      statistical: { stdDeviation: { value: 0.4, threshold: 2.0, status: 'normal' }, meanShift: { value: '+0.8%', baseline: '2.38M', status: 'normal' }, medianShift: { value: '+0.6%', baseline: '2.37M', status: 'normal' }, p95Breach: { value: 'N/A', threshold: 'N/A', status: 'normal' }, p99Breach: { value: 'N/A', threshold: 'N/A', status: 'normal' }, ksTest: { value: 0.03, threshold: 0.15, status: 'normal' }, jsDivergence: { value: 0.02, threshold: 0.10, status: 'normal' }, psi: { value: 0.04, threshold: 0.25, status: 'normal' } },
      cardinality: { explosion: { detected: false, change: 'N/A', status: 'normal' }, collapse: { detected: false, change: 'N/A', status: 'normal' }, drift: { detected: false, rate: '+0.8%/day', status: 'normal' } },
      rateVolume: { eventRateSpike: { value: '+2%', baseline: '13,400/min', current: '13,670/min', status: 'normal' }, eventRateDrop: { detected: false, status: 'normal' }, seasonalityViolation: { detected: false, status: 'normal' } }
    }
  }
];

// Helper Functions
const getTypeIcon = (type) => {
  switch(type) {
    case 'enum': return <Layers className="w-4 h-4" />;
    case 'ipv4': return <Globe className="w-4 h-4" />;
    case 'int': case 'float': return <Hash className="w-4 h-4" />;
    case 'datetime': return <Clock className="w-4 h-4" />;
    case 'string': return <Terminal className="w-4 h-4" />;
    default: return <Database className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'CRITICAL': return { bg: 'rgba(127, 29, 29, 0.4)', border: 'rgba(220, 38, 38, 0.6)', text: '#f87171', icon: XCircle };
    case 'WARNING': return { bg: 'rgba(120, 53, 15, 0.4)', border: 'rgba(217, 119, 6, 0.6)', text: '#fbbf24', icon: AlertTriangle };
    case 'INFO': return { bg: 'rgba(30, 58, 138, 0.3)', border: 'rgba(59, 130, 246, 0.5)', text: '#60a5fa', icon: Info };
    case 'PASS': return { bg: 'rgba(20, 83, 45, 0.3)', border: 'rgba(34, 197, 94, 0.5)', text: '#4ade80', icon: CheckCircle };
    default: return { bg: '#1f2937', border: '#374151', text: '#9ca3af', icon: HelpCircle };
  }
};

const getAlertStyle = (anomaly) => ALERT_TYPES[anomaly] || ALERT_TYPES.NORMAL;

// Export Functions
const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0] || {}).filter(k => typeof data[0][k] !== 'object');
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export Button Component
const ExportButton = ({ onExportCSV, onExportJSON, label = 'Export' }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowMenu(!showMenu)}
        style={{ padding: '8px 14px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', fontSize: '13px', color: '#d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#374151'; }}
        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#1f2937'; }}>
        <Download style={{ width: '14px', height: '14px' }} />{label}
      </button>
      {showMenu && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', overflow: 'hidden', zIndex: 50, minWidth: '120px' }}>
          <button onClick={() => { onExportCSV(); setShowMenu(false); }} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', color: '#d1d5db', cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#374151'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>Export CSV</button>
          <button onClick={() => { onExportJSON(); setShowMenu(false); }} style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: 'none', color: '#d1d5db', cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#374151'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>Export JSON</button>
        </div>
      )}
    </div>
  );
};

// Help Tooltip Component
const HelpTooltip = ({ children, title, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}
        style={{ background: 'none', border: 'none', cursor: 'help', padding: '2px', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
        <HelpCircle style={{ width: '14px', height: '14px' }} />
      </button>
      {isVisible && (
        <div style={{ position: 'absolute', [position === 'top' ? 'bottom' : 'top']: '100%', left: position === 'right' ? '100%' : '50%', transform: position === 'right' ? 'translateX(8px)' : 'translateX(-50%)', marginBottom: position === 'top' ? '8px' : '0', marginTop: position === 'top' ? '0' : '8px', padding: '12px 14px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '13px', color: '#d1d5db', width: '280px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.4)', lineHeight: 1.5 }}>
          {title && <div style={{ fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{title}</div>}
          {children}
        </div>
      )}
    </div>
  );
};

// Mini Sparkline
const MiniSparkline = ({ data, threshold, color = '#22c55e', width = 80, height = 24 }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data, threshold || Infinity);
  const max = Math.max(...data, threshold || -Infinity);
  const range = max - min || 1;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * width},${height - ((val - min) / range) * height}`).join(' ');
  const thresholdY = threshold ? height - ((threshold - min) / range) * height : null;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {threshold && thresholdY && <line x1="0" y1={thresholdY} x2={width} y2={thresholdY} stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />}
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2.5" fill={color} />
    </svg>
  );
};

// Anomaly Check Card
const AnomalyCheckCard = ({ check, isExpanded, onToggle }) => {
  const statusStyle = getStatusColor(check.status);
  const StatusIcon = statusStyle.icon;
  const CategoryIcon = ANOMALY_CATEGORIES[check.category]?.icon || Database;
  const categoryColor = ANOMALY_CATEGORIES[check.category]?.color || '#9ca3af';

  return (
    <div style={{ backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <StatusIcon style={{ width: '20px', height: '20px', color: statusStyle.text, marginTop: '2px', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: categoryColor, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <CategoryIcon style={{ width: '12px', height: '12px' }} />
              {ANOMALY_CATEGORIES[check.category]?.name}
            </span>
            <span style={{ fontSize: '12px', padding: '3px 10px', backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, borderRadius: '4px', color: statusStyle.text, fontWeight: 600 }}>{check.status}</span>
          </div>
          <div style={{ fontSize: '15px', color: '#e5e7eb', fontWeight: 500, marginBottom: '4px' }}>{check.name}</div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>{check.message}</div>
        </div>
        {check.sparkline && <MiniSparkline data={check.sparkline} threshold={check.thresholdLine} color={statusStyle.text} />}
        <div style={{ flexShrink: 0 }}>{isExpanded ? <ChevronUp style={{ width: '18px', height: '18px', color: '#6b7280' }} /> : <ChevronDown style={{ width: '18px', height: '18px', color: '#6b7280' }} />}</div>
      </div>
      {isExpanded && (
        <div style={{ padding: '16px 18px', paddingTop: '0', borderTop: `1px solid ${statusStyle.border}`, backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '14px', color: '#d1d5db', fontFamily: 'ui-monospace, monospace', padding: '14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginTop: '14px', lineHeight: 1.6 }}>
            <div style={{ color: '#6b7280', marginBottom: '6px' }}>// Technical Details</div>
            {check.detail}
          </div>
          {check.detectedAt && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock style={{ width: '12px', height: '12px' }} />First detected {check.detectedAt}</div>}
          {(check.baseline !== undefined && check.current !== undefined && typeof check.baseline === 'object') && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distribution Comparison</div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#6b7280', marginBottom: '8px' }}>Baseline</div>
                  {Object.entries(check.baseline).slice(0, 4).map(([key, val]) => <div key={key} style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', marginBottom: '4px' }}><span>{key}</span><span>{val}%</span></div>)}
                </div>
                <div style={{ width: '1px', backgroundColor: '#374151' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#6b7280', marginBottom: '8px' }}>Current</div>
                  {Object.entries(check.current).slice(0, 4).map(([key, val]) => {
                    const baseVal = check.baseline[key] || 0;
                    const diff = val - baseVal;
                    return <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#9ca3af' }}>{key}</span><span style={{ color: diff > 2 ? '#f87171' : diff < -2 ? '#4ade80' : '#9ca3af' }}>{val}%{diff !== 0 && <span style={{ marginLeft: '6px', fontSize: '12px' }}>({diff > 0 ? '+' : ''}{diff.toFixed(1)})</span>}</span></div>;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Anomaly Detail Section
const AnomalyDetailSection = ({ title, icon: Icon, iconColor, children, helpText, onExport }) => (
  <div style={{ marginBottom: '28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #1f2937' }}>
      <Icon style={{ width: '22px', height: '22px', color: iconColor }} />
      <span style={{ fontSize: '16px', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      <HelpTooltip title={title}>{helpText}</HelpTooltip>
      {onExport && <div style={{ marginLeft: 'auto' }}><ExportButton onExportCSV={() => onExport('csv')} onExportJSON={() => onExport('json')} label="Export" /></div>}
    </div>
    {children}
  </div>
);

// Metric Row
const MetricRow = ({ label, value, threshold, status, helpText, showBar = false, barValue = 0 }) => {
  const statusColors = {
    critical: { text: '#f87171', bg: 'rgba(127, 29, 29, 0.3)', border: 'rgba(185, 28, 28, 0.4)' },
    warning: { text: '#fbbf24', bg: 'rgba(120, 53, 15, 0.3)', border: 'rgba(180, 83, 9, 0.4)' },
    normal: { text: '#4ade80', bg: 'rgba(20, 83, 45, 0.2)', border: 'rgba(34, 197, 94, 0.3)' }
  };
  const colors = statusColors[status] || statusColors.normal;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '8px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <span style={{ fontSize: '16px', color: '#d1d5db' }}>{label}</span>
        <HelpTooltip position="right">{helpText}</HelpTooltip>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showBar && <div style={{ width: '100px', height: '8px', backgroundColor: '#1f2937', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(barValue * 100, 100)}%`, backgroundColor: colors.text, borderRadius: '4px' }} /></div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text, fontFamily: 'ui-monospace, monospace' }}>{value}</span>
          {threshold && threshold !== 'N/A' && <span style={{ fontSize: '14px', color: '#6b7280' }}>/ {threshold}</span>}
        </div>
      </div>
    </div>
  );
};

// Main Component
const DimensionalAnomalies = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnomaly, setFilterAnomaly] = useState('all');
  const [sortBy, setSortBy] = useState('anomaly');
  const [copiedText, setCopiedText] = useState(null);
  const [expandedChecks, setExpandedChecks] = useState({});
  const [anomalyTab, setAnomalyTab] = useState('checks');
  const [viewMode, setViewMode] = useState('fields');

  const fields = useMemo(generateFieldData, []);
  const valueAnomalies = useMemo(generateValueAnomalies, []);

  const filteredFields = fields
    .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(f => filterAnomaly === 'all' || f.anomaly === filterAnomaly)
    .sort((a, b) => {
      if (sortBy === 'anomaly') { const order = { HIGH: 0, MEDIUM: 1, LOW: 2, NORMAL: 3 }; return order[a.anomaly] - order[b.anomaly]; }
      return a.name.localeCompare(b.name);
    });

  const filteredValueAnomalies = valueAnomalies
    .filter(v => v.displayKey.toLowerCase().includes(searchTerm.toLowerCase()) || v.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(v => filterAnomaly === 'all' || v.anomaly === filterAnomaly)
    .sort((a, b) => {
      if (sortBy === 'anomaly') { const order = { HIGH: 0, MEDIUM: 1, LOW: 2, NORMAL: 3 }; return order[a.anomaly] - order[b.anomaly]; }
      return a.displayKey.localeCompare(b.displayKey);
    });

  const anomalyCount = fields.filter(f => f.anomaly === 'HIGH').length;
  const valueAnomalyCount = valueAnomalies.filter(v => v.anomaly === 'HIGH').length;
  const selectedFieldData = fields.find(f => f.name === selectedField);
  const selectedValueData = valueAnomalies.find(v => v.id === selectedValue);

  const handleCopy = (text) => { navigator.clipboard.writeText(text); setCopiedText(text); setTimeout(() => setCopiedText(null), 2000); };
  const toggleCheckExpanded = (checkName) => { setExpandedChecks(prev => ({ ...prev, [checkName]: !prev[checkName] })); };

  const anomalySummary = selectedFieldData?.anomalyChecks ? {
    critical: selectedFieldData.anomalyChecks.filter(c => c.status === 'CRITICAL').length,
    warning: selectedFieldData.anomalyChecks.filter(c => c.status === 'WARNING').length,
    info: selectedFieldData.anomalyChecks.filter(c => c.status === 'INFO').length,
    pass: selectedFieldData.anomalyChecks.filter(c => c.status === 'PASS').length,
  } : null;

  // Export handlers
  const handleExportFields = (format) => {
    const data = filteredFields.map(f => ({ name: f.name, type: f.type, cardinality: f.cardinality, anomaly: f.anomaly, category: f.category, eventCount: f.eventCount }));
    format === 'csv' ? exportToCSV(data, 'dimension-anomalies') : exportToJSON(data, 'dimension-anomalies');
  };

  const handleExportValues = (format) => {
    const data = filteredValueAnomalies.map(v => ({ field: v.field, value: v.value, anomaly: v.anomaly, change: v.change, baseline: v.baseline, current: v.current, category: v.category }));
    format === 'csv' ? exportToCSV(data, 'value-anomalies') : exportToJSON(data, 'value-anomalies');
  };

  const handleExportChecks = (format) => {
    if (!selectedFieldData?.anomalyChecks) return;
    const data = selectedFieldData.anomalyChecks.map(c => ({ name: c.name, category: c.category, status: c.status, message: c.message, detail: c.detail, detectedAt: c.detectedAt }));
    format === 'csv' ? exportToCSV(data, `${selectedFieldData.name}-checks`) : exportToJSON(data, `${selectedFieldData.name}-checks`);
  };

  const handleExportAnalysis = (format) => {
    if (!selectedFieldData?.anomalyDetails) return;
    format === 'csv' ? exportToJSON(selectedFieldData.anomalyDetails, `${selectedFieldData.name}-analysis`) : exportToJSON(selectedFieldData.anomalyDetails, `${selectedFieldData.name}-analysis`);
  };

  const handleExportTimeline = (format) => {
    if (!selectedFieldData?.anomalyTimeline) return;
    const data = selectedFieldData.anomalyTimeline;
    format === 'csv' ? exportToCSV(data, `${selectedFieldData.name}-timeline`) : exportToJSON(data, `${selectedFieldData.name}-timeline`);
  };

  const handleExportDetails = (format) => {
    if (!selectedFieldData) return;
    const data = { name: selectedFieldData.name, type: selectedFieldData.type, cardinality: selectedFieldData.cardinality, description: selectedFieldData.description, insight: selectedFieldData.insight, decision: selectedFieldData.decision, distribution: selectedFieldData.distribution, examples: selectedFieldData.examples };
    format === 'csv' ? exportToJSON(data, `${selectedFieldData.name}-details`) : exportToJSON(data, `${selectedFieldData.name}-details`);
  };

  return (
    <div style={{ backgroundColor: '#080a0f', minHeight: '100vh', color: '#e5e7eb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1f2937', backgroundColor: '#0d1117', padding: '18px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>Dimension Anomalies</h1>
            <p style={{ fontSize: '15px', color: '#6b7280' }}>{fields.length} columns indexed • {valueAnomalies.length} value anomalies tracked</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(anomalyCount > 0 || valueAnomalyCount > 0) && (
              <div style={{ padding: '8px 14px', backgroundColor: 'rgba(127, 29, 29, 0.4)', border: '1px solid rgba(185, 28, 28, 0.5)', borderRadius: '6px', fontSize: '13px', color: '#f87171', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle style={{ width: '16px', height: '16px' }} />{anomalyCount + valueAnomalyCount} Critical Anomalies
              </div>
            )}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '18px', padding: '4px', backgroundColor: '#1a1f2e', borderRadius: '8px', width: 'fit-content' }}>
          <button onClick={() => { setViewMode('fields'); setSelectedField(null); setSelectedValue(null); }}
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: 600, color: viewMode === 'fields' ? '#fff' : '#6b7280', backgroundColor: viewMode === 'fields' ? '#22c55e' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database style={{ width: '18px', height: '18px' }} />Column/Key Level
            {anomalyCount > 0 && <span style={{ padding: '3px 8px', fontSize: '11px', backgroundColor: viewMode === 'fields' ? 'rgba(0,0,0,0.3)' : 'rgba(127, 29, 29, 0.5)', color: viewMode === 'fields' ? '#fff' : '#f87171', borderRadius: '4px', fontWeight: 700 }}>{anomalyCount}</span>}
          </button>
          <button onClick={() => { setViewMode('values'); setSelectedField(null); setSelectedValue(null); }}
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: 600, color: viewMode === 'values' ? '#fff' : '#6b7280', backgroundColor: viewMode === 'values' ? '#22c55e' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers style={{ width: '18px', height: '18px' }} />Value-Level
            {valueAnomalyCount > 0 && <span style={{ padding: '3px 8px', fontSize: '11px', backgroundColor: viewMode === 'values' ? 'rgba(0,0,0,0.3)' : 'rgba(127, 29, 29, 0.5)', color: viewMode === 'values' ? '#fff' : '#f87171', borderRadius: '4px', fontWeight: 700 }}>{valueAnomalyCount}</span>}
          </button>
        </div>

        {/* Search, Filters, and Export */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#6b7280' }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by field name, type, category..."
              style={{ width: '100%', padding: '12px 18px 12px 44px', backgroundColor: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '8px', fontSize: '15px', color: '#fff', outline: 'none' }} />
          </div>
          <select value={filterAnomaly} onChange={(e) => setFilterAnomaly(e.target.value)}
            style={{ padding: '12px 40px 12px 14px', backgroundColor: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '8px', fontSize: '15px', color: '#d1d5db', outline: 'none', cursor: 'pointer', appearance: 'none' }}>
            <option value="all">All Status</option>
            <option value="HIGH">Critical</option>
            <option value="MEDIUM">Non-Critical</option>
            <option value="LOW">Informational</option>
          </select>
          <ExportButton
            onExportCSV={() => viewMode === 'fields' ? handleExportFields('csv') : handleExportValues('csv')}
            onExportJSON={() => viewMode === 'fields' ? handleExportFields('json') : handleExportValues('json')}
            label="Export Table"
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Fields Table */}
        {viewMode === 'fields' && (
          <div style={{ width: selectedFieldData ? '40%' : '100%', overflowY: 'auto', transition: 'width 0.2s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead style={{ backgroundColor: '#0d1117', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Field</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Cardinality</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Failing Checks</th>
                  <th style={{ padding: '16px 24px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredFields.map((field) => {
                  const alertStyle = getAlertStyle(field.anomaly);
                  const criticalCount = field.anomalyChecks?.filter(c => c.status === 'CRITICAL').length || 0;
                  const warningCount = field.anomalyChecks?.filter(c => c.status === 'WARNING').length || 0;
                  return (
                    <tr key={field.name} onClick={() => setSelectedField(selectedField === field.name ? null : field.name)}
                      style={{ borderBottom: '1px solid rgba(31, 41, 55, 0.5)', cursor: 'pointer', backgroundColor: selectedField === field.name ? 'rgba(34, 197, 94, 0.1)' : field.anomaly === 'HIGH' ? 'rgba(127, 29, 29, 0.1)' : 'transparent', borderLeft: selectedField === field.name ? '3px solid #22c55e' : '3px solid transparent' }}
                      onMouseOver={e => { if (selectedField !== field.name) e.currentTarget.style.backgroundColor = '#111827'; }}
                      onMouseOut={e => { if (selectedField !== field.name) e.currentTarget.style.backgroundColor = field.anomaly === 'HIGH' ? 'rgba(127, 29, 29, 0.1)' : 'transparent'; }}>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, borderRadius: '4px', backgroundColor: alertStyle.bg, color: alertStyle.color, border: `1px solid ${alertStyle.border}` }}>
                          {field.anomaly === 'HIGH' && <AlertTriangle style={{ width: '14px', height: '14px' }} />}{alertStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div><span style={{ fontFamily: 'ui-monospace, monospace', color: '#fff', fontWeight: 500, fontSize: '15px' }}>{field.name}</span><div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{field.category}</div></div>
                      </td>
                      <td style={{ padding: '18px 24px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '15px' }}>{getTypeIcon(field.type)}{field.type}</span></td>
                      <td style={{ padding: '18px 24px' }}><span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '15px', color: field.cardinality === '∞' ? '#a78bfa' : parseInt(field.cardinality) > 100000 ? '#60a5fa' : '#9ca3af' }}>{field.cardinality}</span></td>
                      <td style={{ padding: '18px 24px' }}>
                        {(criticalCount > 0 || warningCount > 0) ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {criticalCount > 0 && <span style={{ padding: '4px 12px', fontSize: '13px', fontWeight: 600, borderRadius: '4px', backgroundColor: 'rgba(127, 29, 29, 0.5)', color: '#f87171', border: '1px solid rgba(185, 28, 28, 0.5)' }}>{criticalCount} crit</span>}
                            {warningCount > 0 && <span style={{ padding: '4px 12px', fontSize: '13px', fontWeight: 600, borderRadius: '4px', backgroundColor: 'rgba(120, 53, 15, 0.5)', color: '#fbbf24', border: '1px solid rgba(180, 83, 9, 0.5)' }}>{warningCount} warn</span>}
                          </div>
                        ) : <span style={{ color: '#4ade80', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle style={{ width: '16px', height: '16px' }} />All passing</span>}
                      </td>
                      <td style={{ padding: '18px 24px' }}><ChevronRight style={{ width: '20px', height: '20px', color: selectedField === field.name ? '#22c55e' : '#4b5563', transform: selectedField === field.name ? 'rotate(180deg)' : 'none' }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Values Table */}
        {viewMode === 'values' && (
          <div style={{ width: selectedValueData ? '40%' : '100%', overflowY: 'auto', transition: 'width 0.2s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
              <thead style={{ backgroundColor: '#0d1117', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Field : Value</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Change</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>Baseline → Current</th>
                  <th style={{ padding: '16px 24px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredValueAnomalies.map((valueAnomaly) => {
                  const alertStyle = getAlertStyle(valueAnomaly.anomaly);
                  return (
                    <tr key={valueAnomaly.id} onClick={() => setSelectedValue(selectedValue === valueAnomaly.id ? null : valueAnomaly.id)}
                      style={{ borderBottom: '1px solid rgba(31, 41, 55, 0.5)', cursor: 'pointer', backgroundColor: selectedValue === valueAnomaly.id ? 'rgba(34, 197, 94, 0.1)' : valueAnomaly.anomaly === 'HIGH' ? 'rgba(127, 29, 29, 0.1)' : 'transparent', borderLeft: selectedValue === valueAnomaly.id ? '3px solid #22c55e' : '3px solid transparent' }}
                      onMouseOver={e => { if (selectedValue !== valueAnomaly.id) e.currentTarget.style.backgroundColor = '#111827'; }}
                      onMouseOut={e => { if (selectedValue !== valueAnomaly.id) e.currentTarget.style.backgroundColor = valueAnomaly.anomaly === 'HIGH' ? 'rgba(127, 29, 29, 0.1)' : 'transparent'; }}>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, borderRadius: '4px', backgroundColor: alertStyle.bg, color: alertStyle.color, border: `1px solid ${alertStyle.border}` }}>
                          {valueAnomaly.anomaly === 'HIGH' && <AlertTriangle style={{ width: '14px', height: '14px' }} />}{alertStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div><span style={{ fontFamily: 'ui-monospace, monospace', color: '#9ca3af', fontSize: '14px' }}>{valueAnomaly.field}:</span><span style={{ fontFamily: 'ui-monospace, monospace', color: '#22c55e', fontWeight: 600, fontSize: '15px', marginLeft: '4px' }}>{valueAnomaly.value}</span></div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 14px', fontSize: '14px', fontWeight: 600, borderRadius: '4px', backgroundColor: valueAnomaly.changeDirection === 'up' ? 'rgba(127, 29, 29, 0.3)' : 'rgba(139, 92, 246, 0.3)', color: valueAnomaly.changeDirection === 'up' ? '#f87171' : '#a78bfa' }}>
                          {valueAnomaly.changeDirection === 'up' && '↑'}{valueAnomaly.change}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px' }}><span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '14px', color: '#6b7280' }}>{valueAnomaly.baseline}</span><span style={{ color: '#4b5563', margin: '0 8px' }}>→</span><span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '14px', color: '#f87171' }}>{valueAnomaly.current}</span></td>
                      <td style={{ padding: '18px 24px' }}><ChevronRight style={{ width: '20px', height: '20px', color: selectedValue === valueAnomaly.id ? '#22c55e' : '#4b5563', transform: selectedValue === valueAnomaly.id ? 'rotate(180deg)' : 'none' }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Field Detail Shelf - Enhanced */}
        {viewMode === 'fields' && selectedFieldData && (
          <div style={{ width: '60%', borderLeft: '1px solid #1f2937', backgroundColor: '#080a0f', overflowY: 'auto' }}>
            {/* Shelf Header */}
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#0d1117', borderBottom: '1px solid #1f2937', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#22c55e', fontFamily: 'ui-monospace, monospace', fontSize: '20px' }}>❯</span>
                <span style={{ fontSize: '15px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Column Inspector</span>
                <HelpTooltip title="Column Inspector">Detailed analysis panel showing comprehensive anomaly detection results, statistical metrics, and recommended actions.</HelpTooltip>
              </div>
              <button onClick={() => setSelectedField(null)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>

            <div style={{ padding: '28px' }}>
              {/* Field Name & Status */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '26px', color: '#22c55e', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{selectedFieldData.name}</div>
                  <span style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '6px', backgroundColor: getAlertStyle(selectedFieldData.anomaly).bg, color: getAlertStyle(selectedFieldData.anomaly).color, border: `1px solid ${getAlertStyle(selectedFieldData.anomaly).border}` }}>{getAlertStyle(selectedFieldData.anomaly).label}</span>
                </div>
                <div style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '12px', lineHeight: 1.5 }}>{selectedFieldData.description}</div>
                <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ padding: '5px 10px', backgroundColor: '#1f2937', borderRadius: '4px' }}>{selectedFieldData.type}</span>
                  <span style={{ padding: '5px 10px', backgroundColor: '#1f2937', borderRadius: '4px' }}>{selectedFieldData.category}</span>
                  <span>•</span><span>Last seen {selectedFieldData.lastSeen}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase' }}>Type</div>
                  <div style={{ fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>{getTypeIcon(selectedFieldData.type)}{selectedFieldData.type}</div>
                </div>
                <div style={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase' }}>Cardinality</div>
                  <div style={{ fontSize: '20px', color: '#60a5fa', fontFamily: 'ui-monospace, monospace' }}>{selectedFieldData.cardinality}</div>
                </div>
                <div style={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '8px', padding: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase' }}>Events</div>
                  <div style={{ fontSize: '20px', color: '#fff', fontFamily: 'ui-monospace, monospace' }}>{selectedFieldData.eventCount}</div>
                </div>
              </div>

              {/* Anomaly Summary Bar */}
              {anomalySummary && (selectedFieldData.anomaly === 'HIGH' || selectedFieldData.anomaly === 'MEDIUM') && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', padding: '20px', backgroundColor: '#0d1117', borderRadius: '8px', border: '1px solid #1f2937' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 700, color: '#f87171' }}>{anomalySummary.critical}</div><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Critical</div></div>
                  <div style={{ width: '1px', backgroundColor: '#1f2937' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 700, color: '#fbbf24' }}>{anomalySummary.warning}</div><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Warning</div></div>
                  <div style={{ width: '1px', backgroundColor: '#1f2937' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 700, color: '#60a5fa' }}>{anomalySummary.info}</div><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Info</div></div>
                  <div style={{ width: '1px', backgroundColor: '#1f2937' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: 700, color: '#4ade80' }}>{anomalySummary.pass}</div><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>Pass</div></div>
                </div>
              )}

              {/* Tab Navigation - No counts in parentheses */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
                {['checks', 'analysis', 'timeline', 'details'].map(tab => (
                  <button key={tab} onClick={() => setAnomalyTab(tab)}
                    style={{ padding: '12px 20px', fontSize: '15px', fontWeight: 500, color: anomalyTab === tab ? '#fff' : '#6b7280', backgroundColor: anomalyTab === tab ? '#1f2937' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'capitalize' }}>
                    {tab === 'checks' && <Shield style={{ width: '18px', height: '18px' }} />}
                    {tab === 'analysis' && <AlertCircle style={{ width: '18px', height: '18px' }} />}
                    {tab === 'timeline' && <Clock style={{ width: '18px', height: '18px' }} />}
                    {tab === 'details' && <Database style={{ width: '18px', height: '18px' }} />}
                    {tab === 'checks' ? 'Anomaly Checks' : tab === 'analysis' ? 'Deep Analysis' : tab === 'timeline' ? 'Timeline' : 'Field Details'}
                  </button>
                ))}
              </div>

              {/* Anomaly Checks Tab */}
              {anomalyTab === 'checks' && selectedFieldData.anomalyChecks && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Anomaly Checks</div>
                    <ExportButton onExportCSV={() => handleExportChecks('csv')} onExportJSON={() => handleExportChecks('json')} label="Export" />
                  </div>
                  {Object.keys(ANOMALY_CATEGORIES).map(categoryKey => {
                    const categoryChecks = selectedFieldData.anomalyChecks.filter(c => c.category === categoryKey);
                    if (categoryChecks.length === 0) return null;
                    return (
                      <div key={categoryKey} style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '14px', color: ANOMALY_CATEGORIES[categoryKey].color, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                          {React.createElement(ANOMALY_CATEGORIES[categoryKey].icon, { style: { width: '16px', height: '16px' } })}
                          {ANOMALY_CATEGORIES[categoryKey].name} Checks
                        </div>
                        {categoryChecks.map((check, idx) => <AnomalyCheckCard key={`${categoryKey}-${idx}`} check={check} isExpanded={expandedChecks[`${categoryKey}-${idx}`]} onToggle={() => toggleCheckExpanded(`${categoryKey}-${idx}`)} />)}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Deep Analysis Tab */}
              {anomalyTab === 'analysis' && selectedFieldData.anomalyDetails && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <ExportButton onExportCSV={() => handleExportAnalysis('csv')} onExportJSON={() => handleExportAnalysis('json')} label="Export Analysis" />
                  </div>
                  <AnomalyDetailSection title="Statistical Distribution" icon={Sigma} iconColor="#a78bfa" helpText="Statistical anomalies detect when field values deviate from expected patterns.">
                    <MetricRow label="Standard Deviation" value={`${selectedFieldData.anomalyDetails.statistical.stdDeviation.value}σ`} threshold={`${selectedFieldData.anomalyDetails.statistical.stdDeviation.threshold}σ`} status={selectedFieldData.anomalyDetails.statistical.stdDeviation.status} helpText="Measures how many standard deviations the current value is from the rolling 7-day mean." showBar={selectedFieldData.anomalyDetails.statistical.stdDeviation.value !== 'N/A'} barValue={selectedFieldData.anomalyDetails.statistical.stdDeviation.value !== 'N/A' ? selectedFieldData.anomalyDetails.statistical.stdDeviation.value / 5 : 0} />
                    <MetricRow label="Mean Shift" value={selectedFieldData.anomalyDetails.statistical.meanShift.value} threshold={`baseline: ${selectedFieldData.anomalyDetails.statistical.meanShift.baseline}`} status={selectedFieldData.anomalyDetails.statistical.meanShift.status} helpText="Detects when the average value has moved significantly from baseline." />
                    <MetricRow label="P95 Threshold" value={selectedFieldData.anomalyDetails.statistical.p95Breach.value} threshold={selectedFieldData.anomalyDetails.statistical.p95Breach.threshold} status={selectedFieldData.anomalyDetails.statistical.p95Breach.status} helpText="The 95th percentile value - breaches indicate 'worst 5%' cases are getting worse." />
                    <MetricRow label="P99 Threshold" value={selectedFieldData.anomalyDetails.statistical.p99Breach.value} threshold={selectedFieldData.anomalyDetails.statistical.p99Breach.threshold} status={selectedFieldData.anomalyDetails.statistical.p99Breach.status} helpText="The 99th percentile - represents extreme cases." />
                    <MetricRow label="K-S Test Statistic" value={selectedFieldData.anomalyDetails.statistical.ksTest.value} threshold={selectedFieldData.anomalyDetails.statistical.ksTest.threshold} status={selectedFieldData.anomalyDetails.statistical.ksTest.status} helpText="Measures maximum difference between current and baseline distributions." showBar={selectedFieldData.anomalyDetails.statistical.ksTest.value !== 'N/A'} barValue={selectedFieldData.anomalyDetails.statistical.ksTest.value !== 'N/A' ? selectedFieldData.anomalyDetails.statistical.ksTest.value / 0.5 : 0} />
                    <MetricRow label="JS Divergence" value={selectedFieldData.anomalyDetails.statistical.jsDivergence.value} threshold={selectedFieldData.anomalyDetails.statistical.jsDivergence.threshold} status={selectedFieldData.anomalyDetails.statistical.jsDivergence.status} helpText="Jensen-Shannon divergence measures similarity between probability distributions." showBar={selectedFieldData.anomalyDetails.statistical.jsDivergence.value !== 'N/A'} barValue={selectedFieldData.anomalyDetails.statistical.jsDivergence.value !== 'N/A' ? selectedFieldData.anomalyDetails.statistical.jsDivergence.value : 0} />
                    <MetricRow label="Population Stability Index" value={selectedFieldData.anomalyDetails.statistical.psi.value} threshold={selectedFieldData.anomalyDetails.statistical.psi.threshold} status={selectedFieldData.anomalyDetails.statistical.psi.status} helpText="PSI measures how much the value distribution has shifted. >0.25 = significant change." showBar={selectedFieldData.anomalyDetails.statistical.psi.value !== 'N/A'} barValue={selectedFieldData.anomalyDetails.statistical.psi.value !== 'N/A' ? selectedFieldData.anomalyDetails.statistical.psi.value / 0.6 : 0} />
                  </AnomalyDetailSection>

                  <AnomalyDetailSection title="Cardinality Patterns" icon={GitBranch} iconColor="#60a5fa" helpText="Cardinality anomalies track changes in unique values count.">
                    <MetricRow label="Cardinality Explosion" value={selectedFieldData.anomalyDetails.cardinality.explosion.detected ? `Yes (${selectedFieldData.anomalyDetails.cardinality.explosion.change})` : 'No'} threshold="sudden spike detection" status={selectedFieldData.anomalyDetails.cardinality.explosion.status} helpText="Detects sudden spikes in unique values - may indicate attacks or data issues." />
                    <MetricRow label="Cardinality Collapse" value={selectedFieldData.anomalyDetails.cardinality.collapse.detected ? `Yes (${selectedFieldData.anomalyDetails.cardinality.collapse.change})` : 'No'} threshold="entity disappearance" status={selectedFieldData.anomalyDetails.cardinality.collapse.status} helpText="Detects when fewer unique values than expected - may indicate pipeline issues." />
                    <MetricRow label="Cardinality Drift" value={selectedFieldData.anomalyDetails.cardinality.drift.detected ? `Yes (${selectedFieldData.anomalyDetails.cardinality.drift.rate})` : 'No'} threshold="unbounded growth" status={selectedFieldData.anomalyDetails.cardinality.drift.status} helpText="Monitors gradual unbounded growth in unique values." />
                  </AnomalyDetailSection>

                  <AnomalyDetailSection title="Rate & Volume" icon={Activity} iconColor="#22c55e" helpText="Rate anomalies detect changes in event frequency.">
                    <MetricRow label="Event Rate Spike" value={selectedFieldData.anomalyDetails.rateVolume.eventRateSpike.value} threshold={`baseline: ${selectedFieldData.anomalyDetails.rateVolume.eventRateSpike.baseline}`} status={selectedFieldData.anomalyDetails.rateVolume.eventRateSpike.status} helpText={`Current rate: ${selectedFieldData.anomalyDetails.rateVolume.eventRateSpike.current}. Detects sudden increases.`} />
                    <MetricRow label="Event Rate Drop" value={selectedFieldData.anomalyDetails.rateVolume.eventRateDrop.detected ? 'Detected' : 'None'} threshold="significant decrease" status={selectedFieldData.anomalyDetails.rateVolume.eventRateDrop.status} helpText="Monitors for significant decreases in event rate." />
                    <MetricRow label="Seasonality Violation" value={selectedFieldData.anomalyDetails.rateVolume.seasonalityViolation.detected ? 'Detected' : 'None'} threshold="expected pattern" status={selectedFieldData.anomalyDetails.rateVolume.seasonalityViolation.status} helpText="Compares current rate against expected time-of-day patterns." />
                  </AnomalyDetailSection>
                </div>
              )}

              {/* Timeline Tab */}
              {anomalyTab === 'timeline' && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anomaly Timeline</div>
                    <ExportButton onExportCSV={() => handleExportTimeline('csv')} onExportJSON={() => handleExportTimeline('json')} label="Export" />
                  </div>
                  {selectedFieldData.anomalyTimeline && selectedFieldData.anomalyTimeline.length > 0 ? (
                    <div style={{ position: 'relative', paddingLeft: '28px' }}>
                      <div style={{ position: 'absolute', left: '10px', top: '12px', bottom: '12px', width: '2px', backgroundColor: '#1f2937' }} />
                      {selectedFieldData.anomalyTimeline.map((event, idx) => {
                        const statusStyle = getStatusColor(event.severity);
                        return (
                          <div key={idx} style={{ position: 'relative', marginBottom: '24px', paddingLeft: '24px' }}>
                            <div style={{ position: 'absolute', left: '-18px', top: '8px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: statusStyle.text, border: '3px solid #080a0f' }} />
                            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>{event.time}</div>
                            <div style={{ fontSize: '16px', color: '#e5e7eb' }}>{event.event}</div>
                            <span style={{ display: 'inline-block', marginTop: '8px', padding: '5px 12px', fontSize: '12px', backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, borderRadius: '4px', color: statusStyle.text }}>{event.severity}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No timeline events recorded</div>
                  )}
                </div>
              )}

              {/* Details Tab */}
              {anomalyTab === 'details' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <ExportButton onExportCSV={() => handleExportDetails('csv')} onExportJSON={() => handleExportDetails('json')} label="Export Details" />
                  </div>
                  <div style={{ backgroundColor: 'rgba(30, 58, 138, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', color: '#60a5fa', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}><Lightbulb style={{ width: '18px', height: '18px' }} />Insight</div>
                    <div style={{ fontSize: '16px', color: '#d1d5db', lineHeight: 1.5 }}>{selectedFieldData.insight}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(20, 83, 45, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '20px', marginBottom: '28px' }}>
                    <div style={{ fontSize: '13px', color: '#4ade80', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}><Target style={{ width: '18px', height: '18px' }} />Recommended Action</div>
                    <div style={{ fontSize: '16px', color: '#d1d5db', lineHeight: 1.5 }}>{selectedFieldData.decision}</div>
                  </div>
                  {Object.keys(selectedFieldData.distribution).length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}><PieChart style={{ width: '18px', height: '18px', color: '#6b7280' }} /><span style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value Distribution</span></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(selectedFieldData.distribution).map(([key, val]) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px' }}>
                            <span style={{ width: '140px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'ui-monospace, monospace' }}>{key}</span>
                            <div style={{ flex: 1, height: '10px', backgroundColor: '#1f2937', borderRadius: '5px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${val}%`, backgroundColor: '#22c55e', borderRadius: '5px' }}></div></div>
                            <span style={{ width: '50px', textAlign: 'right', color: '#6b7280' }}>{val}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sample Values</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {selectedFieldData.examples.map((ex, i) => (
                        <button key={i} onClick={() => handleCopy(ex)} style={{ padding: '12px 16px', backgroundColor: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '6px', fontSize: '15px', fontFamily: 'ui-monospace, monospace', color: copiedText === ex ? '#4ade80' : '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {ex}<Copy style={{ width: '16px', height: '16px', color: copiedText === ex ? '#4ade80' : '#6b7280' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Actions - Changed to View Events */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1f2937' }}>
                <button style={{ flex: 1, padding: '16px', backgroundColor: '#22c55e', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}><Eye style={{ width: '20px', height: '20px' }} />View Events</button>
                <button onClick={() => handleCopy(selectedFieldData.name)} style={{ padding: '16px 20px', backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Copy style={{ width: '20px', height: '20px' }} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Value Detail Shelf */}
        {viewMode === 'values' && selectedValueData && (
          <div style={{ width: '60%', borderLeft: '1px solid #1f2937', backgroundColor: '#080a0f', overflowY: 'auto' }}>
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#0d1117', borderBottom: '1px solid #1f2937', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#22c55e', fontFamily: 'ui-monospace, monospace', fontSize: '20px' }}>❯</span>
                <span style={{ fontSize: '15px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value Inspector</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ExportButton
                  onExportCSV={() => {
                    const data = [{ field: selectedValueData.field, value: selectedValueData.value, anomaly: selectedValueData.anomaly, change: selectedValueData.change, baseline: selectedValueData.baseline, current: selectedValueData.current, message: selectedValueData.message }];
                    exportToCSV(data, `${selectedValueData.field}-${selectedValueData.value}`);
                  }}
                  onExportJSON={() => {
                    exportToJSON(selectedValueData, `${selectedValueData.field}-${selectedValueData.value}`);
                  }}
                  label="Export"
                />
                <button onClick={() => setSelectedValue(null)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px' }}><X style={{ width: '20px', height: '20px' }} /></button>
              </div>
            </div>
            <div style={{ padding: '28px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '15px', color: '#6b7280', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>{selectedValueData.field}</div>
                    <div style={{ fontSize: '26px', color: '#22c55e', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{selectedValueData.value}</div>
                  </div>
                  <span style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '6px', backgroundColor: getAlertStyle(selectedValueData.anomaly).bg, color: getAlertStyle(selectedValueData.anomaly).color, border: `1px solid ${getAlertStyle(selectedValueData.anomaly).border}` }}>{getAlertStyle(selectedValueData.anomaly).label}</span>
                </div>
                <div style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '12px', lineHeight: 1.5 }}>{selectedValueData.message}</div>
                <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ padding: '5px 10px', backgroundColor: '#1f2937', borderRadius: '4px' }}>{selectedValueData.category}</span>
                  <span>•</span><span>Detected {selectedValueData.detectedAt}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px', padding: '20px', backgroundColor: '#0d1117', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Change</div><div style={{ fontSize: '26px', fontWeight: 700, color: selectedValueData.changeDirection === 'up' ? '#f87171' : '#a78bfa' }}>{selectedValueData.changeDirection === 'up' && '↑'}{selectedValueData.change}</div></div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid #1f2937', borderRight: '1px solid #1f2937' }}><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Baseline</div><div style={{ fontSize: '26px', fontWeight: 700, color: '#6b7280' }}>{selectedValueData.baseline}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Current</div><div style={{ fontSize: '26px', fontWeight: 700, color: selectedValueData.changeDirection === 'up' ? '#f87171' : '#a78bfa' }}>{selectedValueData.current}</div></div>
              </div>
              {selectedValueData.checks && selectedValueData.checks.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Triggered Checks</div>
                  {selectedValueData.checks.map((check, idx) => {
                    const statusStyle = getStatusColor(check.status);
                    const StatusIcon = statusStyle.icon;
                    const CategoryIcon = ANOMALY_CATEGORIES[check.category]?.icon || Database;
                    return (
                      <div key={idx} style={{ backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, borderRadius: '8px', padding: '18px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                          <StatusIcon style={{ width: '20px', height: '20px', color: statusStyle.text, marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', color: ANOMALY_CATEGORIES[check.category]?.color, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><CategoryIcon style={{ width: '14px', height: '14px' }} />{ANOMALY_CATEGORIES[check.category]?.name}</span>
                              <span style={{ fontSize: '12px', padding: '4px 12px', backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, borderRadius: '4px', color: statusStyle.text, fontWeight: 600 }}>{check.status}</span>
                            </div>
                            <div style={{ fontSize: '16px', color: '#e5e7eb', fontWeight: 500, marginBottom: '6px' }}>{check.name}</div>
                            <div style={{ fontSize: '14px', color: '#9ca3af' }}>{check.detail}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ backgroundColor: 'rgba(30, 58, 138, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '20px', marginBottom: '28px' }}>
                <div style={{ fontSize: '13px', color: '#60a5fa', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parent Field</div>
                <button onClick={() => { setViewMode('fields'); setSelectedValue(null); setSelectedField(selectedValueData.field); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', backgroundColor: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
                  <Database style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
                  <span style={{ fontFamily: 'ui-monospace, monospace', color: '#fff', fontSize: '15px' }}>{selectedValueData.field}</span>
                  <ChevronRight style={{ width: '18px', height: '18px', color: '#6b7280', marginLeft: 'auto' }} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1f2937' }}>
                <button style={{ flex: 1, padding: '16px', backgroundColor: '#22c55e', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}><Eye style={{ width: '20px', height: '20px' }} />View Events</button>
                <button onClick={() => handleCopy(`${selectedValueData.field}:${selectedValueData.value}`)} style={{ padding: '16px 20px', backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Copy style={{ width: '20px', height: '20px' }} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DimensionalAnomalies;
