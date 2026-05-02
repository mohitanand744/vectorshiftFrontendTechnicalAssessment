import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, MarkerType } from 'reactflow';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { NodeRenderer } from '../nodes/NodeRenderer';

import 'reactflow/dist/style.css';

const gridSize = 20;
const nodeTypes = {
  input: NodeRenderer,
  llm: NodeRenderer,
  output: NodeRenderer,
  text: NodeRenderer,
  api: NodeRenderer,
  filter: NodeRenderer,
  math: NodeRenderer,
  delay: NodeRenderer,
  condition: NodeRenderer,
  Branch: NodeRenderer,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
});

export const FlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = useStore.getState().getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#8a01bc',
      width: 20,
      height: 20,
    },
    style: {
      stroke: '#8a01bc',
      strokeWidth: 2,
      zIndex: 999,
    },
  };

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative group">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        snapToGrid={false}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        defaultEdgeOptions={defaultEdgeOptions}
        className="bg-slate-950"
      >
        <Background color="#1e293b" gap={gridSize} size={3} />
        <Controls className="!bg-slate-900 !border-slate-700 !fill-slate-400 hover:!fill-primary" />
        <MiniMap
          nodeColor="#8a01bc"
          nodeStrokeColor="#8a01bc"
          nodeBorderRadius={60}
          maskColor="rgba(2, 6, 23, 0.7)"
          style={{
            backgroundColor: "#0f172a",
            overflow: "hidden",
          }}
          className='!mb-16 md:!mb-0'
        />
      </ReactFlow>
    </div>
  );
}