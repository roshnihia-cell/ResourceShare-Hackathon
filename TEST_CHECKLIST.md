# ResourceShare validation

Automated: `npm test` checks booking/rebooking validation, whitespace-normalized duplicate queue entries, owner queue rejection, FIFO release, FIFO cancellation, queue withdrawal, audit preservation, and Jain index values.

Browser QA completed against local preview:
- Dashboard renders the black/cobalt/lime theme.
- Confirmed Sanjana booking and reference receipt.
- Roshan joins at #1; Diya joins at #2.
- Release assigns Roshan and moves Diya to #1.
- Refresh preserves records.
- Fairness Lab shows 0.667 for allocation counts [1,1,0].

Deployment QA: open the public production URL and exercise a new booking; verify without a login wall.

Responsive layouts use breakpoints at 1150px and 760px. A physical mobile-device test has not been performed.

Planned features are documented in README and not shown as functioning integrations.
