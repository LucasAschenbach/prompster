import browser from "webextension-polyfill";
import { IPrompts, ISettings } from "../shared/types";

type StorageAction =
  | "getPrompts"
  | "setPrompts"
  | "createPrompt"
  | "updatePrompt"
  | "deletePrompt"
  | "getSettings"
  | "setSettings";

interface StorageRequest {
  action: StorageAction;
  [key: string]: any;
}

// Send a message to the background script
async function sendStorageRequest(request: StorageRequest): Promise<any> {
  const response = await browser.runtime.sendMessage(request);
  return response;
}

// Prompt methods

export async function getPrompts(): Promise<IPrompts> {
  const response = await sendStorageRequest({ action: "getPrompts" });
  return response;
}

export async function setPrompts(prompts: IPrompts): Promise<void> {
  await sendStorageRequest({ action: "setPrompts", prompts: prompts });
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

export function listenForBackgroundPromptUpdates(
  callback: (updatedPrompts: IPrompts) => void
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

// Settings methods

export async function getSettings(): Promise<ISettings> {
  const response = await sendStorageRequest({ action: "getSettings" });
  return response;
}

export async function setSettings(settings: ISettings): Promise<void> {
  await sendStorageRequest({ action: "setSettings", settings: settings });
}

export function listenForBackgroundSettingsUpdates(
  callback: (updatedSettings: ISettings) => void
) {
  const listener = (message: any, sender: any) => {
    if (message.type === "updateSettings" && sender.id === browser.runtime.id) {
      callback(message.settings);
    }
  };
  browser.runtime.onMessage.addListener(listener);
  return () => {
    browser.runtime.onMessage.removeListener(listener);
  };
}
