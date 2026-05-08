function isIpv4(hostname: string): boolean {
  const segments = hostname.split(".");

  return (
    segments.length === 4 &&
    segments.every((segment) => /^(25[0-5]|2[0-4]\d|1?\d?\d)$/.test(segment))
  );
}

function isAliasEligible(hostname: string): boolean {
  return hostname !== "localhost" && !isIpv4(hostname) && hostname.includes(".");
}

export function getHostnameRuleTargets(hostname: string): string[] {
  const targets = new Set<string>([hostname]);

  if (!isAliasEligible(hostname)) {
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

export function getHostnameDedupKey(hostname: string): string {
  if (!isAliasEligible(hostname)) {
    return hostname;
  }

  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}

export function isHostnameBlocked(currentHostname: string, blockedHostname: string): boolean {
  return getHostnameRuleTargets(blockedHostname).some(
    (targetHostname) =>
      currentHostname === targetHostname || currentHostname.endsWith(`.${targetHostname}`)
  );
}
