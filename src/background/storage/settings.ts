import defaultSettingsJson from "../../../static/default_settings.json";

interface ISettings {
  onlyFirstChar: boolean;
}

let settingsCache: ISettings;

export async function initSettingsStorage() {
  const settingsJson =
    (await new Promise<{ [key: string]: any }>((resolve) => {
      chrome.storage.local.get("settings", (data) => {
        resolve(data.settings);
      });
    })) || {};

  settingsCache = { ...defaultSettingsJson, ...settingsJson } as ISettings;

  if (JSON.stringify(settingsCache) === JSON.stringify(settingsJson)) {
    await chrome.storage.local.set({ settings: settingsCache });
  }
}

// Update the cache and notify listeners
export async function updateSettingsCache(settings: ISettings) {
  if (JSON.stringify(settings) === JSON.stringify(settingsCache)) {
    return;
  }
  settingsCache = settings;
  await chrome.runtime.sendMessage({
    type: "setSettings",
    settings: settingsCache,
  });
}

// CRUD operations
export function getSettings() {
  return settingsCache;
}

export async function setSettings(settings: ISettings) {
  await updateSettingsCache(settings);
  await chrome.storage.local.set({ settings: settingsCache });
}
