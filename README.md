# MedEase
MedEase — Healthcare Appointment Booking UI is a responsive prototype for discovering doctors and scheduling appointments via a guided multi-step experience. The project includes a listing page and a bespoke booking flow plus a companion admin dashboard.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open https://localhost:3000 to view the experience, which exposes `/doctors`, `/booking`, and the admin panel under `/admin`.

## Backend

The backend lives in `backend/` and provides:

- `/api/doctors` and `/api/doctors/:id/slots` for live listings and availability
- `/api/appointments` for booking submissions
- `/api/admin/*` for managing doctors, availability, and appointment statuses

## Learn More

- https://nextjs.org/docs
- https://nextjs.org/docs/app/building-your-application/deploying
- https://playwright.dev/ (E2E tests via `npm run test:e2e`)
- https://vitest.dev/ (`npm run test`)

## Deploy on Vercel

Deploy with the Vercel Platform: https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme
