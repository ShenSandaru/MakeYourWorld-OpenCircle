import { describe, it, expect } from "vitest";
import {
  extractIssueFormField,
  parseIssueSlotBody,
  validateParsedSlot,
  isGrowingWorldsContributionIssue,
  buildOnboardingComment,
  buildCompletionComment,
  isClaimComment,
  buildAlreadyClaimedComment,
} from "../../../scripts/issue-lifecycle-parser";

describe("GitHub Issue Lifecycle Parser & Normalizer Unit Tests", () => {
  // Test sample representative of real YAML Issue Form output
  const sampleIssueFormBody = `
### 🌍 Target World

Growing Forest (growing-forest)

### 🏷️ Contribution Slot Identifier

CONTRIB-SLOT #01

### 📍 Assigned World Segment ID

forest-01 (Ancient Canopy)

### 🎨 Suggested Object Category & Concept

🌲 Forest: Butterfly (Woodland Wildlife / Fauna)

### ✏️ Custom Object Name (Optional)

_No response_

### 📊 Difficulty Level

Beginner (No prior open-source experience needed)

### ⏱️ Estimated Time

15–30 minutes

---

## 🎯 Your Task
Add ONE paper-cutout object to Growing Forest inside forest-01.
`;

  it("TEST 1: correctly parses Target World name and ID", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.worldName).toBe("Growing Forest");
    expect(parsed.worldId).toBe("growing-forest");
  });

  it("TEST 2: correctly parses Contribution Slot Identifier", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.slotFormatted).toBe("CONTRIB-SLOT #01");
  });

  it("TEST 3: correctly parses Assigned World Segment ID", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.segmentId).toBe("forest-01");
  });

  it("TEST 4: correctly parses suggested category when no custom object is given", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.objectName).toBe("Butterfly");
  });

  it("TEST 5: correctly allows Custom Object Name to override suggested category", () => {
    const bodyWithCustomObject = sampleIssueFormBody.replace(
      "_No response_",
      "Golden Dragonfly (woodland fauna)"
    );
    const parsed = parseIssueSlotBody(bodyWithCustomObject);
    expect(parsed.objectName).toBe("Golden Dragonfly");
  });

  it("TEST 6: correctly handles fallback when custom object is empty or No response", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.objectName).toBe("Butterfly");
  });

  it("TEST 7: produces the standardized, normalized title", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.normalizedTitle).toBe(
      "[Good First Issue] 🌱 Add Butterfly to Growing Forest — forest-01 (CONTRIB-SLOT #01)"
    );
  });

  it("TEST 8: calculates the exact student branch name", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    expect(parsed.branchName).toBe("contrib/growing-forest-butterfly");
  });

  it("TEST 9: handles '_No response_' cleanly without treating it as an object name", () => {
    const extracted = extractIssueFormField(sampleIssueFormBody, ["Custom Object Name"]);
    expect(extracted).toBeNull();
  });

  it("TEST 10: correctly parses Markdown issue template format (world-contribution.md)", () => {
    const manualMarkdownBody = `
# 🟢 Good First Issue: Add Butterfly to Growing Forest

- **Target World**: Growing Forest
- **Contribution Slot**: CONTRIB-SLOT #05
- **Assigned World Segment**: forest-03 (Deep Grove)
- **Suggested Object Category**: 🌲 Forest: Song Bird (Canopy Bird / Fauna)
`;
    const parsed = parseIssueSlotBody(manualMarkdownBody);
    expect(parsed.worldName).toBe("Growing Forest");
    expect(parsed.slotFormatted).toBe("CONTRIB-SLOT #05");
    expect(parsed.segmentId).toBe("forest-03");
    expect(parsed.objectName).toBe("Song Bird");
    expect(parsed.normalizedTitle).toBe(
      "[Good First Issue] 🌱 Add Song Bird to Growing Forest — forest-03 (CONTRIB-SLOT #05)"
    );
    expect(parsed.branchName).toBe("contrib/growing-forest-song-bird");
  });

  it("TEST 11: onboarding comment contains unique idempotency marker", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    const comment = buildOnboardingComment(21, "student-dev", parsed);
    expect(comment).toContain("<!-- growing-worlds:onboarding:21:student-dev -->");
    expect(comment).toContain("@student-dev");
    expect(comment).toContain("contrib/growing-forest-butterfly");
    expect(comment).toContain("Closes #21");
  });

  it("TEST 12: completion comment contains unique idempotency marker", () => {
    const parsed = parseIssueSlotBody(sampleIssueFormBody);
    const comment = buildCompletionComment(21, parsed);
    expect(comment).toContain("<!-- growing-worlds:completion:21 -->");
    expect(comment).toContain("Growing Forest");
  });

  it("TEST 13: accurately parses all 10 world suggested categories", () => {
    const testWorlds = [
      { world: "Growing Universe (growing-universe)", cat: "🌌 Universe: Spiral Galaxy (Deep Space Nebula)", expectedObj: "Spiral Galaxy" },
      { world: "Growing Ocean (growing-ocean)", cat: "🌊 Ocean: Research Submarine (Marine Exploration)", expectedObj: "Research Submarine" },
      { world: "Growing City (growing-city)", cat: "🏙️ City: Paper Tram (Transit Rail)", expectedObj: "Paper Tram" },
      { world: "Growing Village (growing-village)", cat: "🏡 Village: Stone Well (Village Landmark)", expectedObj: "Stone Well" },
      { world: "Growing Island (growing-island)", cat: "🏝️ Island: Island Lighthouse (Coastal Landmark)", expectedObj: "Island Lighthouse" },
      { world: "Growing Farm (growing-farm)", cat: "🚜 Farm: Pasture Windmill (Farm Landmark)", expectedObj: "Pasture Windmill" },
      { world: "Growing Campus (growing-campus)", cat: "🏛️ Campus: Campus Telescope (Observatory Instrument)", expectedObj: "Campus Telescope" },
      { world: "Fantasy World (fantasy-world)", cat: "🔮 Fantasy: Dragon Egg (Mythical Artifact)", expectedObj: "Dragon Egg" },
      { world: "Alien Planet (alien-planet)", cat: "🪐 Alien: Surface Rover (Exploration Vehicle)", expectedObj: "Surface Rover" },
    ];

    for (const tw of testWorlds) {
      const body = `
### 🌍 Target World\n${tw.world}\n\n### 🏷️ Contribution Slot Identifier\nCONTRIB-SLOT #03\n\n### 📍 Assigned World Segment ID\nseg-01\n\n### 🎨 Suggested Object Category & Concept\n${tw.cat}\n`;
      const parsed = parseIssueSlotBody(body);
      expect(parsed.objectName).toBe(tw.expectedObj);
      expect(validateParsedSlot(parsed).valid).toBe(true);
    }
  });

  it("TEST 14: detects Growing Worlds issues correctly", () => {
    expect(
      isGrowingWorldsContributionIssue("Random bug", [], "Some description")
    ).toBe(false);

    expect(
      isGrowingWorldsContributionIssue("Any title", ["good first issue"], "Some description")
    ).toBe(true);

    expect(
      isGrowingWorldsContributionIssue(
        "[Good First Issue] 🌱 Add a <Object Name> to <World Name>",
        [],
        sampleIssueFormBody
      )
    ).toBe(true);
  });

  describe("Automatic Issue Claiming Helper Tests", () => {
    it("TEST 15: Exact canonical claim with emoji triggers claim", () => {
      expect(isClaimComment("Hi! I'd like to work on this issue. Thank you! 🙌")).toBe(true);
    });

    it("TEST 16: Claim without emoji triggers claim", () => {
      expect(isClaimComment("Hi! I'd like to work on this issue. Thank you!")).toBe(true);
    });

    it("TEST 17: Claim with different capitalization triggers claim", () => {
      expect(isClaimComment("hi! i'd like to work on this issue. thank you! 🙌")).toBe(true);
      expect(isClaimComment("HI! I'D LIKE TO WORK ON THIS ISSUE. THANK YOU! 🙌")).toBe(true);
      expect(isClaimComment("Hi! I'D like to work on this issue. THANK YOU!")).toBe(true);
    });

    it("TEST 18: Claim with extra leading, trailing, and internal whitespace triggers claim", () => {
      expect(isClaimComment("   Hi!  I'd   like to work on this issue.   Thank you! 🙌  \n")).toBe(true);
      expect(isClaimComment("\n\tHi! I'd like to work on this issue. Thank you!\n")).toBe(true);
    });

    it("TEST 19: Claim with curly/smart apostrophe (’ or ‘) triggers claim", () => {
      expect(isClaimComment("Hi! I’d like to work on this issue. Thank you! 🙌")).toBe(true);
      expect(isClaimComment("Hi! I‘d like to work on this issue. Thank you!")).toBe(true);
    });

    it("TEST 20: Random or arbitrary comments do NOT trigger claim", () => {
      expect(isClaimComment("Can I please work on this?")).toBe(false);
      expect(isClaimComment("Hello world")).toBe(false);
      expect(isClaimComment("I would like to work on this issue")).toBe(false);
      expect(isClaimComment("Hi! I'd like to work on this issue.")).toBe(false);
      expect(isClaimComment("")).toBe(false);
      expect(isClaimComment(null)).toBe(false);
      expect(isClaimComment(undefined)).toBe(false);
    });

    it("TEST 21: Non-contribution issues are correctly identified as non-claimable", () => {
      const isContrib = isGrowingWorldsContributionIssue(
        "Bug: App crash on startup",
        ["bug"],
        "Error in main.tsx"
      );
      expect(isContrib).toBe(false);
    });

    it("TEST 22: Unassigned contribution issues qualify for claim processing", () => {
      const isContrib = isGrowingWorldsContributionIssue(
        "[Good First Issue] 🌱 Add Butterfly to Growing Forest — forest-01 (CONTRIB-SLOT #01)",
        ["good first issue"],
        sampleIssueFormBody
      );
      expect(isContrib).toBe(true);
    });

    it("TEST 23: Already-assigned issue generates polite rejection comment referencing current assignee", () => {
      const comment = buildAlreadyClaimedComment(51, "student-dev-2", "OBagnell");
      expect(comment).toContain("<!-- growing-worlds:claim-rejected:51:student-dev-2 -->");
      expect(comment).toContain("@student-dev-2");
      expect(comment).toContain("**@OBagnell**");
      expect(comment).toContain("Please choose another unassigned contribution slot.");
    });

    it("TEST 24: Rejection comment marker is unique per issue and commenter to prevent duplicate rejections", () => {
      const comment1 = buildAlreadyClaimedComment(51, "student-dev-2", "OBagnell");
      const comment2 = buildAlreadyClaimedComment(51, "student-dev-3", "OBagnell");
      expect(comment1).toContain("<!-- growing-worlds:claim-rejected:51:student-dev-2 -->");
      expect(comment2).toContain("<!-- growing-worlds:claim-rejected:51:student-dev-3 -->");
      expect(comment1).not.toBe(comment2);
    });
  });
});

