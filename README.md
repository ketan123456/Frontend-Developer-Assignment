# CareAxis Control Center

A React + TypeScript healthcare SaaS frontend built for the assignment brief. The app includes:

- Firebase email/password authentication with validation, error handling, and session persistence
- Protected dashboard, analytics, and patient detail routes
- Zustand-managed state for auth, patient view preferences, and notification history
- A responsive patient module with grid/list toggles
- A service worker notification flow with a working local notification use case

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Firebase setup

Populate the `VITE_FIREBASE_*` values in `.env` to enable real Firebase Authentication.

Without Firebase config, the app falls back to a demo auth mode so the rest of the assignment can still be reviewed:

- Email: `demo@careaxis.health`
- Password: `Health123!`

## Notification use case

Open the dashboard and use the `Dispatch care alert` action. The app will request permission and then trigger a service-worker-backed local notification for an urgent patient handoff.
