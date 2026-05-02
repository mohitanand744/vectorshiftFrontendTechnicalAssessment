import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { ReactFlowProvider } from 'reactflow';
import { SubmitButton } from './submit';
import { Toaster } from 'react-hot-toast';
import { Button } from './Button';

import { SavedFlows } from './SavedFlows';
import { ClockIcon } from '@heroicons/react/24/outline';

function App() {
  const [isSavedFlowsOpen, setIsSavedFlowsOpen] = useState(false);

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


          <PipelineUI />



          <div className="absolute top-8 right-8 z-10 flex items-center gap-4">
            <Button
              onClick={() => setIsSavedFlowsOpen(true)}
              variant="pill"
              className="group"
            >
              <span>Pipelines</span>
              <ClockIcon className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            </Button>

            <SubmitButton />
          </div>

          <SavedFlows isOpen={isSavedFlowsOpen} onClose={() => setIsSavedFlowsOpen(false)} />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;