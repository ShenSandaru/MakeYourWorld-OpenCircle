import type { WorldObject } from "@/schemas";

/**
 * [CONTRIBUTOR ZONE - Commit 1]
 * Single starting item for Growing Ocean.
 */
export const oceanObjects: WorldObject[] = [
  {
    id: "clownfish",
    asset: "/assets/worlds/growing-ocean/clownfish.svg",
    contributor: {
      displayName: "Coral",
      githubUsername: "coral-diver",
    },
  }, 
 {
    id: "research-submarine",
    asset: "/assets/worlds/growing-ocean/research-submarine.svg",
    contributor: {
      displayName: "OBagnell",
      githubUsername: "OBagnell",
    },
  },
];
