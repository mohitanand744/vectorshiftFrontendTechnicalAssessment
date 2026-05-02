import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { ChartBarIcon, CubeIcon, ShareIcon } from '@heroicons/react/24/outline';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const FlowStats = () => {
    const { nodes, edges } = useStore(selector, shallow);

    return (
        <div className="z-10  flex flex-col gap-4 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-xl border border-primary/40 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 pointer-events-auto min-w-[200px]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                        <ChartBarIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] text-primary uppercase font-black tracking-widest">Telemetry</span>
                        <span className="text-sm font-bold text-slate-100 tracking-tight">Live Stats</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                        <span className="text-[14px] font-bold text-slate-300 uppercase tracking-tighter">
                            <span className="text-slate-100">{nodes.length} -</span> Nodes
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]"></div>
                        <span className="text-[14px] font-bold text-slate-300 uppercase tracking-tighter">
                            <span className="text-slate-100">{edges.length} -</span> Edges
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};