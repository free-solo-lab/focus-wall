type StoredBlockedSite = {
  hostname: string;
  enabled: boolean;
};

type StoredSettings = {
  blockedSites?: StoredBlockedSite[];
};

function isIpv4(hostname: string): boolean {
  const segments = hostname.split(".");

  return (
    segments.length === 4 &&
    segments.every((segment) => /^(25[0-5]|2[0-4]\d|1?\d?\d)$/.test(segment))
  );
}

function getHostnameRuleTargets(hostname: string): string[] {
  const targets = new Set<string>([hostname]);
  const aliasEligible = hostname !== "localhost" && !isIpv4(hostname) && hostname.includes(".");

  if (!aliasEligible) {
    return [...targets];
  }

  if (hostname.startsWith("www.")) {
    const bareHostname = hostname.slice(4);

    if (bareHostname) {
      targets.add(bareHostname);
    }
  } else {
    targets.add(`www.${hostname}`);
  }

  return [...targets];
}

function isHostnameBlocked(currentHostname: string, blockedHostname: string): boolean {
  return getHostnameRuleTargets(blockedHostname).some(
    (targetHostname) =>
      currentHostname === targetHostname || currentHostname.endsWith(`.${targetHostname}`)
  );
}

function redirectToBlockedPage(hostname: string): void {
  const blockedPageUrl = chrome.runtime.getURL("blocked.html");
  const url = new URL(blockedPageUrl);
  url.searchParams.set("domain", hostname);
  window.location.replace(url.toString());
}

async function loadBlockedSites(): Promise<StoredBlockedSite[]> {
  const result = await chrome.storage.sync.get("settings");
  const settings = result.settings as StoredSettings | undefined;

  return Array.isArray(settings?.blockedSites) ? settings.blockedSites : [];
}

async function runFallbackBlocker(): Promise<void> {
  if (window.top !== window) {
    return;
  }

  if (window.location.protocol.startsWith("chrome-extension")) {
    return;
  }

  const currentHostname = window.location.hostname.toLowerCase();
  const blockedSites = await loadBlockedSites();
  const matchedSite = blockedSites.find(
    (site) => site.enabled && typeof site.hostname === "string" && isHostnameBlocked(currentHostname, site.hostname)
  );

  if (!matchedSite) {
    return;
  }

  redirectToBlockedPage(matchedSite.hostname);
}

void runFallbackBlocker();
