import React from 'react';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

export const ProjectHeader = ({ onNewProject, onRename }) => {
    const { currentProjectName, nodes } = useStore(
        (state) => ({
            currentProjectName: state.currentProjectName,
            nodes: state.nodes
        }),
        shallow
    );

    const handleNewClick = () => {
        onNewProject();
    };

    return (
        <div className="absolute top-28 xl:top-8 left-0 xl:left-8 z-[10] flex items-center gap-4 px-6 py-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-start">
                    <span className="xl:text-[13px] text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] leading-none mb-1.5">Active Pipeline</span>
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={onRename}>
                        <h2 className="xl:text-lg text-sm font-bold text-white tracking-tight leading-none">{currentProjectName}</h2>
                        <PencilSquareIcon className="xl:w-4 xl:h-4 w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="w-px h-8 bg-slate-800 mx-2" />

            <Button
                onClick={handleNewClick}
                variant="ghost"
                className="!px-4 !py-2 !rounded-2xl hover:bg-violet-500/10 hover:text-violet-400 transition-all gap-2"
                title="Create a fresh pipeline"
            >
                <PlusIcon className="xl:w-5 xl:h-5 w-4 h-4" />
                <span className="xl:text-sm text-xs font-bold">New Pipeline</span>
            </Button>
        </div>
    );
};
