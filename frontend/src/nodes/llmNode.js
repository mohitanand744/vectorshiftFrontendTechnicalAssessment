import { Position } from 'reactflow';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: '33%' }, color: 'bg-primary' },
    { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: '66%' }, color: 'bg-primary' },
    { type: 'source', position: Position.Right, id: `${id}-response`, color: 'bg-primary' }
  ];

  return (
    <BaseNode id={id} title="LLM" icon={CpuChipIcon} themeColor="primary" handles={handles}>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-slate-400 leading-relaxed">
          The Large Language Model node will process the input prompt based on the system instructions.
        </p>
      </div>
    </BaseNode>
  );
}