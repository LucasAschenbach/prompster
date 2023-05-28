import browser from "webextension-polyfill";
import {
  initStorage,
  updateCache,
  getPrompts,
  setPrompts,
  updatePrompt,
  deletePrompt,
  createPrompt,
} from "./storage";

let storageInitialized = false;
const messageQueue: {
  request: any;
  sender: browser.Runtime.MessageSender;
  sendResponse: (response?: any) => void;
}[] = [];

async function processMessageQueue() {
  for (const { request, sender, sendResponse } of messageQueue) {
    await handleMessage(request, sender, sendResponse);
  }
}

async function handleMessage(
  request: any,
  sender: browser.Runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  switch (request.action) {
    case "getPrompts":
      sendResponse(getPrompts());
      break;
    case "setPrompts":
      await setPrompts(request.prompts);
      sendResponse();
      break;
    case "createPrompt":
      await createPrompt(request.key, request.value);
      sendResponse();
      break;
    case "updatePrompt":
      await updatePrompt(request.key, request.newKey, request.newValue);
      sendResponse();
      break;
    case "deletePrompt":
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
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.prompts) {
      updateCache(changes.prompts.newValue);
    }
  });
});

// Listen for messages from the popup and content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!storageInitialized) {
    messageQueue.push({ request, sender, sendResponse });
    return true;
  }
  handleMessage(request, sender, sendResponse);
  return true;
});

// Open feedback form on uninstall
browser.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScoNvysAJ_NNT4x8ZKOJaOKNAsdMkeDwXkNOAJfEKKb_Hihxw/viewform?usp=sf_link")
