<!--
============================================
LAAR 61400 — Workflow Content Source
File: wf-claude-code-site.md
Pattern B source: Claude Code compiles this into wf- HTML
matching workflow-shared.css. Component mapping is noted
inline in HTML comments. Do not render this MD live.
Machine note: use `py -m http.server 8000` (the py launcher),
not `python`, to match the build environment.
============================================
-->

# Build a Personal Website with Claude Code

<!-- wf-header: wf-index = "WF07" · wf-title = below · wf-subtitle = below -->

**Title:** BUILD YOUR OWN WEBSITE
**Subtitle:** Claude Code · GitHub Pages · No coding required

<!-- wf-outcome bar -->
> **OUTCOME**
> A live personal portfolio site — an about page, a few projects, and your resume — hosted free at your own public web address. You direct; the agent builds.

---

## Pipeline

<!-- wf-pipeline strip. Nodes in order; tool nodes use wf-pipe-tool (white). -->

Setup → Plan → Spec `[Claude Chat]` → Build `[Claude Code]` → Preview `[localhost]` → Publish `[GitHub]` → Live

---

## Steps

<!--
Steps grid: wf-steps (2-col). Step 0 is a full-width gate card (wf-step wf-full).
Each step: wf-step-num, wf-step-label, optional wf-badge, wf-step-body with
wf-step-desc paragraphs, wf-tips list, wf-note.
-->

### Step 0 — Set Up Your Machine

<!-- wf-full gate card. Badge: none. This is the one-time wall. -->
<!-- Render the four items as a wf-tips list inside the body, each with its source. -->

**One-time setup.** This step is the only tedious part, and you do it once. Everything after is repeatable. A brand-new Windows laptop has none of these installed, so work through them in order.

