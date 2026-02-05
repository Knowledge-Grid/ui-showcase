import React, { useState } from 'react';

const HumanInTheLoop = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [filterAgent, setFilterAgent] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [traceViewMode, setTraceViewMode] = useState('timeline');
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [detailModalTab, setDetailModalTab] = useState('details');

  // Mock data for pending approvals
  const pendingRequests = [
    {
      id: 'req-001',
      timestamp: '2 minutes ago',
      agent: 'Data Pipeline Agent',
      agentId: 'agent-003',
      type: 'action',
      action: 'Delete Records',
      riskLevel: 'high',
      requestedBy: 'system',
      description: 'Agent wants to delete 1,247 duplicate customer records from the database',
      details: {
        operation: 'DELETE',
        table: 'customers',
        affectedRecords: 1247,
        criteria: 'WHERE duplicate_flag = true AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)',
        estimatedImpact: 'High - Permanent data deletion',
        rollbackAvailable: false
      },
      reasoning: 'Identified duplicate entries created during data migration. Records have been inactive for 30+ days and flagged by deduplication algorithm with 99.2% confidence.',
      preview: {
        sampleRecords: [
          { id: 12847, name: 'John Smith', email: 'john.smith@example.com', duplicate_of: 12846 },
          { id: 15293, name: 'Sarah Johnson', email: 's.johnson@example.com', duplicate_of: 15292 },
          { id: 18471, name: 'Mike Williams', email: 'mike.w@example.com', duplicate_of: 18469 }
        ]
      },
      requiredApprovers: 1,
      currentApprovers: 0,
      trace: {
        id: 'trace-001',
        startTime: '2024-01-17T14:32:15Z',
        endTime: '2024-01-17T14:32:47Z',
        duration: 32000,
        observations: [
          {
            id: 'obs-001-1',
            type: 'llm',
            name: 'Duplicate Detection Analysis',
            startTime: '2024-01-17T14:32:15Z',
            endTime: '2024-01-17T14:32:28Z',
            duration: 13000,
            status: 'success',
            input: 'Analyze customer database for duplicate records using fuzzy matching on name, email, and phone',
            output: 'Identified 1,247 potential duplicates with 99.2% confidence. All duplicates are 30+ days old and inactive.',
            metadata: {
              model: 'claude-sonnet-4',
              tokens: { input: 245, output: 89 },
              cost: 0.0034
            }
          },
          {
            id: 'obs-001-2',
            type: 'tool',
            name: 'Database Query - Duplicate Check',
            parentId: 'obs-001-1',
            startTime: '2024-01-17T14:32:28Z',
            endTime: '2024-01-17T14:32:35Z',
            duration: 7000,
            status: 'success',
            input: 'SELECT * FROM customers WHERE duplicate_flag = true AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)',
            output: '1,247 records returned',
            metadata: {
              database: 'production',
              rowsAffected: 1247
            }
          },
          {
            id: 'obs-001-3',
            type: 'span',
            name: 'Risk Assessment',
            parentId: 'obs-001-1',
            startTime: '2024-01-17T14:32:35Z',
            endTime: '2024-01-17T14:32:40Z',
            duration: 5000,
            status: 'success',
            metadata: {
              riskScore: 0.85,
              riskLevel: 'high',
              requiresApproval: true
            }
          },
          {
            id: 'obs-001-4',
            type: 'llm',
            name: 'Generate Approval Request',
            parentId: 'obs-001-1',
            startTime: '2024-01-17T14:32:40Z',
            endTime: '2024-01-17T14:32:47Z',
            duration: 7000,
            status: 'success',
            input: 'Generate human-readable approval request for deleting 1,247 duplicate customer records',
            output: 'Agent wants to delete 1,247 duplicate customer records from the database',
            metadata: {
              model: 'claude-sonnet-4',
              tokens: { input: 156, output: 42 },
              cost: 0.0021
            }
          }
        ]
      }
    },
    {
      id: 'req-002',
      timestamp: '5 minutes ago',
      agent: 'Security Monitor',
      agentId: 'agent-004',
      type: 'result',
      action: 'Security Alert',
      riskLevel: 'critical',
      requestedBy: 'automated-scan',
      description: 'Suspicious access pattern detected - Multiple failed login attempts from unknown IP',
      details: {
        eventType: 'Authentication Failure',
        ipAddress: '185.220.101.47',
        attempts: 47,
        timeWindow: '5 minutes',
        targetAccounts: ['admin@company.com', 'root@company.com', 'sysadmin@company.com'],
        geolocation: 'Russia',
        threatScore: 94
      },
      reasoning: 'Detected brute force attack pattern. IP address is on known threat lists. Recommending immediate block and account security review.',
      recommendedAction: 'Block IP address and force password reset on targeted accounts',
      requiredApprovers: 1,
      currentApprovers: 0,
      trace: {
        id: 'trace-002',
        startTime: '2024-01-17T14:27:00Z',
        endTime: '2024-01-17T14:27:18Z',
        duration: 18000,
        observations: [
          {
            id: 'obs-002-1',
            type: 'span',
            name: 'Authentication Monitoring',
            startTime: '2024-01-17T14:27:00Z',
            endTime: '2024-01-17T14:27:18Z',
            duration: 18000,
            status: 'error',
            metadata: {
              eventType: 'security_alert',
              severity: 'critical'
            }
          },
          {
            id: 'obs-002-2',
            type: 'tool',
            name: 'Failed Login Detection',
            parentId: 'obs-002-1',
            startTime: '2024-01-17T14:27:00Z',
            endTime: '2024-01-17T14:27:05Z',
            duration: 5000,
            status: 'success',
            input: 'Monitor authentication events for anomalies',
            output: '47 failed login attempts detected from IP 185.220.101.47 in 5-minute window',
            metadata: {
              ipAddress: '185.220.101.47',
              attempts: 47,
              timeWindow: '5 minutes'
            }
          },
          {
            id: 'obs-002-3',
            type: 'llm',
            name: 'Threat Intelligence Lookup',
            parentId: 'obs-002-1',
            startTime: '2024-01-17T14:27:05Z',
            endTime: '2024-01-17T14:27:10Z',
            duration: 5000,
            status: 'success',
            input: 'Analyze IP 185.220.101.47 against threat intelligence databases',
            output: 'IP found in 3 threat databases. Known for brute force attacks. Geolocation: Russia. Threat score: 94/100',
            metadata: {
              model: 'claude-sonnet-4',
              threatScore: 94,
              databases: ['AbuseIPDB', 'AlienVault', 'Spamhaus']
            }
          },
          {
            id: 'obs-002-4',
            type: 'llm',
            name: 'Security Response Recommendation',
            parentId: 'obs-002-1',
            startTime: '2024-01-17T14:27:10Z',
            endTime: '2024-01-17T14:27:18Z',
            duration: 8000,
            status: 'success',
            input: 'Generate security response recommendation for brute force attack from 185.220.101.47',
            output: 'Recommend immediate IP block and forced password reset on all targeted accounts',
            metadata: {
              model: 'claude-sonnet-4',
              tokens: { input: 198, output: 67 },
              recommendedActions: ['block_ip', 'reset_passwords', 'notify_security_team']
            }
          }
        ]
      }
    },
    {
      id: 'req-003',
      timestamp: '12 minutes ago',
      agent: 'Sales Analysis Agent',
      agentId: 'agent-001',
      type: 'action',
      action: 'Send Report',
      riskLevel: 'medium',
      requestedBy: 'scheduled-task',
      description: 'Send quarterly sales report to executive team and board members',
      details: {
        operation: 'EMAIL',
        recipients: ['ceo@company.com', 'cfo@company.com', 'board@company.com'],
        attachments: ['Q4_2024_Sales_Report.pdf', 'Revenue_Analysis.xlsx'],
        dataClassification: 'Confidential',
        containsPII: false,
        containsFinancialData: true
      },
      reasoning: 'Scheduled quarterly report generation completed. Data includes revenue figures, customer acquisition metrics, and sales forecasts.',
      preview: {
        reportSummary: {
          totalRevenue: '$12.4M',
          growth: '+23.5% YoY',
          newCustomers: 1847,
          churnRate: '3.2%'
        }
      },
      requiredApprovers: 1,
      currentApprovers: 0
    },
    {
      id: 'req-004',
      timestamp: '18 minutes ago',
      agent: 'Financial Analyst Bot',
      agentId: 'agent-005',
      type: 'action',
      action: 'Update Pricing',
      riskLevel: 'high',
      requestedBy: 'pricing-optimization',
      description: 'Adjust product pricing for 23 SKUs based on competitive analysis and demand elasticity',
      details: {
        operation: 'UPDATE',
        affectedProducts: 23,
        priceChanges: 'Range from -5% to +12%',
        expectedRevenueImpact: '+$47K monthly',
        competitorData: 'Based on analysis of 5 competitors',
        implementationDate: 'Immediate'
      },
      reasoning: 'Machine learning model identified pricing optimization opportunities. Historical data shows 87% accuracy in revenue predictions.',
      preview: {
        sampleChanges: [
          { sku: 'PRD-001', name: 'Enterprise License', currentPrice: '$499', newPrice: '$549', change: '+10%' },
          { sku: 'PRD-002', name: 'Professional Plan', currentPrice: '$99', newPrice: '$94', change: '-5%' },
          { sku: 'PRD-003', name: 'Starter Pack', currentPrice: '$29', newPrice: '$32', change: '+10%' }
        ]
      },
      requiredApprovers: 2,
      currentApprovers: 0
    },
    {
      id: 'req-005',
      timestamp: '25 minutes ago',
      agent: 'Customer Support Bot',
      agentId: 'agent-002',
      type: 'result',
      action: 'Issue Refund',
      riskLevel: 'medium',
      requestedBy: 'customer-ticket-#5847',
      description: 'Customer requesting refund for service outage during critical business hours',
      details: {
        customerId: 'CUST-10293',
        customerName: 'TechCorp Solutions',
        accountValue: '$2,400/month',
        refundAmount: '$800',
        reason: 'Service outage - 6 hours downtime',
        ticketId: '#5847',
        customerTier: 'Enterprise'
      },
      reasoning: 'Service outage confirmed in logs. Customer affected during critical business hours. Refund aligns with SLA terms. Customer has been with us for 3 years with no previous refund requests.',
      recommendedAction: 'Approve refund and offer 10% discount on next month as goodwill gesture',
      requiredApprovers: 1,
      currentApprovers: 0
    },
    {
      id: 'req-006',
      timestamp: '32 minutes ago',
      agent: 'Data Pipeline Agent',
      agentId: 'agent-003',
      type: 'action',
      action: 'API Integration',
      riskLevel: 'low',
      requestedBy: 'integration-request',
      description: 'Enable new API integration with third-party analytics provider',
      details: {
        operation: 'ENABLE_INTEGRATION',
        provider: 'Analytics Plus',
        dataShared: ['Page views', 'User sessions', 'Event tracking'],
        accessLevel: 'Read-only',
        dataRetention: '90 days',
        complianceReview: 'Passed'
      },
      reasoning: 'Marketing team requested integration for enhanced analytics capabilities. Provider has been vetted by security team and privacy review completed.',
      preview: {
        permissions: ['Read analytics data', 'Access dashboard metrics', 'Export reports']
      },
      requiredApprovers: 1,
      currentApprovers: 0
    }
  ];

  // Mock data for approval history
  const approvalHistory = [
    {
      id: 'req-100',
      timestamp: '1 hour ago',
      agent: 'Security Monitor',
      type: 'action',
      action: 'Block IP Address',
      riskLevel: 'critical',
      status: 'approved',
      approvedBy: 'Sarah Chen',
      approvalTime: '1 hour ago',
      executionStatus: 'completed',
      note: 'Confirmed malicious activity. Blocked immediately.'
    },
    {
      id: 'req-101',
      timestamp: '2 hours ago',
      agent: 'Data Pipeline Agent',
      type: 'action',
      action: 'Data Export',
      riskLevel: 'medium',
      status: 'rejected',
      approvedBy: 'Mike Thompson',
      approvalTime: '2 hours ago',
      note: 'Export includes PII. Need DPO approval first.'
    },
    {
      id: 'req-102',
      timestamp: '3 hours ago',
      agent: 'Sales Analysis Agent',
      type: 'result',
      action: 'Generate Report',
      riskLevel: 'low',
      status: 'approved',
      approvedBy: 'Sarah Chen',
      approvalTime: '3 hours ago',
      executionStatus: 'completed',
      note: 'Report reviewed and approved for distribution.'
    },
    {
      id: 'req-103',
      timestamp: '5 hours ago',
      agent: 'Financial Analyst Bot',
      type: 'action',
      action: 'Budget Reallocation',
      riskLevel: 'high',
      status: 'approved',
      approvedBy: 'David Park',
      approvalTime: '4 hours ago',
      executionStatus: 'completed',
      note: 'Approved after CFO review. Good analysis.'
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleApprove = (request, action) => {
    console.log(`${action} request:`, request.id);
    setShowApprovalModal(false);
    setSelectedRequest(null);
    setApprovalNote('');
    setDetailModalTab('details');
    setSelectedObservation(null);
  };

  const handleBatchApprove = () => {
    console.log('Batch approving:', selectedRequests);
    setSelectedRequests([]);
  };

  const toggleSelectRequest = (id) => {
    setSelectedRequests(prev =>
      prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
    );
  };

  const filteredRequests = pendingRequests.filter(req => {
    if (filterAgent !== 'all' && req.agentId !== filterAgent) return false;
    if (filterRisk !== 'all' && req.riskLevel !== filterRisk) return false;
    if (filterType !== 'all' && req.type !== filterType) return false;
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1419',
      color: '#e4e4e7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#1a1d23',
        borderBottom: '1px solid #2d333b',
        padding: '20px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px' }}>
              Human-in-the-Loop Approvals
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Review and approve agent actions and results before execution
            </p>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid #2d333b',
              borderRadius: '6px',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Approval Settings
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '16px',
            background: '#0f1115',
            border: '1px solid #2d333b',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>PENDING APPROVALS</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#f59e0b' }}>{pendingRequests.length}</div>
          </div>
          <div style={{
            padding: '16px',
            background: '#0f1115',
            border: '1px solid #2d333b',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>CRITICAL PRIORITY</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#dc2626' }}>
              {pendingRequests.filter(r => r.riskLevel === 'critical').length}
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: '#0f1115',
            border: '1px solid #2d333b',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>APPROVED TODAY</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#10b981' }}>
              {approvalHistory.filter(r => r.status === 'approved').length}
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: '#0f1115',
            border: '1px solid #2d333b',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>AVG APPROVAL TIME</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>3.2m</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: '#1a1d23',
        borderBottom: '1px solid #2d333b',
        padding: '0 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['pending', 'history', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? '#3b82f6' : 'transparent'}`,
                color: activeTab === tab ? '#3b82f6' : '#6b7280',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {tab === 'pending' && `Pending (${pendingRequests.length})`}
              {tab === 'history' && 'Approval History'}
              {tab === 'settings' && 'Auto-Approval Rules'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>

        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Filters and Batch Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: '#1a1d23',
              border: '1px solid #2d333b',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Filter by:</span>
                <select
                  value={filterAgent}
                  onChange={(e) => setFilterAgent(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    background: '#0f1115',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Agents</option>
                  <option value="agent-001">Sales Analysis Agent</option>
                  <option value="agent-002">Customer Support Bot</option>
                  <option value="agent-003">Data Pipeline Agent</option>
                  <option value="agent-004">Security Monitor</option>
                </select>

                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    background: '#0f1115',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    background: '#0f1115',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#e4e4e7',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="action">Actions</option>
                  <option value="result">Results</option>
                </select>
              </div>

              {selectedRequests.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    {selectedRequests.length} selected
                  </span>
                  <button
                    onClick={handleBatchApprove}
                    style={{
                      padding: '6px 16px',
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Batch Approve
                  </button>
                  <button
                    onClick={() => setSelectedRequests([])}
                    style={{
                      padding: '6px 16px',
                      background: 'transparent',
                      border: '1px solid #2d333b',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Approval Requests List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredRequests.map(request => (
                <div
                  key={request.id}
                  style={{
                    background: '#1a1d23',
                    border: `2px solid ${selectedRequests.includes(request.id) ? '#3b82f6' : '#2d333b'}`,
                    borderLeft: `4px solid ${getRiskColor(request.riskLevel)}`,
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Request Header */}
                  <div style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid #2d333b'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => toggleSelectRequest(request.id)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px', marginTop: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{
                            padding: '4px 10px',
                            background: `${getRiskColor(request.riskLevel)}20`,
                            border: `1px solid ${getRiskColor(request.riskLevel)}`,
                            borderRadius: '4px',
                            color: getRiskColor(request.riskLevel),
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {request.riskLevel} RISK
                          </span>
                          <span style={{
                            padding: '4px 10px',
                            background: request.type === 'action' ? '#3b82f620' : '#8b5cf620',
                            border: `1px solid ${request.type === 'action' ? '#3b82f6' : '#8b5cf6'}`,
                            borderRadius: '4px',
                            color: request.type === 'action' ? '#3b82f6' : '#8b5cf6',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {request.type}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{request.timestamp}</span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
                          {request.action}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 12px', lineHeight: '1.6' }}>
                          {request.description}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                          <span>Agent: <span style={{ color: '#e4e4e7' }}>{request.agent}</span></span>
                          <span>•</span>
                          <span>Requested by: <span style={{ color: '#e4e4e7' }}>{request.requestedBy}</span></span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {request.trace && (
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApprovalModal(true);
                            setDetailModalTab('trace');
                            setSelectedObservation(null);
                          }}
                          style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid #3b82f6',
                            borderRadius: '6px',
                            color: '#3b82f6',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          View Trace
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApprovalModal(true);
                          setDetailModalTab('details');
                          setSelectedObservation(null);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'transparent',
                          border: '1px solid #2d333b',
                          borderRadius: '6px',
                          color: '#9ca3af',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleApprove(request, 'Approve')}
                        style={{
                          padding: '8px 20px',
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(request, 'Reject')}
                        style={{
                          padding: '8px 20px',
                          background: '#ef4444',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* Quick Preview */}
                  <div style={{
                    padding: '16px 20px',
                    background: '#0f1115',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    {Object.entries(request.details).slice(0, 4).map(([key, value]) => (
                      <div key={key}>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: 500 }}>
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div style={{
                  padding: '60px',
                  textAlign: 'center',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px' }}>
                    All caught up!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    No pending approvals at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approval History Tab */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {approvalHistory.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '20px',
                  background: '#1a1d23',
                  border: '1px solid #2d333b',
                  borderLeft: `4px solid ${getStatusColor(item.status)}`,
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: `${getStatusColor(item.status)}20`,
                      border: `1px solid ${getStatusColor(item.status)}`,
                      borderRadius: '4px',
                      color: getStatusColor(item.status),
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {item.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{item.timestamp}</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px' }}>
                    {item.action}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
                    Agent: {item.agent} • Risk: {item.riskLevel}
                  </div>
                  {item.note && (
                    <div style={{
                      padding: '8px 12px',
                      background: '#0f1115',
                      border: '1px solid #2d333b',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#e4e4e7',
                      fontStyle: 'italic',
                      marginTop: '8px'
                    }}>
                      "{item.note}"
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    by {item.approvedBy}
                  </span>
                  {item.executionStatus && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#10b98120',
                      border: '1px solid #10b981',
                      borderRadius: '4px',
                      color: '#10b981',
                      fontSize: '11px'
                    }}>
                      {item.executionStatus}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-Approval Rules Tab */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: '#1a1d23',
              border: '1px solid #2d333b',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>
                Auto-Approval Rules
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px' }}>
                Define conditions where agent actions can be automatically approved without human intervention
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Auto-approve low-risk actions
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Automatically approve actions marked as "low risk" from trusted agents
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>

                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Auto-approve read-only operations
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Approve queries and reports that don't modify data
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>

                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Require dual approval for high-risk actions
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Actions marked "high" or "critical" need 2 approvers
                    </div>
                  </div>
                  <input type="checkbox" style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>

                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Time-based auto-approval
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Auto-approve if no action taken within 4 hours for medium/low risk
                    </div>
                  </div>
                  <input type="checkbox" style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>
              </div>
            </div>

            <div style={{
              background: '#1a1d23',
              border: '1px solid #2d333b',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>
                Notification Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Email notifications for critical requests
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Receive immediate email for critical priority approvals
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>

                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Slack notifications
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Post approval requests to #approvals channel
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>

                <label style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#0f1115',
                  border: '1px solid #2d333b',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Daily digest
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Receive daily summary of all approval activity
                    </div>
                  </div>
                  <input type="checkbox" style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#1a1d23',
            borderRadius: '12px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #2d333b'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #2d333b',
              position: 'sticky',
              top: 0,
              background: '#1a1d23',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: `${getRiskColor(selectedRequest.riskLevel)}20`,
                      border: `1px solid ${getRiskColor(selectedRequest.riskLevel)}`,
                      borderRadius: '4px',
                      color: getRiskColor(selectedRequest.riskLevel),
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {selectedRequest.riskLevel} RISK
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{selectedRequest.timestamp}</span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>
                    {selectedRequest.action}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                    Request ID: {selectedRequest.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setDetailModalTab('details');
                    setSelectedObservation(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '0',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Tab Navigation */}
              <div style={{
                display: 'flex',
                gap: '24px',
                borderBottom: '1px solid #2d333b',
                marginTop: '16px'
              }}>
                <button
                  onClick={() => setDetailModalTab('details')}
                  style={{
                    padding: '12px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${detailModalTab === 'details' ? '#3b82f6' : 'transparent'}`,
                    color: detailModalTab === 'details' ? '#3b82f6' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    marginBottom: '-1px'
                  }}
                >
                  Details
                </button>
                {selectedRequest.trace && (
                  <button
                    onClick={() => setDetailModalTab('trace')}
                    style={{
                      padding: '12px 0',
                      background: 'none',
                      border: 'none',
                      borderBottom: `2px solid ${detailModalTab === 'trace' ? '#3b82f6' : 'transparent'}`,
                      color: detailModalTab === 'trace' ? '#3b82f6' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      marginBottom: '-1px'
                    }}
                  >
                    Execution Trace
                  </button>
                )}
                {selectedRequest.preview && (
                  <button
                    onClick={() => setDetailModalTab('preview')}
                    style={{
                      padding: '12px 0',
                      background: 'none',
                      border: 'none',
                      borderBottom: `2px solid ${detailModalTab === 'preview' ? '#3b82f6' : 'transparent'}`,
                      color: detailModalTab === 'preview' ? '#3b82f6' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      marginBottom: '-1px'
                    }}
                  >
                    Data Preview
                  </button>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflow: 'auto', maxHeight: 'calc(90vh - 250px)' }}>
              {detailModalTab === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Description */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: '#e4e4e7' }}>
                      Description
                    </h3>
                    <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0, lineHeight: '1.6' }}>
                      {selectedRequest.description}
                    </p>
                  </div>

                  {/* Agent Reasoning */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: '#e4e4e7' }}>
                      Agent Reasoning
                    </h3>
                    <div style={{
                      padding: '16px',
                      background: '#0f1115',
                      border: '1px solid #2d333b',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#e4e4e7',
                      lineHeight: '1.6'
                    }}>
                      {selectedRequest.reasoning}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: '#e4e4e7' }}>
                      Technical Details
                    </h3>
                    <div style={{
                      background: '#0f1115',
                      border: '1px solid #2d333b',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      {Object.entries(selectedRequest.details).map(([key, value], index) => (
                        <div
                          key={key}
                          style={{
                            padding: '12px 16px',
                            borderBottom: index < Object.entries(selectedRequest.details).length - 1 ? '1px solid #2d333b' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action */}
                  {selectedRequest.recommendedAction && (
                    <div style={{
                      padding: '16px',
                      background: '#3b82f615',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px'
                    }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px', color: '#3b82f6' }}>
                        Recommended Action
                      </h3>
                      <p style={{ fontSize: '14px', color: '#e4e4e7', margin: 0 }}>
                        {selectedRequest.recommendedAction}
                      </p>
                    </div>
                  )}

                  {/* Approval Note */}
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: '#e4e4e7' }}>
                      Add Note (Optional)
                    </h3>
                    <textarea
                      value={approvalNote}
                      onChange={(e) => setApprovalNote(e.target.value)}
                      placeholder="Add a note explaining your decision..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0f1115',
                        border: '1px solid #2d333b',
                        borderRadius: '6px',
                        color: '#e4e4e7',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              )}

              {detailModalTab === 'trace' && selectedRequest.trace && (
                <div style={{ display: 'flex', gap: '24px' }}>
                  {/* Left: Trace Visualization */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* View Mode Toggle */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '20px',
                      background: '#0f1115',
                      border: '1px solid #2d333b',
                      borderRadius: '6px',
                      padding: '4px',
                      width: 'fit-content'
                    }}>
                      <button
                        onClick={() => setTraceViewMode('timeline')}
                        style={{
                          padding: '6px 16px',
                          background: traceViewMode === 'timeline' ? '#3b82f6' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          color: traceViewMode === 'timeline' ? '#fff' : '#9ca3af',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Timeline
                      </button>
                      <button
                        onClick={() => setTraceViewMode('tree')}
                        style={{
                          padding: '6px 16px',
                          background: traceViewMode === 'tree' ? '#3b82f6' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          color: traceViewMode === 'tree' ? '#fff' : '#9ca3af',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Tree
                      </button>
                      <button
                        onClick={() => setTraceViewMode('logs')}
                        style={{
                          padding: '6px 16px',
                          background: traceViewMode === 'logs' ? '#3b82f6' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          color: traceViewMode === 'logs' ? '#fff' : '#9ca3af',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Logs
                      </button>
                    </div>

                    {/* Trace Summary */}
                    <div style={{
                      padding: '16px',
                      background: '#0f1115',
                      border: '1px solid #2d333b',
                      borderRadius: '6px',
                      marginBottom: '20px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>TRACE ID</div>
                        <div style={{ fontSize: '13px', color: '#e4e4e7', fontFamily: 'monospace' }}>{selectedRequest.trace.id}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>DURATION</div>
                        <div style={{ fontSize: '13px', color: '#e4e4e7', fontFamily: 'monospace' }}>{selectedRequest.trace.duration}ms</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>OPERATIONS</div>
                        <div style={{ fontSize: '13px', color: '#e4e4e7', fontFamily: 'monospace' }}>{selectedRequest.trace.observations.length}</div>
                      </div>
                    </div>

                    {/* Timeline View */}
                    {traceViewMode === 'timeline' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedRequest.trace.observations.map((obs) => {
                          const startOffset = new Date(obs.startTime).getTime() - new Date(selectedRequest.trace.startTime).getTime();
                          const percentage = (startOffset / selectedRequest.trace.duration) * 100;
                          const width = (obs.duration / selectedRequest.trace.duration) * 100;

                          return (
                            <div
                              key={obs.id}
                              onClick={() => setSelectedObservation(obs)}
                              style={{
                                padding: '12px',
                                background: selectedObservation?.id === obs.id ? '#3b82f615' : '#0f1115',
                                border: `1px solid ${selectedObservation?.id === obs.id ? '#3b82f6' : '#2d333b'}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: obs.status === 'success' ? '#10b981' : obs.status === 'error' ? '#ef4444' : '#f59e0b',
                                    flexShrink: 0
                                  }} />
                                  <span style={{
                                    padding: '2px 6px',
                                    background: obs.type === 'llm' ? '#8b5cf620' : obs.type === 'tool' ? '#3b82f620' : '#6b728020',
                                    border: `1px solid ${obs.type === 'llm' ? '#8b5cf6' : obs.type === 'tool' ? '#3b82f6' : '#6b7280'}`,
                                    borderRadius: '3px',
                                    color: obs.type === 'llm' ? '#8b5cf6' : obs.type === 'tool' ? '#3b82f6' : '#6b7280',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                  }}>
                                    {obs.type}
                                  </span>
                                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#e4e4e7' }}>
                                    {obs.name}
                                  </span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>
                                  {obs.duration}ms
                                </span>
                              </div>
                              <div style={{ position: 'relative', height: '20px', background: '#1a1d23', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                  position: 'absolute',
                                  left: `${percentage}%`,
                                  width: `${Math.max(width, 2)}%`,
                                  height: '100%',
                                  background: obs.type === 'llm' ? '#8b5cf6' : obs.type === 'tool' ? '#3b82f6' : '#6b7280',
                                  borderRadius: '2px'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Tree View */}
                    {traceViewMode === 'tree' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedRequest.trace.observations.map((obs) => {
                          const isParent = !obs.parentId;

                          return (
                            <div key={obs.id}>
                              <div
                                onClick={() => setSelectedObservation(obs)}
                                style={{
                                  padding: '12px 16px',
                                  background: selectedObservation?.id === obs.id ? '#3b82f615' : isParent ? '#0f1115' : '#1a1d23',
                                  border: `1px solid ${selectedObservation?.id === obs.id ? '#3b82f6' : '#2d333b'}`,
                                  borderLeft: `3px solid ${obs.status === 'success' ? '#10b981' : obs.status === 'error' ? '#ef4444' : '#f59e0b'}`,
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  marginLeft: isParent ? '0' : '32px'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                      <span style={{
                                        padding: '2px 8px',
                                        background: obs.type === 'llm' ? '#8b5cf620' : obs.type === 'tool' ? '#3b82f620' : '#6b728020',
                                        border: `1px solid ${obs.type === 'llm' ? '#8b5cf6' : obs.type === 'tool' ? '#3b82f6' : '#6b7280'}`,
                                        borderRadius: '4px',
                                        color: obs.type === 'llm' ? '#8b5cf6' : obs.type === 'tool' ? '#3b82f6' : '#6b7280',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        textTransform: 'uppercase'
                                      }}>
                                        {obs.type}
                                      </span>
                                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#e4e4e7' }}>
                                        {obs.name}
                                      </span>
                                    </div>
                                    {obs.input && (
                                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                        {obs.input.substring(0, 80)}...
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                    {obs.duration}ms
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Logs View */}
                    {traceViewMode === 'logs' && (
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        background: '#0f1115',
                        border: '1px solid #2d333b',
                        borderRadius: '6px',
                        padding: '16px',
                        maxHeight: '500px',
                        overflow: 'auto'
                      }}>
                        {selectedRequest.trace.observations.map((obs, index) => (
                          <div key={obs.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: index < selectedRequest.trace.observations.length - 1 ? '1px solid #2d333b' : 'none' }}>
                            <div style={{ color: '#6b7280', marginBottom: '4px' }}>
                              [{new Date(obs.startTime).toISOString()}] {obs.type.toUpperCase()}
                            </div>
                            <div style={{ color: '#e4e4e7', marginBottom: '8px', fontWeight: 500 }}>
                              {obs.name}
                            </div>
                            <div style={{ color: '#9ca3af', fontSize: '11px' }}>
                              Status: <span style={{ color: obs.status === 'success' ? '#10b981' : '#ef4444' }}>{obs.status}</span> •
                              Duration: {obs.duration}ms
                            </div>
                            {obs.metadata && (
                              <div style={{ marginTop: '8px', padding: '8px', background: '#1a1d23', borderRadius: '4px', fontSize: '11px', color: '#6b7280' }}>
                                {JSON.stringify(obs.metadata, null, 2)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Observation Details */}
                  {selectedObservation && (
                    <div style={{
                      width: '350px',
                      flexShrink: 0,
                      padding: '20px',
                      background: '#0f1115',
                      border: '1px solid #2d333b',
                      borderRadius: '8px',
                      height: 'fit-content',
                      position: 'sticky',
                      top: 0
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#e4e4e7' }}>
                          Observation Details
                        </h3>
                        <button
                          onClick={() => setSelectedObservation(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            fontSize: '18px',
                            cursor: 'pointer',
                            padding: '0'
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Type & Status */}
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                            Type & Status
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '4px 10px',
                              background: selectedObservation.type === 'llm' ? '#8b5cf620' : selectedObservation.type === 'tool' ? '#3b82f620' : '#6b728020',
                              border: `1px solid ${selectedObservation.type === 'llm' ? '#8b5cf6' : selectedObservation.type === 'tool' ? '#3b82f6' : '#6b7280'}`,
                              borderRadius: '4px',
                              color: selectedObservation.type === 'llm' ? '#8b5cf6' : selectedObservation.type === 'tool' ? '#3b82f6' : '#6b7280',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase'
                            }}>
                              {selectedObservation.type}
                            </span>
                            <span style={{
                              padding: '4px 10px',
                              background: selectedObservation.status === 'success' ? '#10b98120' : '#ef444420',
                              border: `1px solid ${selectedObservation.status === 'success' ? '#10b981' : '#ef4444'}`,
                              borderRadius: '4px',
                              color: selectedObservation.status === 'success' ? '#10b981' : '#ef4444',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase'
                            }}>
                              {selectedObservation.status}
                            </span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                            Duration
                          </div>
                          <div style={{ fontSize: '14px', color: '#e4e4e7', fontFamily: 'monospace' }}>
                            {selectedObservation.duration}ms
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                            Timestamps
                          </div>
                          <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>
                            <div>Start: {new Date(selectedObservation.startTime).toLocaleTimeString()}</div>
                            <div>End: {new Date(selectedObservation.endTime).toLocaleTimeString()}</div>
                          </div>
                        </div>

                        {/* Input */}
                        {selectedObservation.input && (
                          <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                              Input
                            </div>
                            <div style={{
                              padding: '12px',
                              background: '#1a1d23',
                              border: '1px solid #2d333b',
                              borderRadius: '6px',
                              fontSize: '12px',
                              color: '#e4e4e7',
                              lineHeight: '1.6',
                              maxHeight: '150px',
                              overflow: 'auto'
                            }}>
                              {selectedObservation.input}
                            </div>
                          </div>
                        )}

                        {/* Output */}
                        {selectedObservation.output && (
                          <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                              Output
                            </div>
                            <div style={{
                              padding: '12px',
                              background: '#1a1d23',
                              border: '1px solid #2d333b',
                              borderRadius: '6px',
                              fontSize: '12px',
                              color: '#e4e4e7',
                              lineHeight: '1.6',
                              maxHeight: '150px',
                              overflow: 'auto'
                            }}>
                              {selectedObservation.output}
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        {selectedObservation.metadata && (
                          <div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                              Metadata
                            </div>
                            <div style={{
                              padding: '12px',
                              background: '#1a1d23',
                              border: '1px solid #2d333b',
                              borderRadius: '6px',
                              fontFamily: 'monospace',
                              fontSize: '11px',
                              color: '#9ca3af',
                              lineHeight: '1.6',
                              maxHeight: '200px',
                              overflow: 'auto'
                            }}>
                              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(selectedObservation.metadata, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detailModalTab === 'preview' && selectedRequest.preview && (
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px', color: '#e4e4e7' }}>
                    Data Preview
                  </h3>
                  <div style={{
                    padding: '16px',
                    background: '#0f1115',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#e4e4e7',
                    maxHeight: '500px',
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(selectedRequest.preview, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid #2d333b',
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
              background: '#1a1d23'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {detailModalTab === 'trace' ?
                  'Review execution trace before making decision' :
                  detailModalTab === 'preview' ?
                  'Preview data that will be affected' :
                  'Review details and add approval note'}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setDetailModalTab('details');
                    setSelectedObservation(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid #2d333b',
                    borderRadius: '6px',
                    color: '#9ca3af',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest, 'Reject')}
                  style={{
                    padding: '10px 24px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest, 'Approve')}
                  style={{
                    padding: '10px 24px',
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Approve & Execute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HumanInTheLoop;
