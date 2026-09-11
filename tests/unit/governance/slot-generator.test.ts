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

  it("TEST 11: 20 active slots -> create 0", () => {
    const activeSlots = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`);
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(0);
    expect(result.slotsToCreate).toHaveLength(0);
    expect(result.generatedIssues).toHaveLength(0);
  });

  it("TEST 12: 19 active slots -> create 1", () => {
    const activeSlots = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).slice(0, 19);
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(1);
    expect(result.slotsToCreate).toEqual(["CONTRIB-SLOT #20"]);
    expect(result.generatedIssues).toHaveLength(1);
  });

  it("TEST 13: 15 active slots -> create 5", () => {
    const activeSlots = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).slice(0, 15);
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(5);
    expect(result.slotsToCreate).toHaveLength(5);
    expect(result.generatedIssues).toHaveLength(5);
  });

  it("TEST 14: 11 active slots -> create 9 (overcoming old 5-slot limit)", () => {
    const activeSlots = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).slice(0, 11);
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(9);
    expect(result.slotsToCreate).toHaveLength(9);
    expect(result.generatedIssues).toHaveLength(9);
  });

  it("TEST 15: 7 active slots -> create 13 (real-world deficit test)", () => {
    const activeSlots = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`).slice(0, 7);
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(13);
    expect(result.slotsToCreate).toHaveLength(13);
    expect(result.generatedIssues).toHaveLength(13);
  });

  it("TEST 16: 1 active slot -> create 19", () => {
    const activeSlots = ["CONTRIB-SLOT #05"];
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(19);
    expect(result.slotsToCreate).toHaveLength(19);
    expect(result.slotsToCreate).not.toContain("CONTRIB-SLOT #05");
  });

  it("TEST 17: Deleted slot numbers can be regenerated", () => {
    // Say slots 4, 8, 12 were deleted
    const poolWithoutDeleted = Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`)
      .filter((s) => s !== "CONTRIB-SLOT #04" && s !== "CONTRIB-SLOT #08" && s !== "CONTRIB-SLOT #12");
    
    const result = computeReplenishment({ activeSlots: poolWithoutDeleted, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(3);
    expect(result.slotsToCreate).toEqual(["CONTRIB-SLOT #04", "CONTRIB-SLOT #08", "CONTRIB-SLOT #12"]);
  });

  it("TEST 18: Duplicate active slot numbers are never generated", () => {
    const activeSlots = ["CONTRIB-SLOT #01", "CONTRIB-SLOT #02", "CONTRIB-SLOT #03"];
    const result = computeReplenishment({ activeSlots, activeAssignments: [] });
    const allSlots = [...activeSlots, ...result.slotsToCreate];
    const uniqueSlots = new Set(allSlots);
    expect(uniqueSlots.size).toBe(TOTAL_POOL_SIZE);
  });

  it("TEST 19: Unrelated closed issue vs contribution closed issue detection", () => {
    // Unrelated bug report
    const bugTitle = "Fix broken styling on mobile navigation";
    const bugLabels = ["bug"];
    const bugBody = "The drawer does not expand properly on iPhone.";
    expect(isGrowingWorldsContributionIssue(bugTitle, bugLabels, bugBody)).toBe(false);

    // Authentic contribution issue
    const contribTitle = "[Good First Issue] 🌱 Add Butterfly to Growing Forest — forest-01 (CONTRIB-SLOT #01)";
    const contribLabels = ["good first issue"];
    const contribBody = "| **World** | `Growing Forest` |\n| **Contribution Slot** | `CONTRIB-SLOT #01` |";
    expect(isGrowingWorldsContributionIssue(contribTitle, contribLabels, contribBody)).toBe(true);
  });

  it("TEST 20: 21 active slots (overflow edge-case) -> creates 0", () => {
    const overflowSlots = [
      ...Array.from({ length: 20 }, (_, i) => `CONTRIB-SLOT #${String(i + 1).padStart(2, "0")}`),
      "CONTRIB-SLOT #21",
    ];
    const result = computeReplenishment({ activeSlots: overflowSlots, activeAssignments: [] });
    expect(result.missingSlotCount).toBe(0);
    expect(result.slotsToCreate).toHaveLength(0);
    expect(result.generatedIssues).toHaveLength(0);
  });
});
