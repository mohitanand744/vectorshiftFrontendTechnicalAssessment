import { DraggableNode } from './draggableNode';
import {
    ArrowRightEndOnRectangleIcon,
    ArrowLeftStartOnRectangleIcon,
    CpuChipIcon,
    DocumentTextIcon,
    CommandLineIcon,
    FunnelIcon,
    CalculatorIcon,
    ClockIcon,
    ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { FlowStats } from './FlowStats';

export const PipelineToolbar = () => {
    return (
        <aside className="w-full md:w-80 h-auto md:h-screen bg-[#050505] border-b md:border-b-0 md:border-r border-primary/50 p-6 flex flex-col gap-8 relative overflow-hidden">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img
                    src="/purple_bg.webp"
                    alt=""
                    className="w-full h-full object-cover object-right"
                />
            </div>
           

            <div className="flex items-center gap-2 px-1 relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neon-primary overflow-hidden ">
                    <img src="/VectorShift_Logo.jpg" className="w-10 h-10 rounded-xl object-contain" alt="VectorShift" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">VectorShift</h1>
                    <p className="text-[12px] text-primary uppercase tracking-[0.2em] font-semibold">Workflow Editor</p>
                </div>
            </div>
            <h1 className="text-sm font-bold text-violet-400 uppercase tracking-widest mt-1">Drag & Drop Builder</h1>

            <FlowStats />

            <section className="flex flex-col gap-5">
                <h2 className="text-[13px] font-bold text-primary uppercase tracking-widest px-1">Core Nodes</h2>
                <div className="grid grid-cols-2 gap-4">
                    <DraggableNode type='customInput' label='Input' icon={ArrowRightEndOnRectangleIcon} color="emerald" />
                    <DraggableNode type='customOutput' label='Output' icon={ArrowLeftStartOnRectangleIcon} color="rose" />
                    <DraggableNode type='text' label='Text' icon={DocumentTextIcon} color="violet" />
                    <DraggableNode type='llm' label='LLM' icon={CpuChipIcon} color="violet" />
                </div>
            </section>

            <section className="flex flex-col gap-5">
                <h2 className="text-[13px] font-bold text-primary uppercase tracking-widest px-1">Processing</h2>
                <div className="grid grid-cols-2 gap-4">
                    <DraggableNode type='api' label='API' icon={CommandLineIcon} color="indigo" />
                    <DraggableNode type='filter' label='Filter' icon={FunnelIcon} color="amber" />
                    <DraggableNode type='math' label='Math' icon={CalculatorIcon} color="fuchsia" />
                </div>
            </section>

            <section className="flex flex-col gap-5">
                <h2 className="text-[13px] font-bold text-primary uppercase tracking-widest px-1">Logic & Timing</h2>
                <div className="grid grid-cols-2 gap-4">
                    <DraggableNode type='condition' label='Condition' icon={ArrowsRightLeftIcon} color="cyan" />
                    <DraggableNode type='delay' label='Delay' icon={ClockIcon} color="orange" />
                </div>
            </section>
        </aside>
    );
};