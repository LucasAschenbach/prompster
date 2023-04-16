import prompts from '../../static/prompts.json';

let promptsCache: { [key: string]: string } = {};

export async function initStorage() {
  promptsCache = await new Promise<{ [key: string]: string }>((resolve) => {
    chrome.storage.local.get('prompts', (data) => {
      resolve(data.prompts);
    });
  });
  if (promptsCache === undefined) {
    promptsCache = prompts;
    await chrome.storage.local.set({ prompts: promptsCache });
  }
}

// Update the cache, only called by the storage listener
export function updateCache(prompts: { [key: string]: string }) {
  promptsCache = prompts;
}

// CRUD operations

// Retrieve prompts
export function getPrompts() {
  return promptsCache;
}

// Add a new prompt
export async function addPrompt(key: string, value: string) {
  promptsCache[key] = value;
  await chrome.storage.sync.set({ prompts: promptsCache });
}

// Update an existing prompt
export async function updatePrompt(oldKey: string, newKey: string, newValue: string) {
  delete promptsCache[oldKey];
  promptsCache[newKey] = newValue;
  await chrome.storage.sync.set({ prompts: promptsCache });
}

// Delete a prompt
export async function deletePrompt(key: string) {
  delete promptsCache[key];
  await chrome.storage.sync.set({ prompts: promptsCache });
}
