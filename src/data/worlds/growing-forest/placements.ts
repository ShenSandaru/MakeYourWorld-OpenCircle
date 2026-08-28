import type { ObjectPlacement } from "@/schemas";

/**
 * [CONTRIBUTOR ZONE - Commit 2]
 * Single starting placement for Growing Forest in Segment 01 (Ancient Canopy).
 */
export const forestPlacements: ObjectPlacement[] = [
  {
    objectId: "pine-tree",
    segmentId: "forest-01",
    x: 22.0,
    y: 65.0,
    scale: 1.1,
    rotation: -1,
  },
  {
    objectId: "song-bird",
    segmentId: "forest-01",
    x: 45.0,
    y: 55.0,
    scale: 1.0,
    rotation: 0,
  },
  {
    objectId: "butterfly",
    segmentId: "forest-01",
    x: 35.0, // Shifted slightly so it does not overlap the bird!
    y: 45.0,
    scale: 1.0,
    rotation: 0,
  },
];
