# Run and deploy

## Local development

Use Node 22.13+ (tested with Node 24). This upgrade uses pnpm and pnpm-lock.yaml. Run pnpm install --frozen-lockfile, then pnpm test and pnpm build. The scripts supplied by the Sites starter select the execution profile. Keep the sites() Vite integration when hosting with Sites.

For a D1 preview, apply the generated SQL to the local DB using the command in the starter deployment instructions (included below), then start the supported preview. The local and hosted databases are separate. Schema changes go in db/schema.ts followed by pnpm db:generate; review the SQL and keep applied migrations immutable.

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_sweet_slipstream.sql
```

## Hosted staging

The new .openai/hosting.json identifies only the separate upgraded staging Site, with DB as its D1 binding. The earlier static deployment is not replaced. Sites owns authentication redirects and migration provisioning. Source must be pushed to the Site repository and the archive built from that exact commit before a saved version is deployed. The GitHub submission branch preserves its own parent history; it contains the same authored application source and documentation, but deployment provenance points to the matching Site source commit.

RESOURCE_ADMIN_EMAILS is a comma-separated server-only runtime allowlist. The authenticated Site owner's account has been configured as the initial administrator. Admins can then review institutional membership and grant owner roles. Configure additional administrators deliberately; never accept a client-selected production role. Local environment examples use placeholders only. Do not put secrets in VITE_* or NEXT_PUBLIC_* variables.

This server build is not the old static Netlify/Vercel deployment. Importing it as a static Vite site will not work. Rehosting requires compatible Workers/D1 and trusted identity integration, or an intentionally designed alternative backend. Old netlify.toml and vercel.json are preserved as legacy instructions only; do not use them for this branch.

## External setup still required

A supported Google authentication provider must be chosen/configured separately if Gmail OAuth is mandatory. Email events need a provider, verified sender and delivery tests. AI recommendations/summaries need explicit model integration and evaluation. Scheduled no-show and overdue checks need a trusted scheduled caller. Certificate file uploads need private object storage, content validation and review permissions. None is silently simulated.

## Troubleshooting

- HTTP 409: another mutation changed the workspace. Refresh and retry; do not force overwrite.
- Training required: submit lab-safety evidence and have an administrator verify it. Maya deliberately fails this check initially.
- Check-in blocked: verify the booking is approved, the correct borrower is selected and the start/end interval includes now.
- Wrong demo person after refresh: choose the intended fictional identity from the demo dropdown.
- No pending request after return: a queued interval may have expired, still conflict or fail eligibility. Inspect the queue and audit trail.
- Database unavailable: inspect migration application and DB binding, not browser localStorage.
- Missing production admin: sign in with the configured Site owner account and inspect RESOURCE_ADMIN_EMAILS server configuration.
- Offline draft: reopen the same condition form on the same device; reconnect and explicitly submit it. Draft storage does not reserve equipment.
- Missing fonts: system typography is the fallback; the workflow remains usable.
