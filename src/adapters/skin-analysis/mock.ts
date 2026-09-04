import type {
  AnalyzeInput,
  SkinAnalysisProvider,
  SkinAnalysisResult,
} from "../../core/analysis";

/** Deterministic fake for dev, demos, and tests. Zero API cost. */
export class MockProvider implements SkinAnalysisProvider {
  readonly name = "mock";

  async analyze(input: AnalyzeInput): Promise<SkinAnalysisResult> {
    // Deterministic per client so before/after views are stable in dev.
    const seed = [...input.clientId].reduce((a, c) => a + c.charCodeAt(0), 0);
    const s = (offset: number) => 40 + ((seed + offset * 13) % 55);

    return {
      provider: this.name,
      capturedAt: new Date().toISOString(),
      overallScore: s(0),
      skinType: "combination",
      estimatedSkinAge: 25 + (seed % 20),
      concerns: (
        ["moisture", "texture", "redness", "pores", "spots", "wrinkles"] as const
      ).map((concern, i) => ({ concern, score: s(i + 1) })),
      rawVendorPayload: { mock: true },
    };
  }

  estimatedCostPerScan(): number {
    return 0;
  }
}
