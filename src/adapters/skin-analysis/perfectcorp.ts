import type {
  AnalyzeInput,
  SkinAnalysisProvider,
  SkinAnalysisResult,
} from "../../core/analysis";

/**
 * Perfect Corp (YouCam AI API) adapter — SERVER ONLY. Never import in client components.
 *
 * M0 task: fill in the real flow from https://yce.perfectcorp.com docs. Typical shape:
 *   1. Auth with API key (env: PERFECTCORP_API_KEY)
 *   2. Upload image / request file URL
 *   3. Run skin-analysis task, poll or await result
 *   4. Map vendor concern scores → our normalized 0–100 ConcernScore[]
 *
 * Record actual credit consumption per scan in estimatedCostPerScan() once measured.
 */
export class PerfectCorpProvider implements SkinAnalysisProvider {
  readonly name = "perfectcorp";

  constructor(private readonly apiKey = process.env.PERFECTCORP_API_KEY) {
    if (!this.apiKey) throw new Error("PERFECTCORP_API_KEY is not set");
  }

  async analyze(_input: AnalyzeInput): Promise<SkinAnalysisResult> {
    // TODO(M0): implement against YouCam AI API skin-analysis endpoint.
    throw new Error("Not implemented — see docs/ORCHESTRATION.md M0");
  }

  estimatedCostPerScan(): number {
    // TODO(M0): replace with measured API-unit consumption per scan.
    return NaN;
  }
}
