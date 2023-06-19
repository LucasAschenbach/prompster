import defaultPrompts from "../../static/default_prompts.json";

let promptsCache: { [key: string]: string } = {};

export async function initStorage() {
  promptsCache = await new Promise<{ [key: string]: string }>((resolve) => {
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
export async function updateCache(prompts: { [key: string]: string }) {
  const sortedPrompts = sortAlphabetically(prompts);
  if (JSON.stringify(sortedPrompts) === JSON.stringify(promptsCache)) {
    return;
  }
  promptsCache = sortedPrompts;
  await chrome.runtime.sendMessage({ type: "updatePrompts", prompts: promptsCache });
}

function sortAlphabetically(object: { [key: string]: string }): { [key: string]: string } {
  const sortedEntries = Object.entries(object).sort((a, b) => a[0].localeCompare(b[0]));
  return Object.fromEntries(sortedEntries);
}

// CRUD operations

// Retrieve prompts
export function getPrompts() {
  return promptsCache;
}

export async function setPrompts(prompts: { [key: string]: string }) {
  await updateCache(prompts);
  await chrome.storage.local.set({ prompts: promptsCache });
}

// Add a new prompt
export async function createPrompt(key: string, value: string) {
  const updatedPrompts = { ...promptsCache, [key]: value };
  await updateCache(updatedPrompts);
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
  await updateCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: promptsCache });
}

// Delete a prompt
export async function deletePrompt(key: string) {
  const updatedPrompts = { ...promptsCache };
  delete updatedPrompts[key];
  await updateCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: promptsCache });
}
