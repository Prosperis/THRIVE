# Proposal: Embed Resumier as the Documents microfrontend

## Summary
Replace the existing Documents page in THRIVE with the Resumier microfrontend so the documents workflow is powered by the Prosperis Resumier app. The microfrontend will run standalone for demos while also being embedded into THRIVE for production usage.

## Goals
- Swap the `/documents` route in THRIVE to host the Resumier microfrontend.
- Support a standalone Resumier deployment that can also be embedded as an iframe/microfrontend.
- Keep the integration configurable via environment variables for local and production environments.

## Non-goals
- Rewriting THRIVE document data stores or migrations in this PR.
- Designing cross-app data synchronization (handled in the Resumier microfrontend backlog).

## Proposed Integration Approach
1. **Microfrontend Embed**
   - Expose Resumier as an embeddable experience (microfrontend build or hosted app).
   - THRIVE loads Resumier via an iframe (or later via module federation) so the Documents page fully delegates to Resumier.

2. **Configuration**
   - Add a `VITE_RESUMIER_URL` environment variable in THRIVE to point to the Resumier deployment.
   - Local development can point to `http://localhost:<port>` when running Resumier standalone.

3. **Progressive Enhancement**
   - Short term: iframe-based embed for quick validation.
   - Medium term: switch to a first-class microfrontend (module federation or web component) once Resumier publishes a stable remote entry.

## Open Questions / Follow-ups
- What is the canonical deployment URL for Resumier in each environment (dev/staging/prod)?
- Does Resumier need SSO or token handoff from THRIVE for access control?
- Should THRIVE retain a fallback Documents view in case Resumier is unreachable?

## Rollout Plan
1. Merge the embed-only integration in THRIVE.
2. Deploy Resumier standalone and confirm embedding works in THRIVE.
3. Iterate on shared auth/session and data contract if needed.

## Acceptance Criteria
- Navigating to `/documents` shows the Resumier microfrontend.
- The embed URL is configurable via `VITE_RESUMIER_URL`.
- THRIVE builds without requiring the old Documents page implementation.
