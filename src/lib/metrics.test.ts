import { describe, expect, it } from "vitest";
import {
  clamp,
  filterRrArtifacts,
  fosterSrpe,
  modifiedBanisterTrimp,
  trimpToStrain,
} from "./metrics";

describe("biometric calculations", () => {
  it("clamps values", () => {
    expect(clamp(-1, 0, 100)).toBe(0);
    expect(clamp(101, 0, 100)).toBe(100);
  });

  it("calculates male Banister TRIMP and strain", () => {
    const trimp = modifiedBanisterTrimp(
      [{ durationMinutes: 10, heartRate: 150 }],
      50,
      190,
      "male",
    );
    expect(trimp).toBeGreaterThan(13);
    expect(trimpToStrain(trimp)).toBeGreaterThan(0);
  });

  it("flags RR artifacts over 20 percent from rolling median", () => {
    const result = filterRrArtifacts([800, 810, 805, 800, 1200, 805, 810]);
    expect(result[4].artifact).toBe(true);
  });

  it("calculates Foster sRPE", () => {
    expect(fosterSrpe(7, 65)).toBe(455);
  });
});
