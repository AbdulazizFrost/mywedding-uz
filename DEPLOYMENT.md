# Production Deployment Guide (MyWedding.uz)

Follow these phases sequentially to deploy the application to GitHub, Render (Backend), and Vercel (Frontend).

## PHASE 1 — Create GitHub repository
- **What to do:** Create a new empty repository on GitHub.
- **Where:** github.com
- **Important:** Do NOT commit your local `.env` files or the `backend/public/uploads` folder. These should already be ignored by `.gitignore`.

## PHASE 2 — Push project to GitHub
- **What to do:** Initialize git (if not already done) and push your code.
- **Where:** Local terminal
- **Command:**
  ```bash
  git remote add origin https://github.com/your-username/mywedding.git
  git push -u origin main
  ```

## PHASE 3 — Deploy backend to Render
- **What to do:** Connect your GitHub repository to Render and deploy the backend as a "Web Service".
- **Where:** render.com dashboard
- **Configuration:** 
  - **Root Directory:** `backend`
  - **Build Command:** `npm install --omit=dev`
  - **Start Command:** `npm start`
- **Variables:** Set `NODE_ENV=production` in the Render environment variables settings. Render handles the `PORT` automatically.

## PHASE 4 — Configure Neon DATABASE_URL
- **What to do:** Add your PostgreSQL database connection string to the Render service.
- **Where:** Render Dashboard -> Environment Variables
- **Variable:** `DATABASE_URL` 
- **Placeholder Example:** `postgresql://user:password@ep-your-db-id.eu-central-1.aws.neon.tech/neondb`
- **Important:** Use your real database URL, but never expose it publicly.

## PHASE 5 — Run Prisma migrations
- **What to do:** Apply any pending migrations safely to the production database.
- **Where:** Render Dashboard -> "Shell" tab (or as a deploy script)
- **Command:** `npx prisma migrate deploy`
- **CRITICAL WARNING:** NEVER run `npx prisma migrate reset` or `npx prisma migrate dev` in production, as this will drop all existing data.

## PHASE 6 — Configure S3
- **What to do:** Provide S3 cloud storage credentials to your Render backend so users can upload images.
- **Where:** Render Dashboard -> Environment Variables
- **Variables Needed:**
  - `STORAGE_PROVIDER=s3`
  - `S3_ENDPOINT` (e.g. `https://s3.eu-central-1.amazonaws.com`)
  - `S3_REGION` (e.g. `eu-central-1`)
  - `S3_BUCKET` (e.g. `mywedding-bucket`)
  - `S3_ACCESS_KEY_ID` 
  - `S3_SECRET_ACCESS_KEY`
  - `S3_PUBLIC_URL` (optional CDN url)

## PHASE 7 — Deploy frontend to Vercel
- **What to do:** Connect your GitHub repository to Vercel and deploy the frontend.
- **Where:** vercel.com dashboard
- **Configuration:** Vercel will automatically detect Vite and set the build command (`npm run build`) and output directory (`dist`). Make sure the Root Directory is set to `frontend`.

## PHASE 8 — Configure VITE_API_URL
- **What to do:** Tell the frontend where the backend API lives.
- **Where:** Vercel Dashboard -> Environment Variables
- **Variable:** `VITE_API_URL`
- **Placeholder Example:** `https://your-backend-app.onrender.com/api`

## PHASE 9 — Configure CORS / FRONTEND_URL
- **What to do:** Tell the backend to only accept requests from your Vercel frontend.
- **Where:** Render Dashboard -> Environment Variables
- **Variable:** `FRONTEND_URL`
- **Placeholder Example:** `https://your-frontend-app.vercel.app` (No trailing slash)
- **Verification:** Ensure the backend restarts after adding this variable.

## PHASE 10 — Configure custom domains
- **What to do:** Attach your purchased domain (e.g., `mywedding.uz`).
- **Where:** Vercel & Render Dashboards + Your DNS Provider (e.g., Cloudflare, Namecheap)
- **How:**
  1. In Vercel, add `mywedding.uz` and `www.mywedding.uz`. Update your DNS with Vercel's provided A/CNAME records.
  2. In Render, add `api.mywedding.uz`. Update your DNS with Render's provided CNAME record.
  3. After domains propagate, update `FRONTEND_URL` in Render to `https://mywedding.uz`.
  4. Update `VITE_API_URL` in Vercel to `https://api.mywedding.uz/api`.

## PHASE 11 — Production smoke test
- **What to do:** Verify the live application manually.
- **Steps:**
  1. Go to `https://mywedding.uz`
  2. Register / Login
  3. Buy a template and verify mock payment fails safely or completes if not fully disabled in UI (Dev endpoints are securely disabled backend-side).
  4. Edit the invitation and upload a photo (verifies S3 is working).
  5. Publish and visit the public `/w/slug` link.
  6. Submit an RSVP and check your dashboard.
