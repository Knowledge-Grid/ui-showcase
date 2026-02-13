import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const AgentAnalyticsV2 = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedAgentForCosts, setSelectedAgentForCosts] = useState(null);
  const [selectedAgentForConfig, setSelectedAgentForConfig] = useState(null);
  const [openDropdownAgentId, setOpenDropdownAgentId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [showAgentSettingsModal, setShowAgentSettingsModal] = useState(false);
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  const [showAgentTagsModal, setShowAgentTagsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showTraceDetailModal, setShowTraceDetailModal] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [showTagManagementModal, setShowTagManagementModal] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');
  const [showGenerateKeyForm, setShowGenerateKeyForm] = useState(false);
  const [currentTracePage, setCurrentTracePage] = useState(1);
  const [currentAgentPage, setCurrentAgentPage] = useState(1);
  const tracesPerPage = 10;
  const agentsPerPage = 10;

  // Close dropdown on scroll or resize since it uses fixed positioning
  useEffect(() => {
    if (!openDropdownAgentId) return;
    const handleClose = () => setOpenDropdownAgentId(null);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);
    return () => {
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
    };
  }, [openDropdownAgentId]);

  // Tag Categories
  const tagCategories = [
    { 
      name: 'Environment', 
      tags: [
        { value: 'Production', color: '#ef4444' },
        { value: 'Staging', color: '#f59e0b' },
        { value: 'Development', color: '#3b82f6' }
      ]
    },
    { 
      name: 'Team', 
      tags: [
        { value: 'Sales', color: '#8b5cf6' },
        { value: 'Support', color: '#ec4899' },
        { value: 'Engineering', color: '#06b6d4' },
        { value: 'Analytics', color: '#10b981' }
      ]
    },
    { 
      name: 'Priority', 
      tags: [
        { value: 'Critical', color: '#dc2626' },
        { value: 'High', color: '#f59e0b' },
        { value: 'Medium', color: '#3b82f6' },
        { value: 'Low', color: '#6b7280' }
      ]
    },
    { 
      name: 'Type', 
      tags: [
        { value: 'Customer-Facing', color: '#8b5cf6' },
        { value: 'Internal', color: '#06b6d4' },
        { value: 'Automated', color: '#10b981' }
      ]
    }
  ];

  const availableEndpoints = [
    { path: '/api/v1/nlp-query', label: 'NLP to KGQL' },
    { path: '/api/v1/kgql', label: 'Direct KGQL' },
    { path: '/api/v1/alerts/check', label: 'Alerts' },
  ];

  const registeredAgents = [
    {
      id: 'agent-001',
      name: 'Sales Analysis Agent',
      status: 'enabled',
      lastActive: '2 min ago',
      requests24h: 1284,
      avgQueryTime: '234ms',
      successRate: 99.2,
      createdAt: 'Dec 15, 2024',
      tags: [
        { category: 'Environment', value: 'Production', color: '#ef4444' },
        { category: 'Team', value: 'Sales', color: '#8b5cf6' },
        { category: 'Priority', value: 'Critical', color: '#dc2626' }
      ],
      apiKeys: [
        { id: 'key-001', name: 'Production Key', keyPreview: 'ct_...a3f2', endpoints: ['/api/v1/nlp-query'], expirationDate: 'Mar 15, 2025', status: 'active', createdAt: 'Dec 15, 2024' },
        { id: 'key-002', name: 'Staging Key', keyPreview: 'ct_...b7e1', endpoints: ['/api/v1/nlp-query', '/api/v1/kgql'], expirationDate: 'Feb 1, 2025', status: 'expired', createdAt: 'Dec 15, 2024' },
      ]
    },
    {
      id: 'agent-002',
      name: 'Customer Support Bot',
      status: 'enabled',
      lastActive: '5 min ago',
      requests24h: 892,
      avgQueryTime: '189ms',
      successRate: 98.7,
      createdAt: 'Dec 10, 2024',
      tags: [
        { category: 'Environment', value: 'Production', color: '#ef4444' },
        { category: 'Team', value: 'Support', color: '#ec4899' },
        { category: 'Type', value: 'Customer-Facing', color: '#8b5cf6' },
        { category: 'Priority', value: 'High', color: '#f59e0b' }
      ],
      apiKeys: [
        { id: 'key-003', name: 'Primary Key', keyPreview: 'ct_...c4d8', endpoints: ['/api/v1/nlp-query'], expirationDate: 'Jun 30, 2025', status: 'active', createdAt: 'Dec 10, 2024' },
      ]
    },
    {
      id: 'agent-003',
      name: 'Data Pipeline Agent',
      status: 'enabled',
      lastActive: '1 min ago',
      requests24h: 2341,
      avgQueryTime: '45ms',
      successRate: 99.8,
      createdAt: 'Nov 28, 2024',
      tags: [
        { category: 'Environment', value: 'Production', color: '#ef4444' },
        { category: 'Team', value: 'Engineering', color: '#06b6d4' },
        { category: 'Type', value: 'Automated', color: '#10b981' },
        { category: 'Priority', value: 'Critical', color: '#dc2626' }
      ],
      apiKeys: [
        { id: 'key-004', name: 'Pipeline Key', keyPreview: 'ct_...d9a5', endpoints: ['/api/v1/kgql'], expirationDate: 'Sep 1, 2025', status: 'active', createdAt: 'Nov 28, 2024' },
        { id: 'key-005', name: 'Batch Key', keyPreview: 'ct_...e2b3', endpoints: ['/api/v1/kgql', '/api/v1/nlp-query'], expirationDate: 'Apr 15, 2025', status: 'active', createdAt: 'Dec 5, 2024' },
        { id: 'key-006', name: 'Legacy Key', keyPreview: 'ct_...f1c7', endpoints: ['/api/v1/kgql'], expirationDate: 'Jan 10, 2025', status: 'expired', createdAt: 'Nov 28, 2024' },
      ]
    },
    {
      id: 'agent-004',
      name: 'Anomaly Monitor',
      status: 'enabled',
      lastActive: '30 sec ago',
      requests24h: 4521,
      avgQueryTime: '12ms',
      successRate: 100,
      createdAt: 'Dec 1, 2024',
      tags: [
        { category: 'Environment', value: 'Production', color: '#ef4444' },
        { category: 'Team', value: 'Engineering', color: '#06b6d4' },
        { category: 'Type', value: 'Internal', color: '#06b6d4' }
      ],
      apiKeys: [
        { id: 'key-007', name: 'Monitor Key', keyPreview: 'ct_...g8h4', endpoints: ['/api/v1/alerts/check'], expirationDate: 'Dec 31, 2025', status: 'active', createdAt: 'Dec 1, 2024' },
        { id: 'key-008', name: 'Backup Key', keyPreview: 'ct_...i5j9', endpoints: ['/api/v1/alerts/check', '/api/v1/kgql'], expirationDate: 'Jul 1, 2025', status: 'active', createdAt: 'Dec 8, 2024' },
      ]
    },
    {
      id: 'agent-005',
      name: 'Research Assistant',
      status: 'disabled',
      lastActive: '2 hours ago',
      requests24h: 156,
      avgQueryTime: '412ms',
      successRate: 99.5,
      createdAt: 'Dec 18, 2024',
      tags: [
        { category: 'Environment', value: 'Staging', color: '#f59e0b' },
        { category: 'Team', value: 'Analytics', color: '#10b981' },
        { category: 'Priority', value: 'Low', color: '#6b7280' }
      ],
      apiKeys: [
        { id: 'key-009', name: 'Dev Key', keyPreview: 'ct_...k3l6', endpoints: ['/api/v1/nlp-query', '/api/v1/kgql'], expirationDate: 'May 1, 2025', status: 'active', createdAt: 'Dec 18, 2024' },
      ]
    },
    {
      id: 'agent-006',
      name: 'Report Generator',
      status: 'disabled',
      lastActive: '3 days ago',
      requests24h: 0,
      avgQueryTime: '-',
      successRate: '-',
      createdAt: 'Dec 5, 2024',
      tags: [
        { category: 'Environment', value: 'Development', color: '#3b82f6' },
        { category: 'Team', value: 'Analytics', color: '#10b981' }
      ],
      apiKeys: [
        { id: 'key-010', name: 'Report Key', keyPreview: 'ct_...m2n8', endpoints: ['/api/v1/kgql'], expirationDate: 'Jan 5, 2025', status: 'expired', createdAt: 'Dec 5, 2024' },
      ]
    },
  ];

  const costData = {
    thisMonth: 2847.50,
    lastMonth: 2456.20,
    projected: 3120.00,
    byAgent: [
      { 
        id: 'agent-001',
        name: 'Sales Analysis Agent', 
        cost: 892.40, 
        pct: 31.3,
        requests: 28450,
        apiBreakdown: {
          'NLP to KGQL': { cost: 892.40, requests: 28450, avgCost: 0.031 },
          'Direct KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Alerts': { cost: 0, requests: 0, avgCost: 0 }
        },
        dailyCosts: [28, 31, 29, 33, 30, 32, 28, 27, 30, 35, 31, 29, 32, 37],
        dailyApiCosts: {
          'NLP to KGQL': [28, 31, 29, 33, 30, 32, 28, 27, 30, 35, 31, 29, 32, 37],
          'Direct KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Alerts': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        hourlyPattern: [12, 18, 25, 32, 38, 42, 45, 48, 52, 48, 45, 42, 38, 35, 32, 28, 25, 22, 20, 18, 15, 13, 12, 11]
      },
      { 
        id: 'agent-002',
        name: 'Customer Support Bot', 
        cost: 654.20, 
        pct: 23.0,
        requests: 19240,
        apiBreakdown: {
          'NLP to KGQL': { cost: 654.20, requests: 19240, avgCost: 0.034 },
          'Direct KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Alerts': { cost: 0, requests: 0, avgCost: 0 }
        },
        dailyCosts: [21, 24, 22, 26, 23, 25, 21, 20, 23, 27, 24, 22, 25, 29],
        dailyApiCosts: {
          'NLP to KGQL': [21, 24, 22, 26, 23, 25, 21, 20, 23, 27, 24, 22, 25, 29],
          'Direct KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Alerts': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        hourlyPattern: [8, 12, 18, 24, 28, 32, 35, 38, 42, 40, 38, 35, 32, 28, 25, 22, 19, 16, 14, 12, 10, 9, 8, 7]
      },
      { 
        id: 'agent-003',
        name: 'Data Pipeline Agent', 
        cost: 521.80, 
        pct: 18.3,
        requests: 45230,
        apiBreakdown: {
          'NLP to KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Direct KGQL': { cost: 521.80, requests: 45230, avgCost: 0.012 },
          'Alerts': { cost: 0, requests: 0, avgCost: 0 }
        },
        dailyCosts: [18, 20, 18, 22, 19, 21, 18, 17, 19, 23, 20, 18, 21, 25],
        dailyApiCosts: {
          'NLP to KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Direct KGQL': [18, 20, 18, 22, 19, 21, 18, 17, 19, 23, 20, 18, 21, 25],
          'Alerts': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        hourlyPattern: [22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22]
      },
      { 
        id: 'agent-004',
        name: 'Anomaly Monitor', 
        cost: 412.30, 
        pct: 14.5,
        requests: 52180,
        apiBreakdown: {
          'NLP to KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Direct KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Alerts': { cost: 412.30, requests: 52180, avgCost: 0.008 }
        },
        dailyCosts: [14, 16, 15, 18, 16, 17, 14, 13, 15, 19, 16, 15, 17, 20],
        dailyApiCosts: {
          'NLP to KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Direct KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Alerts': [14, 16, 15, 18, 16, 17, 14, 13, 15, 19, 16, 15, 17, 20]
        },
        hourlyPattern: [17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17]
      },
      { 
        id: 'agent-005',
        name: 'Research Assistant', 
        cost: 245.60, 
        pct: 8.6,
        requests: 6420,
        apiBreakdown: {
          'NLP to KGQL': { cost: 245.60, requests: 6420, avgCost: 0.038 },
          'Direct KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Alerts': { cost: 0, requests: 0, avgCost: 0 }
        },
        dailyCosts: [8, 9, 8, 10, 9, 10, 8, 7, 9, 11, 10, 8, 10, 12],
        dailyApiCosts: {
          'NLP to KGQL': [8, 9, 8, 10, 9, 10, 8, 7, 9, 11, 10, 8, 10, 12],
          'Direct KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Alerts': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        hourlyPattern: [5, 8, 12, 15, 18, 20, 22, 25, 28, 26, 24, 22, 20, 18, 15, 12, 10, 8, 7, 6, 5, 4, 4, 3]
      },
      { 
        id: 'agent-006',
        name: 'Report Generator', 
        cost: 121.20, 
        pct: 4.3,
        requests: 8210,
        apiBreakdown: {
          'NLP to KGQL': { cost: 0, requests: 0, avgCost: 0 },
          'Direct KGQL': { cost: 121.20, requests: 8210, avgCost: 0.015 },
          'Alerts': { cost: 0, requests: 0, avgCost: 0 }
        },
        dailyCosts: [4, 5, 4, 6, 5, 5, 4, 0, 0, 0, 0, 0, 0, 0],
        dailyApiCosts: {
          'NLP to KGQL': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          'Direct KGQL': [4, 5, 4, 6, 5, 5, 4, 0, 0, 0, 0, 0, 0, 0],
          'Alerts': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        hourlyPattern: [0, 0, 0, 0, 0, 8, 12, 15, 18, 20, 18, 15, 12, 10, 8, 5, 3, 0, 0, 0, 0, 0, 0, 0]
      },
    ],
    byApi: [
      { name: 'NLP to KGQL', cost: 1792.20, requests: 54110, avgCost: 0.033 },
      { name: 'Direct KGQL', cost: 643.00, requests: 53440, avgCost: 0.012 },
      { name: 'Alerts', cost: 412.30, requests: 52180, avgCost: 0.008 },
    ],
    dailyCosts: [82, 94, 78, 102, 89, 95, 88, 76, 92, 108, 98, 87, 94, 112]
  };

  const traces = [
    { 
      id: 'tr-7842',
      client_id: 'agent-001',
      agent: 'Sales Analysis Agent',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Get Q4 revenue by region',
      rows_returned: 47,
      execution_time_seconds: 0.234,
      queryTime: '234ms',
      tokens: 1247,
      status: 'success',
      status_code: 200,
      timestamp: '14:22:15',
      client_ip: '192.168.1.105',
      user_agent: 'SalesAgent/2.1.0',
      error_message: null,
      metadata: { query_complexity: 'medium', cache_hit: false, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-45',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.234,
      row_count: 47
    },
    { 
      id: 'tr-7841',
      client_id: 'agent-004',
      agent: 'Anomaly Monitor',
      api: 'Alerts',
      endpoint: '/api/v1/alerts/check',
      http_method: 'GET',
      query: 'Check threshold violations',
      rows_returned: 0,
      execution_time_seconds: 0.008,
      queryTime: '8ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:22:14',
      client_ip: '192.168.1.108',
      user_agent: 'AnomalyMonitor/1.5.2',
      error_message: null,
      metadata: { alert_count: 0, checked_metrics: 12 },
      external_api_client_entity_id: 'entity-12',
      metric_type: 'alert_check',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.008,
      row_count: 0
    },
    { 
      id: 'tr-7840',
      client_id: 'agent-003',
      agent: 'Data Pipeline Agent',
      api: 'Direct KGQL',
      endpoint: '/api/v1/kgql',
      http_method: 'POST',
      query: 'SELECT * FROM events WHERE timestamp > NOW() - INTERVAL \'1 hour\'',
      rows_returned: 1523,
      execution_time_seconds: 0.045,
      queryTime: '45ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:22:12',
      client_ip: '192.168.1.110',
      user_agent: 'DataPipeline/3.0.1',
      error_message: null,
      metadata: { table: 'events', index_used: true },
      external_api_client_entity_id: 'entity-89',
      metric_type: 'direct_query',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.045,
      row_count: 1523
    },
    { 
      id: 'tr-7839',
      client_id: 'agent-002',
      agent: 'Customer Support Bot',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Find tickets with keyword billing',
      rows_returned: 28,
      execution_time_seconds: 0.189,
      queryTime: '189ms',
      tokens: 892,
      status: 'success',
      status_code: 200,
      timestamp: '14:22:08',
      client_ip: '192.168.1.107',
      user_agent: 'SupportBot/1.8.4',
      error_message: null,
      metadata: { query_complexity: 'low', cache_hit: true, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-23',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.189,
      row_count: 28
    },
    { 
      id: 'tr-7838',
      client_id: 'agent-005',
      agent: 'Research Assistant',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Summarize customer feedback trends',
      rows_returned: 156,
      execution_time_seconds: 0.412,
      queryTime: '412ms',
      tokens: 2104,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:54',
      client_ip: '192.168.1.112',
      user_agent: 'ResearchAssistant/2.3.1',
      error_message: null,
      metadata: { query_complexity: 'high', cache_hit: false, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-67',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.412,
      row_count: 156
    },
    { 
      id: 'tr-7837',
      client_id: 'agent-003',
      agent: 'Data Pipeline Agent',
      api: 'Direct KGQL',
      endpoint: '/api/v1/kgql',
      http_method: 'POST',
      query: 'INSERT INTO metrics (timestamp, value) VALUES (NOW(), 42.5)',
      rows_returned: 1,
      execution_time_seconds: 0.032,
      queryTime: '32ms',
      tokens: 0,
      status: 'success',
      status_code: 201,
      timestamp: '14:21:48',
      client_ip: '192.168.1.110',
      user_agent: 'DataPipeline/3.0.1',
      error_message: null,
      metadata: { table: 'metrics', operation: 'insert' },
      external_api_client_entity_id: 'entity-89',
      metric_type: 'direct_query',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.032,
      row_count: 1
    },
    { 
      id: 'tr-7836',
      client_id: 'agent-001',
      agent: 'Sales Analysis Agent',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Compare YoY growth rates',
      rows_returned: 24,
      execution_time_seconds: 0.287,
      queryTime: '287ms',
      tokens: 1456,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:42',
      client_ip: '192.168.1.105',
      user_agent: 'SalesAgent/2.1.0',
      error_message: null,
      metadata: { query_complexity: 'medium', cache_hit: false, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-45',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.287,
      row_count: 24
    },
    { 
      id: 'tr-7835',
      client_id: 'agent-004',
      agent: 'Anomaly Monitor',
      api: 'Alerts',
      endpoint: '/api/v1/alerts/check',
      http_method: 'GET',
      query: 'Check CPU utilization alerts',
      rows_returned: 0,
      execution_time_seconds: 0.006,
      queryTime: '6ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:38',
      client_ip: '192.168.1.108',
      user_agent: 'AnomalyMonitor/1.5.2',
      error_message: null,
      metadata: { alert_count: 0, checked_metrics: 8 },
      external_api_client_entity_id: 'entity-12',
      metric_type: 'alert_check',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.006,
      row_count: 0
    },
    { 
      id: 'tr-7834',
      client_id: 'agent-002',
      agent: 'Customer Support Bot',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Get open tickets count',
      rows_returned: 0,
      execution_time_seconds: 0.156,
      queryTime: '156ms',
      tokens: 645,
      status: 'error',
      status_code: 500,
      timestamp: '14:21:32',
      client_ip: '192.168.1.107',
      user_agent: 'SupportBot/1.8.4',
      error_message: 'Database connection timeout',
      metadata: { query_complexity: 'low', cache_hit: false, retry_count: 2 },
      external_api_client_entity_id: 'entity-23',
      metric_type: 'query_execution',
      error_type: 'timeout',
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.156,
      row_count: 0
    },
    { 
      id: 'tr-7833',
      client_id: 'agent-003',
      agent: 'Data Pipeline Agent',
      api: 'Direct KGQL',
      endpoint: '/api/v1/kgql',
      http_method: 'POST',
      query: 'UPDATE users SET last_login = NOW() WHERE id = 12345',
      rows_returned: 1,
      execution_time_seconds: 0.028,
      queryTime: '28ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:28',
      client_ip: '192.168.1.110',
      user_agent: 'DataPipeline/3.0.1',
      error_message: null,
      metadata: { table: 'users', operation: 'update' },
      external_api_client_entity_id: 'entity-89',
      metric_type: 'direct_query',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.028,
      row_count: 1
    },
    { 
      id: 'tr-7832',
      client_id: 'agent-001',
      agent: 'Sales Analysis Agent',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Show top 10 customers by revenue',
      rows_returned: 10,
      execution_time_seconds: 0.198,
      queryTime: '198ms',
      tokens: 1123,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:15',
      client_ip: '192.168.1.105',
      user_agent: 'SalesAgent/2.1.0',
      error_message: null,
      metadata: { query_complexity: 'medium', cache_hit: true, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-45',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.198,
      row_count: 10
    },
    { 
      id: 'tr-7831',
      client_id: 'agent-003',
      agent: 'Data Pipeline Agent',
      api: 'Direct KGQL',
      endpoint: '/api/v1/kgql',
      http_method: 'POST',
      query: 'DELETE FROM temp_cache WHERE created_at < NOW() - INTERVAL \'1 day\'',
      rows_returned: 342,
      execution_time_seconds: 0.067,
      queryTime: '67ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:10',
      client_ip: '192.168.1.110',
      user_agent: 'DataPipeline/3.0.1',
      error_message: null,
      metadata: { table: 'temp_cache', operation: 'delete' },
      external_api_client_entity_id: 'entity-89',
      metric_type: 'direct_query',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.067,
      row_count: 342
    },
    { 
      id: 'tr-7830',
      client_id: 'agent-004',
      agent: 'Anomaly Monitor',
      api: 'Alerts',
      endpoint: '/api/v1/alerts/check',
      http_method: 'GET',
      query: 'Check memory utilization alerts',
      rows_returned: 1,
      execution_time_seconds: 0.009,
      queryTime: '9ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:21:05',
      client_ip: '192.168.1.108',
      user_agent: 'AnomalyMonitor/1.5.2',
      error_message: null,
      metadata: { alert_count: 1, checked_metrics: 15, triggered_alert: 'memory_high' },
      external_api_client_entity_id: 'entity-12',
      metric_type: 'alert_check',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.009,
      row_count: 1
    },
    { 
      id: 'tr-7829',
      client_id: 'agent-002',
      agent: 'Customer Support Bot',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Find all high priority tickets',
      rows_returned: 42,
      execution_time_seconds: 0.176,
      queryTime: '176ms',
      tokens: 734,
      status: 'success',
      status_code: 200,
      timestamp: '14:20:58',
      client_ip: '192.168.1.107',
      user_agent: 'SupportBot/1.8.4',
      error_message: null,
      metadata: { query_complexity: 'low', cache_hit: false, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-23',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.176,
      row_count: 42
    },
    { 
      id: 'tr-7828',
      client_id: 'agent-005',
      agent: 'Research Assistant',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Analyze sentiment in customer reviews',
      rows_returned: 89,
      execution_time_seconds: 0.445,
      queryTime: '445ms',
      tokens: 2234,
      status: 'success',
      status_code: 200,
      timestamp: '14:20:45',
      client_ip: '192.168.1.112',
      user_agent: 'ResearchAssistant/2.3.1',
      error_message: null,
      metadata: { query_complexity: 'high', cache_hit: false, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-67',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.445,
      row_count: 89
    },
    { 
      id: 'tr-7827',
      client_id: 'agent-003',
      agent: 'Data Pipeline Agent',
      api: 'Direct KGQL',
      endpoint: '/api/v1/kgql',
      http_method: 'POST',
      query: 'SELECT COUNT(*) FROM active_sessions',
      rows_returned: 1,
      execution_time_seconds: 0.023,
      queryTime: '23ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:20:38',
      client_ip: '192.168.1.110',
      user_agent: 'DataPipeline/3.0.1',
      error_message: null,
      metadata: { table: 'active_sessions', operation: 'select' },
      external_api_client_entity_id: 'entity-89',
      metric_type: 'direct_query',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.023,
      row_count: 1
    },
    { 
      id: 'tr-7826',
      client_id: 'agent-001',
      agent: 'Sales Analysis Agent',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Calculate average deal size by region',
      rows_returned: 12,
      execution_time_seconds: 0.267,
      queryTime: '267ms',
      tokens: 1389,
      status: 'success',
      status_code: 200,
      timestamp: '14:20:25',
      client_ip: '192.168.1.105',
      user_agent: 'SalesAgent/2.1.0',
      error_message: null,
      metadata: { query_complexity: 'medium', cache_hit: false, model: 'gpt-4' },
      external_api_client_entity_id: 'entity-45',
      metric_type: 'query_execution',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.267,
      row_count: 12
    },
    { 
      id: 'tr-7825',
      client_id: 'agent-002',
      agent: 'Customer Support Bot',
      api: 'NLP to KGQL',
      endpoint: '/api/v1/nlp-query',
      http_method: 'POST',
      query: 'Get tickets assigned to Sarah Johnson',
      rows_returned: 0,
      execution_time_seconds: 0.234,
      queryTime: '234ms',
      tokens: 823,
      status: 'error',
      status_code: 429,
      timestamp: '14:20:12',
      client_ip: '192.168.1.107',
      user_agent: 'SupportBot/1.8.4',
      error_message: 'Rate limit exceeded',
      metadata: { query_complexity: 'low', cache_hit: false, retry_count: 0 },
      external_api_client_entity_id: 'entity-23',
      metric_type: 'query_execution',
      error_type: 'rate_limit',
      limit_type: 'requests_per_minute',
      auth_failure_reason: null,
      duration_seconds: 0.234,
      row_count: 0
    },
    { 
      id: 'tr-7824',
      client_id: 'agent-004',
      agent: 'Anomaly Monitor',
      api: 'Alerts',
      endpoint: '/api/v1/alerts/check',
      http_method: 'GET',
      query: 'Check disk space alerts',
      rows_returned: 0,
      execution_time_seconds: 0.007,
      queryTime: '7ms',
      tokens: 0,
      status: 'success',
      status_code: 200,
      timestamp: '14:20:05',
      client_ip: '192.168.1.108',
      user_agent: 'AnomalyMonitor/1.5.2',
      error_message: null,
      metadata: { alert_count: 0, checked_metrics: 10 },
      external_api_client_entity_id: 'entity-12',
      metric_type: 'alert_check',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.007,
      row_count: 0
    },
    { 
      id: 'tr-7823',
      client_id: 'agent-003',
      agent: 'Data Pipeline Agent',
      api: 'Direct KGQL',
      endpoint: '/api/v1/kgql',
      http_method: 'POST',
      query: 'INSERT INTO analytics_events (event_type, user_id, data) VALUES (...)',
      rows_returned: 1,
      execution_time_seconds: 0.041,
      queryTime: '41ms',
      tokens: 0,
      status: 'success',
      status_code: 201,
      timestamp: '14:19:58',
      client_ip: '192.168.1.110',
      user_agent: 'DataPipeline/3.0.1',
      error_message: null,
      metadata: { table: 'analytics_events', operation: 'insert' },
      external_api_client_entity_id: 'entity-89',
      metric_type: 'direct_query',
      error_type: null,
      limit_type: null,
      auth_failure_reason: null,
      duration_seconds: 0.041,
      row_count: 1
    },
  ];

  const insights = [
    { title: 'Peak Performance Hours', content: 'Agents perform best between 9 AM - 2 PM with 23% faster response times.', type: 'insight' },
    { title: 'Cost Optimization', content: 'Switching 40% of NLP requests to Direct KGQL could save ~$340/month.', type: 'recommendation' },
    { title: 'Anomaly Detected', content: 'Unusual timeout spike on Wednesday. Root cause: External API rate limiting.', type: 'alert' },
  ];

  const recentActivity = [
    { agent: 'Sales Agent', action: 'Completed analysis', time: '2 min ago', status: 'success' },
    { agent: 'Support Bot', action: 'Handled ticket #4521', time: '5 min ago', status: 'success' },
    { agent: 'Data Pipeline', action: 'Sync completed', time: '12 min ago', status: 'success' },
    { agent: 'Research Agent', action: 'Query timeout', time: '18 min ago', status: 'error' },
    { agent: 'Sales Agent', action: 'Report generated', time: '24 min ago', status: 'success' },
  ];

  const weeklyStats = [
    { day: 'Mon', requests: 4521 },
    { day: 'Tue', requests: 5234 },
    { day: 'Wed', requests: 4890 },
    { day: 'Thu', requests: 6102 },
    { day: 'Fri', requests: 5678 },
    { day: 'Sat', requests: 3245 },
    { day: 'Sun', requests: 2890 },
  ];

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'agents', label: 'Agents' },
    { id: 'costs', label: 'Costs' },
    { id: 'traces', label: 'Traces' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'enabled': return '#22c55e';
      case 'disabled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getApiColor = (api) => {
    switch(api) {
      case 'NLP to KGQL': return '#3b82f6';
      case 'Direct KGQL': return '#22c55e';
      case 'Alerts': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1115',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#e4e4e7',
      display: 'flex'
    }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1d23; }
        ::-webkit-scrollbar-thumb { background: #363b44; border-radius: 3px; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: '#13161b',
        borderRight: '1px solid #23272f',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: '1px solid #23272f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: '#3b82f6',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600
            }}>K</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Knowledge Grid</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', margin: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analytics</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSelectedAgentForCosts(null);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                background: activeSection === item.id ? '#1a1d23' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: activeSection === item.id ? '#fff' : '#9ca3af',
                fontSize: '13px',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                marginBottom: '2px'
              }}
            >{item.label}</button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid #23272f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#363b44',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>JD</div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>John Doe</p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          padding: '14px 24px',
          borderBottom: '1px solid #23272f',
          background: '#13161b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 2px' }}>
              {activeSection === 'overview' && 'Analytics Overview'}
              {activeSection === 'agents' && 'Registered Agents'}
              {activeSection === 'costs' && !selectedAgentForCosts && 'Cost Analysis'}
              {activeSection === 'costs' && selectedAgentForCosts && `${selectedAgentForCosts.name} - Cost Breakdown`}
              {activeSection === 'traces' && 'Query Traces'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {activeSection === 'costs' && selectedAgentForCosts && (
              <button 
                onClick={() => setSelectedAgentForCosts(null)}
                style={{
                  padding: '8px 14px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >← Back to Overview</button>
            )}
            {activeSection === 'agents' && (
              <>
                <button 
                  onClick={() => setShowTagManagementModal(true)}
                  style={{
                    padding: '8px 14px',
                    background: '#1a1d23',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#9ca3af',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >Manage Tags</button>
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  style={{
                    padding: '8px 14px',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >+ Register Agent</button>
              </>
            )}
            {activeSection !== 'agents' && !selectedAgentForCosts && (
              <>
                <select style={{
                  padding: '8px 12px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
                <button style={{
                  padding: '8px 14px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>Export Report</button>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          
          {/* OVERVIEW TAB */}
          {activeSection === 'overview' && (
            <>
              {/* Key Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {[
                  { label: 'Uptime', value: '99.2%' },
                  { label: 'Query Time', value: '234ms' },
                  { label: 'Monthly Spend', value: '$2.4K' },
                ].map((metric, idx) => (
                  <div key={idx} style={{
                    padding: '24px',
                    background: '#13161b',
                    borderRadius: '8px',
                    border: '1px solid #23272f',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '36px', fontWeight: 600, margin: '0 0 8px' }}>{metric.value}</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                {/* Left Column */}
                <div>
                  {/* Weekly Chart */}
                  <div style={{
                    padding: '20px',
                    background: '#13161b',
                    borderRadius: '8px',
                    border: '1px solid #23272f',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Weekly Performance</h3>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>32,560 requests this week</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
                      {weeklyStats.map((day, idx) => (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '100%',
                            height: `${(day.requests / 6102) * 120}px`,
                            background: '#3b82f6',
                            borderRadius: '4px 4px 0 0'
                          }} />
                          <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div style={{
                    padding: '20px',
                    background: '#13161b',
                    borderRadius: '8px',
                    border: '1px solid #23272f'
                  }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Insights & Recommendations</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {insights.map((insight, idx) => (
                        <div key={idx} style={{
                          padding: '14px',
                          background: '#1a1d23',
                          borderRadius: '6px',
                          borderLeft: `3px solid ${insight.type === 'insight' ? '#3b82f6' : insight.type === 'recommendation' ? '#22c55e' : '#eab308'}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              color: insight.type === 'insight' ? '#3b82f6' : insight.type === 'recommendation' ? '#22c55e' : '#eab308'
                            }}>{insight.type}</span>
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 4px' }}>{insight.title}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{insight.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Live Activity */}
                  <div style={{
                    padding: '20px',
                    background: '#13161b',
                    borderRadius: '8px',
                    border: '1px solid #23272f',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Live Activity</h3>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} style={{
                          padding: '12px',
                          background: '#1a1d23',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{activity.agent}</p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{activity.action}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              display: 'inline-block',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: activity.status === 'success' ? '#22c55e' : '#ef4444',
                              marginBottom: '4px'
                            }} />
                            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div style={{
                    padding: '20px',
                    background: '#13161b',
                    borderRadius: '8px',
                    border: '1px solid #23272f'
                  }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Quick Stats</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Active Agents', value: '4' },
                        { label: 'Avg Query Time', value: '234ms' },
                        { label: 'Tokens Today', value: '847K' },
                        { label: 'Cost Today', value: '$78.40' },
                        { label: 'Success Rate', value: '98.7%' },
                        { label: 'Queries/Min', value: '24.3' },
                      ].map((stat, idx) => (
                        <div key={idx} style={{
                          padding: '14px',
                          background: '#1a1d23',
                          borderRadius: '6px'
                        }}>
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                          <p style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* AGENTS TAB */}
          {activeSection === 'agents' && (
            <>
              {/* Agent Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Total Agents</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>{registeredAgents.length}</p>
                </div>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Enabled</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0, color: '#22c55e' }}>
                    {registeredAgents.filter(a => a.status === 'enabled').length}
                  </p>
                </div>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Disabled</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0, color: '#6b7280' }}>
                    {registeredAgents.filter(a => a.status === 'disabled').length}
                  </p>
                </div>
              </div>

              {/* Agents Table */}
              <div style={{
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#1a1d23' }}>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Agent Name</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>API Keys</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Tags</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Requests (24h)</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Avg Query Time</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Success Rate</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Last Active</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredAgents
                      .filter(agent => {
                        if (selectedTagFilter === 'all') return true;
                        const [category, value] = selectedTagFilter.split(':');
                        return agent.tags.some(tag => tag.category === category && tag.value === value);
                      })
                      .slice((currentAgentPage - 1) * agentsPerPage, currentAgentPage * agentsPerPage)
                      .map((agent, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1a1d23' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{agent.name}</p>
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{agent.id}</p>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {(() => {
                            const activeKeys = agent.apiKeys.filter(k => k.status === 'active').length;
                            const totalKeys = agent.apiKeys.length;
                            return (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: 500,
                                background: '#1a1d23',
                                color: activeKeys > 0 ? '#22c55e' : '#6b7280'
                              }}>
                                <span style={{ fontSize: '13px' }}>&#128273;</span>
                                {activeKeys} active{totalKeys > activeKeys ? ` / ${totalKeys} total` : ''}
                              </span>
                            );
                          })()}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '250px' }}>
                            {agent.tags.map((tag, tagIdx) => (
                              <span 
                                key={tagIdx}
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  background: `${tag.color}15`,
                                  color: tag.color,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {tag.value}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: '#1a1d23',
                            color: getStatusColor(agent.status)
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(agent.status) }}></span>
                            {agent.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px' }}>{agent.requests24h.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', color: '#9ca3af' }}>{agent.avgQueryTime}</td>
                        <td style={{ textAlign: 'right', padding: '14px 16px' }}>
                          {agent.successRate !== '-' ? (
                            <span style={{ fontSize: '13px', color: agent.successRate >= 99 ? '#22c55e' : '#eab308' }}>{agent.successRate}%</span>
                          ) : (
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', color: '#6b7280' }}>{agent.lastActive}</td>
                        <td style={{ textAlign: 'right', padding: '14px 16px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (openDropdownAgentId === agent.id) {
                                setOpenDropdownAgentId(null);
                              } else {
                                setSelectedAgentForConfig(agent);
                                const rect = e.currentTarget.getBoundingClientRect();
                                const dropdownHeight = 170;
                                const spaceBelow = window.innerHeight - rect.bottom;
                                setDropdownPosition({
                                  top: spaceBelow < dropdownHeight ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                                  right: window.innerWidth - rect.right
                                });
                                setOpenDropdownAgentId(agent.id);
                              }
                            }}
                            style={{
                              padding: '6px',
                              background: openDropdownAgentId === agent.id ? '#1a1d23' : 'transparent',
                              border: openDropdownAgentId === agent.id ? '1px solid #2d333b' : '1px solid transparent',
                              borderRadius: '4px',
                              color: '#9ca3af',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Agents Pagination */}
                {(() => {
                  const filteredAgents = registeredAgents.filter(agent => {
                    if (selectedTagFilter === 'all') return true;
                    const [category, value] = selectedTagFilter.split(':');
                    return agent.tags.some(tag => tag.category === category && tag.value === value);
                  });
                  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
                  
                  if (totalPages <= 1) return null;
                  
                  return (
                    <div style={{
                      padding: '12px 16px',
                      borderTop: '1px solid #1a1d23',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        Showing {(currentAgentPage - 1) * agentsPerPage + 1}-{Math.min(currentAgentPage * agentsPerPage, filteredAgents.length)} of {filteredAgents.length} agents
                      </span>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <button 
                          onClick={() => setCurrentAgentPage(Math.max(1, currentAgentPage - 1))}
                          disabled={currentAgentPage === 1}
                          style={{
                            padding: '6px 12px',
                            background: currentAgentPage === 1 ? '#13161b' : '#1a1d23',
                            border: '1px solid #2d333b',
                            borderRadius: '4px',
                            color: currentAgentPage === 1 ? '#4b5563' : '#9ca3af',
                            fontSize: '12px',
                            cursor: currentAgentPage === 1 ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit'
                          }}
                        >Previous</button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          
                          const showPage = pageNum === 1 || 
                                          pageNum === totalPages || 
                                          Math.abs(pageNum - currentAgentPage) <= 1;
                          
                          const showEllipsis = (pageNum === 2 && currentAgentPage > 3) ||
                                              (pageNum === totalPages - 1 && currentAgentPage < totalPages - 2);
                          
                          if (showEllipsis) {
                            return <span key={pageNum} style={{ padding: '0 4px', color: '#6b7280' }}>...</span>;
                          }
                          
                          if (!showPage && pageNum !== 2 && pageNum !== totalPages - 1) {
                            return null;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentAgentPage(pageNum)}
                              style={{
                                padding: '6px 12px',
                                background: currentAgentPage === pageNum ? '#3b82f6' : '#1a1d23',
                                border: '1px solid #2d333b',
                                borderRadius: '4px',
                                color: currentAgentPage === pageNum ? '#fff' : '#9ca3af',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontWeight: currentAgentPage === pageNum ? 500 : 400,
                                minWidth: '36px'
                              }}
                            >{pageNum}</button>
                          );
                        })}
                        
                        <button 
                          onClick={() => setCurrentAgentPage(Math.min(totalPages, currentAgentPage + 1))}
                          disabled={currentAgentPage === totalPages}
                          style={{
                            padding: '6px 12px',
                            background: currentAgentPage === totalPages ? '#13161b' : '#1a1d23',
                            border: '1px solid #2d333b',
                            borderRadius: '4px',
                            color: currentAgentPage === totalPages ? '#4b5563' : '#9ca3af',
                            fontSize: '12px',
                            cursor: currentAgentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit'
                          }}
                        >Next</button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* COSTS TAB */}
          {activeSection === 'costs' && !selectedAgentForCosts && (
            <>
              {/* Cost Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ padding: '24px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>This Month</p>
                  <p style={{ fontSize: '32px', fontWeight: 600, margin: '0 0 4px' }}>${costData.thisMonth.toFixed(2)}</p>
                  <p style={{ fontSize: '12px', color: '#22c55e', margin: 0 }}>+16% vs last month</p>
                </div>
                <div style={{ padding: '24px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Last Month</p>
                  <p style={{ fontSize: '32px', fontWeight: 600, margin: '0 0 4px' }}>${costData.lastMonth.toFixed(2)}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Completed</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* Cost by Agent */}
                <div style={{
                  padding: '20px',
                  background: '#13161b',
                  borderRadius: '8px',
                  border: '1px solid #23272f'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Cost by Agent</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {costData.byAgent.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px' }}>{item.name}</span>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>${item.cost.toFixed(2)}</span>
                        </div>
                        <div style={{ height: '6px', background: '#1a1d23', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${item.pct}%`,
                            background: '#3b82f6',
                            borderRadius: '3px'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost by API */}
                <div style={{
                  padding: '20px',
                  background: '#13161b',
                  borderRadius: '8px',
                  border: '1px solid #23272f'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Cost by API</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {costData.byApi.map((item, idx) => (
                      <div key={idx} style={{
                        padding: '14px',
                        background: '#1a1d23',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${getApiColor(item.name)}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>${item.cost.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                          <span>{item.requests.toLocaleString()} requests</span>
                          <span>${item.avgCost.toFixed(3)}/req</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Trend */}
              <div style={{
                padding: '20px',
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Daily Cost Trend</h3>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Last 14 days</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px' }}>
                  {costData.dailyCosts.map((cost, idx) => (
                    <div key={idx} style={{
                      flex: 1,
                      height: `${(cost / 112) * 100}px`,
                      background: '#3b82f6',
                      borderRadius: '3px 3px 0 0',
                      opacity: 0.7
                    }} title={`${cost}`} />
                  ))}
                </div>
              </div>

              {/* Detailed Agent Cost Table */}
              <div style={{
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #23272f' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Agent Cost Details</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#1a1d23' }}>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Agent Name</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>API Keys</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Total Cost</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Total Requests</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Avg Cost/Req</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>% of Total</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {costData.byAgent.map((agent, idx) => {
                      const matchingAgent = registeredAgents.find(a => a.name === agent.name);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #1a1d23' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{agent.name}</p>
                            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{agent.id}</p>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {(() => {
                              const activeKeys = matchingAgent?.apiKeys.filter(k => k.status === 'active').length || 0;
                              return (
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '10px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  background: '#1a1d23',
                                  color: activeKeys > 0 ? '#22c55e' : '#6b7280'
                                }}>{activeKeys} active</span>
                              );
                            })()}
                          </td>
                          <td style={{ textAlign: 'right', padding: '14px 16px', fontSize: '14px', fontWeight: 600 }}>${agent.cost.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', color: '#9ca3af' }}>{agent.requests.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>${(agent.cost / agent.requests).toFixed(4)}</td>
                          <td style={{ textAlign: 'right', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                              <div style={{ width: '60px', height: '6px', background: '#1a1d23', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%',
                                  width: `${agent.pct}%`,
                                  background: '#3b82f6',
                                  borderRadius: '3px'
                                }} />
                              </div>
                              <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '40px', textAlign: 'right' }}>{agent.pct.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', padding: '14px 16px' }}>
                            <button 
                              onClick={() => setSelectedAgentForCosts(agent)}
                              style={{
                                padding: '6px 10px',
                                background: '#1a1d23',
                                border: '1px solid #2d333b',
                                borderRadius: '4px',
                                color: '#3b82f6',
                                fontSize: '11px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontWeight: 500
                              }}
                            >View Details →</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* INDIVIDUAL AGENT COST BREAKDOWN */}
          {activeSection === 'costs' && selectedAgentForCosts && (
            <>
              {/* Agent Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Total Cost</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>${selectedAgentForCosts.cost.toFixed(2)}</p>
                </div>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Total Requests</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>{selectedAgentForCosts.requests.toLocaleString()}</p>
                </div>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>Avg Cost/Req</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>${(selectedAgentForCosts.cost / selectedAgentForCosts.requests).toFixed(4)}</p>
                </div>
                <div style={{ padding: '20px', background: '#13161b', borderRadius: '8px', border: '1px solid #23272f' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>% of Total Budget</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>{selectedAgentForCosts.pct.toFixed(1)}%</p>
                </div>
              </div>

              {/* API Breakdown */}
              <div style={{
                padding: '20px',
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 20px' }}>Cost Breakdown by API</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {Object.entries(selectedAgentForCosts.apiBreakdown).map(([apiName, data]) => (
                    <div key={apiName} style={{
                      padding: '16px',
                      background: '#1a1d23',
                      borderRadius: '8px',
                      border: '1px solid #2d333b',
                      borderLeft: `4px solid ${getApiColor(apiName)}`
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: getApiColor(apiName)
                        }}>{apiName}</span>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Cost</p>
                        <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>${data.cost.toFixed(2)}</p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                        <div>
                          <p style={{ margin: '0 0 4px', color: '#6b7280' }}>Requests</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{data.requests.toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 4px', color: '#6b7280' }}>Avg Cost</p>
                          <p style={{ margin: 0, fontWeight: 500, fontFamily: 'monospace' }}>
                            {data.avgCost > 0 ? `${data.avgCost.toFixed(4)}` : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked Line Chart - API Costs Over Time */}
              <div style={{
                padding: '20px',
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>API Cost Breakdown Over Time</h3>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '3px', background: '#3b82f6', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>NLP to KGQL</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '3px', background: '#22c55e', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Direct KGQL</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '3px', background: '#f59e0b', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Alerts</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ position: 'relative', height: '240px', padding: '20px 0' }}>
                  {/* Y-axis labels */}
                  <div style={{ position: 'absolute', left: '-10px', top: 0, bottom: 0, width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', textAlign: 'right' }}>
                    {(() => {
                      const maxVal = Math.max(...selectedAgentForCosts.dailyCosts);
                      return [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0].map((val, i) => (
                        <span key={i}>${val}</span>
                      ));
                    })()}
                  </div>

                  {/* Chart area */}
                  <div style={{ marginLeft: '50px', height: '100%', position: 'relative' }}>
                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="nlpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="kgqlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="alertGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={`${i * 25}%`}
                          x2="100%"
                          y2={`${i * 25}%`}
                          stroke="#23272f"
                          strokeWidth="1"
                        />
                      ))}

                      {(() => {
                        const maxVal = Math.max(...selectedAgentForCosts.dailyCosts);
                        const chartHeight = 200;
                        const chartWidth = 100; // percentage-based
                        const points = selectedAgentForCosts.dailyApiCosts;
                        const numDays = 14;
                        
                        // Calculate stacked values
                        const nlpPoints = points['NLP to KGQL'].map((val, i) => ({
                          x: (i / (numDays - 1)) * 100,
                          y: chartHeight - (val / maxVal * chartHeight),
                          val: val
                        }));
                        
                        const kgqlPoints = points['Direct KGQL'].map((val, i) => ({
                          x: (i / (numDays - 1)) * 100,
                          y: chartHeight - ((val + points['NLP to KGQL'][i]) / maxVal * chartHeight),
                          val: val
                        }));
                        
                        const alertPoints = points['Alerts'].map((val, i) => ({
                          x: (i / (numDays - 1)) * 100,
                          y: chartHeight - ((val + points['Direct KGQL'][i] + points['NLP to KGQL'][i]) / maxVal * chartHeight),
                          val: val
                        }));

                        // Create path strings for filled areas
                        const nlpArea = nlpPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + 
                                       ` L ${nlpPoints[nlpPoints.length - 1].x},${chartHeight} L 0,${chartHeight} Z`;
                        
                        const kgqlArea = kgqlPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + 
                                        ' ' + nlpPoints.slice().reverse().map(p => `L ${p.x},${p.y}`).join(' ') + ' Z';
                        
                        const alertArea = alertPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + 
                                         ' ' + kgqlPoints.slice().reverse().map(p => `L ${p.x},${p.y}`).join(' ') + ' Z';

                        return (
                          <>
                            {/* Filled areas */}
                            <path d={nlpArea} fill="url(#nlpGradient)" />
                            <path d={kgqlArea} fill="url(#kgqlGradient)" />
                            <path d={alertArea} fill="url(#alertGradient)" />
                            
                            {/* Lines */}
                            <polyline
                              points={nlpPoints.map(p => `${p.x},${p.y}`).join(' ')}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2.5"
                            />
                            <polyline
                              points={kgqlPoints.map(p => `${p.x},${p.y}`).join(' ')}
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="2.5"
                            />
                            <polyline
                              points={alertPoints.map(p => `${p.x},${p.y}`).join(' ')}
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2.5"
                            />

                            {/* Data points */}
                            {nlpPoints.map((p, i) => p.val > 0 && (
                              <circle key={`nlp-${i}`} cx={p.x} cy={p.y} r="3" fill="#3b82f6" />
                            ))}
                            {kgqlPoints.map((p, i) => p.val > 0 && (
                              <circle key={`kgql-${i}`} cx={p.x} cy={p.y} r="3" fill="#22c55e" />
                            ))}
                            {alertPoints.map((p, i) => p.val > 0 && (
                              <circle key={`alert-${i}`} cx={p.x} cy={p.y} r="3" fill="#f59e0b" />
                            ))}
                          </>
                        );
                      })()}
                    </svg>

                    {/* X-axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#6b7280' }}>
                      {selectedAgentForCosts.dailyCosts.map((_, i) => i % 2 === 0 && (
                        <span key={i}>Day {i + 1}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* Daily Cost Trend */}
                <div style={{
                  padding: '20px',
                  background: '#13161b',
                  borderRadius: '8px',
                  border: '1px solid #23272f'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Daily Cost Trend</h3>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Last 14 days</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '180px' }}>
                    {selectedAgentForCosts.dailyCosts.map((cost, idx) => {
                      const maxCost = Math.max(...selectedAgentForCosts.dailyCosts);
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <div style={{
                              width: '100%',
                              height: `${(cost / maxCost) * 160}px`,
                              background: '#3b82f6',
                              borderRadius: '4px 4px 0 0',
                              position: 'relative'
                            }} title={`${cost}`}>
                              <span style={{
                                position: 'absolute',
                                top: '-18px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '10px',
                                color: '#9ca3af',
                                whiteSpace: 'nowrap'
                              }}>${cost}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hourly Usage Pattern */}
                <div style={{
                  padding: '20px',
                  background: '#13161b',
                  borderRadius: '8px',
                  border: '1px solid #23272f'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Hourly Usage Pattern</h3>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Requests by hour</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '180px' }}>
                    {selectedAgentForCosts.hourlyPattern.map((requests, idx) => {
                      const maxRequests = Math.max(...selectedAgentForCosts.hourlyPattern);
                      const isPeak = requests >= maxRequests * 0.8;
                      return (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '100%',
                            height: `${(requests / maxRequests) * 160}px`,
                            background: isPeak ? '#22c55e' : '#3b82f6',
                            borderRadius: '2px 2px 0 0',
                            opacity: isPeak ? 1 : 0.7
                          }} title={`${idx}:00 - ${requests} requests`} />
                          {idx % 3 === 0 && (
                            <span style={{ fontSize: '9px', color: '#6b7280', marginTop: '6px' }}>{idx}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cost Insights */}
              <div style={{
                padding: '20px',
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>Cost Insights</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{
                    padding: '14px',
                    background: '#1a1d23',
                    borderRadius: '6px',
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Peak Usage Hours</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>
                      {selectedAgentForCosts.hourlyPattern.reduce((acc, val, idx) => 
                        val > selectedAgentForCosts.hourlyPattern[acc] ? idx : acc, 0)}:00 - {
                        (selectedAgentForCosts.hourlyPattern.reduce((acc, val, idx) => 
                          val > selectedAgentForCosts.hourlyPattern[acc] ? idx : acc, 0) + 3) % 24}:00
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '14px',
                    background: '#1a1d23',
                    borderRadius: '6px',
                    borderLeft: '3px solid #22c55e'
                  }}>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Daily Cost</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>
                      ${(selectedAgentForCosts.dailyCosts.reduce((a, b) => a + b, 0) / selectedAgentForCosts.dailyCosts.length).toFixed(2)}
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '14px',
                    background: '#1a1d23',
                    borderRadius: '6px',
                    borderLeft: '3px solid #eab308'
                  }}>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Projected Monthly</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>
                      ${((selectedAgentForCosts.dailyCosts.reduce((a, b) => a + b, 0) / selectedAgentForCosts.dailyCosts.length) * 30).toFixed(2)}
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '14px',
                    background: '#1a1d23',
                    borderRadius: '6px',
                    borderLeft: '3px solid #f59e0b'
                  }}>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cost Trend</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: selectedAgentForCosts.dailyCosts[selectedAgentForCosts.dailyCosts.length - 1] > selectedAgentForCosts.dailyCosts[0] ? '#ef4444' : '#22c55e' }}>
                      {selectedAgentForCosts.dailyCosts[selectedAgentForCosts.dailyCosts.length - 1] > selectedAgentForCosts.dailyCosts[0] ? '↑' : '↓'} 
                      {' '}
                      {Math.abs(((selectedAgentForCosts.dailyCosts[selectedAgentForCosts.dailyCosts.length - 1] - selectedAgentForCosts.dailyCosts[0]) / selectedAgentForCosts.dailyCosts[0] * 100)).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TRACES TAB */}
          {activeSection === 'traces' && (
            <>
              {/* Trace Filters */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f'
              }}>
                <select style={{
                  padding: '8px 12px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}>
                  <option>All Agents</option>
                  {registeredAgents.map(a => <option key={a.id}>{a.name}</option>)}
                </select>
                <select style={{
                  padding: '8px 12px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}>
                  <option>All APIs</option>
                  <option>Direct KGQL</option>
                  <option>Alerts</option>
                  <option>NLP to KGQL</option>
                </select>
                <select style={{
                  padding: '8px 12px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}>
                  <option>All Status</option>
                  <option>Success</option>
                  <option>Error</option>
                </select>
                <input
                  placeholder="Search queries..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#1a1d23',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Traces Table */}
              <div style={{
                background: '#13161b',
                borderRadius: '8px',
                border: '1px solid #23272f',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#1a1d23' }}>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Trace ID</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Agent</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>API</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Query</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Query Time</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Tokens</th>
                      <th style={{ textAlign: 'center', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traces
                      .slice((currentTracePage - 1) * tracesPerPage, currentTracePage * tracesPerPage)
                      .map((trace, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => {
                          setSelectedTrace(trace);
                          setShowTraceDetailModal(true);
                        }}
                        style={{ 
                          borderBottom: '1px solid #1a1d23', 
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1a1d23'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>{trace.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{trace.agent}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: `${getApiColor(trace.api)}15`,
                            color: getApiColor(trace.api)
                          }}>{trace.api}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trace.query}</td>
                        <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace' }}>{trace.queryTime}</td>
                        <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{trace.tokens || '-'}</td>
                        <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: trace.status === 'success' ? '#22c55e' : '#ef4444'
                          }} />
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>{trace.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #1a1d23',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    Showing {(currentTracePage - 1) * tracesPerPage + 1}-{Math.min(currentTracePage * tracesPerPage, traces.length)} of {traces.length} traces
                  </span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button 
                      onClick={() => setCurrentTracePage(Math.max(1, currentTracePage - 1))}
                      disabled={currentTracePage === 1}
                      style={{
                        padding: '6px 12px',
                        background: currentTracePage === 1 ? '#13161b' : '#1a1d23',
                        border: '1px solid #2d333b',
                        borderRadius: '4px',
                        color: currentTracePage === 1 ? '#4b5563' : '#9ca3af',
                        fontSize: '12px',
                        cursor: currentTracePage === 1 ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >Previous</button>
                    
                    {[...Array(Math.ceil(traces.length / tracesPerPage))].map((_, i) => {
                      const pageNum = i + 1;
                      const totalPages = Math.ceil(traces.length / tracesPerPage);
                      
                      // Show first page, last page, current page, and pages around current
                      const showPage = pageNum === 1 || 
                                      pageNum === totalPages || 
                                      Math.abs(pageNum - currentTracePage) <= 1;
                      
                      const showEllipsis = (pageNum === 2 && currentTracePage > 3) ||
                                          (pageNum === totalPages - 1 && currentTracePage < totalPages - 2);
                      
                      if (showEllipsis) {
                        return <span key={pageNum} style={{ padding: '0 4px', color: '#6b7280' }}>...</span>;
                      }
                      
                      if (!showPage && pageNum !== 2 && pageNum !== totalPages - 1) {
                        return null;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentTracePage(pageNum)}
                          style={{
                            padding: '6px 12px',
                            background: currentTracePage === pageNum ? '#3b82f6' : '#1a1d23',
                            border: '1px solid #2d333b',
                            borderRadius: '4px',
                            color: currentTracePage === pageNum ? '#fff' : '#9ca3af',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: currentTracePage === pageNum ? 500 : 400,
                            minWidth: '36px'
                          }}
                        >{pageNum}</button>
                      );
                    })}
                    
                    <button 
                      onClick={() => setCurrentTracePage(Math.min(Math.ceil(traces.length / tracesPerPage), currentTracePage + 1))}
                      disabled={currentTracePage === Math.ceil(traces.length / tracesPerPage)}
                      style={{
                        padding: '6px 12px',
                        background: currentTracePage === Math.ceil(traces.length / tracesPerPage) ? '#13161b' : '#1a1d23',
                        border: '1px solid #2d333b',
                        borderRadius: '4px',
                        color: currentTracePage === Math.ceil(traces.length / tracesPerPage) ? '#4b5563' : '#9ca3af',
                        fontSize: '12px',
                        cursor: currentTracePage === Math.ceil(traces.length / tracesPerPage) ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >Next</button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Register Agent Modal */}
      {showRegisterModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowRegisterModal(false)}>
          <div style={{
            width: '480px',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Register New Agent</h2>
              <button 
                onClick={() => setShowRegisterModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px' }}>Agent Name</label>
                <input
                  placeholder="e.g., Sales Analysis Agent"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#1a1d23',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px' }}>Description (Optional)</label>
                <textarea
                  placeholder="Brief description of what this agent does..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#1a1d23',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{
                padding: '12px',
                background: '#1a1d23',
                borderRadius: '6px',
                border: '1px solid #2d333b'
              }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 4px' }}>Note</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>After registering the agent, you can generate API keys with specific endpoint access and expiration dates from the agent configuration.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setShowRegisterModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Cancel</button>
              <button style={{
                flex: 1,
                padding: '10px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>Register Agent</button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Actions Dropdown */}
      {openDropdownAgentId && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setOpenDropdownAgentId(null)}
          />
          <div style={{
            position: 'fixed',
            top: dropdownPosition.top,
            right: dropdownPosition.right,
            zIndex: 1000,
            width: '180px',
            background: '#1a1d23',
            border: '1px solid #2d333b',
            borderRadius: '8px',
            padding: '4px 0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            {[
              // { label: 'Agent Settings', onClick: () => { setShowAgentSettingsModal(true); setOpenDropdownAgentId(null); } },
              { label: 'API Keys', onClick: () => { setShowGenerateKeyForm(false); setShowApiKeysModal(true); setOpenDropdownAgentId(null); } },
              { label: 'Manage Tags', onClick: () => { setShowAgentTagsModal(true); setOpenDropdownAgentId(null); } },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  background: 'none',
                  border: 'none',
                  color: '#e4e4e7',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#23272f'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >{item.label}</button>
            ))}
            <div style={{ height: '1px', background: '#2d333b', margin: '4px 0' }} />
            <button
              onClick={() => { setShowDeleteConfirmModal(true); setOpenDropdownAgentId(null); }}
              style={{
                width: '100%',
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#23272f'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >Disable Agent</button>
          </div>
        </>
      )}

      {/* Agent Settings Modal */}
      {showAgentSettingsModal && selectedAgentForConfig && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAgentSettingsModal(false)}>
          <div style={{
            width: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Agent Settings</h2>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{selectedAgentForConfig.id}</p>
              </div>
              <button
                onClick={() => setShowAgentSettingsModal(false)}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}
              >×</button>
            </div>

            {/* Agent Status Banner */}
            <div style={{
              padding: '14px',
              background: '#1a1d23',
              borderRadius: '8px',
              border: '1px solid #2d333b',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: '#0f1115',
                    color: getStatusColor(selectedAgentForConfig.status)
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(selectedAgentForConfig.status) }}></span>
                    {selectedAgentForConfig.status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>• Last active: {selectedAgentForConfig.lastActive}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>24H Requests</p>
                <p style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{selectedAgentForConfig.requests24h.toLocaleString()}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px' }}>Agent Name</label>
                <input
                  defaultValue={selectedAgentForConfig.name}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#1a1d23',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px' }}>Agent Status</label>
                <select
                  defaultValue={selectedAgentForConfig.status}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#1a1d23',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Performance Settings */}
              <div style={{
                padding: '16px',
                background: '#1a1d23',
                borderRadius: '8px',
                border: '1px solid #2d333b'
              }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 12px' }}>Performance Settings</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Rate Limit (req/min)</label>
                    <input
                      type="number"
                      defaultValue="100"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: '#0f1115',
                        border: '1px solid #23272f',
                        borderRadius: '6px',
                        color: '#e4e4e7',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Timeout (ms)</label>
                    <input
                      type="number"
                      defaultValue="5000"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: '#0f1115',
                        border: '1px solid #23272f',
                        borderRadius: '6px',
                        color: '#e4e4e7',
                        fontSize: '13px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Alert Thresholds */}
              <div style={{
                padding: '16px',
                background: '#1a1d23',
                borderRadius: '8px',
                border: '1px solid #2d333b'
              }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 12px' }}>Alert Thresholds</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" defaultChecked id="errorAlert" style={{ width: '16px', height: '16px' }} />
                    <label htmlFor="errorAlert" style={{ fontSize: '12px', color: '#e4e4e7', flex: 1 }}>Alert on error rate {'>'}5%</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" defaultChecked id="latencyAlert" style={{ width: '16px', height: '16px' }} />
                    <label htmlFor="latencyAlert" style={{ fontSize: '12px', color: '#e4e4e7', flex: 1 }}>Alert on query time {'>'}1000ms</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" id="costAlert" style={{ width: '16px', height: '16px' }} />
                    <label htmlFor="costAlert" style={{ fontSize: '12px', color: '#e4e4e7', flex: 1 }}>Alert on daily cost {'>'}$50</label>
                  </div>
                </div>
              </div>

              {/* Current Metrics */}
              <div style={{
                padding: '16px',
                background: '#1a1d23',
                borderRadius: '8px',
                border: '1px solid #2d333b'
              }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 12px' }}>Current Metrics</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Avg Query Time</p>
                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>{selectedAgentForConfig.avgQueryTime}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Success Rate</p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      margin: 0,
                      color: selectedAgentForConfig.successRate >= 99 ? '#22c55e' : '#eab308'
                    }}>
                      {selectedAgentForConfig.successRate !== '-' ? `${selectedAgentForConfig.successRate}%` : '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Created</p>
                    <p style={{ fontSize: '12px', fontWeight: 500, margin: 0, color: '#9ca3af' }}>{selectedAgentForConfig.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAgentSettingsModal(false)}
                style={{
                  padding: '10px 16px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Cancel</button>
              <button style={{
                padding: '10px 16px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Modal */}
      {showApiKeysModal && selectedAgentForConfig && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowApiKeysModal(false)}>
          <div style={{
            width: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>API Keys</h2>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{selectedAgentForConfig.name} — {selectedAgentForConfig.id}</p>
              </div>
              <button
                onClick={() => setShowApiKeysModal(false)}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}
              >×</button>
            </div>

            <div style={{
              padding: '16px',
              background: '#1a1d23',
              borderRadius: '8px',
              border: '1px solid #2d333b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: 0 }}>API Keys</p>
                  <span style={{
                    padding: '1px 7px',
                    background: '#0f1115',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#6b7280'
                  }}>{selectedAgentForConfig.apiKeys.length}</span>
                </div>
                <button
                  onClick={() => setShowGenerateKeyForm(!showGenerateKeyForm)}
                  style={{
                    padding: '5px 10px',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >{showGenerateKeyForm ? 'Cancel' : '+ Generate Key'}</button>
              </div>

              {/* Generate Key Form */}
              {showGenerateKeyForm && (
                <div style={{
                  padding: '12px',
                  background: '#0f1115',
                  borderRadius: '6px',
                  border: '1px solid #23272f',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Key Name</label>
                      <input
                        placeholder="e.g., Production Key"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#13161b',
                          border: '1px solid #23272f',
                          borderRadius: '6px',
                          color: '#e4e4e7',
                          fontSize: '12px',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Expiration Date <span style={{ color: '#ef4444' }}>*</span></label>
                      <input
                        type="date"
                        required
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#13161b',
                          border: '1px solid #23272f',
                          borderRadius: '6px',
                          color: '#e4e4e7',
                          fontSize: '12px',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Endpoints <span style={{ color: '#ef4444' }}>*</span> <span style={{ color: '#4b5563', fontWeight: 400 }}>(select at least one)</span></label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {availableEndpoints.map((ep) => (
                          <label key={ep.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e4e4e7', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ width: '14px', height: '14px' }} />
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }}>{ep.path}</span>
                            <span style={{ fontSize: '11px', color: '#4b5563' }}>({ep.label})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button style={{
                      padding: '8px 12px',
                      background: '#22c55e',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      marginTop: '4px'
                    }}>Generate API Key</button>
                  </div>
                </div>
              )}

              {/* Existing Keys List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedAgentForConfig.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} style={{
                    padding: '10px 12px',
                    background: '#0f1115',
                    borderRadius: '6px',
                    border: `1px solid ${apiKey.status === 'expired' ? '#7f1d1d' : '#23272f'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: apiKey.status === 'active' ? '#22c55e' : '#ef4444'
                        }}></span>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#e4e4e7' }}>{apiKey.name}</span>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6b7280' }}>{apiKey.keyPreview}</span>
                      </div>
                      <button style={{
                        padding: '3px 8px',
                        background: 'none',
                        border: '1px solid #7f1d1d',
                        borderRadius: '4px',
                        color: '#ef4444',
                        fontSize: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}>{apiKey.status === 'active' ? 'Revoke' : 'Expired'}</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                      {apiKey.endpoints.map((ep) => (
                        <span key={ep} style={{
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          background: '#1a1d2380',
                          color: '#9ca3af'
                        }}>{ep}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#4b5563' }}>
                      <span>Expires: <span style={{ color: apiKey.status === 'expired' ? '#ef4444' : '#6b7280' }}>{apiKey.expirationDate}</span></span>
                      <span>Created: {apiKey.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowApiKeysModal(false)}
                style={{
                  padding: '10px 16px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Tags Modal */}
      {showAgentTagsModal && selectedAgentForConfig && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAgentTagsModal(false)}>
          <div style={{
            width: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Manage Tags</h2>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{selectedAgentForConfig.name}</p>
              </div>
              <button
                onClick={() => setShowAgentTagsModal(false)}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '20px', cursor: 'pointer' }}
              >×</button>
            </div>

            <div style={{
              padding: '16px',
              background: '#1a1d23',
              borderRadius: '8px',
              border: '1px solid #2d333b'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 12px' }}>Agent Tags</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {selectedAgentForConfig.tags && selectedAgentForConfig.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: `${tag.color}15`,
                      color: tag.color
                    }}
                  >
                    {tag.value}
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: tag.color,
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0,
                        lineHeight: 1
                      }}
                    >×</button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                <select style={{
                  padding: '8px 10px',
                  background: '#0f1115',
                  border: '1px solid #23272f',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  fontSize: '12px',
                  fontFamily: 'inherit'
                }}>
                  <option value="">Select a tag...</option>
                  {tagCategories.map(category => (
                    <optgroup key={category.name} label={category.name}>
                      {category.tags.map(tag => (
                        <option key={`${category.name}-${tag.value}`} value={`${category.name}:${tag.value}`}>
                          {tag.value}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button style={{
                  padding: '8px 12px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>Add Tag</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAgentTagsModal(false)}
                style={{
                  padding: '10px 16px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Cancel</button>
              <button style={{
                padding: '10px 16px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>Save Tags</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Agent Confirmation */}
      {showDeleteConfirmModal && selectedAgentForConfig && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowDeleteConfirmModal(false)}>
          <div style={{
            width: '400px',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>Delete Agent</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 8px' }}>
              Are you sure you want to delete <strong style={{ color: '#e4e4e7' }}>{selectedAgentForConfig.name}</strong>?
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 20px' }}>
              This will permanently revoke all {selectedAgentForConfig.apiKeys.length} API key{selectedAgentForConfig.apiKeys.length !== 1 ? 's' : ''} associated with this agent. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                style={{
                  padding: '10px 16px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Cancel</button>
              <button style={{
                padding: '10px 16px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>Delete Agent</button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Management Modal */}
      {showTagManagementModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowTagManagementModal(false)}>
          <div style={{
            width: '700px',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Manage Tags</h2>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Create and organize tag categories</p>
              </div>
              <button 
                onClick={() => setShowTagManagementModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>

            {/* Add New Category */}
            <div style={{
              padding: '16px',
              background: '#1a1d23',
              borderRadius: '8px',
              border: '1px solid #2d333b',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', margin: '0 0 12px' }}>Add New Category</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                <input
                  placeholder="Category name (e.g., Environment, Team)"
                  style={{
                    padding: '10px 12px',
                    background: '#0f1115',
                    border: '1px solid #23272f',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
                <button style={{
                  padding: '10px 16px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>Create Category</button>
              </div>
            </div>

            {/* Tag Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tagCategories.map((category, catIdx) => (
                <div 
                  key={catIdx}
                  style={{
                    padding: '16px',
                    background: '#1a1d23',
                    borderRadius: '8px',
                    border: '1px solid #2d333b'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{category.name}</h3>
                    <button style={{
                      padding: '4px 8px',
                      background: 'none',
                      border: '1px solid #2d333b',
                      borderRadius: '4px',
                      color: '#6b7280',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>Delete</button>
                  </div>

                  {/* Existing Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {category.tags.map((tag, tagIdx) => (
                      <span 
                        key={tagIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 500,
                          background: `${tag.color}15`,
                          color: tag.color
                        }}
                      >
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: tag.color 
                        }}></span>
                        {tag.value}
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: tag.color,
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: 0,
                            lineHeight: 1
                          }}
                        >×</button>
                      </span>
                    ))}
                  </div>

                  {/* Add New Tag */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px' }}>
                    <input
                      placeholder="Tag name"
                      style={{
                        padding: '8px 10px',
                        background: '#0f1115',
                        border: '1px solid #23272f',
                        borderRadius: '6px',
                        color: '#e4e4e7',
                        fontSize: '12px',
                        fontFamily: 'inherit'
                      }}
                    />
                    <input
                      type="color"
                      defaultValue="#3b82f6"
                      style={{
                        width: '40px',
                        height: '34px',
                        padding: '2px',
                        background: '#0f1115',
                        border: '1px solid #23272f',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                    <button style={{
                      padding: '8px 12px',
                      background: '#22c55e',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}>+ Add</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowTagManagementModal(false)}
                style={{
                  padding: '10px 16px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Trace Detail Modal */}
      {showTraceDetailModal && selectedTrace && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }} onClick={() => setShowTraceDetailModal(false)}>
          <div style={{
            width: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#13161b',
            borderRadius: '12px',
            border: '1px solid #23272f',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Trace Details</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{selectedTrace.id}</span>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: selectedTrace.status === 'success' ? '#22c55e' : '#ef4444'
                  }} />
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 500,
                    color: selectedTrace.status === 'success' ? '#22c55e' : '#ef4444'
                  }}>{selectedTrace.status.toUpperCase()}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowTraceDetailModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>

            {/* Overview Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ padding: '14px', background: '#1a1d23', borderRadius: '8px', border: '1px solid #2d333b' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Query Time</p>
                <p style={{ fontSize: '18px', fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>{selectedTrace.queryTime}</p>
              </div>
              <div style={{ padding: '14px', background: '#1a1d23', borderRadius: '8px', border: '1px solid #2d333b' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Status Code</p>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  margin: 0,
                  color: selectedTrace.status_code >= 200 && selectedTrace.status_code < 300 ? '#22c55e' : '#ef4444'
                }}>{selectedTrace.status_code}</p>
              </div>
              <div style={{ padding: '14px', background: '#1a1d23', borderRadius: '8px', border: '1px solid #2d333b' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Rows Returned</p>
                <p style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{selectedTrace.rows_returned.toLocaleString()}</p>
              </div>
              <div style={{ padding: '14px', background: '#1a1d23', borderRadius: '8px', border: '1px solid #2d333b' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Tokens Used</p>
                <p style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{selectedTrace.tokens > 0 ? selectedTrace.tokens.toLocaleString() : '-'}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Request Details */}
                <div style={{
                  padding: '16px',
                  background: '#1a1d23',
                  borderRadius: '8px',
                  border: '1px solid #2d333b'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#e4e4e7' }}>Request Details</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Agent</p>
                      <p style={{ fontSize: '13px', margin: 0 }}>{selectedTrace.agent}</p>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: 0, fontFamily: 'monospace' }}>{selectedTrace.client_id}</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>API Type</p>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        background: `${getApiColor(selectedTrace.api)}15`,
                        color: getApiColor(selectedTrace.api)
                      }}>{selectedTrace.api}</span>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Endpoint</p>
                      <p style={{ fontSize: '12px', margin: 0, fontFamily: 'monospace', color: '#9ca3af' }}>{selectedTrace.endpoint}</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>HTTP Method</p>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: selectedTrace.http_method === 'GET' ? '#22c55e15' : '#3b82f615',
                        color: selectedTrace.http_method === 'GET' ? '#22c55e' : '#3b82f6',
                        fontFamily: 'monospace'
                      }}>{selectedTrace.http_method}</span>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Timestamp</p>
                      <p style={{ fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>{selectedTrace.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div style={{
                  padding: '16px',
                  background: '#1a1d23',
                  borderRadius: '8px',
                  border: '1px solid #2d333b'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#e4e4e7' }}>Client Information</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>IP Address</p>
                      <p style={{ fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>{selectedTrace.client_ip}</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>User Agent</p>
                      <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>{selectedTrace.user_agent}</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Entity ID</p>
                      <p style={{ fontSize: '12px', margin: 0, fontFamily: 'monospace', color: '#9ca3af' }}>{selectedTrace.external_api_client_entity_id}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div style={{
                  padding: '16px',
                  background: '#1a1d23',
                  borderRadius: '8px',
                  border: '1px solid #2d333b'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#e4e4e7' }}>Performance Metrics</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Execution Time</p>
                      <p style={{ fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>{selectedTrace.execution_time_seconds.toFixed(3)}s</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Duration</p>
                      <p style={{ fontSize: '13px', margin: 0, fontFamily: 'monospace' }}>{selectedTrace.duration_seconds.toFixed(3)}s</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Row Count</p>
                      <p style={{ fontSize: '13px', margin: 0 }}>{selectedTrace.row_count.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Metric Type</p>
                      <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>{selectedTrace.metric_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Query */}
                <div style={{
                  padding: '16px',
                  background: '#1a1d23',
                  borderRadius: '8px',
                  border: '1px solid #2d333b'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#e4e4e7' }}>Query</h3>
                  <div style={{
                    padding: '12px',
                    background: '#0f1115',
                    borderRadius: '6px',
                    border: '1px solid #23272f',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#e4e4e7',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {selectedTrace.query}
                  </div>
                </div>

                {/* Error Information */}
                {selectedTrace.error_message && (
                  <div style={{
                    padding: '16px',
                    background: '#1a1d23',
                    borderRadius: '8px',
                    border: '1px solid #ef444415',
                    borderLeft: '3px solid #ef4444'
                  }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#ef4444' }}>Error Details</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Error Message</p>
                        <p style={{ fontSize: '12px', margin: 0, color: '#ef4444' }}>{selectedTrace.error_message}</p>
                      </div>
                      
                      {selectedTrace.error_type && (
                        <div>
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Error Type</p>
                          <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>{selectedTrace.error_type}</p>
                        </div>
                      )}
                      
                      {selectedTrace.auth_failure_reason && (
                        <div>
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Auth Failure Reason</p>
                          <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>{selectedTrace.auth_failure_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rate Limiting */}
                {selectedTrace.limit_type && (
                  <div style={{
                    padding: '16px',
                    background: '#1a1d23',
                    borderRadius: '8px',
                    border: '1px solid #eab30815',
                    borderLeft: '3px solid #eab308'
                  }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#eab308' }}>Rate Limiting</h3>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Limit Type</p>
                      <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>{selectedTrace.limit_type}</p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedTrace.metadata && Object.keys(selectedTrace.metadata).length > 0 && (
                  <div style={{
                    padding: '16px',
                    background: '#1a1d23',
                    borderRadius: '8px',
                    border: '1px solid #2d333b'
                  }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 14px', color: '#e4e4e7' }}>Metadata</h3>
                    <div style={{
                      padding: '12px',
                      background: '#0f1115',
                      borderRadius: '6px',
                      border: '1px solid #23272f',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#9ca3af',
                      lineHeight: '1.6',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {JSON.stringify(selectedTrace.metadata, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button 
                style={{
                  padding: '10px 16px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Export Trace</button>
              <button 
                onClick={() => setShowTraceDetailModal(false)}
                style={{
                  padding: '10px 16px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentAnalyticsV2;