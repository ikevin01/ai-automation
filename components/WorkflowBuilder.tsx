
import React, { useState } from 'react';
import { 
  Plus, Play, Trash2, ChevronRight, Save, Wand2, X, Settings, 
  AlertCircle, CheckCircle, RefreshCcw, Cpu, Sparkles, Thermometer 
} from 'lucide-react';
import { Workflow, StepType, WorkflowStep } from '../types';
import { STEP_METADATA, MODELS } from '../constants';
import { gemini } from '../services/geminiService';

interface WorkflowBuilderProps {
  workflow: Workflow;
  onSave: (updated: Workflow) => void;
  onClose: () => void;
  onStepExecuted?: (type: 'text' | 'image') => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ workflow, onSave, onClose, onStepExecuted }) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(workflow);
  const [executing, setExecuting] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const addStep = (type: StepType) => {
    const newStep: WorkflowStep = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `New ${STEP_METADATA[type].label}`,
      status: 'idle',
      config: {
        prompt: type === StepType.AI_TEXT || type === StepType.AI_IMAGE ? 'What should I generate?' : '',
        aspectRatio: '1:1',
        temperature: 0.7,
        model: type === StepType.AI_TEXT ? MODELS.TEXT : undefined,
        systemInstruction: ''
      }
    };
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: [...currentWorkflow.steps, newStep]
    });
  };

  const deleteStep = (id: string) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.filter(s => s.id !== id)
    });
    if (selectedStepId === id) setSelectedStepId(null);
  };

  const updateStepConfig = (id: string, config: Partial<WorkflowStep['config']>) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.map(s => s.id === id ? { ...s, config: { ...s.config, ...config } } : s)
    });
  };

  const runWorkflow = async () => {
    setExecuting(true);
    const updatedSteps: WorkflowStep[] = currentWorkflow.steps.map(s => ({ ...s, status: 'idle', error: undefined, output: undefined }));
    setCurrentWorkflow({ ...currentWorkflow, steps: updatedSteps });
    
    let previousOutput = '';

    for (let i = 0; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      updatedSteps[i] = { ...step, status: 'running' };
      setCurrentWorkflow(prev => ({ ...prev, steps: [...updatedSteps] }));

      try {
        let result: any;
        if (step.type === StepType.AI_TEXT) {
          result = await gemini.generateText(`${step.config.prompt}\n\nContext: ${previousOutput}`, {
            model: step.config.model,
            temperature: step.config.temperature,
            systemInstruction: step.config.systemInstruction
          });
          previousOutput = result || '';
          if (onStepExecuted) onStepExecuted('text');
        } else if (step.type === StepType.AI_IMAGE) {
          result = await gemini.generateImage(`${step.config.prompt}\n\nContext: ${previousOutput}`, step.config.aspectRatio);
          if (onStepExecuted) onStepExecuted('image');
        }

        updatedSteps[i] = { ...updatedSteps[i], status: 'completed', output: result, error: undefined };
      } catch (err: any) {
        console.error(`Execution failed at step ${step.title}:`, err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        updatedSteps[i] = { ...updatedSteps[i], status: 'error', error: errorMessage };
        setCurrentWorkflow(prev => ({ ...prev, steps: [...updatedSteps], status: 'error' }));
        setExecuting(false);
        return;
      }
      
      setCurrentWorkflow(prev => ({ ...prev, steps: [...updatedSteps] }));
    }

    setExecuting(false);
    setCurrentWorkflow(prev => ({ ...prev, status: 'completed' }));
  };

  const selectedStep = currentWorkflow.steps.find(s => s.id === selectedStepId);

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-6xl h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Wand2 className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentWorkflow.name}</h2>
              <p className="text-sm text-gray-400">Workflow Designer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={runWorkflow}
              disabled={executing || currentWorkflow.steps.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                executing 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
              }`}
            >
              {executing ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {executing ? 'Executing...' : 'Run Workflow'}
            </button>
            <button 
              onClick={() => { onSave(currentWorkflow); onClose(); }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Builder Area */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
            <div className="w-full max-w-lg space-y-6">
              {currentWorkflow.steps.map((step, index) => (
                <div key={step.id} className="relative group">
                  <div 
                    onClick={() => setSelectedStepId(step.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      selectedStepId === step.id 
                        ? 'border-indigo-500 bg-gray-800/80 shadow-lg shadow-indigo-500/10' 
                        : step.status === 'error'
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-3">
                      {step.status === 'running' && <RefreshCcw className="w-4 h-4 text-indigo-400 animate-spin" />}
                      {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {step.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${STEP_METADATA[step.type].color}`}>
                          {STEP_METADATA[step.type].icon}
                        </div>
                        <h4 className="font-semibold text-white">{step.title}</h4>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {step.config.prompt && (
                      <p className="text-sm text-gray-400 line-clamp-2 italic bg-gray-900/50 p-2 rounded-lg">
                        "{step.config.prompt}"
                      </p>
                    )}

                    {step.error && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-red-400 mb-1">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Error</span>
                        </div>
                        <p className="text-xs text-red-300 leading-relaxed">{step.error}</p>
                      </div>
                    )}

                    {step.output && (
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Output</span>
                        {step.type === StepType.AI_IMAGE ? (
                          <img src={step.output} className="w-full aspect-video object-cover rounded-xl border border-gray-700 shadow-lg" alt="Generated" />
                        ) : (
                          <p className="text-sm text-gray-300 bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {step.output}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {index < currentWorkflow.steps.length - 1 && (
                    <div className="flex justify-center h-8">
                      <div className="w-0.5 bg-gray-800 relative">
                        <ChevronRight className="w-4 h-4 text-gray-600 rotate-90 absolute -bottom-2 -left-[7px]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 flex flex-col items-center">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] mb-4">Add Component</p>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {Object.entries(STEP_METADATA).map(([type, meta]) => (
                    <button
                      key={type}
                      onClick={() => addStep(type as StepType)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-800/30 border border-gray-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-center"
                    >
                      <div className={`p-2 rounded-lg ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-300">{meta.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="w-[420px] border-l border-gray-800 bg-gray-900/50 p-6 overflow-y-auto custom-scrollbar">
            {selectedStep ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    {STEP_METADATA[selectedStep.type].icon}
                    Configure Step
                  </h3>
                  <p className="text-sm text-gray-400">{STEP_METADATA[selectedStep.type].description}</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Step Name</label>
                    <input 
                      type="text" 
                      value={selectedStep.title}
                      onChange={(e) => {
                        setCurrentWorkflow({
                          ...currentWorkflow,
                          steps: currentWorkflow.steps.map(s => s.id === selectedStep.id ? { ...s, title: e.target.value } : s)
                        });
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  {(selectedStep.type === StepType.AI_TEXT || selectedStep.type === StepType.AI_IMAGE) && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Prompt / Task</label>
                      <textarea 
                        rows={4}
                        value={selectedStep.config.prompt}
                        onChange={(e) => updateStepConfig(selectedStep.id, { prompt: e.target.value })}
                        placeholder="What should the AI do?"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm"
                      />
                    </div>
                  )}

                  {selectedStep.type === StepType.AI_TEXT && (
                    <>
                      <div className="pt-4 border-t border-gray-800 space-y-5">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <Settings className="w-3 h-3" /> Advanced Parameters
                        </h4>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-indigo-400" /> Model Selection
                          </label>
                          <select 
                            value={selectedStep.config.model || MODELS.TEXT}
                            onChange={(e) => updateStepConfig(selectedStep.id, { model: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          >
                            <option value={MODELS.TEXT}>Gemini 3 Flash (Fast & Efficient)</option>
                            <option value={MODELS.PRO}>Gemini 3 Pro (High Intelligence)</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-orange-400" /> Temperature
                            </label>
                            <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">{selectedStep.config.temperature?.toFixed(1) || '0.7'}</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={selectedStep.config.temperature ?? 0.7}
                            onChange={(e) => updateStepConfig(selectedStep.id, { temperature: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                          <div className="flex justify-between text-[10px] text-gray-500 font-bold px-1">
                            <span>PRECISE</span>
                            <span>BALANCED</span>
                            <span>CREATIVE</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" /> System Instruction
                          </label>
                          <textarea 
                            rows={3}
                            value={selectedStep.config.systemInstruction || ''}
                            onChange={(e) => updateStepConfig(selectedStep.id, { systemInstruction: e.target.value })}
                            placeholder="E.g. You are a professional copywriter..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-xs"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedStep.type === StepType.AI_IMAGE && (
                    <div className="space-y-1.5 pt-4 border-t border-gray-800">
                      <label className="text-sm font-medium text-gray-300">Aspect Ratio</label>
                      <select 
                        value={selectedStep.config.aspectRatio}
                        onChange={(e) => updateStepConfig(selectedStep.id, { aspectRatio: e.target.value as any })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                      >
                        <option value="1:1">Square (1:1)</option>
                        <option value="16:9">Wide (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                  <Settings className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="text-white font-medium mb-1">No Step Selected</h4>
                <p className="text-sm text-gray-400 px-10">Select a step in the workflow to customize its parameters and AI logic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
