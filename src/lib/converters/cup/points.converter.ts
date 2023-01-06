import type { CupContentParticipation, CupContentPositionResult } from '$lib/models/content/cup';
import { cupResultToArr } from '$lib/utils/cup-results-to-arr';
import type { Racers } from '$lib/models';

export const pointsConverter = (
	results: CupContentPositionResult,
	participation: CupContentParticipation,
	points: number[],
	racers: Racers
): Record<string, number> => {
	const resultsArr = cupResultToArr(results);
	return (
		Object.keys(racers)
			.map((racer) => {
				let p = 0;

				if (participation.includes(racer)) {
					const notParticipatingDriverCount = Object.keys(racers).filter((i) =>
						participation.includes(i)
					).length;
					const sharedPoints = [...points]
						.reverse()
						.filter((_, i) => i < notParticipatingDriverCount)
						.reduce((prev, curr) => prev + curr, 0);

					p = sharedPoints / notParticipatingDriverCount;
				} else {
					const index = resultsArr.findIndex((result) => result.racer === racer);
					if (index >= 0) {
						p = points[index];
					}
				}
				return { racer, points: p };
			})
			.reduce(
				(prev, { racer, points }) => ({
					...prev,
					[racer]: points
				}),
				{}
			) ?? {}
	);
};
