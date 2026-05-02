import { useState, useEffect, useRef, useMemo } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { AnimatePresence, motion } from 'framer-motion';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [triggerIndex, setTriggerIndex] = useState(-1);
  
  const nodes = useStore(state => state.nodes);
  const updateNodeField = useStore(state => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);

  const availableNodeNames = useMemo(() => {
    return nodes
      .filter(n => n.id !== id) // Don't suggest self
      .map(n => n.data?.customName || n.id);
  }, [nodes, id]);

  const varRegex = /\{\{\s*([a-zA-Z0-9_$-]+)\s*\}\}/g;

  useEffect(() => {
    const matches = [...currText.matchAll(varRegex)];
    const uniqueVars = [...new Set(matches.map(m => m[1]))];
    setVariables(uniqueVars);
    updateNodeInternals(id);
  }, [currText, id, updateNodeInternals]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currText]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    const selectionStart = e.target.selectionStart;
    setCurrText(val);
    updateNodeField(id, 'text', val);

    // Detect suggestion trigger
    const lastOpen = val.lastIndexOf('{{', selectionStart - 1);
    const lastClose = val.lastIndexOf('}}', selectionStart - 1);

    if (lastOpen !== -1 && lastOpen > lastClose) {
      const search = val.substring(lastOpen + 2, selectionStart).trim();
      const filtered = availableNodeNames.filter(name => 
        name.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filtered);
      setTriggerIndex(lastOpen);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name) => {
    const before = currText.substring(0, triggerIndex);
    const after = currText.substring(textareaRef.current.selectionStart);
    const newText = `${before}{{${name}}}${after}`;
    setCurrText(newText);
    updateNodeField(id, 'text', newText);
    setShowSuggestions(false);
    
    // Focus back and move cursor
    setTimeout(() => {
      textareaRef.current.focus();
      const newPos = before.length + name.length + 4; // {{ + name + }}
      textareaRef.current.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handles = useMemo(() => {
    const inputHandles = variables.map((v, i) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${v}`,
      style: { top: `${(i + 1) * (100 / (variables.length + 1))}%` },
      className: '!bg-primary',
    }));

    return [
      ...inputHandles,
      { type: 'source', position: Position.Right, id: `${id}-output`, color: 'bg-primary' }
    ];
  }, [id, variables]);

  return (
    <BaseNode id={id} title="Text Content" icon={DocumentTextIcon} themeColor="primary" handles={handles} width={320}>
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Editor</label>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Dynamic</span>
            </div>
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Type {{variable}} to create handles..."
            className="w-full bg-[#050505]/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50 transition-all resize-none overflow-hidden font-mono leading-relaxed min-h-[100px]"
            rows={1}
          />

          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 bottom-full mb-2 bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-[60] max-h-40 overflow-y-auto custom-scrollbar"
              >
                <div className="p-2 border-b border-slate-800/50 flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50">
                  <MagnifyingGlassIcon className="w-3 h-3" />
                  Suggestions
                </div>
                {suggestions.map((name) => (
                  <button
                    key={name}
                    onClick={() => selectSuggestion(name)}
                    className="w-full text-left px-4 py-2 text-[10px] text-slate-300 hover:bg-violet-500/20 hover:text-violet-400 transition-colors border-b border-slate-800/30 last:border-0 font-mono"
                  >
                    {name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2 text-slate-500">
                <DocumentTextIcon className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Variable Preview</span>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[24px]">
                {variables.length > 0 ? variables.map(v => (
                    <div key={v} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        <div className="w-1 h-1 rounded-full bg-violet-400"></div>
                        <span className="text-[9px] font-bold font-mono">{v}</span>
                    </div>
                )) : (
                    <span className="text-[9px] text-slate-600 italic">No variables detected...</span>
                )}
            </div>
        </div>

        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{variables.length} Variables</span>
                <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{currText.length} Characters</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
            </div>
        </div>
      </div>
    </BaseNode>
  );
};