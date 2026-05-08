const IPV4_SEGMENT = /^(25[0-5]|2[0-4]\d|1?\d?\d)$/;
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function isValidIpv4(hostname: string): boolean {
  const segments = hostname.split(".");

  return segments.length === 4 && segments.every((segment) => IPV4_SEGMENT.test(segment));
}

function isValidDomain(hostname: string): boolean {
  if (hostname === "localhost") {
    return true;
  }

  if (isValidIpv4(hostname)) {
    return true;
  }

  const labels = hostname.split(".");

  return labels.length > 0 && labels.every((label) => DOMAIN_LABEL.test(label));
}

export function normalizeHostname(input: string): string | null {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return null;
  }

  const candidate = /^[a-z]+:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    const hostname = parsed.hostname.replace(/\.$/, "");

    if (!hostname || !isValidDomain(hostname)) {
      return null;
    }

    return hostname;
  } catch {
    return null;
  }
}
