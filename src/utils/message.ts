type StorageAction = 'getPrompts' | 'addPrompt' | 'updatePrompt' | 'deletePrompt';

interface StorageRequest {
  action: StorageAction;
  [key: string]: any;
}

// Send a message to the background script
function sendStorageRequest(request: StorageRequest): Promise<any> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(request, (response) => {
      resolve(response);
    });
  });
}

export async function getPrompts(): Promise<{ [key: string]: string }> {
  const response = await sendStorageRequest({ action: 'getPrompts' });
  return response;
}

export async function addPrompt(key: string, value: string): Promise<void> {
  await sendStorageRequest({ action: 'addPrompt', key: key, value: value });
}

export async function updatePrompt(key: string, newKey: string, newValue: string): Promise<void> {
  await sendStorageRequest({ action: 'updatePrompt', key: key, newKey: newKey, newValue: newValue });
}

export async function deletePrompt(key: string): Promise<void> {
  await sendStorageRequest({ action: 'deletePrompt', key: key });
}

export function listenForBackgroundUpdates(callback: (updatedPrompts: { [key: string]: string }) => void) {
  const listener = (message: any, sender: any) => {
    if (message.type === 'updatePrompts' && sender.id === chrome.runtime.id) {
      callback(message.prompts);
    }
  };
  chrome.runtime.onMessage.addListener(listener);
  return () => {
    chrome.runtime.onMessage.removeListener(listener);
  }
}
