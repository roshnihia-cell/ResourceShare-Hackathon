# AI and pre-existing-code disclosure

ResourceShare already existed before this upgrade. The baseline is commit b689b07a852aac10056181bc30fbe5adccc39370 on resourceshare-final-submission. The other branch has unrelated Git history but identical application source and package versions. Existing booking, FIFO queue, Jain metric and audit code, original tests and CSS are retained in legacy/ and /legacy. The README from that baseline identifies prior ChatGPT assistance and an earlier hosted prototype.

The new upgrade was produced with OpenAI ChatGPT/Codex assistance for architecture, backend rules, interface implementation, tests, documentation and deployment. The runtime scaffold is the supplied Sites React/Vinext starter. No development timestamps were rewritten, no earlier commits were fabricated, and no existing branch was merged or force-pushed.

Third-party components include React, Vinext/Vite, Cloudflare Workers and D1, Drizzle ORM, lucide-react, qrcode-generator and the starter's dependency tree. The lockfile is authoritative. Existing unused starter UI libraries remain dependencies. Typography requests DM Sans and Manrope from Google Fonts with local system fallbacks. Resource illustrations and the illustrative campus map are CSS and icon compositions. All demo identities, emails, resource locations and records are fictional; example.edu addresses are placeholders, not delivered mail.

There is no runtime generative-AI recommendation or summary service. Project kit suggestions use fixed transparent rules. No email or payment provider is connected. Authentication uses Sites platform sign-in, not independently configured Google OAuth.

## Build-window disclosure requiring the team's input

Official hackathon start/end times and timezone have not been supplied. Therefore no assertion is made that either the baseline or this upgrade falls within the official 48-hour period. Preserve the repository's real commit dates and have the organizers assess eligibility under their rules. The team must identify work done before, during and after the official window and confirm its actual contributions before submission.

Do not submit the project as wholly new during the build window without that disclosure. AI assistance does not establish originality or rules compliance.
