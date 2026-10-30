# ResourceShare — Fair Resource Allocation Prototype

A campus resource-booking demo with a midnight black (#0B0B0F), electric cobalt (#1255FF), and acid lime (#D7FF3F) dashboard.

Live demo: https://resourceshare-sanjana-hackathon.electhill.chatgpt.site
Target GitHub repository: https://github.com/roshnihia-cell/ResourceShare-Hackathon

Collaborator account: **Sanjana1513**. Submission branch: **resourceshare-updated-hackathon**. Repository upload is not yet verified. See [Windows upload steps](UPLOAD_WINDOWS.md).

## Implemented

- Responsive dashboard, resource cards, icons, search and category filtering.
- Immediate booking with confirmation dialog and a saved reference receipt.
- Active reservations, release, cancellation and completed/cancelled history.
- FIFO waiting list, numbered positions, queue withdrawal, duplicate-name prevention.
- Automatic assignment to the next waiting participant on release or cancellation.
- Jain's fairness index and per-participant allocation distribution.
- Audit records for bookings, cancellation, release, queue changes and automatic allocation; JSON export.
- Browser persistence using the original resourceshare-v1 key, with a visible storage-error warning.
- Confirmation prompts for deleting a resource, cancelling/releasing bookings, withdrawing from a queue, and resetting demo data.

## Setup

Use Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

## Verification and production

```bash
npm test
npm run build
npm run preview
```

The Node test suite checks booking validation, duplicate protection, FIFO allocation, cancellation, queue withdrawal, audit preservation, and the fairness formula. The production output is `dist`.

## Deploy on Vercel or Netlify

Import the repository. Select Vite, build command `npm run build`, and output/publish directory `dist`. No environment variables are needed. `netlify.toml` and `vercel.json` supply equivalent settings. The `.openai/hosting.json` manifest belongs to the current Sites deployment and is not required by Vercel/Netlify.

Never commit node_modules, dist, .env, .env.local, API keys, private keys, logs, or credentials. Keep the package lockfile for reproducible installs. Preserve unrelated repository content and review changes on a new branch before merging.

## Two-minute demo

1. Enter **Sanjana** in the name field. Open Resources, book Physics Laboratory and confirm.
2. Change the name to **Roshan** and join the Physics Laboratory queue.
3. Change the name to **Diya** and join. Roshan is #1, Diya is #2.
4. Release the resource and accept the confirmation. Roshan is automatically assigned; Diya becomes #1.
5. Open Bookings to view the receipt or cancel Roshan's reservation. Diya is automatically assigned.
6. Open Fairness Lab and Audit Trail; export the history as JSON.

## Demonstration boundaries

This is a **working browser-local prototype**, not a production multi-user booking service. Records are saved independently in each browser/device. Existing data from this browser's earlier version is retained on the same origin. No backend, authentication, role enforcement, cross-tab transaction locking or shared database exists. Names are demo identities; any demo participant can release/cancel a booking. Receipt IDs are not secure admission credentials. Audit records can be edited or cleared through browser tools. Storage failure is reported; session-only records should be exported before closing.

Fairness uses historical allocation counts (including cancelled allocations) and participants in current queues. An index of 1 when there are no allocations is a display convention, not proof of fairness. FIFO does not account for duration, need or eligibility. Availability is immediate or after manual release; no unreliable time estimate is shown.

## Planned — not simulated

Rule-based quick help (not a real AI integration), QR booking receipts, calendar reminders, notifications, backend persistence, role permissions, and secure provider-based email OTP are not implemented. There is no email/SMS delivery, scheduled background reminder, or AI API connection. Face verification remains a future possibility only after a secure, privacy-conscious biometric design and explicit consent.

## AI assistance

This project was developed with assistance from OpenAI ChatGPT for React components, design, documentation, tests and deployment. Review this disclosure to match your team's actual process and hackathon requirements.

## Technologies and backend status

React 18, Vite 6, JavaScript, CSS, lucide-react icons, and Node's built-in test runner. This package has no backend server, API routes, database schema, or authentication provider. No `.env` file, secrets, paid service, or external API is required to run or deploy the current demo. Do not add fake API keys. For a future shared backend, use server-side authorization and transactional allocation; never put service-role credentials into a Vite frontend (`VITE_*` values are public).

## Final package review

The uploaded ZIP is the same application source as live version 2. This final package preserves that application code and adds clearer deployment/submission documentation, stricter ignore rules, and a Windows upload helper. Tests and a clean `npm ci` production build were rerun for the final package. No new optional integrations were added.

The Windows helper uses a fresh clone, checks that the requested branch is new, copies only project files, preserves unrelated repository files, runs tests/build, asks before push, and verifies the pushed commit. It never merges or force-pushes. It requires Git for Windows and Node.js 22+. The GitHub account used to authenticate must be Sanjana1513 with accepted collaborator access. Do not confuse commit name/email with the account used for authentication.
