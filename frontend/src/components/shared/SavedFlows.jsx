import { ClockIcon, TrashIcon, PlayIcon, XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { useReactFlow } from 'reactflow';
import { EmptyState } from './EmptyState';
import { Button } from '../ui/Button';
import Modal from '../ui/Modal';

export const SavedFlows = ({ isOpen, onClose }) => {
    const { history, removeHistoryItem, setNodes, setEdges, setCurrentFlowId, setCurrentProjectName } = useStore(
        state => ({
            history: state.history,
            removeHistoryItem: state.removeHistoryItem,
            setNodes: state.setNodes,
            setEdges: state.setEdges,
            setCurrentFlowId: state.setCurrentFlowId,
            setCurrentProjectName: state.setCurrentProjectName
        }),
        shallow
    );

    const { fitView } = useReactFlow();

    const loadFlow = (item) => {
        if (Array.isArray(item.nodes) && Array.isArray(item.edges)) {
            setNodes(item.nodes);
            setEdges(item.edges);
            setCurrentFlowId(item.id);
            setCurrentProjectName(item.title);
            onClose();

            setTimeout(() => {
                fitView({ padding: 0.3, duration: 300 });
            }, 20);
        }
    };

    const getCount = (data, statsValue) => {
        if (statsValue !== undefined) return statsValue;
        if (Array.isArray(data)) return data.length;
        return data; 
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 border border-violet-500/30">
                            <ClockIcon className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col text-left">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Saved Flows</h3>
                            <p className="text-sm text-slate-500">Restore a previously saved pipeline configuration.</p>
                        </div>
                    </div>
                    <Button onClick={onClose} variant="dangerIcon" title="Close Panel">
                        <XMarkIcon className="w-5 h-5" />
                    </Button>
                </div>

                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar flex flex-col gap-4 py-2">
                    {history.length > 0 ? (
                        history.map((item) => (
                            <div key={item.id} className="relative bg-slate-800/20 border border-slate-700/30 rounded-2xl p-5 flex items-center justify-between group hover:border-violet-500/40 transition-all overflow-hidden">
                                {/* Trace Background Icon */}
                                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                                    <CommandLineIcon className="w-24 h-24" />
                                </div>

                                <div className="flex flex-col gap-3 text-left relative z-10">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] font-black text-violet-400 uppercase tracking-widest">{item.title}</span>
                                        <span className="text-[11px] font-bold text-slate-500">
                                            {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Nodes</span>
                                            <span className="text-md font-bold text-slate-200">{getCount(item.nodes, item.stats?.nodes)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Edges</span>
                                            <span className="text-md font-bold text-slate-200">{getCount(item.edges, item.stats?.edges)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 relative z-10">
                                    <Button
                                        onClick={() => removeHistoryItem(item.id)}
                                        variant="ghost"
                                        className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2.5 transition-all"
                                        title="Delete this flow"
                                    >
                                        <TrashIcon className="w-[20px] h-[20px]" />
                                    </Button>
                                    <Button
                                        onClick={() => loadFlow(item)}
                                        variant="ghost"
                                        className="hover:text-emerald-400 hover:bg-emerald-500/10 p-2.5"
                                        title="Restore this flow"
                                    >
                                        <PlayIcon className="w-5 h-5 rotate-180" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState
                            icon={ClockIcon}
                            title="No History"
                            message="No recent executions found. Submit a pipeline to save it here."
                        />
                    )}
                </div>

            </div>
        </Modal>
    );
};
