## 👤 Contributor Information

- **GitHub Username:** `@your-github-username`
- **Discord Username:** `your-discord-username`

---

## 🔴 IMPORTANT — LINK YOUR ISSUE

> **⚠️ Please replace `XXX` with your assigned issue number.**
>
> **Closes #XXX**

**This is required.** Make sure the issue number is correct so GitHub can automatically close your assigned issue when the PR is merged.


---

## 📁 Two-Stage Contribution Structure

Your PR should contain changes split across a **minimum of 2 commits** (more commits for adjustments are welcome):

### Commit 1: Register Object with Existing Asset
- `src/data/worlds/<world>/objects.ts` (references existing SVG from `public/assets/worlds/<world>/`)

### Commit 2: World Placement
- `src/data/worlds/<world>/placements.ts` (places object in assigned segment)

---

## 🛑 Files You Must NOT Modify
Student contributors must **NOT** modify maintainer or infrastructure files:
`public/assets/worlds/*` (assets are read-only and reused), `src/engine/*`, `src/schemas/*`, `src/components/*`, `src/app/*`, `tests/*`, `.github/*`, `package.json`, `package-lock.json`, `docs/*`, or `scripts/*`.

---

## 📸 Visual Verification Screenshot (Optional)

<!-- Attach a screenshot of your added object rendered in the world from http://localhost:3000/worlds/<world-id> -->
