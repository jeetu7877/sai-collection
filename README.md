# MenStyle Pro — Smart Men's Clothing Store Management System

Full-stack web app: **React (Vite) + Tailwind** frontend and **Node.js/Express + MongoDB** backend.

## What's included

**Customer-facing site:** Home, Shop (filters/search/sort), Product detail, Cart, Wishlist, Checkout, Order history, Profile, About, Contact, Login/Register.

**Admin/Staff dashboard** (`/admin`): sales stats, low-stock alerts, recent orders, revenue chart.

**Backend API:** JWT auth (admin/staff/customer roles), products with variants (size/color/stock), categories & brands, cart & wishlist, orders with GST invoice generation (PDFKit), coupons, product reviews, customer profiles with loyalty points (₹100 = 10 points, Silver/Gold/VIP tiers), image upload, and a basic outfit/size recommendation endpoint.

Design: dark theme, orange accent (#ff6b00), glassmorphism cards, per the brief.

## Requirements

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a MongoDB Atlas connection string

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env — set MONGO_URI and JWT_SECRET at minimum
npm run seed   # creates sample admin/staff/customer users, categories, products, coupons
npm run dev    # starts API on http://localhost:5000
```

Seeded logins (printed by the seed script too):
- Admin: `admin@menstylepro.com` / `admin123`
- Staff: `staff@menstylepro.com` / `staff123`
- Customer: `rahul@example.com` / `customer123`

## 2. Frontend setup

```bash
cd client
npm install
npm run dev    # starts site on http://localhost:5173
```

The client expects the API at `http://localhost:5000` (see `src/services/api.js`) — adjust `VITE_API_URL` if you deploy the backend elsewhere.

## 3. Production build

```bash
cd client && npm run build   # outputs client/dist — serve with any static host
cd server && npm start
```

## Deploying — Backend on Render, Frontend on Netlify

### 1. Push the code to GitHub
Both Render and Netlify deploy from a Git repo.

```bash
cd menstyle-pro
git init
git add .
git commit -m "Initial commit"
```
Create a repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/menstyle-pro.git
git push -u origin main
```

### 2. Set up MongoDB Atlas (Render has no local MongoDB)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → create a free cluster.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere — Render's IPs aren't static).
4. **Connect** → "Drivers" → copy the connection string, e.g.
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/menstyle-pro?retryWrites=true&w=majority`

### 3. Deploy the backend on Render
1. [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo.
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free is fine to start
3. **Environment** tab → add these variables (same names as `.env.example`):
   ```
   MONGO_URI=<your Atlas connection string>
   JWT_SECRET=<a long random string>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=<your Netlify URL — add this after step 4, then redeploy>
   ADMIN_EMAILS=you@example.com
   SMTP_HOST=... (optional, for real verification emails)
   SMTP_USER=...
   SMTP_PASS=...
   ```
4. Deploy. Once live, note the URL Render gives you, e.g. `https://menstyle-pro-api.onrender.com`.
5. Seed the database once, from your own machine (point your local `.env`'s `MONGO_URI` at the same Atlas cluster first):
   ```bash
   cd server && npm run seed
   ```

**Note:** Render's free tier spins down when idle and takes ~30–60s to wake up on the next request — normal for free tier, upgrade if that matters for you. Also, uploaded product images (via multer) are **not persistent** on Render's free tier (filesystem resets on redeploy) — set up Cloudinary (already wired in `.env`) for production image uploads.

### 4. Deploy the frontend on Netlify
1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → pick your repo.
2. Since `netlify.toml` is already in the repo root, Netlify auto-detects:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
3. **Site configuration → Environment variables** → add:
   ```
   VITE_API_URL=https://menstyle-pro-api.onrender.com/api
   ```
   (use your actual Render URL from step 3, keep the `/api` at the end)
4. Deploy. Netlify gives you a URL like `https://menstyle-pro.netlify.app`.

### 5. Connect the two
Go back to Render → your backend's environment variables → set:
```
CLIENT_URL=https://menstyle-pro.netlify.app
```
Redeploy the backend so CORS allows requests from your Netlify domain. That's it — visit your Netlify URL and the site should be fully live.

### Custom domain (optional)
Both Render and Netlify support adding your own domain under their respective "Domain" settings — point your DNS as instructed there, then update `CLIENT_URL` (Render) and `VITE_API_URL` (Netlify) to match.

## Email verification (signup)

New customer signups now require email verification before they can log in:

1. `POST /api/auth/register` creates the account (unverified) and emails a 6-digit code.
2. `POST /api/auth/verify-email` (email + code) verifies the account and logs the user in.
3. `POST /api/auth/resend-verification` sends a fresh code if it expired (codes last 10 minutes).
4. `POST /api/auth/login` returns `403 { needsVerification: true }` if the account isn't verified yet — the frontend automatically redirects to `/verify-email` in that case.

**Without SMTP configured**, the code is printed to the server console instead of emailed (clearly logged as dev mode) — useful for local testing without a mail provider. To send real emails, set `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` in `server/.env` (e.g. a Gmail app password, or any SMTP provider).

The three seeded demo accounts (admin/staff/customer) are marked verified already, so they log in normally without going through this flow.

### Make a specific email always sign up as admin

Set `ADMIN_EMAILS` in `server/.env` to a comma-separated list of email addresses:

```
ADMIN_EMAILS=you@example.com,cofounder@example.com
```

Anyone who registers with one of these emails automatically gets the `admin` role instead of `customer` — they still have to verify their email like everyone else, just their account starts with full admin access. Leave it blank (or unset) to disable this.

## Notes on optional integrations

These are wired up but need your own credentials in `.env` to go live — the app works without them, just with reduced functionality:
- **Email (Nodemailer):** offer/OTP emails — set `SMTP_*` vars.
- **Cloudinary:** product image hosting — set `CLOUDINARY_*` vars. Without it, uploads save to `server/uploads/` and are served statically.
- **Socket.io** is already active for live order/stock updates on the same server.

## Project structure

```
server/
  config/       # DB connection
  models/       # Mongoose schemas (User, Product, Order, Cart, Wishlist, Coupon, Review, ...)
  controllers/  # Route handlers
  routes/       # Express routers
  middleware/   # JWT auth, role guard, error handling, multer upload
  utils/        # Token, SKU generator, invoice (PDF) generator
  seed/         # Sample data seeder

client/
  src/
    components/ # Navbar, Footer, ProductCard, Filters, AdminLayout, ProtectedRoute
    context/    # Auth, Cart, Wishlist (React Context + API calls)
    pages/      # Home, Shop, ProductPage, Cart, Wishlist, Checkout, OrderHistory,
                # Profile, Login, Register, About, Contact, admin/AdminDashboard
    services/   # Axios API client
```

## What's not built (out of scope for this pass)

The original spec's "Future Features" list (AR try-on, virtual trial room, franchise/multi-shop support, voice assistant, native mobile apps) and a few "nice to have" items (barcode scanner hardware integration, WhatsApp API sending) are left as stubs or omitted — flag any of these if you want them built out next.
