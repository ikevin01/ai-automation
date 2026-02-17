
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import SubscriptionModal from './components/SubscriptionModal';
import { Workflow, StepType } from './types';
// Fixed: Added Crown and Database to imports
import { Plus, Search, Bell, User, CreditCard, ShieldCheck, Mail, Crown, Database } from 'lucide-react';

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: '1',
    name: 'Smart News Summarizer',
    description: 'Summarize top news stories using AI and generate thumbnail images.',
    steps: [
      { 
        id: 's1', 
        type: StepType.AI_TEXT, 
        title: 'Fetch & Summarize', 
        config: { prompt: 'Summarize the latest AI news in 3 bullet points.' } 
      },
      { 
        id: 's2', 
        type: StepType.AI_IMAGE, 
        title: 'Generate Art', 
        config: { prompt: 'A futuristic digital painting of a robot reading a newspaper.', aspectRatio: '16:9' } 
      }
    ],
    status: 'idle'
  },
  {
    id: '2',
    name: 'Social Media Bot',
    description: 'Transform raw notes into viral LinkedIn posts and matching visuals.',
    steps: [
      { 
        id: 's1', 
        type: StepType.AI_TEXT, 
        title: 'Draft Post', 
        config: { prompt: 'Write an engaging LinkedIn post about productivity.' } 
      },
      { 
        id: 's2', 
        type: StepType.AI_IMAGE, 
        title: 'Hero Image', 
        config: { prompt: 'Minimalist desktop setup with warm lighting.', aspectRatio: '1:1' } 
      }
    ],
    status: 'idle'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Subscription & Usage State
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Starter');
  const [usage, setUsage] = useState({ text: 42, image: 7 });

  const createNewWorkflow = () => {
    const newWf: Workflow = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Untitled Workflow',
      description: 'A brand new intelligent automation.',
      steps: [],
      status: 'idle'
    };
    setWorkflows([newWf, ...workflows]);
    setEditingWorkflow(newWf);
  };

  const saveWorkflow = (updated: Workflow) => {
    setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
  };

  const incrementUsage = (type: 'text' | 'image') => {
    setUsage(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const filteredWorkflows = workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onManageSubscription={() => setIsSubModalOpen(true)}
        currentPlan={currentPlan}
        usage={usage}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search automations, logs, or assets..." 
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900" />
            </button>
            <div className="h-8 w-px bg-gray-800 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Alex Rivers</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-indigo-500/20 shadow-lg overflow-hidden">
                <img src="https://picsum.photos/id/64/100/100" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <Dashboard 
              workflows={workflows} 
              onOpenWorkflow={setEditingWorkflow} 
              currentPlan={currentPlan}
              onManageSubscription={() => setIsSubModalOpen(true)}
            />
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Your Workflows</h1>
                  <p className="text-gray-400">Manage and create intelligent automation pipelines.</p>
                </div>
                <button 
                  onClick={createNewWorkflow}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5" /> Create New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWorkflows.map((wf) => (
                  <div 
                    key={wf.id}
                    onClick={() => setEditingWorkflow(wf)}
                    className="group bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all cursor-pointer relative overflow-hidden flex flex-col h-[240px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-all" />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-indigo-400 group-hover:rotate-45 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] bg-gray-800 px-2 py-1 rounded">Idle</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{wf.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-auto">{wf.description}</p>
                    
                    <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between relative z-10">
                      <div className="flex -space-x-2">
                        {wf.steps.map((step, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Last run: 2h ago</span>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={createNewWorkflow}
                  className="bg-gray-900/30 border-2 border-dashed border-gray-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-3xl p-6 transition-all flex flex-col items-center justify-center text-gray-500 hover:text-indigo-400 h-[240px]"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="font-semibold">New Automation</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Activity Stream</h1>
                <p className="text-gray-400">Real-time logs of all your workflow executions.</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Workflow</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Event</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Duration</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {[
                      { workflow: 'Smart News Summarizer', status: 'success', event: 'Step 2: Generate Art completed', duration: '1.2s', time: 'Just now' },
                      { workflow: 'Social Media Bot', status: 'success', event: 'Step 1: Draft Post completed', duration: '0.8s', time: '12m ago' },
                      { workflow: 'Asset Library Sync', status: 'failure', event: 'API connection timeout', duration: '5.0s', time: '1h ago' },
                      { workflow: 'Customer Feedback', status: 'success', event: 'Workflow finished', duration: '2.3s', time: '2h ago' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'success' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                          }`}>
                            <div className={`w-1 h-1 rounded-full ${log.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-100">{log.workflow}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{log.event}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{log.duration}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-6 bg-gray-900/50 border-t border-gray-800 flex justify-center">
                  <button className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Load Older Logs</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Account Settings</h1>
                <p className="text-gray-400">Manage your profile, billing, and security preferences.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Section */}
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <input type="text" defaultValue="Alex Rivers" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <input type="email" defaultValue="alex@example.com" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                    </div>
                    <button className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/10">
                      Save Changes
                    </button>
                  </div>

                  {/* Billing History */}
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-400" /> Billing History
                    </h3>
                    <div className="space-y-4">
                      {[
                        { date: 'Oct 12, 2023', amount: '$19.00', status: 'Paid', method: '•••• 4242' },
                        { date: 'Sep 12, 2023', amount: '$19.00', status: 'Paid', method: '•••• 4242' },
                      ].map((inv, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800/50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                              <Mail className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">Invoice for {inv.date}</p>
                              <p className="text-xs text-gray-500">Paid via Card {inv.method}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{inv.amount}</p>
                            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider bg-green-400/10 px-2 py-0.5 rounded-full">Success</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plan Summary Card */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <Crown className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                    <h2 className="text-3xl font-black mb-1">{currentPlan} Plan</h2>
                    <p className="text-indigo-100/70 text-sm mb-8">Your next billing date is Nov 12, 2023.</p>
                    
                    <button 
                      onClick={() => setIsSubModalOpen(true)}
                      className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg"
                    >
                      Change Plan
                    </button>
                    <button className="w-full mt-4 text-xs font-bold text-indigo-100/50 hover:text-white transition-colors">
                      Cancel Subscription
                    </button>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400" /> Data Privacy
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      Your automation logs are encrypted and stored securely. We never use your workflow data for model training.
                    </p>
                    <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Read Privacy Policy →</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                <Database className="w-8 h-8 text-gray-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Asset Library Coming Soon</h2>
              <p className="text-gray-400 max-w-sm">A centralized place to manage all your generated AI images, documents, and transcriptions.</p>
            </div>
          )}
        </div>
      </main>

      {editingWorkflow && (
        <WorkflowBuilder 
          workflow={editingWorkflow} 
          onSave={saveWorkflow}
          onClose={() => setEditingWorkflow(null)}
          onStepExecuted={incrementUsage}
        />
      )}

      {isSubModalOpen && (
        <SubscriptionModal
          currentPlan={currentPlan}
          onClose={() => setIsSubModalOpen(false)}
          onUpgrade={(plan) => setCurrentPlan(plan)}
        />
      )}
    </div>
  );
};

export default App;
