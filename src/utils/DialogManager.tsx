// DialogManager.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import { PromptProvider } from '../contexts/PromptContext';
import PreviewPrompt from '../components/PreviewPrompt';
import Modal from '../components/Modal';

const launchDialog = (
  promptKey: string,
  prompt: string,
  onSubmit: (result: string) => void,
  onClose: () => void
) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const handleCloseDialog = () => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    onClose();
  };

  ReactDOM.render(
    <React.StrictMode>
      <div className="prompster">
        <div className="font-sans">
          <Modal 
            onClose={handleCloseDialog} 
            ariaLabel="Modal Title"
            ariaDescribedby="modalDescriptionId"
          >
            <PromptProvider>
              <PreviewPrompt
                promptKey={promptKey}
                prompt={prompt}
                onSubmit={(result: string) => {
                  handleCloseDialog();
                  onSubmit(result);
                }}
              />
            </PromptProvider>
          </Modal>
        </div>
      </div>
    </React.StrictMode>,
    div
  );
};

export default launchDialog;
