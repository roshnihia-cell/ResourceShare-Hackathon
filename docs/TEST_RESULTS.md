# Verification record

Date: 1 November 2026 (India). No results are inferred from UI labels alone.

## Baseline

Both branches have the same src tree and package versions, despite unrelated Git history. resourceshare-final-submission adds clearer documentation/upload helpers. Its original 4 Node tests and Vite production build passed before upgrading. The full baseline is preserved in Git history and the operational prototype is retained at /legacy.

## Automated domain tests

18 tests pass using Node's built-in test runner, including 4 preserved baseline tests. Upgraded tests cover: complete request-to-return lifecycle; FIFO promotion; overlapping allocation rejection; eligibility, agreement, role and ownership checks; invalid time and usage limits; token/time validation; training and institutional review; incident/dispute handling; deposit/refund and feedback lifecycle; accepted-policy snapshots and admin-only owner assignment; audit edit detection and student-view filtering; SQLite stale-writer compare-and-swap; on-demand no-show release; extension conflict rejection.

The SQLite concurrency test uses the actual SQLite engine and the same conditional UPDATE shape. It demonstrates stale revision rejection, not a high-load distributed performance benchmark.

## Deployed HTTP integration

scripts/test-api.mjs passed against the actual public upgraded staging origin. It created a separate fictional demo workspace and exercised persistence after GET, owner resource listing, student authorization rejection, stale revision HTTP 409, an overlapping FIFO request, check-in with correct pass, checkout condition, owner-verified return, queue promotion, complete hash-chain verification and demo exit. It did not modify the real campus workspace or old deployment. The initial local terminal HTTP transport failed; the same test succeeded against the deployed URL.

## Browser QA

The local preview was inspected with the browser. Booking request, owner approval, before-use condition, checkout report and owner return verification were exercised through the UI. A local HTTP Secure-cookie mismatch was observed and fixed with a named-preview-host exception; production HTTPS cookies retain Secure, HttpOnly and SameSite=Strict. Original and new builds pass. Additional final browser checks are recorded in the release notes when completed.

## Limits

Google login/logout and email verification/delivery cannot be tested because the integrations are not configured. ChatGPT sign-in is supplied by the platform; interactive sign-in/logout and real multi-account institutional onboarding require account-holder validation. No physical-camera QR test, real payment, binary certificate upload, external emergency dispatch, runtime AI call, recurring job, formal accessibility audit, load test or physical-mobile-device test is claimed. Responsive CSS and keyboard controls do not constitute certification. Offline reports store draft text locally and require explicit submission after reconnection.
