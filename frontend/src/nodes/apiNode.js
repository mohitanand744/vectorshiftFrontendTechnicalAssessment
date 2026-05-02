import { useState } from 'react';
import { Position } from 'reactflow';
import { CommandLineIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '../Dropdown';
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-trigger`, color: 'bg-sky-400' },
    { type: 'source', position: Position.Right, id: `${id}-data`, style: { top: '33%' }, color: 'bg-sky-400' },
    { type: 'source', position: Position.Right, id: `${id}-error`, style: { top: '66%' }, color: 'bg-rose-400' }
  ];

  return (
    <BaseNode id={id} title="API Request" icon={CommandLineIcon} themeColor="indigo" handles={handles}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Endpoint URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-[#050505]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            placeholder="https://api.example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</label>
          <Dropdown
            value={method}
            onChange={setMethod}
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' }
            ]}
          />
        </div>
      </div>
    </BaseNode>
  );
}