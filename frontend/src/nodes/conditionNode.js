import { useState } from 'react';
import { Position } from 'reactflow';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { BaseNode } from './BaseNode';

export const ConditionNode = ({ id, data }) => {
  const [logic, setLogic] = useState(data?.logic || 'x === true');

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-input`, color: 'bg-violet-400' },
    { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: '33%' }, color: 'bg-emerald-400' },
    { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '66%' }, color: 'bg-rose-400' }
  ];

  return (
    <BaseNode id={id} title="Condition" icon={ArrowsRightLeftIcon} themeColor="cyan" handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logic Expression</label>
        <input
          type="text"
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
          className="w-full bg-[#050505]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          placeholder="e.g. value > 10"
        />
      </div>
    </BaseNode>
  );
}