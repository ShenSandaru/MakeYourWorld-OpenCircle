# 🌱 Good First Issue: Add Song Bird to Growing Forest

Welcome to **MakeYourWorld-OpenCircle**! This issue is designed specifically for first-time contributors. No prior open-source experience is required—just follow the step-by-step instructions below.

> 💡 **No design skills needed:** You don't need to create or upload an SVG. You will reuse an existing paper-cutout asset and register its position in the world using TypeScript data files.

---

### 📋 Assignment Summary

| Detail | Value |
| --- | --- |
| **World** | `growing-forest` (Growing Forest) |
| **Segment ID** | `forest-01` (Ancient Canopy) |
| **Object Name** | Song Bird |
| **Asset Path** | `/assets/worlds/growing-forest/song-bird.svg` |
| **Branch Name** | `contrib/growing-forest-song-bird` |
| **Base Branch** | `dev` |
| **Estimated Time** | 15–30 minutes |

---

### 🛠️ Step-by-Step Guide

#### 1. Claim the Issue

Leave a comment below to reserve this slot:

```text
Hi! I'd like to work on this issue. Thank you! 🙌

```

> Wait until a maintainer assigns you before moving forward. Slots are held for **48 hours**.

---

#### 2. Set Up Your Repository

Fork the repository on GitHub, then clone your fork and sync it with upstream:

```bash
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
git checkout -b contrib/growing-forest-song-bird

# Install dependencies
npm install

```

---

#### 3. Register the Object (Commit 1)

Open `src/data/worlds/growing-forest/objects.ts` and add your object entry at the end of the array:

```typescript
{
  id: "song-bird",
  asset: "/assets/worlds/growing-forest/song-bird.svg",
  contributor: {
    displayName: "<Your Name>",
    githubUsername: "<your-github-username>",
  },
},

```

Stage and commit this change:

```bash
git add src/data/worlds/growing-forest/objects.ts
git commit -m "feat: register song bird object"

```

---

#### 4. Place the Object in the World (Commit 2)

Open `src/data/worlds/growing-forest/placements.ts` and append your placement coordinates ($x$ and $y$ are percentages from `0.0` to `100.0`):

```typescript
{
  objectId: "song-bird",
  segmentId: "forest-01",
  x: 45.0,
  y: 55.0,
  scale: 1.0,
  rotation: 0,
},

```

Stage and commit this change:

```bash
git add src/data/worlds/growing-forest/placements.ts
git commit -m "feat: place song bird in forest-01"

```

---

#### 5. Verify & Test Locally

**Inspect your changes:**
Ensure only `objects.ts` and `placements.ts` were modified:

```bash
git diff --name-only dev

```

**Run local validation:**

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx tsx scripts/audit-integrity.ts

```

**Preview in browser:**

```bash
npm run dev

```

Open [http://localhost:3000/worlds/growing-forest](http://localhost:3000/worlds/growing-forest) to verify your bird appears in the canopy and displays your contributor pin badge correctly.

---

#### 6. Submit Your Pull Request

Push your branch:

```bash
git push -u origin contrib/growing-forest-song-bird

```

1. Go to your fork on GitHub and click **Compare & pull request**.
2. **Base branch:** Set to `dev` *(do not target `main`)*.
3. In the description, include:
```markdown
Closes #<THIS_ISSUE_NUMBER>

```


4. Submit the PR. CI checks will run automatically, and a maintainer will review your placement shortly!