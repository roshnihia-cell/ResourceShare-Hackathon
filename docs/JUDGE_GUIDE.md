# ResourceShare judge testing guide

Open the upgraded staging website and choose **Try the judge demo**. No passwords, real student records, emails or payments are required. Every new demo creates its own D1-backed workspace. The role dropdown changes fictional identities only inside that workspace. It does not grant production roles.

## Complete lifecycle (about 4 minutes)

1. Use **Asha Raman - student**. Open Resource directory and search Physics. Asha has verified lab-safety training. Read the safety guide.
2. Request Physics Laboratory. Choose a start within the current minute (or wait until the selected start time) and an end about one hour later. Describe your project and accept the agreement. Save. A future start prevents premature check-in, by design.
3. Switch to **Dr. Meera - owner**. In Booking management, inspect the request and approve it. Deposit records are bookkeeping only; no payment is taken.
4. Switch to **Kavin Kumar - student**. Request the same resource for an overlapping interval. Verify that it becomes a waiting request and that your queue position appears. Do not use a start time in the past.
5. Switch back to Asha. Open My bookings. Check in during the approved time, leaving the populated access token in place, and record the before-use condition. The Access pass dialog also produces a QR deep link.
6. Choose Check out & return. Record the after-use condition. Status becomes return pending; the item has not yet been released.
7. Switch to Dr. Meera. Verify return and write an inspection note. Status becomes completed. Kavin's compatible waiting request becomes requested, awaiting owner approval. This preserves human oversight.
8. Switch to **Campus Admin**. Inspect Audit trail and its full hash-chain verification. Open Fairness & insights. Export audit JSON. Download the booking PDF receipt.

## Negative checks

- Maya has no lab-safety training: laboratory requests are rejected until an administrator reviews her evidence.
- Students cannot list resources, approve bookings, set policy, verify evidence or cancel another person's reservation. Authorization runs on the server.
- The server rejects overlapping allocations and stale revisions. On a conflict, refresh and retry using the new availability.
- Rejection requires a reason. Checked-in equipment cannot be cancelled to bypass return inspection.
- An extension cannot overlap another live request. A refund record requires collection and completed return.
- Use the administrator to inspect an incident and record its resolution. Urgent reports produce in-app notices only.

## Persistence and safe exit

Refresh the page after an operation; the same demo cookie returns the same D1 data. Exit closes access from this browser; it does not delete the database history. A new demo starts independently. A demo pass scanned in another browser does not authenticate that browser or transfer the demo cookie.

## Integration boundaries

Google sign-in, email delivery, uploaded certificate files, AI model calls and scheduled reminders are not configured. ChatGPT authentication uses the hosting platform; real student membership needs administrator approval. The demo is the reliable judge entry point. See FEATURE_STATUS.md for all 50 requested features.
