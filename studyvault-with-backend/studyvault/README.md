# StudyVault

Educational study-resource website: Course → Semester → Subject → Syllabus / PYQs / Notes.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, **Prisma + SQLite
(database) and API routes (backend)** for real, shared file uploads.

## 1. Run it on your PC

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
cd studyvault
npm install          # also runs "prisma generate" automatically
npm run db:push       # creates the SQLite database file (prisma/dev.db)
npm run dev
```

Open **http://localhost:3000** in your browser.

A `.env` file is already included with sane local defaults:

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="changeme123"
```

**Change `ADMIN_PASSWORD` before you share this with anyone** — it's the
password for `/admin`, the page that can delete any uploaded file.

To build a production version:

```bash
npm run build
npm run start
```

## 1a. How the backend works now

- Every file a student drags into a Syllabus/PYQ/Notes drop zone is uploaded
  to the server (`app/api/uploads/route.ts`), saved on disk under
  `public/uploads/`, and recorded in a real database table (`Upload`, see
  `prisma/schema.prisma`) — not just the visitor's own browser anymore.
- Anyone can add a file (matches the site's original "crowdsourced notes"
  idea). Only someone who knows `ADMIN_PASSWORD` can delete files, via
  `/admin`.
- `npm run db:studio` opens a local browser UI (Prisma Studio) to look at
  the database table directly.

## 1b. Deploying with a real backend — important

SQLite (`prisma/dev.db`) and the files in `public/uploads/` are stored **as
plain files on disk**. That's perfect for point 1 above and for hosts with a
persistent disk (a VPS, or platforms like **Render** or **Railway**), but it
will **NOT persist** on serverless platforms like Vercel — their filesystem
resets on every deploy/request, so uploads would quietly disappear.

Two ways to handle this when you deploy:

- **Easiest: use Render or Railway instead of Vercel.** Both support an
  attached persistent disk, so SQLite + `public/uploads/` keep working
  exactly as they do locally. Just set `DATABASE_URL` and `ADMIN_PASSWORD`
  as environment variables on the host, mount a persistent disk over
  `prisma/` and `public/uploads/`, then run `npm run db:push` once (Render/
  Railway both let you run a one-off shell command).
- **If you want to stay on Vercel:** swap `DATABASE_URL` to a free hosted
  Postgres database (e.g. [Neon](https://neon.tech) or
  [Supabase](https://supabase.com) — both have a free tier, just change
  `provider = "sqlite"` to `provider = "postgresql"` in
  `prisma/schema.prisma`), and swap the file-saving code in
  `app/api/uploads/route.ts` to upload to a storage service instead of
  local disk (Vercel Blob, Supabase Storage, or Cloudinary all have free
  tiers and a simple SDK). Ask me and I can wire either of these in.

## 2. Project structure

```
studyvault/
├── app/
│   ├── page.tsx                          Homepage
│   ├── courses/page.tsx                  All courses
│   ├── courses/[course]/page.tsx         Semester list for a course
│   ├── courses/[course]/[semester]/page.tsx      Subject list
│   ├── courses/[course]/[semester]/[subject]/page.tsx   Syllabus/PYQs/Notes tabs
│   ├── search/page.tsx                   Search
│   ├── admin/page.tsx                    List/delete everything you've uploaded
│   └── layout.tsx, globals.css
├── components/                           Header, Footer, cards, DropZone, Accordion…
├── data/
│   ├── site.ts                           Change the site name here — one place
│   └── courses.ts                        Sample courses, subjects, syllabus, PYQs, notes
├── lib/storage.ts                        Browser-storage helpers for uploaded files
└── types/index.ts
```

## 3. The drag-and-drop uploader

Every subject page has three tabs — **Syllabus**, **PYQs**, **Notes** — and each
tab has a drop zone under the sample content. Drag a PDF/JPG/PNG onto it (or
click to browse) and it's saved **in your browser's local storage on this
device** and shown immediately with View/Download/Delete buttons.

Go to **/admin** any time to see and delete everything you've added, across
every subject.

**Important limitation:** this storage is per-browser and per-device — it
does not sync between your phone and laptop, and very large files (tens of
MB) may hit the browser's storage limit. This is intentional for a first
version with no backend. When you're ready for real shared storage, swap the
functions in `lib/storage.ts` for calls to Supabase Storage (see below) —
nothing else in the UI needs to change.

## 4. Adding new courses, semesters, subjects

All sample content lives in `data/courses.ts`.

- **New course:** add an entry to the `courses` array (slug, name, description, `semesterCount`).
- **New semester:** semesters are generated automatically from `semesterCount` — just raise the number.
- **New subjects for a semester:** add a case inside `getSubjects()`, following the `btechSem5` example.
- **Syllabus/PYQ/notes sample content for a subject:** add a case inside `getSubjectContent()`, following the `dbmsContent` example.

Any course/semester/subject not given specific data automatically falls back
to a small generic placeholder set, so every route on the site always works.

## 5. Changing the site name

Edit `SITE_NAME` in `data/site.ts` — it updates the header, footer and page titles everywhere.

## 6. Connecting a real database later (Supabase)

The suggested tables match the brief: `courses`, `semesters`, `subjects`,
`syllabus`, `question_papers`, `notes`, `users`. Steps:

1. Create a Supabase project, add the tables above.
2. Replace the functions in `data/courses.ts` with `fetch`/`supabase-js` calls.
3. Replace `lib/storage.ts` with Supabase Storage upload/list/delete calls, and
   point the DropZone's `dataUrl` at the returned public URL instead of a
   base64 string.
4. Add Supabase auth if you want a real admin login for `/admin`.

## 7. Real PDF uploads / admin panel

`DropZone.tsx` already handles drag-and-drop, file reading and saving — it's
the piece a real admin panel would reuse. To make it a proper admin system:
add authentication, move the save target from `localStorage` to Supabase
Storage, and gate `/admin` and the drop zones behind a login check.

## 8. Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the project's GitHub repo at vercel.com → New Project. No
environment variables are required for this first version.

## 9. What's left for a full production version

- Real backend/database (Supabase) instead of the sample data in `data/courses.ts`
- Shared cloud storage for uploads instead of per-browser local storage
- Authenticated admin panel for managing courses/semesters/subjects
- Real PDF files for syllabus/PYQs/notes, plus an in-page PDF viewer
- Google AdSense in the existing `<AdPlaceholder />` slots
- Google Analytics + Search Console
- Full-text search across real content (current search only matches course/semester/subject names)
