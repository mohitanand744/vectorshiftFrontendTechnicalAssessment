import { useState } from 'react';
import { Position } from 'reactflow';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../Dropdown';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-value`, color: 'bg-emerald-400' }
  ];

  return (
    <BaseNode id={id} title="Input" icon={ArrowRightEndOnRectangleIcon} themeColor="emerald" handles={handles}>
      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</label>
          <Dropdown
            value={inputType}
            onChange={setInputType}
            options={[
              { value: 'Text', label: 'Text' },
              { value: 'File', label: 'File' }
            ]}
          />
        </div>
      </div>
    </BaseNode>
  );
}