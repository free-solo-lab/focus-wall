import { buildDynamicRules } from "../lib/rules";
import { ensureSettings, loadSettings } from "../lib/storage";

async function syncDynamicRules(): Promise<void> {
  const settings = await loadSettings();
  const blockedPageUrl = chrome.runtime.getURL("blocked.html");
  const addRules = buildDynamicRules(settings.blockedSites, blockedPageUrl);
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map((rule) => rule.id),
    addRules
  });
}

async function bootstrap(): Promise<void> {
  await ensureSettings();
  await syncDynamicRules();
}

chrome.runtime.onInstalled.addListener(() => {
  void bootstrap();
});

chrome.runtime.onStartup.addListener(() => {
  void syncDynamicRules();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.settings) {
    void syncDynamicRules();
  }
});

chrome.action.onClicked.addListener(() => {
  void chrome.runtime.openOptionsPage();
});

// Ensure rules are re-projected from storage whenever the MV3 worker starts,
// including manual extension reloads where no storage change occurs.
void bootstrap();
