---
name: "🌿 Reusable World Contribution Slot (Good First Issue)"
about: "Reusable contribution slot for adding a paper-collage object into a Growing World segment"
title: "🌱 Add a <Object Name> to <World Name> at <Segment Name> (SLOT #<01-20>)"
labels: ["good first issue"]
assignees: ""
---

# 🌱 Good First Issue — Add <Object Name> to <World Name>

> 👋 **Welcome!** This is a beginner-friendly contribution to Growing Worlds.
>
> You do not need previous open-source experience. We will guide you through every step from claiming this issue to opening your Pull Request!
>
> **Important**: You are **NOT** expected to create or upload a new SVG file. This repository already provides a rich collection of reusable paper-cutout assets! Your job is to select an existing asset, register **ONE** new object using that asset, and place the object in your assigned world segment.

- 🟢 **Difficulty**: Beginner
- ⏱️ **Estimated Time**: 15–30 minutes

---

## 🎯 Contribution Slot Summary

| Detail | Your Assignment |
| :--- | :--- |
| **Target World** | `[e.g., Growing Forest]` (`growing-forest`) |
| **Contribution Slot** | `[e.g., CONTRIB-SLOT #02]` |
| **Assigned Segment** | `[e.g., forest-01]` (Ancient Canopy) |
| **Object Name** | `[e.g., Butterfly]` |
| **Feature Branch** | `contrib/<world-id>-<object-slug>` |
| **PR Target Branch** | `dev` |
| **Required Commits** | Minimum 2 (more allowed) |

---

## 📝 Quick Instructions

1. ⭐ **Star our repo** on GitHub!
2. 🍴 **Fork our repo** and clone it locally.
3. 🙋 **Claim this issue**: Comment `Hi! I'd like to work on this issue. Thank you! 🙌` below.
4. 🌿 **Create your branch**: `git checkout -b contrib/<world-id>-<object-name>` from `dev`.
5. 🎨 **Commit 1**: Open `src/data/worlds/<world-id>/objects.ts`, reference an existing reusable asset from `public/assets/worlds/<world-id>/`, and register your object.
6. 📍 **Commit 2**: Open `src/data/worlds/<world-id>/placements.ts` and add placement for your assigned segment.
7. 🧪 **Run checks**: `npm test && npm run lint && npm run typecheck && npm run build`.
8. 🚀 **Submit PR**: Open a Pull Request targeting `dev` with `Closes #<THIS_ISSUE_NUMBER>` in the description.
9. 👀 **Wait for review & merge!**

---

## 🎨 Important Distinction: Object vs. Asset

- **Asset (SVG)**: A reusable visual picture file stored in `public/assets/worlds/<world-id>/`. Think of it as the physical paper stamp.
- **Object**: A data record in `objects.ts` that defines *who* made the contribution and *which* visual asset it uses.
- **Placement**: A record in `placements.ts` that defines *where* (coordinates and segment) the object sits in the world.

> 💡 *You do NOT need to create a new SVG file. You reuse an existing asset from the repository.*

---

## 🎯 What You Are Building

Your contribution adds **ONE** new visual paper-cutout object to the selected Growing World!
- Once merged into `dev`, your paper craft becomes a permanent visual part of the shared interactive diorama.
- Your GitHub username and contributor display name will be displayed in an elegant paper pin badge right beneath your object.

---

## 📝 Your Task

1. **Inspect existing reusable assets** in `public/assets/worlds/<world-id>/`.
2. **Register ONE new object** in `src/data/worlds/<world-id>/objects.ts` referencing that asset.
3. **Place that object** in the assigned segment using `src/data/worlds/<world-id>/placements.ts`.
4. **Follow the flexible two-stage commit workflow** (minimum 2 commits, more allowed).
5. **Open a Pull Request** targeting the `dev` branch.

> ⚠️ **Important Scope Boundary**: You are modifying data files for **ONE** world only (`objects.ts` and `placements.ts`). Do NOT modify existing SVG assets, unrelated worlds, governance files, CI workflows, or project configuration.

---

## ✅ Before You Start

- [ ] Read this entire issue once from top to bottom.
- [ ] Make sure the issue is formally assigned to you before writing code.
- [ ] Verify your assigned World and Segment ID.
- [ ] Check the existing assets under `public/assets/worlds/<world-id>/`.
- [ ] Remember: PRs require a **minimum of 2 commits** (more commits are completely fine!).
- [ ] Remember: PRs always target the **`dev`** branch (never `main`).

---

## 🙋 Step 1 — Claim the Issue

To claim this slot, comment below:
```text
Hi! I'd like to work on this issue. Thank you! 🙌
```
A maintainer will formally assign you to the issue. Once assigned, GitHub Actions will automatically post a personalized onboarding comment with your exact branch name and assignment details. You have a **48-hour reservation window** to submit your PR.

---

## 🍴 Step 2 — Fork and Clone

1. Click **Fork** in the top right corner of this repository on GitHub.
2. Clone your newly created fork to your computer:
   ```bash
   git clone https://github.com/<your-github-username>/MakeYourWorld-OpenCircle.git
   cd MakeYourWorld-OpenCircle
   ```
