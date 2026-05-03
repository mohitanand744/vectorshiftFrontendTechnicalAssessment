import { useState } from 'react';
import { PipelineToolbar } from '../components/flow/PipelineToolbar';
import { FlowCanvas } from '../components/flow/FlowCanvas';
import { ReactFlowProvider } from 'reactflow';
import { SubmitButton } from '../components/flow/SubmitButton';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../components/ui/Button';

import { SavedFlows } from '../components/shared/SavedFlows';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ProjectHeader } from '../components/shared/ProjectHeader';
import { PipelineNamingModal } from '../components/shared/PipelineNamingModal';
import { useStore } from '../store/store';

function App() {
  const [isSavedFlowsOpen, setIsSavedFlowsOpen] = useState(false);
  const [isNamingModalOpen, setIsNamingModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'rename'

  const { clearCanvas, resetCanvas, setCurrentProjectName, saveToHistory, nodes, edges, currentProjectName } = useStore(state => ({
    clearCanvas: state.clearCanvas,
    resetCanvas: state.resetCanvas,
    setCurrentProjectName: state.setCurrentProjectName,
    saveToHistory: state.saveToHistory,
    nodes: state.nodes,
    edges: state.edges,
    currentProjectName: state.currentProjectName
  }));

  const handleCreateNew = () => {
    setModalMode('create');
    setIsNamingModalOpen(true);
  };

  const handleRename = () => {
    setModalMode('rename');
    setIsNamingModalOpen(true);
  };

  const handleNameConfirm = (name) => {
    if (modalMode === 'create') {
      const hasExistingContent = nodes.length > 0;
      const prevName = currentProjectName === 'Untitled Pipeline' ? 'Previous Pipeline' : currentProjectName;

      // 1. Save current state to history before clearing
      if (hasExistingContent) {
        saveToHistory(null, { nodes: nodes.length, edges: edges.length });
      }

      // 2. Reset workspace
      clearCanvas();

      // 3. Set the new name
      setCurrentProjectName(name);

      toast.success((t) => (
        <div className="flex flex-col gap-1">
          {hasExistingContent && (
            <p className="text-[14px] text-slate-400 font-medium">
              Archived <span className="text-violet-400 font-bold">"{prevName}"</span> to history
            </p>
          )}
          <p className="text-sm font-bold text-white">
            New project <span className="text-emerald-400 font-black tracking-tight">"{name}"</span> started!
          </p>
        </div>
      ), { icon: '✨', duration: 5000 });
    } else {
      // Just Rename Mode
      setCurrentProjectName(name);
      toast.success(`Pipeline renamed to "${name}"`, { icon: '📝' });
    }

    setIsNamingModalOpen(false);
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-col-reverse md:flex-row h-screen w-screen overflow-hidden bg-[#020617] font-sans text-slate-200">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0D1117',
              color: '#e2e8f0',
              border: '1px solid #30363D',
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
          }}
        />

        <PipelineToolbar />

        <div className="flex-1 relative h-full w-full">


          <FlowCanvas />



          <ProjectHeader
            onNewProject={handleCreateNew}
            onRename={handleRename}
          />

          <div className="absolute top-4 md:top-8 right-4 md:right-8 z-[50] flex items-center gap-2 md:gap-4">
            {nodes.length > 0 && (
              <Button
                onClick={() => {
                  resetCanvas();
                  toast.success('Canvas cleared', { icon: '🧹' });
                }}
                variant="dangerPill"
                title="Clear all nodes and edges"
                className="!px-3 md:!px-8 !py-2 md:!py-3 !rounded-xl md:!rounded-full animate-in fade-in slide-in-from-right-4 duration-300 group"
              >
                <span className="hidden md:block">Clear</span>
                <TrashIcon className="w-5 h-5 md:hidden group-hover:scale-110 transition-transform" />
              </Button>
            )}

            <Button
              onClick={() => setIsSavedFlowsOpen(true)}
              variant="pill"
              className="!px-3 md:!px-8 !py-2 md:!py-3 !rounded-xl md:!rounded-full group"
              title="View and restore past pipelines"
            >
              <span className="hidden md:block text-xs xl:text-sm">Pipelines</span>
              <ClockIcon className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            </Button>

            <SubmitButton />
          </div>

          <SavedFlows isOpen={isSavedFlowsOpen} onClose={() => setIsSavedFlowsOpen(false)} />
          <PipelineNamingModal
            isOpen={isNamingModalOpen}
            onClose={() => setIsNamingModalOpen(false)}
            onConfirm={handleNameConfirm}
            initialValue={modalMode === 'rename' ? currentProjectName : ''}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;