# Submission answers - review before pasting

The official form URL supplied by the team is https://forms.gle/QTD1ZRuPX37Yef37A . Its exact fields could not be retrieved with the available search tool; these are adaptable answer blocks, not a claim that the form was inspected or submitted.

## Project title
ResourceShare - Fair Access to Underused Campus Resources

## Selected problem statement
Unlock Underused Equipment and Spaces.

## One-line description
A trusted campus platform that helps students discover, request and responsibly return underused spaces and equipment, with owner approval and transparent FIFO waiting lists.

## Problem and target users
Colleges own laboratories, cameras, computers and rooms that can sit unused while students struggle to access them. ResourceShare brings student borrowers, resource owners and campus administrators into one traceable borrowing workflow.

## Solution and workflow
Owners list resources and safety requirements. Verified students request time slots and accept a borrowing agreement. The server checks qualification, usage limits and scheduling conflicts. Owners approve or reject with reasons. Conflicts enter a FIFO queue. Borrowers check in with a time-limited pass and record condition before/after use. Owners verify return, after which compatible waiting requests are promoted for review. Administrators review incidents, training evidence, policies, allocation distribution and hash-linked audit history.

## Innovation and fairness
Availability and lifecycle records use a shared D1 database, not browser-only coordination. Atomic revision checks reject stale concurrent updates. Transparent queue order and configurable limits support explainable access; Jain's allocation-count index helps inspect distribution without claiming to measure individual need. Condition snapshots and independent return review make responsibility traceable.

## Technology
React, Vinext/Vite, Cloudflare Workers, D1 SQLite, Drizzle migrations, lucide-react, qrcode-generator and Node automated tests. Platform-supported ChatGPT identity; Gmail OAuth not configured.

## Live website
https://resourceshare-upgrade-staging.electhill.chatgpt.site
Use Try the judge demo for an isolated fictional workspace. No passwords are needed.

## GitHub branch
https://github.com/roshnihia-cell/ResourceShare-Hackathon/tree/resourceshare-50-features-upgrade

## Documentation
Use the included ResourceShare_Project_Report.pdf and the judge guide, feature report and architecture documents on the same branch. Confirm artifact links in the final handoff before pasting them into fields requiring URLs.

## Test evidence
18 passing automated tests, a successful server production build and a passed live HTTP workflow test including persistence, authorization, owner listing, stale-update rejection, FIFO promotion, check-in/check-out, verified return and audit verification. See TEST_RESULTS.md for exclusions.

## AI, prior work and limitations
This project extends a pre-existing ResourceShare prototype. ChatGPT/Codex assisted code, design, tests, documentation and deployment. The Sites React/Vinext starter and open-source libraries are disclosed. Official build-window dates remain unconfirmed. No claim is made that all development occurred in 48 hours. Google OAuth, email delivery, runtime AI recommendations/summaries and scheduled reminders are not connected; several advanced features are partial or demonstration-only. Full 50-feature status is supplied.

## Video
No hosted recording available. Use DEMO_SCRIPT.md to record a truthful demonstration and insert the team's reviewed video URL.

## Team details
[PENDING: team name, leader, members, institution, contact email, contributions and official build-window times.]

## Future scope
Configure supported Google OAuth and email, private evidence uploads and scheduled operations; normalize/paginate storage; add rate limits/retention and independent security/accessibility review; integrate campus membership and actual location data; evaluate demand forecasting and human-reviewed AI summaries with representative data.

Do not submit until the team confirms these details and reviews the final form.
