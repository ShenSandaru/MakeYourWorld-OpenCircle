/**
 * Deterministic Contribution Slot Generator for Growing Worlds.
 * Manages the replenishment of the 20-slot contribution issue pool.
 */

export interface ExistingSlotAssignment {
  slotFormatted: string; // e.g. "CONTRIB-SLOT #03"
  worldId: string;       // e.g. "growing-forest"
  segmentId: string;     // e.g. "forest-01"
  objectName: string;    // e.g. "Butterfly"
  isOpen: boolean;
}

export interface CuratedConcept {
  worldId: string;
  worldName: string;
  categoryLabel: string;
  objectName: string;
  assetFile: string;
  defaultSegmentId: string;
  segmentName: string;
}

/**
 * Master catalog of valid contribution concepts mapped to existing verified SVG assets.
 */
export const CURATED_CONCEPTS: CuratedConcept[] = [
  // Growing Forest
  {
    worldId: "growing-forest",
    worldName: "Growing Forest",
    categoryLabel: "🌲 Forest: Butterfly (Woodland Wildlife / Fauna)",
    objectName: "Butterfly",
    assetFile: "student-butterfly.svg",
    defaultSegmentId: "forest-01",
    segmentName: "Ancient Canopy",
  },
  {
    worldId: "growing-forest",
    worldName: "Growing Forest",
    categoryLabel: "🌲 Forest: Song Bird (Canopy Bird / Fauna)",
    objectName: "Song Bird",
    assetFile: "song-bird.svg",
    defaultSegmentId: "forest-01",
    segmentName: "Ancient Canopy",
  },
  {
    worldId: "growing-forest",
    worldName: "Growing Forest",
    categoryLabel: "🌲 Forest: Woodland Flower (Forest Floor Flora)",
    objectName: "Woodland Flower",
    assetFile: "woodland-flower.svg",
    defaultSegmentId: "forest-02",
    segmentName: "Sunlit Meadow",
  },
  {
    worldId: "growing-forest",
    worldName: "Growing Forest",
    categoryLabel: "🌲 Forest: Mossy Rock (Terrain Prop)",
    objectName: "Mossy Rock",
    assetFile: "mossy-rock.svg",
    defaultSegmentId: "forest-02",
    segmentName: "Sunlit Meadow",
  },
  {
    worldId: "growing-forest",
    worldName: "Growing Forest",
    categoryLabel: "🌲 Forest: Red Mushroom (Fungi & Undergrowth)",
    objectName: "Red Mushroom",
    assetFile: "red-mushroom.svg",
    defaultSegmentId: "forest-03",
    segmentName: "Deep Grove",
  },
  {
    worldId: "growing-forest",
    worldName: "Growing Forest",
    categoryLabel: "🌲 Forest: Forest Deer (Large Fauna)",
    objectName: "Forest Deer",
    assetFile: "forest-deer.svg",
    defaultSegmentId: "forest-03",
    segmentName: "Deep Grove",
  },

  // Growing Universe
  {
    worldId: "growing-universe",
    worldName: "Growing Universe",
    categoryLabel: "🌌 Universe: Spiral Galaxy (Deep Space Nebula)",
    objectName: "Spiral Galaxy",
    assetFile: "spiral-galaxy.svg",
    defaultSegmentId: "universe-01",
    segmentName: "Starlit Orbit",
  },
  {
    worldId: "growing-universe",
    worldName: "Growing Universe",
    categoryLabel: "🌌 Universe: Crescent Moon (Lunar Body)",
    objectName: "Crescent Moon",
    assetFile: "crescent-moon.svg",
    defaultSegmentId: "universe-02",
    segmentName: "Planetary Horizon",
  },
  {
    worldId: "growing-universe",
    worldName: "Growing Universe",
    categoryLabel: "🌌 Universe: Paper Satellite (Orbital Tech)",
    objectName: "Paper Satellite",
    assetFile: "paper-satellite.svg",
    defaultSegmentId: "universe-01",
    segmentName: "Starlit Orbit",
  },
  {
    worldId: "growing-universe",
    worldName: "Growing Universe",
    categoryLabel: "🌌 Universe: Paper Comet (Cosmic Wanderer)",
    objectName: "Paper Comet",
    assetFile: "paper-comet.svg",
    defaultSegmentId: "universe-03",
    segmentName: "Asteroid Belt",
  },
  {
    worldId: "growing-universe",
    worldName: "Growing Universe",
    categoryLabel: "🌌 Universe: Paper Asteroid (Asteroid Belt)",
    objectName: "Paper Asteroid",
    assetFile: "paper-asteroid.svg",
    defaultSegmentId: "universe-03",
    segmentName: "Asteroid Belt",
  },

  // Growing Ocean
  {
    worldId: "growing-ocean",
    worldName: "Growing Ocean",
    categoryLabel: "🌊 Ocean: Swimming Clownfish (Reef Fish)",
    objectName: "Swimming Clownfish",
    assetFile: "clownfish.svg",
    defaultSegmentId: "ocean-01",
    segmentName: "Shallow Coral Reef",
  },
  {
    worldId: "growing-ocean",
    worldName: "Growing Ocean",
    categoryLabel: "🌊 Ocean: Sea Turtle (Marine Fauna)",
    objectName: "Sea Turtle",
    assetFile: "sea-turtle.svg",
    defaultSegmentId: "ocean-02",
    segmentName: "Sunlit Kelp Forest",
  },
  {
    worldId: "growing-ocean",
    worldName: "Growing Ocean",
    categoryLabel: "🌊 Ocean: Paper Coral (Reef Structure)",
    objectName: "Paper Coral",
    assetFile: "paper-coral.svg",
    defaultSegmentId: "ocean-01",
    segmentName: "Shallow Coral Reef",
  },
  {
    worldId: "growing-ocean",
    worldName: "Growing Ocean",
    categoryLabel: "🌊 Ocean: Kelp Stalk (Marine Flora)",
    objectName: "Kelp Stalk",
    assetFile: "kelp-stalk.svg",
    defaultSegmentId: "ocean-02",
    segmentName: "Sunlit Kelp Forest",
  },
  {
    worldId: "growing-ocean",
    worldName: "Growing Ocean",
    categoryLabel: "🌊 Ocean: Research Submarine (Marine Exploration)",
    objectName: "Research Submarine",
    assetFile: "research-submarine.svg",
    defaultSegmentId: "ocean-03",
    segmentName: "Twilight Reef Shelf",
  },

  // Growing City
  {
    worldId: "growing-city",
    worldName: "Growing City",
    categoryLabel: "🏙️ City: Park Bench (Street Furniture)",
    objectName: "Park Bench",
    assetFile: "park-bench.svg",
    defaultSegmentId: "city-01",
    segmentName: "Brownstone Street",
  },
  {
    worldId: "growing-city",
    worldName: "Growing City",
    categoryLabel: "🏙️ City: Street Lamp (Urban Lighting)",
    objectName: "Street Lamp",
    assetFile: "street-lamp.svg",
    defaultSegmentId: "city-01",
    segmentName: "Brownstone Street",
  },
  {
    worldId: "growing-city",
    worldName: "Growing City",
    categoryLabel: "🏙️ City: Paper Bicycle (Urban Transit)",
    objectName: "Paper Bicycle",
    assetFile: "paper-bicycle.svg",
    defaultSegmentId: "city-02",
    segmentName: "Town Square",
  },
  {
    worldId: "growing-city",
    worldName: "Growing City",
    categoryLabel: "🏙️ City: Paper Tram (Transit Rail)",
    objectName: "Paper Tram",
    assetFile: "paper-tram.svg",
    defaultSegmentId: "city-03",
    segmentName: "Transit District",
  },

  // Growing Village
  {
    worldId: "growing-village",
    worldName: "Growing Village",
    categoryLabel: "🏡 Village: Flower Pot (Rustic Garden)",
    objectName: "Flower Pot",
    assetFile: "flower-pot.svg",
    defaultSegmentId: "village-01",
    segmentName: "River Watermill",
  },
  {
    worldId: "growing-village",
    worldName: "Growing Village",
    categoryLabel: "🏡 Village: Wooden Cart (Market Prop)",
    objectName: "Wooden Cart",
    assetFile: "wooden-cart.svg",
    defaultSegmentId: "village-01",
    segmentName: "River Watermill",
  },
  {
    worldId: "growing-village",
    worldName: "Growing Village",
    categoryLabel: "🏡 Village: Stone Well (Village Landmark)",
    objectName: "Stone Well",
    assetFile: "stone-well.svg",
    defaultSegmentId: "village-02",
    segmentName: "Cobblestone Street",
  },
  {
    worldId: "growing-village",
    worldName: "Growing Village",
    categoryLabel: "🏡 Village: Market Basket (Artisan Goods)",
    objectName: "Market Basket",
    assetFile: "market-basket.svg",
    defaultSegmentId: "village-03",
    segmentName: "Market Square",
  },

  // Growing Island
  {
    worldId: "growing-island",
    worldName: "Growing Island",
    categoryLabel: "🏝️ Island: Coconut Palm (Coastal Flora)",
    objectName: "Coconut Palm",
    assetFile: "coconut-palm.svg",
    defaultSegmentId: "island-01",
    segmentName: "Arrival Beach",
  },
  {
    worldId: "growing-island",
    worldName: "Growing Island",
    categoryLabel: "🏝️ Island: Wooden Canoe (Shoreline Vessel)",
    objectName: "Wooden Canoe",
    assetFile: "wooden-canoe.svg",
    defaultSegmentId: "island-01",
    segmentName: "Arrival Beach",
  },
  {
    worldId: "growing-island",
    worldName: "Growing Island",
    categoryLabel: "🏝️ Island: Island Lighthouse (Coastal Landmark)",
    objectName: "Island Lighthouse",
    assetFile: "island-lighthouse.svg",
    defaultSegmentId: "island-03",
    segmentName: "Volcanic Ridge",
  },

  // Growing Farm
  {
    worldId: "growing-farm",
    worldName: "Growing Farm",
    categoryLabel: "🚜 Farm: Harvest Pumpkin (Crop Harvest)",
    objectName: "Harvest Pumpkin",
    assetFile: "harvest-pumpkin.svg",
    defaultSegmentId: "farm-01",
    segmentName: "Homestead Yard",
  },
  {
    worldId: "growing-farm",
    worldName: "Growing Farm",
    categoryLabel: "🚜 Farm: Wheat Bundle (Field Sheaf)",
    objectName: "Wheat Bundle",
    assetFile: "wheat-bundle.svg",
    defaultSegmentId: "farm-02",
    segmentName: "Wheat Fields",
  },
  {
    worldId: "growing-farm",
    worldName: "Growing Farm",
    categoryLabel: "🚜 Farm: Pasture Windmill (Farm Landmark)",
    objectName: "Pasture Windmill",
    assetFile: "pasture-windmill.svg",
    defaultSegmentId: "farm-03",
    segmentName: "Pasture Windmill",
  },

  // Growing Campus
  {
    worldId: "growing-campus",
    worldName: "Growing Campus",
    categoryLabel: "🏛️ Campus: Student Backpack (Campus Life)",
    objectName: "Student Backpack",
    assetFile: "student-backpack.svg",
    defaultSegmentId: "campus-01",
    segmentName: "University Gate",
  },
  {
    worldId: "growing-campus",
    worldName: "Growing Campus",
    categoryLabel: "🏛️ Campus: Stack of Books (Library Detail)",
    objectName: "Stack of Books",
    assetFile: "stack-of-books.svg",
    defaultSegmentId: "campus-02",
    segmentName: "Academic Quad",
  },
  {
    worldId: "growing-campus",
    worldName: "Growing Campus",
    categoryLabel: "🏛️ Campus: Campus Telescope (Observatory Instrument)",
    objectName: "Campus Telescope",
    assetFile: "campus-telescope.svg",
    defaultSegmentId: "campus-03",
    segmentName: "Library Plaza",
  },

  // Fantasy World
  {
    worldId: "fantasy-world",
    worldName: "Fantasy World",
    categoryLabel: "🔮 Fantasy: Floating Crystal (Arcane Landmark)",
    objectName: "Floating Crystal",
    assetFile: "floating-crystal.svg",
    defaultSegmentId: "fantasy-01",
    segmentName: "Enchanted Glade",
  },
  {
    worldId: "fantasy-world",
    worldName: "Fantasy World",
    categoryLabel: "🔮 Fantasy: Rune Stone (Ancient Magic)",
    objectName: "Rune Stone",
    assetFile: "rune-stone.svg",
    defaultSegmentId: "fantasy-02",
    segmentName: "Rune Arch",
  },
  {
    worldId: "fantasy-world",
    worldName: "Fantasy World",
    categoryLabel: "🔮 Fantasy: Dragon Egg (Mythical Artifact)",
    objectName: "Dragon Egg",
    assetFile: "dragon-egg.svg",
    defaultSegmentId: "fantasy-03",
    segmentName: "High Spire",
  },

  // Alien Planet
  {
    worldId: "alien-planet",
    worldName: "Alien Planet",
    categoryLabel: "🪐 Alien: Alien Mushroom (Bioluminescent Flora)",
    objectName: "Alien Mushroom",
    assetFile: "alien-mushroom.svg",
    defaultSegmentId: "alien-01",
    segmentName: "Touchdown Basin",
  },
  {
    worldId: "alien-planet",
    worldName: "Alien Planet",
    categoryLabel: "🪐 Alien: Neon Crystal (Xenolith Mineral)",
    objectName: "Neon Crystal",
    assetFile: "neon-crystal.svg",
    defaultSegmentId: "alien-02",
    segmentName: "Spore Forest",
  },
  {
    worldId: "alien-planet",
    worldName: "Alien Planet",
    categoryLabel: "🪐 Alien: Surface Rover (Exploration Vehicle)",
    objectName: "Surface Rover",
    assetFile: "surface-rover.svg",
    defaultSegmentId: "alien-03",
    segmentName: "Crystal Geysers",
  },
];

