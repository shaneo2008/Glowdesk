/**
 * Vendor-agnostic skin analysis contract.
 * NOTHING outside src/adapters/ may know about Perfect Corp response shapes.
 */

export type SkinConcern =
  | "moisture"
  | "spots"
  | "wrinkles"
  | "dark_circles"
  | "oiliness"
  | "texture"
  | "redness"
  | "acne"
  | "eye_bags"
  | "firmness"
  | "radiance"
  | "pores";

export interface ConcernScore {
  concern: SkinConcern;
  /** Normalized 0–100, higher = better condition. Adapters map vendor scales to this. */
  score: number;
  /** Storage path to vendor-provided problem-area overlay image, if any. */
  overlayImagePath?: string;
}

export interface SkinAnalysisResult {
  provider: string; // e.g. "perfectcorp"
  capturedAt: string; // ISO 8601
  overallScore: number; // 0–100
  skinType?: string; // adapter-normalized, e.g. "combination"
  estimatedSkinAge?: number;
  concerns: ConcernScore[];
  /** Raw vendor payload, stored for audit/debug only. Never read by app code. */
  rawVendorPayload: unknown;
}

export interface AnalyzeInput {
  /** JPEG/PNG bytes of a single well-lit frontal face image. */
  image: Uint8Array;
  tenantId: string;
  clientId: string;
  /** Must reference a valid consent record — enforce before calling any provider. */
  consentRecordId: string;
}

export interface SkinAnalysisProvider {
  readonly name: string;
  analyze(input: AnalyzeInput): Promise<SkinAnalysisResult>;
  /** Approximate cost in your billing units, for COGS tracking (M0 gate). */
  estimatedCostPerScan(): number;
}
