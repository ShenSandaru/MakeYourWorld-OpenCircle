/**
 * Pure parsing and normalization helper module for the Growing Worlds issue lifecycle.
 * Provides deterministic extraction of Issue Form fields, object normalization,
 * branch calculation, and comment generation.
 */

export interface ParsedIssueSlot {
  rawWorld: string | null;
  worldName: string;
  worldId: string;
  rawSlot: string | null;
  slotFormatted: string;
  rawSegment: string | null;
  segmentId: string;
  rawCategory: string | null;
  rawCustomObject: string | null;
  objectName: string;
  normalizedTitle: string;
  branchName: string;
}

export interface ParseResult {
  isContributionIssue: boolean;
  success: boolean;
  error?: string;
  data?: ParsedIssueSlot;
}

/**
 * Extracts a section value from an Issue Form body given one or more keyword identifiers.
 * Matches exact headers such as "### 🌍 Target World", "### Target World", "## Target World", etc.
 */
export function extractIssueFormField(body: string, keywords: string[]): string | null {
  if (!body) return null;

  // 1. Table row style markdown (e.g. "| **World** | `Growing Forest` |")
  for (const keyword of keywords) {
    const tableRegex = new RegExp(
      "(?:^|\\n)\\|\\s*\\*\\*[^\\r\\n]*?" +
        escapeRegex(keyword) +
        "[^\\r\\n]*?\\*\\*\\s*\\|\\s*(?:`?)([^`\\r\\n|]+?)(?:`?)\\s*\\|",
      "i"
    );
    const match = body.match(tableRegex);
    if (match && match[1]) {
      const val = match[1].trim();
      if (val && val !== "_No response_" && val !== "No response") {
        return val;
      }
    }
  }

  // 2. Fallback for list style / key-value style markdown (e.g. "- **Target World**: Growing Forest")
  for (const keyword of keywords) {
    const listRegex = new RegExp(
      `(?:^|\\n)[-*]\\s*\\*\\*[^\\r\\n]*?${escapeRegex(keyword)}[^\\r\\n]*?\\*\\*:\\s*` +
        `(?:\\[e\\.g\\.,?\\s*)?([^\\]\\r\\n]+?)(?:\\])?(?=[\\r\\n]|$)`,
      "i"
    );
    const match = body.match(listRegex);
    if (match && match[1]) {
      const val = match[1].trim();
      if (val && val !== "_No response_" && val !== "No response") {
        return val;
      }
    }
  }

  // 3. Heading lines (e.g. "### 🌍 Target World\n\nGrowing Forest (growing-forest)")
  for (const keyword of keywords) {
    const regex = new RegExp(
      `(?:^|\\n)#{1,4}\\s*(?:[^\\r\\n]*?\\s)?${escapeRegex(keyword)}(?:\\s[^\\r\\n]*?)?[\\r\\n]+([\\s\\S]*?)(?=(?:\\n#{1,4}\\s+|\\n---|\\n\\*\\*|$))`,
      "i"
    );
    const match = body.match(regex);
    if (match && match[1]) {
      const lines = match[1]
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith(">"));

      if (lines.length > 0) {
        const firstLine = lines[0];
        if (firstLine !== "_No response_" && firstLine !== "No response" && firstLine !== "None") {
          return firstLine;
        }
      }
    }
  }

  return null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Detects whether an issue is a Growing Worlds contribution issue based on labels, title, and body tokens.
 */
export function isGrowingWorldsContributionIssue(
  title: string,
  labels: string[],
  body: string
): boolean {
  const hasGoodFirstIssueLabel = labels.includes("good first issue");
  const hasContributionTitle =
    title.includes("[Good First Issue]") || title.includes("[CONTRIB-SLOT");
  const hasWorldFields =
    body.includes("Target World") &&
    (body.includes("Contribution Slot") || body.includes("Assigned World Segment"));

  return hasGoodFirstIssueLabel || hasContributionTitle || hasWorldFields;
}

/**
 * Parses and normalizes raw issue body text into structured metadata.
 * Does NOT use artificial defaults if required fields are missing.
 */
