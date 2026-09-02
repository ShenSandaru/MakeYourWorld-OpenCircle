import { describe, it, expect } from "vitest";
import {
  calculateMissingSlotIds,
  selectFreshConcept,
  generateContributionSlotIssue,
  CURATED_CONCEPTS,
  TOTAL_POOL_SIZE,
} from "../../../scripts/contribution-slot-generator";
import { parseIssueSlotBody, isGrowingWorldsContributionIssue } from "../../../scripts/issue-lifecycle-parser";
import { computeReplenishment, ReplenishInput } from "../../../scripts/run-replenishment";

describe("Contribution Slot Pool Replenishment Generator Tests", () => {
  it("TEST 1: 20 open issues -> 0 missing slots", () => {
    const fullPool = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`);
    const missing = calculateMissingSlotIds(fullPool);
    expect(missing).toHaveLength(0);
  });

  it("TEST 2: 19 open issues -> exactly 1 missing slot detected", () => {
    // Missing slot 03
    const pool = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).filter(
      (s) => s !== "CONTRIB-SLOT #03"
    );
    const missing = calculateMissingSlotIds(pool);
    expect(missing).toHaveLength(1);
    expect(missing[0]).toBe("CONTRIB-SLOT #03");
  });

  it("TEST 3: 18 open issues -> exactly 2 missing slots detected", () => {
    const pool = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).filter(
      (s) => s !== "CONTRIB-SLOT #03" && s !== "CONTRIB-SLOT #07"
    );
    const missing = calculateMissingSlotIds(pool);
    expect(missing).toEqual(["CONTRIB-SLOT #03", "CONTRIB-SLOT #07"]);
  });

  it("TEST 4: 17 open issues -> exactly 3 missing slots detected", () => {
    const pool = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).filter(
      (s) => s !== "CONTRIB-SLOT #01" && s !== "CONTRIB-SLOT #10" && s !== "CONTRIB-SLOT #20"
    );
    const missing = calculateMissingSlotIds(pool);
    expect(missing).toEqual(["CONTRIB-SLOT #01", "CONTRIB-SLOT #10", "CONTRIB-SLOT #20"]);
  });

  it("TEST 5: selectFreshConcept avoids already active assignments", () => {
    const active = [
      { worldId: "growing-forest", objectName: "Butterfly" },
      { worldId: "growing-forest", objectName: "Song Bird" },
    ];
    const fresh = selectFreshConcept(active, "growing-forest");
    expect(fresh.worldId).toBe("growing-forest");
    expect(fresh.objectName).not.toBe("Butterfly");
    expect(fresh.objectName).not.toBe("Song Bird");
  });

  it("TEST 6: generates valid issue title adhering to standardized pattern", () => {
    const concept = CURATED_CONCEPTS[0]; // Butterfly
    const generated = generateContributionSlotIssue("CONTRIB-SLOT #03", concept);
    expect(generated.title).toBe("🌱 Add a Butterfly to Growing Forest — Ancient Canopy (SLOT #03)");
    expect(generated.labels).toEqual(["good first issue"]);
  });

  it("TEST 7: generated issue body is fully parseable by existing issue-lifecycle-parser", () => {
    const concept = CURATED_CONCEPTS.find((c) => c.objectName === "Wooden Cart")!;
    const generated = generateContributionSlotIssue("CONTRIB-SLOT #05", concept);

    // Validate with issue parser
    const parsed = parseIssueSlotBody(generated.body);
    expect(parsed.worldName).toBe("Growing Village");
    expect(parsed.worldId).toBe("growing-village");
    expect(parsed.slotFormatted).toBe("CONTRIB-SLOT #05");
    expect(parsed.segmentId).toBe("village-01");
    expect(parsed.objectName).toBe("Wooden Cart");
    expect(isGrowingWorldsContributionIssue(generated.title, generated.labels, generated.body)).toBe(true);
  });

  it("TEST 8: generated issue explicitly emphasizes reusing existing assets without creating SVGs", () => {
    const concept = CURATED_CONCEPTS[0];
    const generated = generateContributionSlotIssue("CONTRIB-SLOT #01", concept);
    expect(generated.body).toContain("No design skills needed");
    expect(generated.body).toContain("You don't need to create or upload an SVG");
    expect(generated.body).toContain("reuse an existing paper-cutout asset");
  });

  it("TEST 9: every curated concept references a verified existing asset", () => {
    expect(CURATED_CONCEPTS.length).toBeGreaterThanOrEqual(TOTAL_POOL_SIZE);
    for (const c of CURATED_CONCEPTS) {
      expect(c.worldId).toBeTruthy();
      expect(c.worldName).toBeTruthy();
      expect(c.assetFile.endsWith(".svg")).toBe(true);
    }
  });

  it("TEST 10: computeReplenishment handles empty input, multiline strings, and special characters cleanly", () => {
    const emptyInput: ReplenishInput = {
      activeSlots: [],
      activeAssignments: [],
      maxPerRun: 5,
    };
    const result = computeReplenishment(emptyInput);
    expect(result.openContributionCount).toBe(0);
    expect(result.missingSlotCount).toBe(20);
    expect(result.slotsToCreate).toHaveLength(5);
    expect(result.generatedIssues).toHaveLength(5);

    // Complex input with Unicode / special quotes
    const complexInput: ReplenishInput = {
      activeSlots: ["CONTRIB-SLOT #01", "CONTRIB-SLOT #02"],
      activeAssignments: [
        { worldId: "growing-forest", objectName: 'Butterfly "Canopy" & 🌲' },
      ],
      maxPerRun: 2,
    };
    const complexResult = computeReplenishment(complexInput);
    expect(complexResult.openContributionCount).toBe(2);
    expect(complexResult.missingSlotCount).toBe(18);
    expect(complexResult.slotsToCreate).toEqual(["CONTRIB-SLOT #03", "CONTRIB-SLOT #04"]);
    expect(complexResult.generatedIssues).toHaveLength(2);
    expect(complexResult.generatedIssues[0].slotFormatted).toBe("CONTRIB-SLOT #03");
  });
});