3. Connect to the upstream repository:
   ```bash
   git remote add upstream https://github.com/ShenSandaru/MakeYourWorld-OpenCircle.git
   ```

---

## 🌿 Step 3 — Create Your Student Feature Branch

Always start fresh from the latest upstream **`dev`** branch:
```bash
git checkout dev
git fetch upstream
git pull upstream dev
```

Create and switch to your feature branch using the required `contrib/` prefix:
```bash
git checkout -b contrib/<world-id>-<object-slug>
```
*Example for Growing Forest Butterfly:*
```bash
git checkout -b contrib/growing-forest-butterfly
```

---

## 📦 Step 4 — Install Dependencies

```bash
npm install
```

---

## 📁 Files You Will Change

Your contribution will normally modify **only these two files**:
```text
Commit 1 (Object Registration):
└── src/data/worlds/<world-id>/objects.ts              (Object metadata & contributor attribution)

Commit 2 (World Placement):
└── src/data/worlds/<world-id>/placements.ts           (Coordinates & segment placement)
```
*(Existing SVG assets in `public/assets/worlds/<world-id>/` are read-only and should NOT be modified).*

---

# 🔐 Two-Stage Contribution Governance

- **Minimum 2 commits required** (Commit 1: Object registration in `objects.ts`, Commit 2: Placement in `placements.ts`).
- **Flexible commit count**: If you make 3, 4, or 5 commits (for fixes or adjustments), that is **100% fine and allowed**! You do not need to squash them.
- **Strict file scope**: Only modify `objects.ts` and `placements.ts` for your assigned world.

---

## 🎨 Step 5 — Commit 1: Register Object with Existing Asset

1. **Select an Existing Asset**:
   - Open `public/assets/worlds/<world-id>/` in your file explorer or GitHub.
   - Choose an existing paper cutout SVG (e.g. `/assets/worlds/growing-forest/woodland-flower.svg`).

2. **Register in `objects.ts`**:
   - Open `src/data/worlds/<world-id>/objects.ts` and append your object definition:
     ```typescript
     {
       id: "<object-name>",
       asset: "/assets/worlds/<world-id>/<existing-asset-file>.svg",
       contributor: {
         displayName: "<Your Display Name>",
         githubUsername: "<your-github-username>",
       },
     },
     ```

3. **Check Changes & Create Commit 1**:
   ```bash
   git status
   git diff
   git add src/data/worlds/<world-id>/objects.ts
   git commit -m "feat: register <object-name> object"
   ```

---

## 📍 Step 6 — Commit 2: Place Your Object in the Segment

1. Open `src/data/worlds/<world-id>/placements.ts`.
2. Append your placement entry referencing your registered `id` and assigned `segmentId`:
   ```typescript
   {
     objectId: "<object-name>",
     segmentId: "<assigned-segment-id>",
     x: 45.0,
     y: 55.0,
     scale: 1.0,
     rotation: 0,
   },
   ```
   *(Coordinates `x` and `y` are normalized percentages `0.0` to `100.0`)*

3. **Check Changes & Create Commit 2**:
   ```bash
   git status
   git diff
   git add src/data/worlds/<world-id>/placements.ts
   git commit -m "feat: place <object-name> in <assigned-segment-id>"
   ```

---

## 🔍 Step 7 — Verify Your Commits & Modified Files

Check your Git commit history:
```bash
git log --oneline -5
```
Check your modified files (should only be `objects.ts` and `placements.ts`):
```bash
git diff --name-only origin/dev
```

---

## 🧪 Step 8 — Run Local Quality Gates

Run all validation checks locally to ensure zero errors:
```bash
npm test
npm run lint
npm run typecheck
npm run build
npx tsx scripts/audit-integrity.ts
```

---

## 🖥️ Step 9 — Visual Verification in Your Browser

Start the local Next.js development server:
```bash
npm run dev
```
Open `http://localhost:3000/worlds/<world-id>` in your browser:
- Verify that your object renders in its assigned segment.
- Verify that your contributor badge displays your display name.
- Verify that existing objects remain intact.

---

## 🚀 Step 10 — Push and Open Pull Request

1. Push your branch to your fork:
   ```bash
   git push -u origin contrib/<world-id>-<object-name>
   ```
2. Open a Pull Request on GitHub:
   - **Base branch**: `dev` *(⚠️ Do NOT target `main`)*
   - **Compare branch**: `contrib/<world-id>-<object-name>`
3. In the PR description, connect this issue so it automatically closes upon merge:
   ```markdown
   ## 🔗 Linked Issue
   Closes #<THIS_ISSUE_NUMBER>
   ```
   *(Example:* `Closes #21`*)*

---

## 🎉 Step 11 — What Happens After Submitting

1. **Automated CI Validation**: GitHub Actions will automatically test your commits, verify strict file boundaries, run ESLint/typecheck/build, and confirm relational schema integrity.
2. **Maintainer Review**: A maintainer will review your placement and approve the PR.
3. **Merge & Automatic Closure**: Once merged into `dev`, GitHub automatically closes this issue slot and awards your permanent spot in the diorama!
4. **Need Help?**: If you get stuck or have questions at any step, feel free to comment right here on this issue!