export const TOTAL_POOL_SIZE = 20;

/**
 * Calculates missing slot IDs from the 1..20 pool given existing open slots.
 */
export function calculateMissingSlotIds(existingSlots: string[]): string[] {
  const activeSlotNumbers = new Set(
    existingSlots
      .map((s) => {
        const m = s.match(/(\d+)/);
        return m ? parseInt(m[1], 10) : null;
      })
      .filter((n): n is number => n !== null && n >= 1 && n <= TOTAL_POOL_SIZE)
  );

  const missing: string[] = [];
  for (let i = 1; i <= TOTAL_POOL_SIZE; i++) {
    if (!activeSlotNumbers.has(i)) {
      missing.push(`CONTRIB-SLOT #${String(i).padStart(2, "0")}`);
    }
  }

  return missing;
}

/**
 * Selects a fresh concept from the curated catalog that is not currently actively assigned.
 */
export function selectFreshConcept(
  activeAssignments: { worldId: string; objectName: string }[],
  preferredWorldId?: string
): CuratedConcept {
  const activeKeys = new Set(
    activeAssignments.map((a) => `${a.worldId.toLowerCase()}:${a.objectName.toLowerCase()}`)
  );

  // 1. Try preferred world if specified
  if (preferredWorldId) {
    const worldCandidates = CURATED_CONCEPTS.filter(
      (c) =>
        c.worldId.toLowerCase() === preferredWorldId.toLowerCase() &&
        !activeKeys.has(`${c.worldId.toLowerCase()}:${c.objectName.toLowerCase()}`)
    );
    if (worldCandidates.length > 0) {
      return worldCandidates[0];
    }
  }

  // 2. Try any unassigned concept from the catalog
  const available = CURATED_CONCEPTS.filter(
    (c) => !activeKeys.has(`${c.worldId.toLowerCase()}:${c.objectName.toLowerCase()}`)
  );

  if (available.length > 0) {
    return available[0];
  }

  // 3. Fallback to round-robin if pool is completely saturated
  return CURATED_CONCEPTS[0];
}

