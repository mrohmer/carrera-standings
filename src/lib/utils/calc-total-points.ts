import type { Cup } from '../models';
import type { Racers } from '../models';

export const calcTotalPoints = (
	cups: Pick<Cup, 'points'>[],
	racers: Racers
): Record<string, number> =>
	cups.reduce(
		(prev, cup) =>
			Object.keys(racers).reduce(
				(points, racer) => ({
					...points,
					[racer]: (prev[racer] ?? 0) + (cup.points.total[racer] ?? 0)
				}),
				{}
			),
		{} as Record<string, number>
	);
