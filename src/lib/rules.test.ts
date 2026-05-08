import { describe, expect, it } from "vitest";
import { buildDynamicRules } from "./rules";
import type { BlockedSite } from "./types";

const baseSite: BlockedSite = {
  id: "1",
  hostname: "youtube.com",
  enabled: true,
  createdAt: 1
};

describe("buildDynamicRules", () => {
  it("creates redirect and sub-frame block rules for bare and www variants", () => {
    const rules = buildDynamicRules([baseSite], "chrome-extension://test-id/blocked.html");

    expect(rules).toHaveLength(4);
    expect(rules[0]).toMatchObject({
      id: 1,
      action: {
        type: "redirect",
        redirect: {
          url: "chrome-extension://test-id/blocked.html?domain=youtube.com"
        }
      },
      condition: {
        requestDomains: ["youtube.com"],
        resourceTypes: ["main_frame"]
      }
    });
    expect(rules[1]).toMatchObject({
      id: 2,
      action: {
        type: "block"
      },
      condition: {
        requestDomains: ["youtube.com"],
        resourceTypes: ["sub_frame"]
      }
    });
    expect(rules[2]).toMatchObject({
      id: 3,
      action: {
        type: "redirect",
        redirect: {
          url: "chrome-extension://test-id/blocked.html?domain=youtube.com"
        }
      },
      condition: {
        requestDomains: ["www.youtube.com"],
        resourceTypes: ["main_frame"]
      }
    });
    expect(rules[3]).toMatchObject({
      id: 4,
      action: {
        type: "block"
      },
      condition: {
        requestDomains: ["www.youtube.com"],
        resourceTypes: ["sub_frame"]
      }
    });
  });

  it("adds a bare-domain alias when the saved hostname starts with www", () => {
    const rules = buildDynamicRules(
      [{ ...baseSite, hostname: "www.championat.com" }],
      "chrome-extension://test-id/blocked.html"
    );

    expect(rules).toHaveLength(4);
    expect(rules.map((rule) => rule.condition?.requestDomains?.[0])).toEqual([
      "www.championat.com",
      "www.championat.com",
      "championat.com",
      "championat.com"
    ]);
  });

  it("skips disabled sites", () => {
    const rules = buildDynamicRules([{ ...baseSite, enabled: false }], "chrome-extension://test-id/blocked.html");
    expect(rules).toEqual([]);
  });

  it("keeps generated rule identifiers deterministic and unique", () => {
    const sites = [
      baseSite,
      { ...baseSite, id: "2", hostname: "news.ycombinator.com", createdAt: 2 }
    ];

    const firstPass = buildDynamicRules(sites, "chrome-extension://test-id/blocked.html");
    const secondPass = buildDynamicRules(sites, "chrome-extension://test-id/blocked.html");

    expect(firstPass.map((rule) => rule.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(secondPass.map((rule) => rule.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
