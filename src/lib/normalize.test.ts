import { describe, expect, it } from "vitest";
import { normalizeHostname } from "./normalize";

describe("normalizeHostname", () => {
  it("extracts hostname from a full URL", () => {
    expect(normalizeHostname("https://www.youtube.com/feed")).toBe("www.youtube.com");
  });

  it("keeps a plain hostname", () => {
    expect(normalizeHostname("youtube.com")).toBe("youtube.com");
  });

  it("rejects empty input", () => {
    expect(normalizeHostname("   ")).toBeNull();
  });

  it("rejects invalid hostnames", () => {
    expect(normalizeHostname("not a valid host")).toBeNull();
  });
});
