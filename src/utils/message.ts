import browser from "webextension-polyfill";

type StorageAction =
  | "getPrompts"
  | "createPrompt"
  | "updatePrompt"
  | "deletePrompt";

interface StorageRequest {
  action: StorageAction;
  [key: string]: any;
}

// Send a message to the background script
async function sendStorageRequest(request: StorageRequest): Promise<any> {
  const response = await browser.runtime.sendMessage(request);
  return response;
}

export async function getPrompts(): Promise<{ [key: string]: string }> {
  const response = await sendStorageRequest({ action: "getPrompts" });
  return response;
}

export async function createPrompt(key: string, value: string): Promise<void> {
  await sendStorageRequest({ action: "createPrompt", key: key, value: value });
}

export async function updatePrompt(
  key: string,
  newKey: string,
  newValue: string
): Promise<void> {
  await sendStorageRequest({
    action: "updatePrompt",
    key: key,
    newKey: newKey,
    newValue: newValue,
  });
}

export async function deletePrompt(key: string): Promise<void> {
  await sendStorageRequest({ action: "deletePrompt", key: key });
}

export function listenForBackgroundUpdates(
  callback: (updatedPrompts: { [key: string]: string }) => void
) {
  const listener = (message: any, sender: any) => {
    if (message.type === "updatePrompts" && sender.id === browser.runtime.id) {
      callback(message.prompts);
    }
  };
  browser.runtime.onMessage.addListener(listener);
  return () => {
    browser.runtime.onMessage.removeListener(listener);
  };
}
