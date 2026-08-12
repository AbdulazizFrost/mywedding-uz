# MyWedding.uz

MyWedding.uz is a premium platform for creating, customizing, and sharing digital wedding invitations. It provides a complete workflow from browsing templates to managing guest RSVPs.

## Core Features
- **Authentication:** Secure user registration and login.
- **Catalog:** Browse beautifully crafted premium wedding templates.
- **Orders & Checkout:** Order a template and proceed through the checkout flow.
- **Mock Payment Architecture:** Easily extensible payment provider abstraction currently using a mock provider for development.
- **Invitation Editor:** Fully customize the bought template (names, dates, locations, messages).
- **Media Storage:** Local storage for development and S3-compatible cloud storage for production image hosting.
- **Public Invitations & RSVP:** Publish invitations to a custom public URL (`/w/:slug`). Guests can submit RSVP responses which the owner can track in their dashboard.

## Architecture Overview
The project uses a modern decoupled architecture:
- **Frontend:** React + Vite, deployed on **Vercel**
- **Backend:** Node.js + Express, deployed on **Render**
- **Database:** PostgreSQL hosted on **Neon**, managed via Prisma ORM
- **Storage:** AWS S3-compatible cloud storage for production media

## Environment Variables
The application requires specific environment variables for development and production. 

### Backend (`backend/.env`)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - The port the API runs on (default 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Allowed CORS origin
- `STORAGE_PROVIDER` - `local` or `s3`
- `S3_ENDPOINT` - S3 provider endpoint
- `S3_REGION` - S3 region
- `S3_BUCKET` - S3 bucket name
- `S3_ACCESS_KEY_ID` - S3 access key
- `S3_SECRET_ACCESS_KEY` - S3 secret key
- `S3_PUBLIC_URL` - Base public URL for hosted media

### Frontend (`frontend/.env`)
- `VITE_API_URL` - URL of the backend API

*Note: Never commit real credentials or secrets to version control. Use `.env.example` as a template.*

## Local Development
1. Start PostgreSQL (e.g. via Docker) or use a cloud database.
2. Clone the repository and install dependencies in both `frontend` and `backend` directories.
3. Configure your `.env` files based on `.env.example`.
4. Run migrations: `cd backend && npx prisma migrate dev`
5. Start backend: `cd backend && npm run dev`
6. Start frontend: `cd frontend && npm run dev`

## Testing
The backend is thoroughly tested using Jest:
```bash
cd backend
npm test
```

## Production Build
To create an optimized production build for the frontend:
```bash
cd frontend
npm install
npm run build
```
The output will be generated in the `dist` folder.

For the backend:
```bash
cd backend
npm install --omit=dev
npm start
```
