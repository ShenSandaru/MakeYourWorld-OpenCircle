import type { WorldObject } from "@/schemas";

/**
 * [CONTRIBUTOR ZONE - Commit 1]
 * Single starting item for Growing Forest to leave maximum canvas space for students.
 */
export const forestObjects: WorldObject[] = [
  {
    id: "pine-tree",
    asset: "/assets/worlds/growing-forest/pine-tree.svg",
    contributor: {
      displayName: "Shen",
      githubUsername: "ShenSandaru",
    },
  },
  {
    id: "forest-butterfly",
    asset: "/assets/worlds/growing-forest/forest-butterfly.svg",
    contributor: {
      displayName: "Manish Kumar",
      githubUsername: "meManish47",
    },
  },
];
