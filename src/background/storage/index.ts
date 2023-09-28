import browser from "webextension-polyfill";
import {
  initPromptsStorage,
  updatePromptsCache,
  getPrompts,
  setPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
} from "./prompts";
import {
  initSettingsStorage,
  updateSettingsCache,
  getSettings,
  setSettings,
} from "./settings";

export async function initStorage() {
  await Promise.all([initPromptsStorage(), initSettingsStorage()]);
}

// Update the caches and notify listeners
export async function updateCache(
  changes: Record<string, browser.Storage.StorageChange>
) {
  await Promise.all([
    changes.prompts
      ? updatePromptsCache(changes.prompts?.newValue)
      : Promise.resolve(),
    changes.settings
      ? updateSettingsCache(changes.settings?.newValue)
      : Promise.resolve(),
  ]);
}

export {
  // prompt methods
  getPrompts,
  setPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
  // settings methods
  getSettings,
  setSettings,
};
