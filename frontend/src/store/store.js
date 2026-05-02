import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';


export const useStore = create(
    persist(
        (set, get) => ({
            nodes: [],
            edges: [],
            nodeIDs: {},
            currentFlowId: null,
            history: [], // Centralized history

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
                                color: '#8a01bc',
                                width: 20,
                                height: 20,
                            },
                            style: { stroke: '#8a01bc', strokeWidth: 2 }
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

            // History Actions
            saveToHistory: (stats) => {
                const { nodes, edges, currentFlowId, history } = get();
                const flowId = currentFlowId || Date.now();
                
                const newEntry = {
                    id: flowId,
                    timestamp: new Date().toISOString(),
                    nodes: [...nodes],
                    edges: [...edges],
                    stats: stats || { nodes: nodes.length, edges: edges.length }
                };

                const existingIndex = history.findIndex(item => item.id === flowId);
                let newHistory;
                if (existingIndex !== -1) {
                    newHistory = [newEntry, ...history.filter(item => item.id !== flowId)];
                } else {
                    newHistory = [newEntry, ...history];
                }

                set({ 
                    history: newHistory.slice(0, 10),
                    currentFlowId: flowId 
                });
            },

            renameNodeReferences: (oldName, newName) => {
                set({
                    nodes: get().nodes.map((node) => {
                        const newData = { ...node.data };
                        let hasChanged = false;

                        // Scan all fields for the old variable pattern
                        Object.keys(newData).forEach((key) => {
                            if (typeof newData[key] === 'string' && newData[key].includes(`{{${oldName}}}`)) {
                                newData[key] = newData[key].replace(`{{${oldName}}}`, `{{${newName}}}`);
                                hasChanged = true;
                            }
                        });

                        if (hasChanged) {
                            return { ...node, data: newData };
                        }
                        return node;
                    }),
                });
            },

            clearHistory: () => set({ history: [] }),
            
            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),
            setCurrentFlowId: (currentFlowId) => set({ currentFlowId }),
        }),
        {
            name: 'workflow-storage', // unique name for localStorage key
        }
    )
);