export function parseIssueSlotBody(body: string): ParsedIssueSlot {
  const rawWorld = extractIssueFormField(body, ["Target World", "World", "world"]);
  let rawSlot = extractIssueFormField(body, [
    "Contribution Slot Identifier",
    "Contribution Slot",
    "slot_id",
    "slot",
  ]);
  const rawSegment = extractIssueFormField(body, [
    "Assigned World Segment ID",
    "Assigned World Segment",
    "Segment ID",
    "target_segment",
    "segment",
  ]);
  const rawCategory = extractIssueFormField(body, [
    "Suggested Object Category & Concept",
    "Suggested Object Category",
    "suggested_category",
    "category",
  ]);
  const rawCustomObject = extractIssueFormField(body, [
    "Custom Object Name",
    "custom_object_name",
    "Object Name",
  ]);

  // 1. World Parsing
  let worldName = "";
  let worldId = "";
  if (rawWorld) {
    // Example: "Growing Forest (growing-forest)" -> name: "Growing Forest", id: "growing-forest"
    const idMatch = rawWorld.match(/\(([a-z0-9-]+)\)/i);
    if (idMatch) {
      worldId = idMatch[1].toLowerCase();
    }
    worldName = rawWorld.replace(/\s*\([^)]*\)/, "").trim();
    if (!worldId && worldName) {
      worldId = worldName.toLowerCase().replace(/\s+/g, "-");
    }
  }

  // 2. Slot Parsing
  let slotFormatted = "";
  if (rawSlot) {
    const numMatch = rawSlot.match(/(\d+)/);
    if (numMatch) {
      slotFormatted = `CONTRIB-SLOT #${numMatch[1].padStart(2, "0")}`;
    }
  } else {
    // Fallback search for (SLOT #XX) or CONTRIB-SLOT #XX in body
    const slotTextMatch = body.match(/(?:CONTRIB-SLOT|SLOT)\s*#?(\d+)/i);
    if (slotTextMatch) {
      slotFormatted = `CONTRIB-SLOT #${slotTextMatch[1].padStart(2, "0")}`;
      rawSlot = slotFormatted;
    }
  }

  // 3. Segment Parsing
  let segmentId = "";
  if (rawSegment) {
    // Example: "forest-01 (Ancient Canopy)" -> "forest-01"
    const segmentMatch =
      rawSegment.match(/([a-z0-9]+-[0-9]+)/i) || rawSegment.match(/([a-z0-9-]+)/i);
    if (segmentMatch) {
      segmentId = segmentMatch[1].toLowerCase();
    }
  }

  // 4. Object Name Parsing
  // Priority: Custom Object Name -> Suggested Category / Concept
  let objectName = "";
  if (rawCustomObject && rawCustomObject.trim() !== "") {
    // Example: "Golden Dragonfly (woodland fauna)" -> "Golden Dragonfly"
    objectName = rawCustomObject.replace(/\s*\([^)]*\)/, "").trim();
  } else if (rawCategory && rawCategory.trim() !== "") {
    // Example: "🌲 Forest: Butterfly (Woodland Wildlife / Fauna)" -> "Butterfly"
    // Remove emoji and theme prefixes
    let cleaned = rawCategory.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, "").trim();
    if (cleaned.includes(":")) {
      cleaned = cleaned.split(":")[1].trim();
    }
    cleaned = cleaned.replace(/\s*\([^)]*\)/, "").trim();
    if (cleaned) {
      objectName = cleaned;
    }
  }

  // Fallbacks only if completely missing (to prevent undefined strings)
  if (!worldName) worldName = "Growing Forest";
  if (!worldId) worldId = "growing-forest";
  if (!slotFormatted) slotFormatted = "CONTRIB-SLOT #01";
  if (!segmentId) segmentId = "forest-01";
  if (!objectName) objectName = "Object";

  // 5. Final Normalized Title
  const normalizedTitle = `[Good First Issue] 🌱 Add ${objectName} to ${worldName} — ${segmentId} (${slotFormatted})`;

  // 6. Branch Name
  // contrib/<world-id>-<kebab-object-name>
  const objectSlug = objectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const branchName = `contrib/${worldId}-${objectSlug || "object"}`;

  return {
    rawWorld,
    worldName,
    worldId,
    rawSlot,
    slotFormatted,
    rawSegment,
    segmentId,
    rawCategory,
    rawCustomObject,
    objectName,
    normalizedTitle,
    branchName,
  };
}

/**
 * Validates whether all critical fields were parsed from the issue body.
 */
export function validateParsedSlot(slot: ParsedIssueSlot): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!slot.rawWorld) missing.push("Target World");
  if (!slot.rawSlot) missing.push("Contribution Slot Identifier");
  if (!slot.rawSegment) missing.push("Assigned World Segment ID");
  if (!slot.rawCategory && !slot.rawCustomObject) missing.push("Object / Category");

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Builds the unique onboarding comment with an idempotency marker to prevent duplicate comments.
 */
export function buildOnboardingComment(
  issueNumber: number,
  assignee: string,
  slot: ParsedIssueSlot
): string {
  const marker = `<!-- growing-worlds:onboarding:${issueNumber}:${assignee} -->`;

  return `${marker}
## 👋 Welcome @${assignee}! You have been assigned to this slot! 🎉

We are excited for your contribution to **${slot.worldName}**! Here is a quick reference for your next steps:

### 📋 Your Contribution Details
- **Assigned World**: \`${slot.worldName}\` (\`${slot.worldId}\`)
- **Assigned Segment**: \`${slot.segmentId}\`
- **Object**: \`${slot.objectName}\`
- **Feature Branch**: \`${slot.branchName}\` (must start with \`contrib/\` from \`dev\`)

### 📝 Quick Instructions
1. ⭐ **Star our repo** on GitHub!
2. 🍴 **Fork our repo** and clone it locally.
3. 🌿 **Create your branch**: \`git checkout -b ${slot.branchName}\` (from latest \`dev\`).
4. 🎨 **Commit 1**: Open \`src/data/worlds/${slot.worldId}/objects.ts\`, reference an existing reusable asset from \`public/assets/worlds/${slot.worldId}/\`, and register your object.
5. 📍 **Commit 2**: Open \`src/data/worlds/${slot.worldId}/placements.ts\` and add placement with \`segmentId: "${slot.segmentId}"\`.
6. 🧪 **Run checks**: \`npm test && npm run lint && npm run typecheck && npm run build && npx tsx scripts/audit-integrity.ts\`.
7. 🚀 **Submit PR**: Open PR targeting \`dev\` and include \`Closes #${issueNumber}\` in the description.

> 💡 *Note: You do NOT need to create or upload a new SVG file. You reuse an existing asset from the repository! Assigned slots are reserved for **48 hours**.* Happy coding! 🌱`;
}

/**
 * Builds the completion/celebration comment with an idempotency marker.
 */
export function buildCompletionComment(issueNumber: number, slot: ParsedIssueSlot): string {
  const marker = `<!-- growing-worlds:completion:${issueNumber} -->`;

  return `${marker}
## 🎉 Contribution Complete & Merged!

This contribution slot has been successfully completed and merged into **${slot.worldName}**! 🌿

Thank you to the contributor for expanding our growing worlds! Your paper cutout is now a permanent part of the shared diorama.`;
}
