# NiMSA South East Region — Official Website
### Built with Node.js + Express + EJS

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
# OR for development (auto-restart on changes)
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## 🔐 Default Admin Login
| Field    | Value                  |
|----------|------------------------|
| Email    | admin@nimsase.org      |
| Password | password               |

> **IMPORTANT:** Change this immediately! Go to Admin Dashboard → Users to manage access.

---

## 📁 Project Structure

```
nimsa-se/
├── app.js                    # Express entry point
├── package.json
├── data/
│   └── db.json               # Flat-file database (all content stored here)
├── middleware/
│   ├── auth.js               # Login/Admin guard middleware
│   └── db.js                 # JSON read/write helpers
├── routes/
│   ├── index.js              # Public page routes
│   ├── auth.js               # Login / Register / Logout
│   └── admin.js              # All admin CRUD routes
├── views/
│   ├── partials/
│   │   ├── nav.ejs           # Sticky navigation bar
│   │   └── footer.ejs        # Footer + WhatsApp FAB
│   ├── admin/
│   │   ├── layout-top.ejs    # Admin sidebar layout (top)
│   │   ├── layout-bottom.ejs # Admin sidebar layout (bottom)
│   │   ├── dashboard.ejs     # Admin home/stats
│   │   ├── executives.ejs    # Manage REC & school presidents
│   │   ├── exec-edit.ejs     # Edit individual executive
│   │   ├── events.ejs        # Manage events
│   │   ├── bulletin.ejs      # Manage bulletins
│   │   ├── news.ejs          # Manage news posts
│   │   ├── users.ejs         # Manage user accounts + roles
│   │   └── settings.ejs      # Site-wide settings
│   ├── index.ejs             # Homepage
│   ├── about.ejs             # About NiMSA SE
│   ├── leadership.ejs        # Executives directory
│   ├── events.ejs            # Events listing
│   ├── bulletin.ejs          # Monthly bulletin + archive
│   ├── resources.ejs         # Resource hub
│   ├── gallery.ejs           # Photo gallery
│   ├── news.ejs              # News & stories
│   ├── campaigns.ejs         # Campaigns & career corner
│   ├── join.ejs              # Member registration
│   ├── contact.ejs           # Contact form
│   ├── login.ejs             # Login page
│   ├── register.ejs          # Registration page
│   └── 404.ejs               # 404 error page
└── public/
    ├── css/style.css          # All styles (NiMSA SE brand)
    └── js/main.js             # All client-side JS
```

---

## 👤 User Roles

| Role  | Access                                                     |
|-------|------------------------------------------------------------|
| Guest | View all public pages; see Join page prompt to register    |
| User  | All public pages + personalised Join form                  |
| Admin | Full access + Admin Dashboard to manage ALL content        |

### Admin Can Manage:
- ✅ **Executives** — Add/Edit/Delete REC members & school presidents
- ✅ **Events** — Create webinars, conventions, campaigns
- ✅ **Bulletins** — Upload new issues, set featured, manage archive
- ✅ **News** — Post announcements & stories
- ✅ **Users** — Promote to admin, delete accounts
- ✅ **Settings** — WhatsApp number, email, social links

---

## 🌐 Deployment Options

### Option A — Railway (Recommended for Node.js)
1. Push this folder to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Railway auto-detects Node.js and deploys
4. Add a custom domain in Railway settings

### Option B — Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Build command: `npm install`
4. Start command: `npm start`

### Option C — Heroku
```bash
heroku login
heroku create nimsa-se-website
git push heroku main
```

---

## ⚙️ Configuration

### Update Contact Details
Go to **Admin Dashboard → Settings** and update:
- Official email
- WhatsApp number (format: `2348012345678` — no `+` or spaces)
- Social media links (Facebook, Instagram, Twitter/X, YouTube)

### Update Formspree (Contact & Join Forms)
1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the form ID
3. In the EJS files, replace `your-form-id` with your real ID:
   - `views/contact.ejs`
   - `views/join.ejs`
   - `views/bulletin.ejs` (newsletter form)

### Add Google Analytics
Add your GA4 tracking ID to `views/partials/nav.ejs` (in the `<head>` area):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
```

---

## 🗓️ Adding Real Content (Quick Checklist)

- [ ] Log in as admin at `/auth/login`
- [ ] Add Regional Coordinator profile at `/admin/executives`
- [ ] Add all REC members and school presidents
- [ ] Add upcoming events (conventions, webinars, campaigns)
- [ ] Upload latest bulletin PDF link
- [ ] Post your first news story
- [ ] Update WhatsApp number and email in Settings
- [ ] Add real social media links in Settings
- [ ] Replace Formspree `your-form-id` in EJS files

---

## 🔧 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Runtime      | Node.js            |
| Framework    | Express.js         |
| Templates    | EJS                |
| Auth         | express-session + bcryptjs |
| Database     | JSON flat-file (data/db.json) |
| CSS          | Custom (DM Sans + Playfair Display) |
| Fonts        | Google Fonts (CDN) |
| Icons        | Inline SVG         |

---

## 🎨 Brand Colors

| Token         | Hex       | Usage                          |
|---------------|-----------|--------------------------------|
| Primary Green | `#006400` | Nav, buttons, headers          |
| Deep Green    | `#003300` | Footer, dark overlays          |
| Gold Accent   | `#D4AF37` | CTAs, badges, active states    |
| Light Green   | `#e8f5e9` | Backgrounds, card fills        |

---

*NiMSA South East Region — ICT Directorate*  
*"Most Exceptional Arm" 🏆*
