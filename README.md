# GlowDesk (working title)

White-label consultation platform for makeup artists, skincare specialists, and beauty therapists.
AI skin analysis (Perfect Corp / YouCam API) is the **hook**; the **product** is the client
workflow: consult → record → recommend → rebook.

## Why this exists

- Perfect Corp sells the scanner directly to practitioners (Skincare Pro). We do NOT compete on
  analysis quality — we win on everything around it: client history, before/after tracking,
  product recommendations with retail margin, rebooking, and consent-compliant record keeping.
- Perfect Corp's YouCam API "Project Management" (June 2026) supports per-client API keys and
  pooled bulk units — designed for exactly this agency/white-label deployment model.

## Golden rule

**The analysis vendor is swappable.** All Perfect Corp calls go through `src/adapters/skin-analysis/`.
Nothing outside the adapter may import vendor SDKs or know vendor response shapes.

## Repo layout

```
docs/            Specs — read ORCHESTRATION.md first
src/adapters/    Vendor integrations (Perfect Corp, payments, comms)
src/core/        Domain types + business logic (vendor-agnostic)
supabase/        Schema + RLS policies (multi-tenant from day one)
```

## Getting started

1. Read `docs/ORCHESTRATION.md` — it defines how work is sequenced and what "done" means per milestone.
2. Milestone 0 is a **validation spike**, not product code. Do not skip it.
3. Copy `.env.example` → `.env.local`, fill in your YouCam API key (free trial credits available
   at yce.perfectcorp.com).
