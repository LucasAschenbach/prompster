import browser from "webextension-polyfill";
import { IPrompts } from "../../shared/types";
import defaultPrompts from "../../../static/default_prompts.json";

let promptsCache: IPrompts = {};

export async function initPromptsStorage() {
  promptsCache = await new Promise<IPrompts>((resolve) => {
    chrome.storage.local.get("prompts", (data) => {
      resolve(data.prompts);
    });
  });
  const res = await browser.storage.local.get("prompts");
  promptsCache = res.prompts as IPrompts;

  if (promptsCache === undefined) {
    promptsCache = sortAlphabetically(defaultPrompts);
    await browser.storage.local.set({ prompts: promptsCache });
  }
}

// Update the cache and notify listeners
export async function updatePromptsCache(prompts: IPrompts) {
  const sortedPrompts = sortAlphabetically(prompts);
  if (JSON.stringify(sortedPrompts) === JSON.stringify(promptsCache)) {
    return;
  }
  promptsCache = sortedPrompts;
  const msg = {
    type: "updatePrompts",
    prompts: promptsCache,
  };
  await Promise.all([
    browser.runtime.sendMessage(msg),
    // send to content script
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs.length > 0 && tabs[0].id) {
        browser.tabs.sendMessage(tabs[0].id, msg);
      }
    })
  ])
}

function sortAlphabetically(object: IPrompts): IPrompts {
  const sortedEntries = Object.entries(object).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  return Object.fromEntries(sortedEntries);
}

// CRUD operations

// Retrieve prompts
export function getPrompts() {
  return promptsCache;
}

export async function setPrompts(prompts: IPrompts) {
  await updatePromptsCache(prompts);
  await browser.storage.local.set({ prompts: promptsCache });
}

// Add a new prompt
export async function createPrompt(key: string, value: string) {
  const updatedPrompts = { ...promptsCache, [key]: value };
  await updatePromptsCache(updatedPrompts);
  await browser.storage.local.set({ prompts: promptsCache });
}

// Update an existing prompt
export async function updatePrompt(
  oldKey: string,
  newKey: string,
  newValue: string
) {
  const updatedPrompts = { ...promptsCache, [newKey]: newValue };
  if (oldKey !== newKey) {
    delete updatedPrompts[oldKey];
  }
  await updatePromptsCache(updatedPrompts);
  await browser.storage.local.set({ prompts: promptsCache });
}

// Delete a prompt
export async function deletePrompt(key: string) {
  const updatedPrompts = { ...promptsCache };
  delete updatedPrompts[key];
  await updatePromptsCache(updatedPrompts);
  await browser.storage.local.set({ prompts: promptsCache });
}
