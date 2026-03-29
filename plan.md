# MedEase Delivery Plan

## Summary
- Build a greenfield Next.js App Router web app for doctor discovery and appointment booking.
- Implement the SRS behavior exactly and use Figma as the final visual source of truth when layouts differ.
- Keep the prototype demo-focused: no auth, no real payments, no appointment persistence beyond the in-app flow.

## Build Order
1. Scaffold the app, shared types, Firebase wiring, seed data, and deployment config.
2. Implement the doctors listing route with combined client-side filters and loading fallback.
3. Implement the booking wizard with preserved state, validations, payment selection, and success animation.
4. Align the final UI with provided Figma screens without breaking SRS interactions.
5. Add automated unit, integration, and Playwright acceptance coverage and run the full quality gate.

## Quality Gate
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e`

## Acceptance Focus
- Search, city, and specialty filters work together.
- Booking flow blocks invalid progression and preserves user-entered data.
- Success overlay appears after confirmation and returns the user to `/doctors`.
- Mobile layout has no critical overflow and primary flows remain keyboard accessible.
