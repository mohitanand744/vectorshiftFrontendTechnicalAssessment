import {
    ArrowRightEndOnRectangleIcon,
    ArrowLeftStartOnRectangleIcon,
    CpuChipIcon,
    DocumentTextIcon,
    CommandLineIcon,
    FunnelIcon,
    CalculatorIcon,
    ClockIcon,
    ArrowsRightLeftIcon,
    ChevronDownIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import { FlowStats } from './FlowStats';
import { useState } from 'react';
import { DraggableNode } from './DraggableNode';
import { useReactFlow } from 'reactflow';
import { useStore } from '../../store/store';


export const PipelineToolbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { getViewport } = useReactFlow();
    const addNode = useStore(state => state.addNode);
    const getNodeID = useStore(state => state.getNodeID);

    const onNodeClick = (type) => {
        const { x, y, zoom } = getViewport();

        const center = {
            x: -x / zoom + (window.innerWidth > 768 ? (window.innerWidth - 320) : window.innerWidth) / (2 * zoom),
            y: -y / zoom + window.innerHeight / (2 * zoom),
        };

        const nodeID = getNodeID(type);
        const newNode = {
            id: nodeID,
            type,
            position: center,
            data: { id: nodeID, nodeType: type },
        };

        addNode(newNode);

        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Toggle Trigger */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary rounded-full shadow-neon-primary text-white font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
                >
                    <Squares2X2Icon className="w-5 h-5" />
                    <span>{isOpen ? 'Close Nodes' : 'Add Nodes'}</span>
                </button>
            </div>

            <aside className={`
                fixed md:relative z-[90] md:z-10
                w-full md:w-80 
                bg-[#050505]/95 md:bg-[#050505] 
                backdrop-blur-xl md:backdrop-blur-none
                border-t md:border-t-0 md:border-r border-primary/50 
                p-6 flex flex-col gap-8 
                transition-all duration-500 ease-in-out
                ${isOpen ? 'bottom-0 h-[70vh]' : 'bottom-[-100%] h-[70vh]'}
                md:bottom-auto md:h-screen md:translate-y-0
                overflow-y-auto custom-scrollbar
            `}>
                {/* Background Image Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img
                        src="/purple_bg.webp"
                        alt=""
                        className="w-full h-full object-cover object-right"
                    />
                </div>

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex bg-black/40 border border-primary/40 w-full px-4 py-2 rounded-2xl pl-2 shadow-lg shadow-black items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-neon-primary overflow-hidden">
                            <img src="/VectorShift_Logo.jpg" className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-contain" alt="VectorShift" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">VectorShift</h1>
                            <p className="text-[10px] md:text-[12px] text-violet-400 uppercase tracking-[0.2em] font-semibold">Workflow Editor</p>
                        </div>
                    </div>
                    <button className="md:hidden text-slate-400 p-2" onClick={() => setIsOpen(false)}>
                        <ChevronDownIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative z-10 flex flex-col gap-8 pb-20 md:pb-0">
                    <div className=''>
                        <h1 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-4">Drag & Drop Builder</h1>
                        <FlowStats />
                    </div>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-[13px] font-bold text-violet-400 uppercase tracking-widest px-1">Core Nodes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <DraggableNode type='input' label='Input' icon={ArrowRightEndOnRectangleIcon} color="emerald" onClick={onNodeClick} />
                            <DraggableNode type='output' label='Output' icon={ArrowLeftStartOnRectangleIcon} color="rose" onClick={onNodeClick} />
                            <DraggableNode type='text' label='Text' icon={DocumentTextIcon} color="violet" onClick={onNodeClick} />
                            <DraggableNode type='llm' label='LLM' icon={CpuChipIcon} color="violet" onClick={onNodeClick} />
                        </div>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-[13px] font-bold text-violet-400 uppercase tracking-widest px-1">Processing Nodes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <DraggableNode type='api' label='API' icon={CommandLineIcon} color="indigo" onClick={onNodeClick} />
                            <DraggableNode type='filter' label='Filter' icon={FunnelIcon} color="amber" onClick={onNodeClick} />
                            <DraggableNode type='math' label='Math' icon={CalculatorIcon} color="fuchsia" onClick={onNodeClick} />
                        </div>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-[13px] font-bold text-violet-400 uppercase tracking-widest px-1">Logic & Timing Nodes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <DraggableNode type='condition' label='Condition' icon={ArrowsRightLeftIcon} color="cyan" onClick={onNodeClick} />
                            <DraggableNode type='delay' label='Delay' icon={ClockIcon} color="orange" onClick={onNodeClick} />

                        </div>
                    </section>
                </div>
            </aside>

            {/* Overlay for mobile when open */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};