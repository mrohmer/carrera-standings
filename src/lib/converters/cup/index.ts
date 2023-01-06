import type { Cup, Racers } from '$lib/models';
import { infoConverter } from './info.converter';
import { formatDate } from '$lib/utils/format-date';
import type { CupContent, CupContentPenalties } from '$lib/models/content/cup';
import { liveSessionIdConverter } from './live-session-id.converter';
import { cupResultToArr } from '$lib/utils/cup-results-to-arr';
import { mainRaceStartingOrderConverter } from './main-race-starting-order.converter';
import { orderConverter } from './order.converter';
import { pointsConverter } from './points.converter';

const convertPenalties = (penalties: CupContentPenalties | undefined): Record<string, number> =>
	(penalties ?? [])
		.filter((i) => i?.racer && i?.points)
		.reduce(
			(prev, curr) => ({
				...prev,
				[curr.racer]: curr.points
			}),
			{} as Record<string, number>
		);
export const cupConverter = (cup: CupContent, racers: Racers): Cup => {
	const rawPoints: Omit<Cup['points'], 'total'> = {
		mainRace: pointsConverter(
			cup.results?.mainRace,
			cup.participation ?? {},
			[10, 8, 6, 4, 2, 1],
			racers
		),
		timeTrial: pointsConverter(
			cup.results?.timeTrial,
			cup.participation ?? {},
			[6, 5, 4, 3, 2, 1],
			racers
		),
		fastestLap: (cup.results?.fastestLap
			? { [cup.results?.fastestLap as string]: 1 }
			: {}) as Record<string, number>,
		penalty: convertPenalties(cup.results?.penalties)
	};

	const total = Object.keys(racers).reduce(
		(prev, racer) => ({
			...prev,
			[racer]: Object.entries(rawPoints)
				.map(([key, points]) => (points[racer] ?? 0) * (key !== 'penalty' ? 1 : -1))
				.reduce((sum, points) => sum + points, 0)
		}),
		{}
	);

	const orderMainRace = orderConverter(rawPoints.mainRace);

	const pointsDone: Cup['pointsDone'] = {
		mainRace: !!cupResultToArr(cup.results?.mainRace ?? {}).filter(({ racer }) => !!racer).length,
		timeTrial: !!cupResultToArr(cup.results?.timeTrial ?? {}).filter(({ racer }) => !!racer).length,
		fastestLap: !!cup.results?.fastestLap
	};

	return {
		title: cup.title,
		slug: cup.slug,
		points: {
			...rawPoints,
			total
		},
		pointsDone,
		fastestLap: cup.results?.fastestLap,
		penalties: convertPenalties(cup.results?.penalties),
		order: orderMainRace,
		info: infoConverter(cup),
		date: formatDate(cup.date),
		liveSessionId: liveSessionIdConverter(cup),
		layout: cup.layout,
		startOrderForMainRace: mainRaceStartingOrderConverter(cup.results?.timeTrial, cup.participation)
	};
};
