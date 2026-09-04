# ARCHITECTURE.md

## Stack (opinionated defaults — change in DECISIONS.md if you disagree)

- **Next.js 15 (App Router) + TypeScript** — one deployable, PWA-capable so practitioners use
  it on a phone/tablet without app-store friction. Native app is a later decision, not a day-1 one.
- **Supabase** — Postgres + Auth + Storage + RLS. Multi-tenancy via `tenant_id` on every table
  with row-level security. Face images in Storage with per-tenant buckets/paths.
- **Stripe** — practitioner subscriptions.
- **Perfect Corp YouCam API** — server-side calls only. API key never reaches the browser.
  Use their JS Camera Kit client-side for capture quality only if M0 shows plain
  getUserMedia capture is insufficient.

## Tenancy model

tenant (practitioner business) → users (practitioner, later: staff) → clients → consultations
→ scans / recommendations / bookings. White-labelling = tenant-level branding config rendered
into the client-facing surfaces. One codebase, one deployment.

## Vendor abstraction (the important bit)

```
src/core/analysis.ts        — SkinAnalysisProvider interface + normalized domain types
src/adapters/skin-analysis/
  perfectcorp.ts            — real implementation (server-only)
  mock.ts                   — deterministic fake for dev/tests
```

Normalized result shape is OURS (concern scores 0–100, skin type enum, overlay image refs).
Vendor response parsing lives only in the adapter. This protects against: price hikes,
Perfect Corp competing harder with Skincare Pro, or a better/cheaper model appearing.

## Compliance (non-negotiable, build in M1)

Face scans are biometric data.
- Explicit, per-client, versioned consent record BEFORE first scan (who, when, consent text version).
- Right to erasure: single action deletes a client's images + derived analysis data.
- Data residency: keep Supabase region close to your market (EU region if UK/EU practitioners).
- Retention policy field per tenant; default auto-delete raw images after N months, keep scores.
- Check Perfect Corp's DPA + their image retention behaviour during M0 — record findings.
- Positioning guardrail: this is cosmetic analysis, NOT medical diagnosis. Copy must never
  claim to detect/diagnose conditions.

## What we deliberately do NOT build early

- Native iOS/Android apps, staff roles/permissions, marketplace of products, inventory,
  payments from end-clients, multi-language. All post-pilot.
