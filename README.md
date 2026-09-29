# S.S.E Industries — Website + Super Admin

Designed & developed by **Nikki Technologies** — https://nikkitechnologies.com

React (Vite) + Tailwind website for **S.S.E Industries – The Future of the Rice**, with a full Super Admin panel at **`/admin`**.
Every text, image, product, project, service, industry, gallery photo, testimonial, FAQ, phone/WhatsApp number and enquiry is managed from the admin panel.

---

## 1. Run in VS Code (2 minutes)

```bash
npm install
npm run dev          # open http://localhost:5173
```

Admin panel: **http://localhost:5173/admin** — in *Demo mode* the password is `admin123`
(change it in `.env` → `VITE_DEMO_ADMIN_PASSWORD`).

> **Demo mode** = no database connected. Everything works (editing, uploads, enquiries) but is saved only in *your* browser.
> Connect Supabase (step 2) to make changes live for every visitor.

## 2. Go live with Supabase (free)

1. Create a project at https://supabase.com.
2. Open `supabase/schema.sql`, change `admin@sseindustries.in` (bottom of the file) to your admin email.
3. Supabase → **SQL Editor** → paste the whole file → **Run**. This creates tables, security rules, the `media` image bucket and loads all the default website content.
4. Supabase → **Authentication → Users → Add user** → same email + a password (tick "Auto confirm").
5. Supabase → **Project Settings → API** → copy *Project URL* and *anon public key* into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
6. Restart `npm run dev`, log in at `/admin` with your email & password.
7. (Password reset emails) Authentication → URL Configuration → add `https://your-domain.com/admin/reset` to *Redirect URLs*.

## Live Supabase project
The production keys are in `.env.production` (Supabase URL + public anon key), so `npm run build` and Vercel builds connect to the live database automatically — no environment variables needed on Vercel.
Database calls go through this site's own domain (`/sb/…`, see `vercel.json` and `VITE_SUPABASE_PROXY` in `.env.production`). This keeps the site working for visitors on Indian networks that block `supabase.co`.
**Hostinger:** the `/sb` route only exists on Vercel — remove the `VITE_SUPABASE_PROXY` line from `.env.production` before `npm run build`.
For local development without touching live data, leave `.env` empty (demo mode) or point it at a separate Supabase project.

## 3. Build & deploy (copy `dist`)

```bash
npm run build        # creates the dist/ folder
npm run preview      # test the built site at http://localhost:4173
```

Upload **the contents of `dist/`** to any host:

| Host | Notes |
|---|---|
| cPanel / Hostinger / GoDaddy | Upload into `public_html`. `.htaccess` is already included for page refresh support. |
| Netlify | Drag & drop `dist` — `_redirects` included. |
| Vercel | Import the repo (framework: Vite) — `vercel.json` included. Add the two `VITE_SUPABASE_*` env vars. |

⚠️ The Supabase keys are baked in at build time — set `.env` **before** `npm run build`.

## 4. What the admin can manage

| Section | What you can do |
|---|---|
| Dashboard | New enquiries, weekly count, content totals, quick actions |
| Enquiries | All form submissions · filter by status (New / Contacted / Quoted / Won / Closed) · internal notes · one-click WhatsApp / Call / Email reply · CSV export |
| Website Pages | Every heading, paragraph, banner image, icon badge, CTA and list on Home, About, Products, Projects, Industries, Services, Gallery, Contact |
| Common Sections | Stats (100+, 50+…), Why-Choose-Us items, default CTA band |
| Hero Slides | Home page banner slider — image, titles, buttons |
| Products / Projects / Services / Industries | Add, edit, duplicate, hide, delete, drag to reorder, feature on home, multiple images, specs table, features, brochure PDF, YouTube video |
| Categories | Product, project and gallery categories |
| Gallery | Bulk upload many photos at once, captions, categories, video tiles (MP4 upload or YouTube) |
| Testimonials / FAQs | Full CRUD |
| Site Settings | Logo, phone, WhatsApp number, email, address, working hours, Google Map, social links, footer, SEO, announcement bar, brochure PDF, floating button toggles |
| Media Library | See/copy/delete every uploaded file |
| Admin Users | Super admin can add editors or other super admins |
| Backup & Restore | Download all content as JSON, restore any time |

Images are auto-resized and converted to WebP before upload, so pages stay fast.
Videos: upload MP4 (up to 50 MB) or paste a YouTube link — on the home/about video block, hero slides (background video), products, projects, services and gallery.

## 5. WhatsApp enquiry features
- Floating WhatsApp + Call buttons on every page
- WhatsApp button on every product card and product / project / service page (pre-filled message with product name)
- Every form saves the enquiry to the admin panel **and** (optional, toggle in Settings) opens WhatsApp with all details pre-filled
- Admin can reply to any enquiry on WhatsApp in one click

## Project structure
```
src/
  data/defaults.js     default content (also used to generate the SQL seed: npm run gen:sql)
  lib/api.js           Supabase + demo-mode data layer
  pages/               public pages
  components/          layout, cards, sections, enquiry form, quote popup
  admin/               super admin panel (schemas.js drives all editor forms)
supabase/schema.sql    database, security rules, storage bucket, seed data
public/images/         default images & logo
```

Adding a new editable field: add it to `src/admin/schemas.js` and use it in the page — no database change needed.

**Note:** Projects and the testimonial are taken from the design mockup — replace them with your real projects and client feedback from the admin panel.
