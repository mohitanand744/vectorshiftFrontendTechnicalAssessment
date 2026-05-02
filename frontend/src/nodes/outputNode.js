import { useState } from 'react';
import { Position } from 'reactflow';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../Dropdown';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-value`, color: 'bg-rose-400' }
  ];

  return (
    <BaseNode id={id} title="Output" icon={ArrowLeftStartOnRectangleIcon} themeColor="rose" handles={handles}>
      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</label>
          <Dropdown
            value={outputType}
            onChange={setOutputType}
            options={[
              { value: 'Text', label: 'Text' },
              { value: 'Image', label: 'Image' }
            ]}
          />
        </div>
      </div>
    </BaseNode>
  );
}