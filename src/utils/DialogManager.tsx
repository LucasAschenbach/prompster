import React from "react";
import ReactDOM from "react-dom";
import { PromptProvider } from "../contexts/PromptContext";
import PreviewPrompt from "../components/PreviewPrompt";
import Modal from "../components/Modal";

const launchDialog = (
  promptKey: string,
  prompt: string,
  onSubmit: (result: string) => void,
  onCancel: () => void
) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const unmountDialog = () => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };

  const handleCancelDialog = () => {
    unmountDialog();
    onCancel();
  };

  const handleSubmitDialog = (result: string) => {
    unmountDialog();
    onSubmit(result);
  };

  ReactDOM.render(
    <React.StrictMode>
      <div className="prompster">
        <div className="font-sans">
          <Modal
            onClose={handleCancelDialog}
            ariaLabel="Modal Title"
            ariaDescribedby="modalDescriptionId"
          >
            <PromptProvider>
              <PreviewPrompt
                promptKey={promptKey}
                prompt={prompt}
                onSubmit={handleSubmitDialog}
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
