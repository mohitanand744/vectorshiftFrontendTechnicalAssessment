import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-hot-toast';
import { Button } from './Button';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
    currentFlowId: state.currentFlowId,
    setCurrentFlowId: state.setCurrentFlowId,
});


export const SubmitButton = () => {
    const { nodes, edges, currentFlowId, setCurrentFlowId } = useStore(selector, shallow);


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
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nodes, edges })
            });

            if (!response.ok) throw new Error('Backend analysis failed');

            const data = await response.json();

            toast.dismiss(loadingToast);

            // Success modal or toast with results
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

            // Save to history if valid
            const history = JSON.parse(localStorage.getItem('saved_flows') || '[]');

            const flowId = currentFlowId || Date.now();
            if (!currentFlowId) setCurrentFlowId(flowId);

            const newEntry = {
                id: flowId,
                timestamp: new Date().toISOString(),
                nodes: nodes,
                edges: edges,
                stats: {
                    nodes: nodes.length,
                    edges: edges.length
                },
                is_dag: data.is_dag
            };

            const existingIndex = history.findIndex(item => item.id === flowId);
            let newHistory;
            if (existingIndex !== -1) {
                // Update existing entry and move to top
                newHistory = [newEntry, ...history.filter(item => item.id !== flowId)];
            } else {
                // Add new entry
                newHistory = [newEntry, ...history];
            }

            localStorage.setItem('saved_flows', JSON.stringify(newHistory.slice(0, 10)));


        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Submission error: ${error.message}`);
        }
    };

    return (
        <Button
            onClick={handleSubmit}
            variant="pill"
        >
            Submit 
        </Button>
    );
};