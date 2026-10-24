# DEV@Deakin Newsletter — SIT313 Task P5

Newsletter sign-up project built from the Task P2 Express + SendGrid project and upgraded to use a React frontend.

## Requirements
- Node.js 18 or newer
- A SendGrid account with a verified sender identity

## Setup
1. Open this project folder in Terminal.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`.
4. Add your own `SENDGRID_API_KEY` and verified `SENDER_EMAIL` to `.env`. Never commit `.env`.
5. Start the development servers: `npm run dev`
6. Open the Vite address printed in Terminal (normally `http://localhost:5173`).

The React app sends a POST request to `/api/subscribe`; Vite proxies it to Express on port 3000. For production, run `npm run build` and then `npm start`; Express serves the compiled React app from `dist`.

## API
- `GET /api/health` — health check; returns HTTP 200.
- `POST /api/subscribe` — expects JSON such as `{"email":"you@example.com"}`.
  - `400 Bad Request`: missing or invalid email.
  - `200 OK`: SendGrid accepted the email request (the SendGrid Mail Send API normally returns `202 Accepted`, which is logged separately).
  - `500 Internal Server Error`: missing configuration or sending failure.

## Before submitting
- Test an invalid email and confirm the frontend shows a helpful message.
- Test a valid email with a verified sender and confirm a welcome email arrives.
- In Terminal, capture `SendGrid API status: 202` (or the actual successful 2xx status returned by SendGrid). The backend's own response to the frontend is HTTP 200.
- Create the GitLab project named `Task P5`, set visibility to Internal, and push all source files except `node_modules`, `dist`, and `.env`.
