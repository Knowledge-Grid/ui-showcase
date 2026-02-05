import { useState } from 'react';

const dataSources = {
  Network: ['Firewall Logs', 'Netflow Data', 'IDS/IPS'],
  User: ['Okta SSO', 'Azure AD', 'CyberArk PAM'],
  Asset: ['Endpoint Logs', 'CMDB'],
  'Cloud/SaaS': ['AWS CloudTrail', 'Microsoft 365', 'Salesforce'],
  'AI Agents': ['Support Bot', 'Code Assistant'],
};

const standardMenu = ['Events', 'Event Search', 'Rules & Alerting', 'Anomalies', 'Anomaly Tuning', 'Threat Hunting', 'Reports'];
const agentExtras = ['Agent/LLM Manager', 'Agent Discovery', 'Traces', 'Sessions'];
const dataSections = ['Network', 'User', 'Asset', 'Cloud/SaaS', 'AI Agents'];

// VARIATION 1: Two-Panel Architecture
const TwoPanelNav = () => {
  const [sources, setSources] = useState({ Network: 'Netflow Data', User: 'Okta SSO', Asset: 'CMDB', 'Cloud/SaaS': 'Microsoft 365', 'AI Agents': 'Code Assistant' });
  const [activeSection, setActiveSection] = useState('Network');
  const [activeMenu, setActiveMenu] = useState('Events');
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const allSections = ['Home', ...dataSections, 'Data Platform', 'Alert Triage', 'Admin', 'Internal Tools'];

  return (
    <div className="w-80 bg-zinc-900 rounded overflow-hidden flex-shrink-0 flex h-[700px]">
      <div className="w-16 bg-zinc-950 border-r border-zinc-800/50 py-3 flex flex-col overflow-y-auto">
        <div className="px-2 mb-3">
          <div className="w-12 h-7 rounded bg-zinc-800 flex items-center justify-center">
            <span className="text-[9px] font-semibold text-zinc-500">KG</span>
          </div>
        </div>
        {allSections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`mx-1.5 mb-0.5 px-1 py-2 text-[9px] text-center rounded transition-colors ${
              activeSection === s ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            {s === 'Cloud/SaaS' ? 'Cloud' : s === 'Data Platform' ? 'Platform' : s === 'Alert Triage' ? 'Triage' : s === 'Internal Tools' ? 'Tools' : s}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 border-b border-zinc-800/50 sticky top-0 bg-zinc-900 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-200">{activeSection}</span>
            {dataSources[activeSection] && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                {activeSection === 'AI Agents' ? 'AIM' : 'DAS'}
              </span>
            )}
          </div>
        </div>

        {activeSection === 'Home' && (
          <div className="py-2">
            <button onClick={() => setActiveMenu('Dashboards')} className={`block w-full text-left px-4 py-2 text-[11px] ${activeMenu === 'Dashboards' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>Dashboards</button>
          </div>
        )}

        {dataSources[activeSection] && (
          <>
            <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-950/30">
              <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-2">Data Source</div>
              {dataSources[activeSection].map((src) => (
                <button
                  key={src}
                  onClick={() => setSources(prev => ({ ...prev, [activeSection]: src }))}
                  className={`flex items-center gap-2 w-full text-left px-2 py-1.5 text-[11px] rounded transition-colors ${
                    sources[activeSection] === src ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full border ${sources[activeSection] === src ? 'border-zinc-400 bg-zinc-400' : 'border-zinc-600'}`} />
                  {src}
                </button>
              ))}
            </div>
            <div className="py-2">
              {standardMenu.map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-4 py-2 text-[11px] transition-colors ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>{item}</button>
              ))}
              {activeSection === 'AI Agents' && (
                <>
                  <div className="my-2 mx-4 border-t border-zinc-800/50" />
                  {agentExtras.map((item) => (
                    <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-4 py-2 text-[11px] transition-colors ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>{item}</button>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {activeSection === 'Data Platform' && (
          <div className="py-2">
            <button onClick={() => setActiveMenu('Schema Designer')} className={`block w-full text-left px-4 py-2 text-[11px] ${activeMenu === 'Schema Designer' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>Schema Designer</button>
            <button onClick={() => toggle('InternalAgents')} className="w-full text-left px-4 py-2 text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 flex justify-between items-center">
              Internal Agents <span className="text-zinc-600">{expanded['InternalAgents'] ? '−' : '+'}</span>
            </button>
            {expanded['InternalAgents'] && ['Overview', 'Agent Registry', 'Costs', 'API Traces'].map((item) => (
              <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
            ))}
            <button onClick={() => setActiveMenu('Feature Management')} className={`block w-full text-left px-4 py-2 text-[11px] ${activeMenu === 'Feature Management' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>Feature Management</button>
          </div>
        )}

        {activeSection === 'Alert Triage' && (
          <div className="py-2">
            {['Dashboard', 'Alert Manager', 'Cases'].map((item) => (
              <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-4 py-2 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>{item}</button>
            ))}
          </div>
        )}

        {activeSection === 'Admin' && (
          <div className="py-2">
            {['User', 'Roles', 'API Manager'].map((item) => (
              <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-4 py-2 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>{item}</button>
            ))}
          </div>
        )}

        {activeSection === 'Internal Tools' && (
          <div className="py-2">
            {['Schema Designer', 'Tenant Management', 'UAD Management'].map((item) => (
              <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-4 py-2 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}`}>{item}</button>
            ))}
            <button onClick={() => toggle('Subscriptions')} className="w-full text-left px-4 py-2 text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 flex justify-between items-center">
              Subscriptions <span className="text-zinc-600">{expanded['Subscriptions'] ? '−' : '+'}</span>
            </button>
            {expanded['Subscriptions'] && ['Services', 'Data Source Selector'].map((item) => (
              <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// VARIATION 2: All Sections Collapsible
const AllCollapsibleNav = () => {
  const [sources, setSources] = useState({ Network: 'Netflow Data', User: 'Okta SSO', Asset: 'CMDB', 'Cloud/SaaS': 'Microsoft 365', 'AI Agents': 'Code Assistant' });
  const [activeMenu, setActiveMenu] = useState('Events');
  const [expanded, setExpanded] = useState({ Home: true, Network: true });

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-72 bg-zinc-900 rounded overflow-hidden flex-shrink-0 h-[700px] flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-950">
        <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">KG PORTAL</span>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Home */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Home')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Home</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Home'] ? '−' : '+'}</span>
          </button>
          {expanded['Home'] && (
            <div className="pb-2">
              <button onClick={() => setActiveMenu('Dashboards')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Dashboards' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Dashboards</button>
            </div>
          )}
        </div>

        {/* Data Sections */}
        {dataSections.map((section) => (
          <div key={section} className="border-b border-zinc-800/50">
            <button onClick={() => toggle(section)} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-200">{section}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{section === 'AI Agents' ? 'AIM' : 'DAS'}</span>
              </div>
              <span className="text-zinc-600 text-[10px]">{expanded[section] ? '−' : '+'}</span>
            </button>
            {expanded[section] && (
              <div className="pb-2">
                <div className="px-4 py-2 border-b border-zinc-800/30 mb-1">
                  {dataSources[section].map((src) => (
                    <button
                      key={src}
                      onClick={() => setSources(prev => ({ ...prev, [section]: src }))}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1 text-[11px] rounded ${sources[section] === src ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
                    >
                      <span className={`w-2 h-2 rounded-full border ${sources[section] === src ? 'border-zinc-400 bg-zinc-400' : 'border-zinc-600'}`} />
                      {src}
                    </button>
                  ))}
                </div>
                {standardMenu.map((item) => (
                  <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                ))}
                {section === 'AI Agents' && (
                  <>
                    <div className="my-1.5 mx-4 border-t border-zinc-800/50" />
                    {agentExtras.map((item) => (
                      <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Data Platform */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Data Platform')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Data Platform</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Data Platform'] ? '−' : '+'}</span>
          </button>
          {expanded['Data Platform'] && (
            <div className="pb-2">
              <button onClick={() => setActiveMenu('Schema Designer')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Schema Designer' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Schema Designer</button>
              <button onClick={() => toggle('InternalAgents2')} className="w-full text-left px-6 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 flex justify-between items-center pr-4">
                Internal Agents <span className="text-zinc-600">{expanded['InternalAgents2'] ? '−' : '+'}</span>
              </button>
              {expanded['InternalAgents2'] && ['Overview', 'Agent Registry', 'Costs', 'API Traces'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-8 py-1 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
              ))}
              <button onClick={() => setActiveMenu('Feature Management')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Feature Management' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Feature Management</button>
            </div>
          )}
        </div>

        {/* Alert Triage */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Alert Triage')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Alert Triage</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Alert Triage'] ? '−' : '+'}</span>
          </button>
          {expanded['Alert Triage'] && (
            <div className="pb-2">
              {['Dashboard', 'Alert Manager', 'Cases'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
              ))}
            </div>
          )}
        </div>

        {/* Admin */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Admin')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Admin</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Admin'] ? '−' : '+'}</span>
          </button>
          {expanded['Admin'] && (
            <div className="pb-2">
              {['User', 'Roles', 'API Manager'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
              ))}
            </div>
          )}
        </div>

        {/* Internal Tools */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Internal Tools')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Internal Tools</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Internal Tools'] ? '−' : '+'}</span>
          </button>
          {expanded['Internal Tools'] && (
            <div className="pb-2">
              {['Schema Designer', 'Tenant Management', 'UAD Management'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
              ))}
              <button onClick={() => toggle('Subscriptions2')} className="w-full text-left px-6 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 flex justify-between items-center pr-4">
                Subscriptions <span className="text-zinc-600">{expanded['Subscriptions2'] ? '−' : '+'}</span>
              </button>
              {expanded['Subscriptions2'] && ['Services', 'Data Source Selector'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-8 py-1 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// VARIATION 3: Accordion (one section at a time)
const AccordionNav = () => {
  const [sources, setSources] = useState({ Network: 'Netflow Data', User: 'Okta SSO', Asset: 'CMDB', 'Cloud/SaaS': 'Microsoft 365', 'AI Agents': 'Code Assistant' });
  const [activeMenu, setActiveMenu] = useState('Events');
  const [openSection, setOpenSection] = useState('Network');
  const [subExpanded, setSubExpanded] = useState({});

  const toggleSub = (key) => setSubExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const allSections = ['Home', ...dataSections, 'Data Platform', 'Alert Triage', 'Admin', 'Internal Tools'];

  return (
    <div className="w-72 bg-zinc-900 rounded overflow-hidden flex-shrink-0 h-[700px] flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-950">
        <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">KG PORTAL</span>
      </div>

      <div className="overflow-y-auto flex-1">
        {allSections.map((section) => (
          <div key={section} className="border-b border-zinc-800/50">
            <button
              onClick={() => setOpenSection(openSection === section ? null : section)}
              className={`w-full px-4 py-2.5 flex items-center justify-between transition-colors ${openSection === section ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'}`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${openSection === section ? 'text-zinc-100' : 'text-zinc-300'}`}>{section}</span>
                {dataSources[section] && <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{section === 'AI Agents' ? 'AIM' : 'DAS'}</span>}
              </div>
              <span className="text-zinc-600 text-[10px]">{openSection === section ? '−' : '+'}</span>
            </button>

            {openSection === section && (
              <div className="pb-2 bg-zinc-950/20">
                {section === 'Home' && (
                  <button onClick={() => setActiveMenu('Dashboards')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Dashboards' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Dashboards</button>
                )}

                {dataSources[section] && (
                  <>
                    <div className="px-4 py-2 border-b border-zinc-800/30 mb-1">
                      {dataSources[section].map((src) => (
                        <button
                          key={src}
                          onClick={() => setSources(prev => ({ ...prev, [section]: src }))}
                          className={`flex items-center gap-2 w-full text-left px-2 py-1 text-[11px] rounded ${sources[section] === src ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
                        >
                          <span className={`w-2 h-2 rounded-full border ${sources[section] === src ? 'border-zinc-400 bg-zinc-400' : 'border-zinc-600'}`} />
                          {src}
                        </button>
                      ))}
                    </div>
                    {standardMenu.map((item) => (
                      <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                    ))}
                    {section === 'AI Agents' && (
                      <>
                        <div className="my-1.5 mx-4 border-t border-zinc-800/50" />
                        {agentExtras.map((item) => (
                          <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                        ))}
                      </>
                    )}
                  </>
                )}

                {section === 'Data Platform' && (
                  <>
                    <button onClick={() => setActiveMenu('Schema Designer')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Schema Designer' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Schema Designer</button>
                    <button onClick={() => toggleSub('IA3')} className="w-full text-left px-6 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 flex justify-between items-center pr-4">
                      Internal Agents <span className="text-zinc-600">{subExpanded['IA3'] ? '−' : '+'}</span>
                    </button>
                    {subExpanded['IA3'] && ['Overview', 'Agent Registry', 'Costs', 'API Traces'].map((item) => (
                      <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-8 py-1 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
                    ))}
                    <button onClick={() => setActiveMenu('Feature Management')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Feature Management' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Feature Management</button>
                  </>
                )}

                {section === 'Alert Triage' && ['Dashboard', 'Alert Manager', 'Cases'].map((item) => (
                  <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                ))}

                {section === 'Admin' && ['User', 'Roles', 'API Manager'].map((item) => (
                  <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                ))}

                {section === 'Internal Tools' && (
                  <>
                    {['Schema Designer', 'Tenant Management', 'UAD Management'].map((item) => (
                      <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                    ))}
                    <button onClick={() => toggleSub('Sub3')} className="w-full text-left px-6 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 flex justify-between items-center pr-4">
                      Subscriptions <span className="text-zinc-600">{subExpanded['Sub3'] ? '−' : '+'}</span>
                    </button>
                    {subExpanded['Sub3'] && ['Services', 'Data Source Selector'].map((item) => (
                      <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-8 py-1 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// VARIATION 4: Dropdown Sources
const DropdownNav = () => {
  const [sources, setSources] = useState({ Network: 'Netflow Data', User: 'Okta SSO', Asset: 'CMDB', 'Cloud/SaaS': 'Microsoft 365', 'AI Agents': 'Code Assistant' });
  const [activeMenu, setActiveMenu] = useState('Events');
  const [expanded, setExpanded] = useState({ Home: true, Network: true });

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-72 bg-zinc-900 rounded overflow-hidden flex-shrink-0 h-[700px] flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-950">
        <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">KG PORTAL</span>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Home */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Home')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Home</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Home'] ? '−' : '+'}</span>
          </button>
          {expanded['Home'] && (
            <div className="pb-2">
              <button onClick={() => setActiveMenu('Dashboards')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Dashboards' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Dashboards</button>
            </div>
          )}
        </div>

        {/* Data Sections with Dropdowns */}
        {dataSections.map((section) => (
          <div key={section} className="border-b border-zinc-800/50">
            <button onClick={() => toggle(section)} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-200">{section}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{section === 'AI Agents' ? 'AIM' : 'DAS'}</span>
              </div>
              <span className="text-zinc-600 text-[10px]">{expanded[section] ? '−' : '+'}</span>
            </button>
            {expanded[section] && (
              <div className="pb-2">
                <div className="px-4 py-2 border-b border-zinc-800/30 mb-1">
                  <select
                    value={sources[section]}
                    onChange={(e) => setSources(prev => ({ ...prev, [section]: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700/50 rounded px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none"
                  >
                    {dataSources[section].map((src) => (<option key={src} value={src}>{src}</option>))}
                  </select>
                </div>
                {standardMenu.map((item) => (
                  <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                ))}
                {section === 'AI Agents' && (
                  <>
                    <div className="my-1.5 mx-4 border-t border-zinc-800/50" />
                    {agentExtras.map((item) => (
                      <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Data Platform */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Data Platform')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Data Platform</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Data Platform'] ? '−' : '+'}</span>
          </button>
          {expanded['Data Platform'] && (
            <div className="pb-2">
              <button onClick={() => setActiveMenu('Schema Designer')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Schema Designer' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Schema Designer</button>
              <button onClick={() => toggle('IA4')} className="w-full text-left px-6 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 flex justify-between items-center pr-4">
                Internal Agents <span className="text-zinc-600">{expanded['IA4'] ? '−' : '+'}</span>
              </button>
              {expanded['IA4'] && ['Overview', 'Agent Registry', 'Costs', 'API Traces'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-8 py-1 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
              ))}
              <button onClick={() => setActiveMenu('Feature Management')} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === 'Feature Management' ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Feature Management</button>
            </div>
          )}
        </div>

        {/* Alert Triage */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Alert Triage')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Alert Triage</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Alert Triage'] ? '−' : '+'}</span>
          </button>
          {expanded['Alert Triage'] && (
            <div className="pb-2">
              {['Dashboard', 'Alert Manager', 'Cases'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
              ))}
            </div>
          )}
        </div>

        {/* Admin */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Admin')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Admin</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Admin'] ? '−' : '+'}</span>
          </button>
          {expanded['Admin'] && (
            <div className="pb-2">
              {['User', 'Roles', 'API Manager'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
              ))}
            </div>
          )}
        </div>

        {/* Internal Tools */}
        <div className="border-b border-zinc-800/50">
          <button onClick={() => toggle('Internal Tools')} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/30">
            <span className="text-xs font-medium text-zinc-200">Internal Tools</span>
            <span className="text-zinc-600 text-[10px]">{expanded['Internal Tools'] ? '−' : '+'}</span>
          </button>
          {expanded['Internal Tools'] && (
            <div className="pb-2">
              {['Schema Designer', 'Tenant Management', 'UAD Management'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-6 py-1.5 text-[11px] ${activeMenu === item ? 'text-zinc-200 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{item}</button>
              ))}
              <button onClick={() => toggle('Sub4')} className="w-full text-left px-6 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 flex justify-between items-center pr-4">
                Subscriptions <span className="text-zinc-600">{expanded['Sub4'] ? '−' : '+'}</span>
              </button>
              {expanded['Sub4'] && ['Services', 'Data Source Selector'].map((item) => (
                <button key={item} onClick={() => setActiveMenu(item)} className={`block w-full text-left px-8 py-1 text-[10px] ${activeMenu === item ? 'text-zinc-300 bg-zinc-800/30' : 'text-zinc-600 hover:text-zinc-400'}`}>{item}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LeftNavVariations() {
  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="mb-6">
        <h1 className="text-zinc-100 text-sm font-semibold mb-1">KG Portal Navigation — Interactive Variants</h1>
        <p className="text-zinc-600 text-xs">Click sections to expand/collapse, select data sources, click menu items</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 items-start">
        <div>
          <div className="text-[10px] text-zinc-500 mb-3 uppercase tracking-wider">1. Two-Panel Split</div>
          <TwoPanelNav />
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 mb-3 uppercase tracking-wider">2. Multi-Expand</div>
          <AllCollapsibleNav />
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 mb-3 uppercase tracking-wider">3. Single Accordion</div>
          <AccordionNav />
        </div>

        <div>
          <div className="text-[10px] text-zinc-500 mb-3 uppercase tracking-wider">4. Dropdown Sources</div>
          <DropdownNav />
        </div>
      </div>
    </div>
  );
}
