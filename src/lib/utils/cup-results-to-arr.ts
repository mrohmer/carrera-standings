import type { CupContentPositionResult, CupContentResult } from '../models/content/cup';

export const cupResultToArr = (results: CupContentPositionResult): CupContentResult[] =>
	Object.entries(results ?? {})
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, data]) => data);
