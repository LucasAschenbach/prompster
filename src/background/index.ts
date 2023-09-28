import browser from "webextension-polyfill";
import {
  initStorage,
  updateCache,
  // prompt methods
  getPrompts,
  setPrompts,
  updatePrompt,
  deletePrompt,
  createPrompt,
  // settings methods
  getSettings,
  setSettings,
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
    // prompt methods
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
    // settings methods
    case "getSettings":
      sendResponse(getSettings());
      break;
    case "setSettings":
      await setSettings(request.settings);
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
    if (areaName === "local") {
      updateCache(changes);
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
browser.runtime.setUninstallURL("https://tally.so/r/w542Go");
