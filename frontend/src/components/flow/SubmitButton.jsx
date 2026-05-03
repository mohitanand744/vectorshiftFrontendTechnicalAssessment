import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { pipelineApi } from '../../api/pipeline';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    currentFlowId: state.currentFlowId,
    setCurrentFlowId: state.setCurrentFlowId,
});


export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);


    const handleSubmit = async () => {
        if (nodes.length === 0) {
            toast.error("Cannot submit an empty pipeline. Please add some nodes.", {
                icon: '🚀',
                style: {
                    borderRadius: '10px',
                    background: '#0D1117',
                    color: '#e2e8f0',
                    border: '1px solid #30363D'
                }
            });
            return;
        }

        if (edges.length === 0) {
            toast.error("Pipeline must have at least one connection.", {
                icon: '🔗',
                style: {
                    borderRadius: '10px',
                    background: '#0D1117',
                    color: '#e2e8f0',
                    border: '1px solid #30363D'
                }
            });
            return;
        }

        const loadingToast = toast.loading('Analyzing pipeline structure...');

        try {
            const data = await pipelineApi.parse({ nodes, edges });

            toast.dismiss(loadingToast);

            toast.success(
                (t) => (
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-emerald-400">Pipeline Analyzed Successfully!</p>
                        <div className="grid grid-cols-3 gap-2 text-md text-slate-300">
                            <span>Nodes: {data.num_nodes}</span>
                            <span>Edges: {data.num_edges}</span>
                            <span>Is DAG: <span className={data.is_dag ? 'text-emerald-400' : 'text-rose-400'}>{data.is_dag ? 'Yes' : 'No'}</span></span>
                        </div>
                    </div>
                ),
                { duration: 5000 }
            );

            useStore.getState().saveToHistory(null, {
                nodes: data.num_nodes,
                edges: data.num_edges,
                is_dag: data.is_dag
            });

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Submission error: ${error.message}`);
        }
    };

    return (
        <Button
            onClick={handleSubmit}
            variant="pill"
            title="Submit and save progress"
            className="!px-3 md:!px-8 !py-2 md:!py-3 !rounded-xl md:!rounded-full"
        >
            Submit
        </Button>
    );
};