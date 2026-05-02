import { Handle, Position } from 'reactflow';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store';
import { Button } from '../Button';
import { motion } from 'framer-motion';
import { useState } from 'react';


export const BaseNode = ({
  id,
  title,
  icon: Icon,
  width = 250,
  height,
  themeColor = 'primary',
  handles = [],
  children
}) => {
  const removeNode = useStore(state => state.removeNode);
  const nodes = useStore(state => state.nodes);
  const updateNodeField = useStore(state => state.updateNodeField);

  const currentNode = nodes.find(n => n.id === id);
  const currentCustomName = currentNode?.data?.customName || id;

  const [localName, setLocalName] = useState(currentCustomName);
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setLocalName(newName);
    
    const isDuplicate = nodes.some(n => n.id !== id && (n.data?.customName === newName || n.id === newName));
    
    if (isDuplicate) {
      setError('Name taken');
    } else {
      setError('');
      updateNodeField(id, 'customName', newName);
    }
  };


  const themeMap = {
    primary: {
      bg: 'bg-primary/20',
      text: 'text-primary',
      border: 'border-primary/30',
      shadow: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]',
      gradient: 'from-primary/10',
    },
    violet: {
      bg: 'bg-violet-500/20',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
      shadow: 'shadow-[0_0_10px_rgba(139,92,246,0.3)]',
      gradient: 'from-violet-500/10',
    },
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      shadow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]',
      gradient: 'from-emerald-500/10',
    },
    sky: {
      bg: 'bg-sky-400/20',
      text: 'text-sky-400',
      border: 'border-sky-400/30',
      shadow: 'shadow-[0_0_10px_rgba(56,189,248,0.3)]',
      gradient: 'from-sky-400/10',
    },
    amber: {
      bg: 'bg-amber-400/20',
      text: 'text-amber-400',
      border: 'border-amber-400/30',
      shadow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]',
      gradient: 'from-amber-400/10',
    },
    rose: {
      bg: 'bg-rose-400/20',
      text: 'text-rose-400',
      border: 'border-rose-400/30',
      shadow: 'shadow-[0_0_10px_rgba(251,113,133,0.3)]',
      gradient: 'from-rose-400/10',
    },
    indigo: {
      bg: 'bg-indigo-400/20',
      text: 'text-indigo-400',
      border: 'border-indigo-400/30',
      shadow: 'shadow-[0_0_10px_rgba(129,140,248,0.3)]',
      gradient: 'from-indigo-400/10',
    },
    cyan: {
      bg: 'bg-cyan-400/20',
      text: 'text-cyan-400',
      border: 'border-cyan-400/30',
      shadow: 'shadow-[0_0_10px_rgba(34,211,238,0.3)]',
      gradient: 'from-cyan-400/10',
    },
    orange: {
      bg: 'bg-orange-400/20',
      text: 'text-orange-400',
      border: 'border-orange-400/30',
      shadow: 'shadow-[0_0_10px_rgba(251,146,60,0.3)]',
      gradient: 'from-orange-400/10',
    },
    fuchsia: {
      bg: 'bg-fuchsia-400/20',
      text: 'text-fuchsia-400',
      border: 'border-fuchsia-400/30',
      shadow: 'shadow-[0_0_10px_rgba(232,121,249,0.3)]',
      gradient: 'from-fuchsia-400/10',
    },
    lime: {
      bg: 'bg-lime-400/20',
      text: 'text-lime-400',
      border: 'border-lime-400/30',
      shadow: 'shadow-[0_0_10px_rgba(163,230,53,0.3)]',
      gradient: 'from-lime-400/10',
    }
  };


  const theme = themeMap[themeColor] || themeMap.primary;

  const styleProp = { width: `${width}px` };
  if (height) styleProp.height = `${height}px`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-2xl bg-[#0d1117]/60 backdrop-blur-xl border ${error ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-slate-800/50 shadow-2xl'} transition-all duration-300 hover:border-primary/40 group relative`}
      style={styleProp}

    >
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <img
          src="/purple_bg.webp"
          alt=""
          className="w-full h-full object-cover mix-blend-overlay object-right"
        />
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      {handles.map((handle, idx) => {
        const posClass = handle.position === Position.Left ? '!left-[-8px]' : '!right-[-8px]';

        return (
          <div
            key={`${handle.id || idx}`}
            className={`absolute ${posClass}  z-20`}
            style={{ top: handle.style?.top || '50%', transform: 'translateY(-50%)' }}
          >
            <span className={`animate-ping absolute inline-flex -top-2.5 -right-0.5 min-w-5 min-h-5 rounded-full bg-white opacity-40`} />
            <Handle
              type={handle.type}
              position={handle.position}
              id={handle.id}
              className={`!static  !min-w-4 !min-h-4 !rounded-full !bg-white !border-[1.5px] !border-[#0d1117] !transition-all hover:!scale-150 z-20 ${handle.className || ''}`}
              style={handle.style}
            />
          </div>
        );
      })}

      <div className="px-4 py-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between relative z-10">
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className={`flex items-center justify-center w-6 h-6 rounded-md ${theme.bg} ${theme.text} border ${theme.border} ${theme.shadow}`}>
            {Icon && <Icon className="w-4 h-4" />}
          </div>
          <span className="text-slate-200 font-semibold text-sm tracking-widest uppercase">{title}</span>
        </div>
        <Button
          onClick={() => removeNode(id)}
          variant="dangerIcon"
          className="relative z-10"
          title="Delete Node"
        >
          <XMarkIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node Name</label>
            {error && <span className="text-[8px] font-bold text-rose-400 uppercase animate-pulse">{error}</span>}
          </div>
          <input
            type="text"
            value={localName}
            onChange={handleNameChange}
            className={`w-full bg-[#050505]/50 border ${error ? 'border-rose-500/50 text-rose-200' : 'border-slate-700/50 text-slate-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-mono`}
            placeholder="Unique identifier..."
          />
        </div>
        <div className="h-px bg-slate-800/50 w-full" />
        {children}
      </div>

    </motion.div>
  );
};