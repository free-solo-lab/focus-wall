import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  STORAGE_VERSION,
  type BlockedSite,
  type ExtensionSettings
} from "./types";
import { isLanguage } from "./i18n";
import { normalizeHostname } from "./normalize";

function isBlockedSite(value: unknown): value is BlockedSite {
  if (!value || typeof value !== "object") {
    return false;
  }

  const site = value as Record<string, unknown>;

  return (
    typeof site.id === "string" &&
    typeof site.hostname === "string" &&
    typeof site.enabled === "boolean" &&
    typeof site.createdAt === "number"
  );
}

function sanitizeSettings(input: unknown): ExtensionSettings {
  if (!input || typeof input !== "object") {
    return DEFAULT_SETTINGS;
  }

  const raw = input as Partial<ExtensionSettings>;
  const blockedSites = Array.isArray(raw.blockedSites)
    ? raw.blockedSites
        .filter(isBlockedSite)
        .map((site) => {
          const hostname = normalizeHostname(site.hostname);
          return hostname ? { ...site, hostname } : null;
        })
        .filter((site): site is BlockedSite => site !== null)
    : [];

  return {
    blockedSites,
    language: isLanguage(raw.language) ? raw.language : DEFAULT_SETTINGS.language,
    storageVersion:
      typeof raw.storageVersion === "number" && raw.storageVersion > 0
        ? raw.storageVersion
        : STORAGE_VERSION
  };
}

export async function loadSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
  return sanitizeSettings(result[SETTINGS_STORAGE_KEY]);
}

export async function saveSettings(settings: ExtensionSettings): Promise<ExtensionSettings> {
  const sanitized = sanitizeSettings(settings);
  await chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: sanitized });
  return sanitized;
}

export async function ensureSettings(): Promise<ExtensionSettings> {
  const settings = await loadSettings();

  if (settings.storageVersion !== STORAGE_VERSION) {
    return saveSettings({
      ...settings,
      storageVersion: STORAGE_VERSION
    });
  }

  return settings;
}
