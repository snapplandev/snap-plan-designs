# QA Runbook (Pre-Stripe)

## Purpose
Validate core client and admin project lifecycle behavior before Stripe is enabled.

## Local Test Environment Variables
Add these in your local `.env.local` only (do not commit secrets):

```bash
TEST_EMAIL=
TEST_PASSWORD=
ADMIN_TEST_EMAIL=
ADMIN_TEST_PASSWORD=
```

## Consistent Test Dataset Approach
1. Use dedicated test accounts only (one client + one admin).
2. Name all test projects with `E2E_SMOKE_YYYYMMDDHHMMSS` or `QA_MANUAL_YYYYMMDDHHMMSS`.
3. Never reuse real customer data.
4. For repeatability, keep one active smoke project and one active manual QA project per day.

## Manual QA Script
1. Client signup/login:
   - If account does not exist, sign up at `/signup`.
   - Log in at `/login`.
2. Client create project:
   - Open `/app`.
   - Click `New Project`.
   - Enter a unique project title (`QA_MANUAL_...`), fill required `Goals`, and submit intake.
3. Client verify project workspace:
   - Confirm redirect to `/app/projects/{id}`.
   - Confirm status reads `Submitted`.
4. Client collaboration actions:
   - Send one message in the `Messages` tab.
   - Add one revision request in the `Revisions` tab.
5. Admin queue and operations:
   - Log in as admin and open `/admin`.
   - Confirm project appears in queue.
   - Open `/admin/projects/{id}`.
   - Update status: `In Review` -> `In Progress` -> `Delivered`.
   - Post one admin reply message.
   - Mark the revision request `Resolved`.
   - Add deliverable metadata using upload control (metadata row only; storage upload is not wired yet).
6. Client verify admin changes:
   - Return to client session and open `/app/projects/{id}`.
   - Confirm updated status is visible.
   - Confirm admin message is visible.
   - Confirm revision status reflects resolved state.
   - Confirm deliverable metadata row appears in deliverables section.
7. RLS checks:
   - As client A, manually navigate to `/app/projects/{projectId_belonging_to_client_B}`.
   - Expect not-found/forbidden behavior (no cross-user project data exposure).
   - As non-admin user, navigate to `/admin`.
   - Expect redirect away from admin area (middleware/admin role gating).
