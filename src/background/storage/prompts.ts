import { IPrompts } from "../../shared/types";
import defaultPrompts from "../../../static/default_prompts.json";

let promptsCache: IPrompts = {};

export async function initPromptsStorage() {
  promptsCache = await new Promise<IPrompts>((resolve) => {
    chrome.storage.local.get("prompts", (data) => {
      resolve(data.prompts);
    });
  });
  if (promptsCache === undefined) {
    promptsCache = sortAlphabetically(defaultPrompts);
    await chrome.storage.local.set({ prompts: promptsCache });
  }
}

// Update the cache and notify listeners
export async function updatePromptsCache(prompts: IPrompts) {
  const sortedPrompts = sortAlphabetically(prompts);
  if (JSON.stringify(sortedPrompts) === JSON.stringify(promptsCache)) {
    return;
  }
  promptsCache = sortedPrompts;
  await chrome.runtime.sendMessage({
    type: "updatePrompts",
    prompts: promptsCache,
  });
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
  await chrome.storage.local.set({ prompts: promptsCache });
}

// Add a new prompt
export async function createPrompt(key: string, value: string) {
  const updatedPrompts = { ...promptsCache, [key]: value };
  await updatePromptsCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: promptsCache });
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
  await chrome.storage.local.set({ prompts: promptsCache });
}

// Delete a prompt
export async function deletePrompt(key: string) {
  const updatedPrompts = { ...promptsCache };
  delete updatedPrompts[key];
  await updatePromptsCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: promptsCache });
}
