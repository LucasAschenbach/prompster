import defaultPrompts from "../../static/default_prompts.json";

let promptsCache: { [key: string]: string } = {};

export async function initStorage() {
  promptsCache = await new Promise<{ [key: string]: string }>((resolve) => {
    chrome.storage.local.get("prompts", (data) => {
      resolve(data.prompts);
    });
  });
  if (promptsCache === undefined) {
    promptsCache = defaultPrompts;
    await chrome.storage.local.set({ prompts: promptsCache });
  }
}

// Update the cache and notify listeners
export async function updateCache(prompts: { [key: string]: string }) {
  if (JSON.stringify(prompts) === JSON.stringify(promptsCache)) {
    return;
  }
  promptsCache = prompts;
  await chrome.runtime.sendMessage({ type: "updatePrompts", prompts: prompts });
}

// CRUD operations

// Retrieve prompts
export function getPrompts() {
  return promptsCache;
}

export async function setPrompts(prompts: { [key: string]: string }) {
  await updateCache(prompts);
  await chrome.storage.local.set({ prompts: prompts });
}

// Add a new prompt
export async function createPrompt(key: string, value: string) {
  const updatedPrompts = { ...promptsCache, [key]: value };
  await updateCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: updatedPrompts });
}

// Update an existing prompt
export async function updatePrompt(
  oldKey: string,
  newKey: string,
  newValue: string
) {
  console.log(oldKey, newKey, newValue);
  const updatedPrompts = { ...promptsCache, [newKey]: newValue };
  if (oldKey !== newKey) {
    delete updatedPrompts[oldKey];
  }
  await updateCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: updatedPrompts });
}

// Delete a prompt
export async function deletePrompt(key: string) {
  const updatedPrompts = { ...promptsCache };
  delete updatedPrompts[key];
  await updateCache(updatedPrompts);
  await chrome.storage.local.set({ prompts: updatedPrompts });
}
