# ORCHESTRATION.md — build plan & working agreement

This file is the source of truth for sequencing. Each milestone has an exit gate.
Do not start a milestone until the previous gate passes.

---

## M0 — Validation spike (1–2 weeks, throwaway code allowed)

Goal: prove the risky assumptions before building product.

Tasks:
1. Sign up at yce.perfectcorp.com, get API key + free credits.
2. Build a single-page throwaway app: upload/capture selfie → call Skin Analysis API →
   render concern scores + overlay images. Measure latency, cost per scan, quality on
   varied skin tones and phone-camera lighting.
3. Price check: record actual unit consumption per scan → derive real COGS per consultation.
4. Talk to 5+ working MUAs/therapists. Show them the demo. Ask what they'd pay monthly and
   what they currently use for client records (spoiler: usually Instagram DMs + paper).

Exit gate:
- [ ] Cost per scan known and < 10% of target monthly price at expected usage
- [ ] Analysis quality acceptable across Fitzpatrick I–VI in normal salon lighting
- [ ] ≥3 practitioners say they'd pay ≥ £25/mo for scanner + client records
- [ ] Decision recorded in docs/DECISIONS.md: proceed / pivot / kill

## M1 — Core domain, no vendor (2–3 weeks)

Goal: multi-tenant skeleton with auth, tenants (practitioner businesses), clients, consultations.

- Supabase schema per `supabase/schema.sql` with RLS enforced per tenant
- Auth: practitioner signup/login, tenant creation, branding fields (logo, colours) — this IS
  the white-label layer
- Client CRUD + consultation records (notes, photos, products used)
- Consent capture flow (see ARCHITECTURE.md §Compliance) — blocking requirement before any
  face image is stored

Exit gate: two test tenants cannot see each other's data (write an RLS test proving it).

## M2 — Analysis integration behind adapter (2 weeks)

- Implement `SkinAnalysisProvider` interface (src/core/analysis.ts) with `PerfectCorpProvider`
- Scan flow: consent check → capture → analyze → persist normalized result to consultation
- Before/after comparison view across a client's consultation history

Exit gate: swapping in the included `MockProvider` requires zero changes outside adapters/.

## M3 — Money & retention loop (2–3 weeks)

- Product recommendation records per consultation (practitioner picks from their own product list)
- Rebooking: suggested follow-up date + calendar hold + reminder (email first, SMS later)
- Stripe subscription for practitioners (single tier to start)

Exit gate: one real practitioner completes consult → recommend → rebook on their own device.

## M4 — White-label polish & pilot (ongoing)

- Client-facing shareable report (branded PDF/link) — this is the practitioner's marketing asset
- Onboard 5–10 pilot practitioners, instrument usage, iterate

---

## Working agreement

- Claude orchestrates: writes/updates specs, reviews diffs against exit gates, breaks milestones
  into PR-sized tasks on request.
- Human implements: owns the IDE, makes final calls, records deviations in docs/DECISIONS.md.
- Any vendor lock-in creep (Perfect Corp types leaking outside adapters/) is a blocking review comment.
