import type { BlockedSite } from "./types";
import { getHostnameRuleTargets } from "./hostname";

function createBlockedPageUrl(blockedPageUrl: string, hostname: string): string {
  const separator = blockedPageUrl.includes("?") ? "&" : "?";
  return `${blockedPageUrl}${separator}domain=${encodeURIComponent(hostname)}`;
}

export function buildDynamicRules(
  blockedSites: BlockedSite[],
  blockedPageUrl: string
): chrome.declarativeNetRequest.Rule[] {
  let ruleId = 1;

  return blockedSites
    .filter((site) => site.enabled)
    .flatMap((site) =>
      getHostnameRuleTargets(site.hostname).flatMap((targetHostname) => {
        const targetRuleId = ruleId;
        ruleId += 2;

        return [
          {
            id: targetRuleId,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                url: createBlockedPageUrl(blockedPageUrl, site.hostname)
              }
            },
            condition: {
              requestDomains: [targetHostname],
              resourceTypes: ["main_frame"]
            }
          },
          {
            id: targetRuleId + 1,
            priority: 1,
            action: {
              type: "block"
            },
            condition: {
              requestDomains: [targetHostname],
              resourceTypes: ["sub_frame"]
            }
          }
        ];
      })
    );
}
