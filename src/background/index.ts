// src/background/index.ts

import { initStorage, updateCache, getPrompts, addPrompt, updatePrompt, deletePrompt } from './storage';

// Initialize the storage and cache
initStorage();

// Listen for changes in the Chrome storage to keep the cache up to date
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.prompts) {
    updateCache(changes.prompts.newValue);
  }
});

// Listen for messages from the popup and content script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.action) {
    case 'getPrompts':
      sendResponse(getPrompts());
      break;
    case 'addPrompt':
      addPrompt(request.key, request.value);
      sendResponse();
      break;
    case 'updatePrompt':
      updatePrompt(request.key, request.newKey, request.newValue);
      sendResponse();
      break;
    case 'deletePrompt':
      await deletePrompt(request.key);
      sendResponse();
      break;
  }
  return true;
});
