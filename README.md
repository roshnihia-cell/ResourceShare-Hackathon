# ResourceShare - institutional resource sharing

A server-backed campus platform for sharing underused equipment and spaces. Students request time slots, owners approve allocations, borrowers record before/after condition, and owners verify returns. Conflicts enter a transparent FIFO queue; compatible waiting requests are promoted for owner review after cancellation or verified return.

**Upgraded staging:** https://resourceshare-upgrade-staging.electhill.chatgpt.site

**Submission branch:** https://github.com/roshnihia-cell/ResourceShare-Hackathon/tree/resourceshare-50-features-upgrade

The existing static deployment is preserved. This branch starts from b689b07 on resourceshare-final-submission; neither existing branch has been overwritten or merged. The original working React prototype remains at /legacy, with its local browser booking, queue, fairness and audit behavior intact. Previous-origin localStorage records are not copied to the new origin.

## Test the actual workflow

Choose **Try the judge demo**. No password or real student data is needed. The fictional role dropdown is confined to one isolated D1 workspace. Follow [Judge guide](docs/JUDGE_GUIDE.md); choose a booking start within the current minute for an immediate check-in demonstration. The server validates pass time, borrower, qualification and ownership.

The public landing/demo does not require sign-in. The real campus workspace uses Sites-supported ChatGPT identity, a server-only initial admin allowlist and manual institutional membership review. Administrators can grant owner roles. Gmail OAuth is **not configured**.

## What is verified

Shared database persistence, date/time requests, owner approval, qualifications, server authorization, conflict prevention with revision compare-and-swap, FIFO promotion, condition reports, verified return and audit integrity. Automated tests include original prototype behavior and the upgraded lifecycle/security rules. A live HTTP test exercises real database writes, owner listing, stale revisions, queue promotion and complete return. See [test results](docs/TEST_RESULTS.md) for precise coverage and limitations.

**All 50 requested features are accounted for, not all completed.** [Feature report](docs/FEATURE_STATUS.md) separates implemented, partial, demonstration-only and planned features. No email delivery, Google OAuth, runtime AI API or scheduled job is claimed. Deposits are ledger records, the map is illustrative, translation is partial, and evidence submission uses references rather than file uploads.

## Stack and setup

React 19, Vinext/Vite, JavaScript domain rules, TypeScript route/UI, Cloudflare Workers and D1, Drizzle migrations, lucide-react and qrcode-generator. Node 22.13+ and pnpm are required.

```
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

The local database needs the migration in drizzle/ before the preview can perform writes. [Deployment and troubleshooting](docs/DEPLOYMENT.md) explains D1 setup and server identity. This is a Worker application, not a static Vite export; the old Netlify/Vercel configuration applies only to the legacy static prototype.

## Submission package

- [Project report PDF](docs/ResourceShare_Project_Report.pdf)
- [Judge guide](docs/JUDGE_GUIDE.md)
- [50-feature report](docs/FEATURE_STATUS.md)
- [Architecture and database](docs/ARCHITECTURE.md)
- [Architecture diagram](docs/architecture.svg)
- [Recording script](docs/DEMO_SCRIPT.md)
- [AI and existing-code disclosure](docs/DISCLOSURE.md)
- [Deployment and troubleshooting](docs/DEPLOYMENT.md)
- [Test results](docs/TEST_RESULTS.md)
- [Team details to confirm](docs/TEAM_DETAILS.md)
- [Submission answer draft](docs/SUBMISSION_ANSWERS.md)

The official build-window times and team contribution details have not been supplied. The pre-existing code is disclosed; no claim is made that all work was created during the official 48 hours. The Google Form has not been submitted. No hosted video link has been invented.

## Practical boundaries

D1 stores a versioned state document per workspace. The design makes booking and audit updates atomic but serializes writes and is intended for a small campus pilot. Production use needs normalized/paginated records, rate limits, demo cleanup and data retention, independent security/accessibility review and operator procedures. Hash linking can detect inconsistent event edits but does not prevent a privileged database operator from rewriting a whole chain. See the architecture document for more.
