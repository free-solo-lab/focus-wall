import { describe, expect, it } from "vitest";
import { getHostnameDedupKey, getHostnameRuleTargets, isHostnameBlocked } from "./hostname";

describe("getHostnameRuleTargets", () => {
  it("adds a www alias for bare domains", () => {
    expect(getHostnameRuleTargets("championat.com")).toEqual([
      "championat.com",
      "www.championat.com"
    ]);
  });

  it("adds a bare alias for www domains", () => {
    expect(getHostnameRuleTargets("www.championat.com")).toEqual([
      "www.championat.com",
      "championat.com"
    ]);
  });

  it("does not add aliases for localhost or ipv4", () => {
    expect(getHostnameRuleTargets("localhost")).toEqual(["localhost"]);
    expect(getHostnameRuleTargets("127.0.0.1")).toEqual(["127.0.0.1"]);
  });
});

describe("getHostnameDedupKey", () => {
  it("treats www and bare hostnames as the same site for deduplication", () => {
    expect(getHostnameDedupKey("championat.com")).toBe("championat.com");
    expect(getHostnameDedupKey("www.championat.com")).toBe("championat.com");
  });

  it("keeps custom subdomains distinct", () => {
    expect(getHostnameDedupKey("news.ycombinator.com")).toBe("news.ycombinator.com");
  });
});

describe("isHostnameBlocked", () => {
  it("matches bare and www aliases", () => {
    expect(isHostnameBlocked("championat.com", "www.championat.com")).toBe(true);
    expect(isHostnameBlocked("www.championat.com", "championat.com")).toBe(true);
  });

  it("matches deeper subdomains of a blocked site", () => {
    expect(isHostnameBlocked("static.news.youtube.com", "youtube.com")).toBe(true);
  });

  it("does not match unrelated domains", () => {
    expect(isHostnameBlocked("example.com", "youtube.com")).toBe(false);
  });
});