- **Claude Desktop** — download from claude.com/download. This is the app you'll work in; it includes Claude Code built in. Using the Code tab requires a paid Claude plan (Pro or above).
- **GitHub account** — sign up free at github.com. This is where your site files live online and where your site is hosted.
- **Git for Windows** — download from git-scm.com. The first time you open the Code tab, Claude Desktop will prompt you to install Git if it's missing. Run the installer and click Next through every screen, leaving all defaults. You won't use Git directly — Claude Code does.
- **Python** — download from python.org. This lets your computer run a local preview server. On the download page, get the latest Windows installer; during install, leave the defaults. (If typing a command later opens the Microsoft Store, the install didn't register — re-run the installer.)

> **wf-note:** Don't worry about understanding every tool yet. Install them, and the workflow below will show you what each one is for.

---

### Step 1 — Plan Your Site

<!-- wf-step, badge: none -->

**Gather your material before you build.** A simple portfolio needs three things:

- A short **about** text — who you are, what you do.
- Your **resume** — the file you already have.
- A few **project images** — three to six is plenty to start.

Decide the simplest possible structure: a home/about page, and a projects section. You can always add more later.

<!-- wf-tips list: image prep -->

**Prepare your images for the web.** Designers tend to work at print resolution, which is far too heavy for a website — it makes pages slow without looking any better on screen. Aim for:

- **Large/feature images:** 1600–2000 px on the long edge.
- **Gallery/inline images:** 1000–1200 px on the long edge.
- **File size:** under ~300–500 KB each. A 12 MB export is about 30× too big.
- **Format:** JPG for photos and renders; PNG only when you need a transparent background.

> **wf-note:** If your exports are too big, don't resize them by hand — in Step 3 you can ask Claude Code to resize them all for you.

---

### Step 2 — Write the Spec in Claude Chat

<!-- wf-step, badge: wf-badge-neutral "CHAT" -->

**Chat is for deciding what you want.** Open a normal Claude chat (not the Code tab) and talk through your site: what pages, what sections, what goes where, what style you like. Work with Claude until you have a clear plan.

Then have Claude write it all into a single file called **`BUILDSPEC.md`** — a plain description of the site you want built.

**Save `BUILDSPEC.md` into a new folder on your computer** — this folder will become your website. Making the folder yourself, and putting the spec inside it, is how you'll understand what's actually happening: everything for your site lives in one place.

> **wf-note:** Nothing has been built yet. Chat is for thinking and planning — figuring out *what* you want before anything is made.

---

### Step 3 — Build in Claude Code

<!-- wf-step, badge: wf-badge-neutral "CODE" -->

**Code is for doing it — on your actual files.** Open Claude Desktop, click the **Code** tab, choose **Local**, and select the folder you just made. Claude Code can now see your folder, your spec, and your images.

Tell it to read `BUILDSPEC.md` and build the site. It writes the real HTML and CSS files into your folder. To change anything, just describe it in plain language — "make the header bigger," "use a darker background" — and it edits the files for you. This is where directing the agent matters: you say what you want, it does the work.

If your project images are too large, ask Claude Code to resize them to web sizes here.

> **wf-note:** The spec is the bridge: you decided *what* in Chat, and Code does the *how* against your real files.

---

### Step 4 — Preview with a Local Server

<!-- wf-step, badge: wf-badge-neutral "localhost" -->

**See your site before it goes public.** There are two ways, and it's worth knowing both.

- **Quick way:** ask Claude Code to preview the site, and it shows you a live preview right in the app.
- **Proper way:** ask Claude Code to start a local server. It runs `py -m http.server 8000` in your folder, and you open **`localhost:8000`** in your own browser.

The proper way shows you what a website really is: a folder of files, *served* at an address. When you close the server, the site stops — because nothing is hosting it yet. That's exactly the problem the next step solves.

---

### Step 5 — Publish to GitHub

<!-- wf-step, badge: wf-badge-neutral "GitHub" -->

**Put your files online.** Ask Claude Code to save your work and upload it to GitHub. It handles everything — taking a snapshot of your files, creating the online repository, and pushing the files up. You'll see it happen; you don't type any commands yourself.

Then, in your repository on github.com, open **Settings → Pages** and turn on GitHub Pages (deploy from the `main` branch, root folder). One toggle.

---

### Step 6 — Your Site Is Live

<!-- wf-step, badge: none -->

**You now have a public web address** — something like `yourname.github.io`. Anyone can visit it.

This is the same thing as your local preview from Step 4 — a folder of files served at an address — except now it's served from the cloud, at a public URL, all the time.

**To update your site later:** change something with Claude Code, ask it to push the update, and your live site refreshes. That's the whole loop.

---

## Explainers

<!--
Two explainer callouts. Render as styled note boxes (wf-outcome style or
a tinted box). Keep them visually distinct from the step cards.
-->

### What is Git?

<!-- explainer box -->

Git keeps a history of every saved version of your files — like version history in InDesign or Photoshop, but for your whole project folder, and the snapshots are deliberate. Instead of `site_final_v2_REALLY_final`, you keep one folder and Git remembers each saved state, so you can always go back.

Three names that get mixed up:

- **Git** tracks the snapshots, on your own computer.
- **GitHub** stores a copy online, so it's backed up and shareable.
- **GitHub Pages** turns the files in your GitHub repo into a live public website, free.

You won't operate Git by hand — Claude Code does the snapshots and uploads. You just need the idea: deliberate saves you can return to, backed up online, served as a site.

### Chat vs. Code

<!-- explainer box -->

You used two different tools in this workflow, and the difference is the point:

- **Claude Chat** is for *deciding*. Thinking through what you want, planning, writing the spec. No files are touched.
- **Claude Code** is for *doing*. It works on the real files in your folder — building, editing, resizing, publishing.

The `BUILDSPEC.md` file is the handoff between them: you figure out *what* in Chat, then Code makes it real.

---

<!-- wf-footer: left = "LAAR 61400 · Representation + Computation I" · right = "WF07" -->
