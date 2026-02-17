
import React from 'react';
import { LayoutDashboard, Zap, Activity, Settings, Database, Code, Crown } from 'lucide-react';
import { PLAN_LIMITS } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onManageSubscription: () => void;
  currentPlan: string;
  usage: { text: number; image: number };
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onManageSubscription, currentPlan, usage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'workflows', label: 'Workflows', icon: <Zap className="w-5 h-5" /> },
    { id: 'logs', label: 'Activity Logs', icon: <Activity className="w-5 h-5" /> },
    { id: 'assets', label: 'Asset Library', icon: <Database className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const limits = PLAN_LIMITS[currentPlan];

  const renderProgressBar = (label: string, current: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return null;
    const percentage = Math.min((current / limit) * 100, 100);
    return (
      <div className="space-y-1 mt-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-gray-400">{label}</span>
          <span className="text-indigo-400">{current}/{limit}</span>
        </div>
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col p-4 z-20">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Code className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          AutomateAI
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className={`w-4 h-4 ${currentPlan === 'Starter' ? 'text-gray-400' : 'text-yellow-400 animate-pulse'}`} />
            <h4 className="text-sm font-semibold text-indigo-300">{currentPlan} Plan</h4>
          </div>
          
          {renderProgressBar('Text Gen', usage.text, limits.textRuns)}
          {renderProgressBar('Images', usage.image, limits.imageRuns)}

          <p className="text-[10px] text-gray-500 mt-3 leading-tight">
            {currentPlan === 'Starter' 
              ? 'Upgrade for unlimited runs and custom models.'
              : 'Unlimited AI capabilities enabled.'}
          </p>
          <button 
            onClick={onManageSubscription}
            className="w-full mt-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transform active:scale-95"
          >
            Manage Billing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
