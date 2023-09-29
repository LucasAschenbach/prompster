import browser from "webextension-polyfill";
import { ISettings } from "../../shared/types";
import defaultSettingsJson from "../../../static/default_settings.json";

let settingsCache: ISettings;

export async function initSettingsStorage() {
  const res = await browser.storage.local.get("settings");
  const settingsJson = res.settings || {};

  settingsCache = { ...defaultSettingsJson, ...settingsJson } as ISettings;

  if (JSON.stringify(settingsCache) === JSON.stringify(settingsJson)) {
    await browser.storage.local.set({ settings: settingsCache });
  }
}

// Update the cache and notify listeners
export async function updateSettingsCache(settings: ISettings) {
  if (JSON.stringify(settings) === JSON.stringify(settingsCache)) {
    return;
  }
  settingsCache = settings;
  const msg = {
    type: "updateSettings",
    settings: settingsCache,
  }
  await Promise.all([
    browser.runtime.sendMessage(msg),
    // send to content script
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs.length > 0 && tabs[0].id) {
        browser.tabs.sendMessage(tabs[0].id, msg);
      }
    })
  ]);
}

// CRUD operations
export function getSettings() {
  return settingsCache;
}

export async function setSettings(settings: ISettings) {
  await updateSettingsCache(settings);
  await browser.storage.local.set({ settings: settingsCache });
}
