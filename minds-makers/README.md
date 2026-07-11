# Minds Makers — React Site + Admin Dashboard

## What this is
The full Minds Makers website rebuilt in React (Vite), with a built-in
admin dashboard at `/admin` that lets you add, edit, and delete content
on the live site — services, team members, projects, home page text,
and site settings — without touching code.

## How content works
All editable content lives in `src/data/data.json` as the **default**
content. When you edit something in the dashboard, the change is saved
to your browser's `localStorage` and instantly reflected on the site
for you. This means:

- Changes you make in the dashboard show up immediately when you preview
  the live site **in the same browser**.
- To make those changes permanent and visible to **everyone** who visits
  the site (not just your browser), you need to either:
  1. Manually copy the values into `src/data/data.json` and redeploy, or
  2. (Recommended next step) Connect a real backend — see "Going further" below.

## Running locally
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`

## Building for production
```bash
npm run build
```
Output goes to `dist/`

## Deploying to Vercel
1. Push this project to a GitHub repository
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite — just click Deploy
4. Done — every push to your main branch auto-deploys

## Admin Dashboard
Visit `/admin` on your deployed site (e.g. `https://yoursite.vercel.app/admin`)

**Default invite code for creating admin accounts:** `MM-ADMIN-2024`
(Change this in `src/context/AuthContext.jsx` — look for `INVITE_CODE`)

Admin accounts and content edits are stored in the browser's
localStorage — they are per-browser/per-device, not shared globally
yet.

## Going further: making dashboard edits go live for everyone
Right now edits only persist in your own browser. To make the dashboard
actually update the live site for all visitors, you need a real backend.
Two common options:
1. **GitHub API integration** — the dashboard commits changes directly
   to `data.json` in your GitHub repo; Vercel redeploys automatically.
2. **A database** (Supabase, Firebase, etc.) — the site fetches content
   from the database at runtime instead of the static JSON file.

Ask your developer (or Claude!) to wire up either of these when you're
ready — the dashboard UI is already built to support it.
