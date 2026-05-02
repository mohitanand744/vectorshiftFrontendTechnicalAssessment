import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { XMarkIcon, SparklesIcon, FireIcon, BeakerIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'framer-motion';
import { NODE_CONFIGS } from './configs/nodeRegistry';
import { VARIABLE_PATTERN, SPACE_PATTERN } from '../../utils/regex';

export const BaseNode = ({ id, config, data }) => {
    const { title, icon: Icon, themeColor = 'primary', inputs = [], outputs = [], fields = [], width = 250 } = config;

    const { updateNodeField, nodes, removeNode, renameNodeReferences } = useStore(
        state => ({
            updateNodeField: state.updateNodeField,
            nodes: state.nodes,
            removeNode: state.removeNode,
            renameNodeReferences: state.renameNodeReferences
        }),
        shallow
    );
    const updateNodeInternals = useUpdateNodeInternals();

    const currentNode = nodes.find(n => n.id === id);
    const currentCustomName = currentNode?.data?.customName || id;

    const [localName, setLocalName] = useState(currentCustomName);
    const [error, setError] = useState('');

    // For TextNode dynamic handles
    const [variables, setVariables] = useState([]);
    const textareaRef = useRef(null);

    const lastValidName = useRef(currentCustomName);

    const handleNameChange = (e) => {
        // Prevent spaces in node names using centralized regex
        const newName = e.target.value.replace(SPACE_PATTERN, '');
        setLocalName(newName);
        const isDuplicate = nodes.some(n => n.id !== id && (n.data?.customName === newName || n.id === newName));

        if (isDuplicate) {
            setError('Name taken');
        } else {
            setError('');
            // Trigger global refactor if we have a valid new name and a previous valid name to replace
            if (newName.trim() !== '' && lastValidName.current !== newName) {
                renameNodeReferences(lastValidName.current, newName);
                lastValidName.current = newName; // Update our source of truth for the next rename
            }
            updateNodeField(id, 'customName', newName);
        }
    };

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [triggerIndex, setTriggerIndex] = useState(-1);

    const availableNodeNames = React.useMemo(() => {
        return nodes
            .filter(n => n.id !== id && !variables.includes(n.data?.customName || n.id))
            .map(n => n.data?.customName || n.id);
    }, [nodes, id, variables]);

    const handleFieldChange = (key, value) => {
        updateNodeField(id, key, value);

        if (config.type === 'text' && key === 'text') {
            const matches = [...value.matchAll(VARIABLE_PATTERN)];
            const uniqueVars = [...new Set(matches.map(m => m[1]))];
            setVariables(uniqueVars);

            // Suggestion Logic
            const cursor = textareaRef.current.selectionStart;
            const textBefore = value.slice(0, cursor);
            const lastTrigger = textBefore.lastIndexOf('{{');

            if (lastTrigger !== -1) {
                const query = textBefore.slice(lastTrigger + 2);
                if (!query.includes('}')) {
                    setTriggerIndex(lastTrigger);
                    const filtered = availableNodeNames.filter(name =>
                        name.toLowerCase().includes(query.toLowerCase())
                    );
                    setSuggestions(filtered);
                    setShowSuggestions(true);
                } else {
                    setShowSuggestions(false);
                }
            } else {
                setShowSuggestions(false);
            }
        }
    };

    const applySuggestion = (suggestion) => {
        const text = data.text || '';
        const before = text.slice(0, triggerIndex + 2);
        const after = text.slice(textareaRef.current.selectionStart);
        const newValue = `${before}${suggestion}}}${after}`;

        handleFieldChange('text', newValue);
        setShowSuggestions(false);

        // MAGIC CONNECTION LOGIC
        const sourceNode = nodes.find(n => (n.data?.customName || n.id) === suggestion);
        if (sourceNode) {
            setTimeout(() => {
                const targetHandleId = `${id}-${suggestion}`;
                useStore.getState().onConnect({
                    source: sourceNode.id,
                    target: id,
                    sourceHandle: 'output',
                    targetHandle: targetHandleId
                });
            }, 100);
        }

        setTimeout(() => {
            textareaRef.current.focus();
            const newCursor = before.length + suggestion.length + 4;
            textareaRef.current.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    useEffect(() => {
        if (config.type === 'text') {
            updateNodeInternals(id);

            // Cleanup orphaned edges
            const currentEdges = useStore.getState().edges;
            const orphanedEdges = currentEdges.filter(edge =>
                edge.target === id &&
                edge.targetHandle &&
                edge.targetHandle.startsWith(`${id}-`) &&
                !variables.some(v => `${id}-${v}` === edge.targetHandle)
            );

            if (orphanedEdges.length > 0) {
                const { onEdgesChange } = useStore.getState();
                onEdgesChange(orphanedEdges.map(edge => ({ id: edge.id, type: 'remove' })));
            }
        }
    }, [variables, id, updateNodeInternals, config.type]);

    useEffect(() => {
        if (textareaRef.current) {
            const { selectionStart, selectionEnd } = textareaRef.current;

            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';

            textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
        }
    }, [data?.text]);

    useEffect(() => {
        if (config.type === 'text' && data.text) {
            const matches = [...data.text.matchAll(VARIABLE_PATTERN)];
            const uniqueVars = [...new Set(matches.map(m => m[1]))];
            setVariables(uniqueVars);
        }
    }, [data.text, config.type]);

    const themeMap = {
        primary: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30', shadow: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]', gradient: 'from-primary/10' },
        violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30', shadow: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]', gradient: 'from-violet-500/10' },
        emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', shadow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]', gradient: 'from-emerald-500/10' },
        sky: { bg: 'bg-sky-400/20', text: 'text-sky-400', border: 'border-sky-400/30', shadow: 'shadow-[0_0_10px_rgba(56,189,248,0.3)]', gradient: 'from-sky-400/10' },
        amber: { bg: 'bg-amber-400/20', text: 'text-amber-400', border: 'border-amber-400/30', shadow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]', gradient: 'from-amber-400/10' },
        rose: { bg: 'bg-rose-400/20', text: 'text-rose-400', border: 'border-rose-400/30', shadow: 'shadow-[0_0_10px_rgba(251,113,133,0.3)]', gradient: 'from-rose-400/10' },
        indigo: { bg: 'bg-indigo-400/20', text: 'text-indigo-400', border: 'border-indigo-400/30', shadow: 'shadow-[0_0_10px_rgba(129,140,248,0.3)]', gradient: 'from-indigo-400/10' },
        cyan: { bg: 'bg-cyan-400/20', text: 'text-cyan-400', border: 'border-cyan-400/30', shadow: 'shadow-[0_0_10px_rgba(34,211,238,0.3)]', gradient: 'from-cyan-400/10' },
        orange: { bg: 'bg-orange-400/20', text: 'text-orange-400', border: 'border-orange-400/30', shadow: 'shadow-[0_0_10px_rgba(251,146,60,0.3)]', gradient: 'from-orange-400/10' },
        fuchsia: { bg: 'bg-fuchsia-400/20', text: 'text-fuchsia-400', border: 'border-fuchsia-400/30', shadow: 'shadow-[0_0_10px_rgba(232,121,249,0.3)]', gradient: 'from-fuchsia-400/10' },
        lime: { bg: 'bg-lime-400/20', text: 'text-lime-400', border: 'border-lime-400/30', shadow: 'shadow-[0_0_10px_rgba(163,230,53,0.3)]', gradient: 'from-lime-400/10' }
    };

    const theme = themeMap[themeColor] || themeMap.primary;

    const renderField = (field) => {
        const value = data[field.key] ?? field.default;

        switch (field.type) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full bg-[#050505]/50 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50 transition-all"
                    >
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case 'textarea':
                return (
                    <div className="relative flex flex-col gap-3">
                        <div className="relative">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-[#050505]/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50 transition-all resize-none overflow-hidden font-mono leading-relaxed min-h-[100px]"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute z-[100] left-0 bottom-full mb-2 w-full max-h-40 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-neon-primary p-1 animate-in fade-in zoom-in duration-200">
                                    {suggestions.map(name => {
                                        const sourceNode = nodes.find(n => (n.data?.customName || n.id) === name);
                                        const config = NODE_CONFIGS[sourceNode?.type] || {};
                                        const SuggestionIcon = config.icon || SparklesIcon;
                                        const colorClass = themeMap[config.themeColor]?.text || 'text-primary';

                                        return (
                                            <button
                                                key={name}
                                                onClick={() => applySuggestion(name)}
                                                className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-300 hover:bg-primary/20 hover:text-white rounded-lg transition-colors flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`${colorClass} opacity-70 group-hover:opacity-100 transition-opacity`}>
                                                        <SuggestionIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>{name}</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <SparklesIcon className="w-3 h-3 text-primary/50" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Variable Badges Display */}
                        {variables.length > 0 && (
                            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                {variables.map(v => (
                                    <div
                                        key={v}
                                        className="flex items-center gap-2 px-2.5 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-xl group hover:border-violet-500/60 transition-all hover:bg-violet-500/20 shadow-sm"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                        <span className="text-[10px] font-bold text-slate-200 font-mono tracking-tight">{v}</span>
                                        <button
                                            onClick={() => handleFieldChange(field.key, v)}
                                            className="text-slate-500 hover:text-rose-400 transition-colors ml-0.5"
                                            title="Remove variable"
                                        >
                                            <XMarkIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'modelSelect':
                const models = [
                    { id: 'gpt-4', name: 'GPT-4', icon: SparklesIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { id: 'claude-3', name: 'Claude 3', icon: FireIcon, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { id: 'gemini-pro', name: 'Gemini Pro', icon: BeakerIcon, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                    { id: 'llama-3', name: 'Llama 3', icon: BoltIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                ];
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {models.map((model) => {
                            const MIcon = model.icon;
                            const isSelected = value === model.id;
                            return (
                                <button
                                    key={model.id}
                                    onClick={() => handleFieldChange(field.key, model.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${isSelected
                                        ? `border-primary bg-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.2)] scale-[1.02]`
                                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-800/60'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${model.bg} ${model.color}`}>
                                        <MIcon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                        {model.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                        className="font-mono text-xs"
                    />
                );
            case 'text':
            default:
                return (
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="font-mono text-xs"
                    />
                );
        }
    };

    const allInputs = [
        ...inputs,
        ...(config.type === 'text' ? variables.map((v, i) => ({
            id: `${id}-${v}`,
            style: { top: `${(i + 1) * (100 / (variables.length + 1))}%` },
            className: '!bg-primary'
        })) : [])
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className={`rounded-2xl bg-[#0d1117]/60 backdrop-blur-xl border ${error ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-slate-800/50 shadow-2xl'} transition-all duration-300 hover:border-primary/40 group relative`}
            style={{ width: `${width}px` }}
        >
            {/* Background Decorations */}
            <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden rounded-2xl">
                <img src="/purple_bg.webp" alt="" className="w-full h-full object-cover mix-blend-overlay object-right" />
            </div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>

            {/* Target Handles (Left) */}
            {allInputs.map((h, idx) => (
                <div key={h.id} className="absolute !left-[-8px] z-20" style={{ top: h.style?.top || '50%', transform: 'translateY(-50%)' }}>
                    <span className="animate-ping absolute inline-flex -top-2.5 -right-0.5 min-w-5 min-h-5 rounded-full bg-white opacity-20" />
                    <Handle
                        type="target"
                        position={Position.Left}
                        id={h.id}
                        className={`!static !min-w-4 !min-h-4 !rounded-full !bg-white !border-[1.5px] !border-[#0d1117] !transition-all hover:!scale-150 z-20 ${h.className || ''}`}
                    />
                </div>
            ))}

            {/* Source Handles (Right) */}
            {outputs.map((h, idx) => (
                <div key={h.id} className="absolute !right-[-8px] z-20" style={{ top: h.style?.top || '50%', transform: 'translateY(-50%)' }}>
                    <span className="animate-ping absolute inline-flex -top-2.5 -right-0.5 min-w-5 min-h-5 rounded-full bg-white opacity-20" />
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={h.id}
                        className={`!static !min-w-4 !min-h-4 !rounded-full !bg-white !border-[1.5px] !border-[#0d1117] !transition-all hover:!scale-150 z-20 ${h.className || ''}`}
                    />
                </div>
            ))}

            {/* Header */}
            <div className="px-4 py-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between relative overflow-hidden z-10">
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="flex items-center gap-3 relative z-10">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-md ${theme.bg} ${theme.text} border ${theme.border} ${theme.shadow}`}>
                        {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-slate-200 font-semibold text-sm tracking-widest uppercase">{title}</span>
                </div>
                <Button onClick={() => removeNode(id)} variant="dangerIcon" className="relative z-10" title="Remove this node">
                    <XMarkIcon className="w-4 h-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-4 relative z-10">
                {/* Node Name Field (Always Present) */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node Name</label>
                        {error && <span className="text-[8px] font-bold text-rose-400 uppercase animate-pulse">{error}</span>}
                    </div>
                    <Input
                        type="text"
                        value={localName}
                        onChange={handleNameChange}
                        error={error}
                        className="font-mono"
                    />
                </div>

                <div className="h-px bg-slate-800/50 w-full" />

                {/* Dynamic Fields */}
                {fields.map(field => (
                    <div key={field.key} className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{field.label}</label>
                        {renderField(field)}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};