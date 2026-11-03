# Render deployment status - 3 November 2026

This branch (`resourceshare-render-static-fix`) is the original **frontend-only React/Vite prototype**. It builds to `dist`. It has no backend, database, authentication provider or `start` script. Deploy it as a **Render Static Site**, not a Node Web Service.

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Branch: `resourceshare-render-static-fix`
- Root directory: leave blank (repository root)
- SPA rule: Rewrite `/*` to `/index.html`
- Startup command: none; Static Sites do not run an application process.

The Blueprint is in [render.yaml](render.yaml). Changing this file does not convert an existing manually created Node Web Service. Create a new Static Site without deleting the failed service. See [exact dashboard steps and verification](docs/RENDER_DEPLOYMENT.md).

**Render publication remains pending account authorization.** No Render URL is claimed as deployed by this change. Exit 127 is consistent with a missing startup executable; the exact failed command cannot be confirmed without the actual Render startup log/settings.

## Which version should judges test?

| Version | Persistence and access | Use |
| --- | --- | --- |
| This Render static branch | Browser-local names and localStorage; no secure account roles | Original booking/FIFO/fairness prototype |
| `resourceshare-50-features-upgrade` | D1-backed state, server-side role checks, approvals, condition reports and owner-verified return | More complete end-to-end hackathon workflow |

The separately hosted upgraded workspace is https://resourceshare-upgrade-staging.electhill.chatgpt.site . Its existence is not evidence that Render has deployed. The upgraded Worker/D1 application cannot be deployed by publishing its `dist` folder as a Render Static Site.

[Full-stack feature status and limitations](https://github.com/roshnihia-cell/ResourceShare-Hackathon/blob/resourceshare-50-features-upgrade/docs/FEATURE_STATUS.md) and [judge guide](https://github.com/roshnihia-cell/ResourceShare-Hackathon/blob/resourceshare-50-features-upgrade/docs/JUDGE_GUIDE.md) are on their separate branch. No branches have been merged or force-pushed.

## Static demo instructions

1. Enter a fictional name, book Physics Laboratory and confirm.
2. Change to a second fictional name and join its FIFO waiting list.
3. Release or cancel the first booking. The next waiting participant is allocated automatically.
4. Inspect Bookings, Fairness Lab and Audit Trail; export JSON.
5. Refresh in the same browser to check local persistence. A private browser starts independent data.

These steps do not demonstrate login, owner authorization, time-slot scheduling or verified check-in/return. Those features are absent from this static branch. Do not describe this deployment as a production multi-user system.

## Disclosure

This is pre-existing ResourceShare code. ChatGPT/Codex assisted the earlier prototype and this deployment audit. This change retains all application files and commit history, and only adjusts the Render branch selection/publish path and documentation. Official build-window times and member contributions have not been supplied, so no all-work-created-within-48-hours claim is made.

---

The original README below is retained as historical project documentation. Its prior upload-status and submission-branch notes are superseded by the status above.

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
