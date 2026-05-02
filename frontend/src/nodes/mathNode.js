import { useState } from 'react';
import { Position } from 'reactflow';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../Dropdown';
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'Add');

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-a`, style: { top: '33%' }, color: 'bg-amber-400' },
    { type: 'target', position: Position.Left, id: `${id}-b`, style: { top: '66%' }, color: 'bg-amber-400' },
    { type: 'source', position: Position.Right, id: `${id}-result`, color: 'bg-amber-400' }
  ];

  return (
    <BaseNode id={id} title="Math Operation" icon={CalculatorIcon} themeColor="fuchsia" handles={handles}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operation</label>
        <Dropdown
          value={operation}
          onChange={setOperation}
          options={[
            { value: 'Add', label: 'Add' },
            { value: 'Subtract', label: 'Subtract' },
            { value: 'Multiply', label: 'Multiply' },
            { value: 'Divide', label: 'Divide' }
          ]}
        />
      </div>
    </BaseNode>
  );
}