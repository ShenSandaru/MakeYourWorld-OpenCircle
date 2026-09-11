import { readFileSync, writeFileSync } from "fs";
import {
  selectFreshConcept,
  generateContributionSlotIssue,
  calculateMissingSlotIds,
  TOTAL_POOL_SIZE,
  GeneratedSlotIssue,
} from "./contribution-slot-generator";

export interface ReplenishInput {
  activeSlots: string[];
  activeAssignments: { worldId: string; objectName: string }[];
  maxPerRun?: number;
}

export interface ReplenishOutput {
  targetPoolSize: number;
  openContributionCount: number;
  missingSlotCount: number;
  slotsToCreate: string[];
  generatedIssues: GeneratedSlotIssue[];
}

export function computeReplenishment(input: ReplenishInput): ReplenishOutput {
  const maxPerRun = input.maxPerRun ?? TOTAL_POOL_SIZE;
  const missingSlots = calculateMissingSlotIds(input.activeSlots);
  const slotsToCreate = missingSlots.slice(0, maxPerRun);

  const generatedIssues: GeneratedSlotIssue[] = [];
  const currentActiveAssignments = [...input.activeAssignments];

  for (const slotFormatted of slotsToCreate) {
    const concept = selectFreshConcept(currentActiveAssignments);
    const generated = generateContributionSlotIssue(slotFormatted, concept);
    generatedIssues.push(generated);
    currentActiveAssignments.push({
      worldId: generated.worldId,
      objectName: generated.objectName,
    });
  }

  return {
    targetPoolSize: TOTAL_POOL_SIZE,
    openContributionCount: input.activeSlots.length,
    missingSlotCount: missingSlots.length,
    slotsToCreate,
    generatedIssues,
  };
}

// CLI runner when executed via node/tsx
if (require.main === module || process.argv[1]?.includes("run-replenishment")) {
  const args = process.argv.slice(2);
  const inputFile = args[0];
  const outputFile = args[1];

  if (!inputFile || !outputFile) {
    console.error("Usage: run-replenishment <input-json-path> <output-json-path>");
    process.exit(1);
  }

  try {
    const raw = readFileSync(inputFile, "utf-8");
    const input: ReplenishInput = JSON.parse(raw);
    const result = computeReplenishment(input);
    writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf-8");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Replenishment execution error:", message);
    process.exit(1);
  }
}
