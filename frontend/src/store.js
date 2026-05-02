import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';


export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    currentFlowId: null,

    getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
    },

    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
        });
    },

    removeNode: (id) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== id),
            edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
    },

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection) => {
        set({
            edges: addEdge(
                {
                    ...connection,
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#8B5CF6',
                    },
                    style: { stroke: '#8B5CF6' }
                },
                get().edges
            ),
        });
    },

    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
            }),
        });
    },
    
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setCurrentFlowId: (currentFlowId) => set({ currentFlowId }),
}));