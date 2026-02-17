
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Play, TrendingUp, Clock, Activity, AlertCircle, Crown, ArrowUpRight } from 'lucide-react';
import { Workflow } from '../types';

interface DashboardProps {
  workflows: Workflow[];
  onOpenWorkflow: (wf: Workflow) => void;
  currentPlan: string;
  onManageSubscription: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workflows, onOpenWorkflow, currentPlan, onManageSubscription }) => {
  const usageData = [
    { name: 'Mon', calls: 120, images: 15 },
    { name: 'Tue', calls: 210, images: 22 },
    { name: 'Wed', calls: 180, images: 18 },
    { name: 'Thu', calls: 350, images: 45 },
    { name: 'Fri', calls: 290, images: 38 },
    { name: 'Sat', calls: 150, images: 12 },
    { name: 'Sun', calls: 110, images: 8 },
  ];

  const stats = [
    { label: 'Successful Runs', value: '2,842', change: '+12%', icon: <TrendingUp className="text-green-400" /> },
    { label: 'Avg Execution', value: '1.4s', change: '-0.2s', icon: <Clock className="text-blue-400" /> },
    { label: 'Active Workflows', value: workflows.length, change: '+1', icon: <Activity className="text-purple-400" /> },
    { label: 'Failed (24h)', value: '0', change: '0%', icon: <AlertCircle className="text-gray-400" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
          <p className="text-gray-400">Welcome back. Your automations are running smoothly.</p>
        </div>
        <div 
          onClick={onManageSubscription}
          className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-indigo-600/20 transition-all group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Plan</p>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              {currentPlan}
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
            </h4>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <div className="p-2 bg-gray-800 rounded-lg">{stat.icon}</div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${stat.change.startsWith('+') ? 'text-green-400 bg-green-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">AI Usage Trends</h3>
            <select className="bg-gray-800 border border-gray-700 text-sm text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#f9fafb' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Launch */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Recent Workflows</h3>
          <div className="space-y-4">
            {workflows.slice(0, 4).map((wf) => (
              <div 
                key={wf.id}
                onClick={() => onOpenWorkflow(wf)}
                className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-2xl cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <Play className="w-4 h-4 text-indigo-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Activity className="w-4 h-4 text-indigo-400 group-hover:hidden" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{wf.name}</h5>
                    <p className="text-xs text-gray-500">{wf.steps.length} steps · Idle</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/20" />
              </div>
            ))}
            
            <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl text-sm font-semibold transition-colors mt-2">
              View All Workflows
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
