import { useState } from 'react';
import { Position } from 'reactflow';
import { CpuChipIcon, SparklesIcon, FireIcon, BeakerIcon, BoltIcon } from '@heroicons/react/24/outline';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data }) => {
  const [selectedModel, setSelectedModel] = useState(data?.model || 'gpt-4');
  const updateNodeField = useStore(state => state.updateNodeField);

  const models = [
    { id: 'gpt-4', name: 'GPT-4', icon: SparklesIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'claude-3', name: 'Claude 3', icon: FireIcon, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { id: 'gemini-pro', name: 'Gemini Pro', icon: BeakerIcon, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { id: 'llama-3', name: 'Llama 3', icon: BoltIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    updateNodeField(id, 'model', modelId);
  };

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: '33%' }, color: 'bg-primary' },
    { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: '66%' }, color: 'bg-primary' },
    { type: 'source', position: Position.Right, id: `${id}-response`, color: 'bg-primary' }
  ];

  return (
    <BaseNode id={id} title="LLM" icon={CpuChipIcon} themeColor="primary" handles={handles}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Model</label>
            <div className="grid grid-cols-2 gap-3">
                {models.map((model) => {
                    const Icon = model.icon;
                    const isSelected = selectedModel === model.id;
                    return (
                        <button
                            key={model.id}
                            onClick={() => handleModelSelect(model.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                                isSelected 
                                ? `border-primary bg-primary/20 shadow-neon-primary scale-[1.02]` 
                                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/60'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${model.bg} ${model.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                {model.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
        
        <div className="p-3 rounded-xl bg-[#050505]/40 border border-slate-800/50">
            <p className="text-[9px] text-slate-500 leading-relaxed italic">
                Currently optimized for <span className="text-primary font-bold">{models.find(m => m.id === selectedModel)?.name}</span>. 
                Ensure your API keys are configured in the global settings.
            </p>
        </div>
      </div>
    </BaseNode>
  );
}