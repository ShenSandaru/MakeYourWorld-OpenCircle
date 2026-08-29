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
    id: "song-bird",
    asset: "/assets/worlds/growing-forest/song-bird.svg",
    contributor: {
      displayName: "Harsh",
      githubUsername: "Lazy-Pir8",
    },
  },
  {
    id: "butterfly",
    asset: "/assets/worlds/growing-forest/student-butterfly.svg",
    contributor: {
      displayName: "Haneesh",
      githubUsername: "HaneeshYadav",
    },
  },
];
