import { useState } from 'react';
import { Position } from 'reactflow';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-input`, color: 'bg-amber-400' },
    { type: 'source', position: Position.Right, id: `${id}-output`, color: 'bg-amber-400' }
  ];

  return (
    <BaseNode id={id} title="Filter List" icon={FunnelIcon} themeColor="amber" handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Criteria</label>
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full bg-[#050505]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          placeholder="e.g. Length > 0"
        />
      </div>
    </BaseNode>
  );
}