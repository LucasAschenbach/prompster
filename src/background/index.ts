import { initStorage, updateCache, getPrompts, addPrompt, updatePrompt, deletePrompt } from './storage';

let storageInitialized = false;
const messageQueue: { request: any; sender: chrome.runtime.MessageSender; sendResponse: (response?: any) => void }[] = [];

async function processMessageQueue() {
  for (const { request, sender, sendResponse } of messageQueue) {
    await handleMessage(request, sender, sendResponse);
  }
}

async function handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  switch (request.action) {
    case 'getPrompts':
      sendResponse(getPrompts());
      break;
    case 'addPrompt':
      await addPrompt(request.key, request.value);
      sendResponse();
      break;
    case 'updatePrompt':
      await updatePrompt(request.key, request.newKey, request.newValue);
      sendResponse();
      break;
    case 'deletePrompt':
      await deletePrompt(request.key);
      sendResponse();
      break;
  }
  return true;
}

// Initialize the storage and cache
initStorage().then(() => {
  storageInitialized = true;
  processMessageQueue();

  // Listen for changes in the Chrome storage to keep the cache up to date
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.prompts) {
      updateCache(changes.prompts.newValue);
    }
  });
});

// Listen for messages from the popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!storageInitialized) {
    messageQueue.push({ request, sender, sendResponse });
    return true;
  }
  handleMessage(request, sender, sendResponse);
  return true;
});
