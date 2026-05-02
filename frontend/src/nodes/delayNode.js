import { useState } from 'react';
import { Position } from 'reactflow';
import { ClockIcon } from '@heroicons/react/24/outline';
import { BaseNode } from './BaseNode';

export const DelayNode = ({ id, data }) => {
  const [ms, setMs] = useState(data?.ms || 1000);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-input`, color: 'bg-amber-400' },
    { type: 'source', position: Position.Right, id: `${id}-output`, color: 'bg-amber-400' }
  ];

  return (
    <BaseNode id={id} title="Delay" icon={ClockIcon} themeColor="orange" handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Delay (ms)</label>
        <input
          type="number"
          value={ms}
          onChange={(e) => setMs(parseInt(e.target.value) || 0)}
          className="w-full bg-[#050505]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
        />
      </div>
    </BaseNode>
  );
}