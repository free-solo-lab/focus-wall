export type Language = "en" | "ru";

export type BlockedSite = {
  id: string;
  hostname: string;
  enabled: boolean;
  createdAt: number;
};

export type ExtensionSettings = {
  blockedSites: BlockedSite[];
  language: Language;
  storageVersion: number;
};

export const STORAGE_VERSION = 1;
export const SETTINGS_STORAGE_KEY = "settings";
export const DEFAULT_LANGUAGE: Language = "en";

export const DEFAULT_SETTINGS: ExtensionSettings = {
  blockedSites: [],
  language: DEFAULT_LANGUAGE,
  storageVersion: STORAGE_VERSION
};