export interface GeneratedSlotIssue {
  slotFormatted: string;
  worldId: string;
  worldName: string;
  segmentId: string;
  segmentName: string;
  objectName: string;
  categoryLabel: string;
  title: string;
  body: string;
  labels: string[];
}

/**
 * Generates the full title and Markdown body for a replacement contribution slot issue.
 */
export function generateContributionSlotIssue(
  slotFormatted: string,
  concept: CuratedConcept,
  overrideSegmentId?: string
): GeneratedSlotIssue {
  const segmentId = overrideSegmentId || concept.defaultSegmentId;
  const slotNumMatch = slotFormatted.match(/(\d+)/);
  const slotNumStr = slotNumMatch ? slotNumMatch[1].padStart(2, "0") : "01";
  const objectSlug = concept.objectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const title = `🌱 Add a ${concept.objectName} to ${concept.worldName} — ${concept.segmentName} (SLOT #${slotNumStr})`;

  const body = `# 🌱 Good First Issue: Add ${concept.objectName} to ${concept.worldName}

Welcome to **MakeYourWorld-OpenCircle**! This issue is designed specifically for first-time contributors. No prior open-source experience is required—just follow the step-by-step instructions below.

> 💡 **No design skills needed:** You don't need to create or upload an SVG. You will reuse an existing paper-cutout asset and register its position in the world using TypeScript data files.

---

### 📋 Assignment Summary

| Detail | Value |
| --- | --- |
| **World** | \`${concept.worldName}\` |
| **Contribution Slot** | \`${slotFormatted}\` |
| **Segment ID** | \`${segmentId}\` |
| **Object Name** | \`${concept.objectName}\` |
| **Asset Path** | \`/assets/worlds/${concept.worldId}/${concept.assetFile}\` |
| **Branch Name** | \`contrib/${concept.worldId}-${objectSlug}\` |
| **Base Branch** | \`dev\` |
| **Estimated Time** | \`15–30 minutes\` |

---

### 🛠️ Step-by-Step Guide

#### 1. Claim the Issue

Leave a comment below to reserve this slot:

\`\`\`text
Hi! I'd like to work on this issue. Thank you! 🙌
\`\`\`

> Wait until a maintainer assigns you before moving forward. Slots are held for **48 hours**.

---

#### 2. Set Up Your Repository

Fork the repository on GitHub, then clone your fork and sync it with upstream:

\`\`\`bash
# Clone your fork
git clone https://github.com/<your-github-username>/MakeYourWorld-OpenCircle.git
cd MakeYourWorld-OpenCircle

# Add upstream remote to stay up to date
git remote add upstream https://github.com/ShenSandaru/MakeYourWorld-OpenCircle.git

# Pull the latest dev branch
git checkout dev
git fetch upstream
git pull upstream dev

# Create your feature branch
git checkout -b contrib/${concept.worldId}-${objectSlug}

# Install dependencies
npm install
\`\`\`

---

#### 3. Register the Object (Commit 1)

Open \`src/data/worlds/${concept.worldId}/objects.ts\` and add your object entry at the end of the array:

\`\`\`typescript
{
  id: "${objectSlug}",
  asset: "/assets/worlds/${concept.worldId}/${concept.assetFile}",
  contributor: {
    displayName: "<Your Name>",
    githubUsername: "<your-github-username>",
  },
},
\`\`\`

Stage and commit this change:

\`\`\`bash
git add src/data/worlds/${concept.worldId}/objects.ts
git commit -m "feat: register ${objectSlug} object"
\`\`\`

---

#### 4. Place the Object in the World (Commit 2)

Open \`src/data/worlds/${concept.worldId}/placements.ts\` and append your placement coordinates (\`x\` and \`y\` are percentages from \`0.0\` to \`100.0\`):

\`\`\`typescript
{
  objectId: "${objectSlug}",
  segmentId: "${segmentId}",
  x: 45.0,
  y: 55.0,
  scale: 1.0,
  rotation: 0,
},
\`\`\`

Stage and commit this change:

\`\`\`bash
git add src/data/worlds/${concept.worldId}/placements.ts
git commit -m "feat: place ${objectSlug} in ${segmentId}"
\`\`\`

---

#### 5. Verify & Test Locally

**Inspect your changes:**
Ensure only the expected data files were modified:

\`\`\`bash
git diff --name-only dev
\`\`\`

**Run local validation:**

\`\`\`bash
npm test
npm run lint
npm run typecheck
npm run build
npx tsx scripts/audit-integrity.ts
\`\`\`

**Preview in browser:**

\`\`\`bash
npm run dev
\`\`\`

Open \`http://localhost:3000/worlds/${concept.worldId}\` to verify your object appears in the correct segment and displays your contributor badge correctly.

---

#### 6. Submit Your Pull Request

Push your branch:

\`\`\`bash
git push -u origin contrib/${concept.worldId}-${objectSlug}
\`\`\`

1. Go to your fork on GitHub and click **Compare & pull request**.
2. **Base branch:** Set to \`dev\` *(do not target \`main\`)*.
3. In the description, include:

\`\`\`markdown
Closes #<THIS_ISSUE_NUMBER>
\`\`\`

4. Submit the PR. CI checks will run automatically, and a maintainer will review your placement shortly!`;

  return {
    slotFormatted,
    worldId: concept.worldId,
    worldName: concept.worldName,
    segmentId,
    segmentName: concept.segmentName,
    objectName: concept.objectName,
    categoryLabel: concept.categoryLabel,
    title,
    body,
    labels: ["good first issue"],
  };
}
