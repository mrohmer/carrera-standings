import type { CupContentParticipation, CupContentPositionResult } from '../../models/content/cup';
import { cupResultToArr } from '../../utils/cup-results-to-arr';

const getMainRaceStartingOrder = (
	results: CupContentPositionResult,
	participation: CupContentParticipation
): Record<string, number> => {
	return cupResultToArr(results)
		?.filter(
			({ racer, raceStats }) =>
				!!participation[racer] && !!raceStats?.rounds && !!raceStats?.fastestLapTime
		)
		.map(({ raceStats, ...result }) => ({
			...result,
			raceStats: {
				rounds: raceStats?.rounds ?? 0,
				fastestLapTime: raceStats?.fastestLapTime ?? 0
			}
		}))
		.sort((a, b) => {
			if (a.raceStats.rounds === b.raceStats.rounds) {
				return a.raceStats.fastestLapTime > b.raceStats.fastestLapTime ? 1 : -1;
			}
			return a.raceStats.rounds < b.raceStats.rounds ? 1 : -1;
		})
		.map(({ raceStats: { rounds, fastestLapTime }, ...result }, index, array) => ({
			...result,
			rounds,
			fastestLapTime,
			delta: index === 0 ? 0 : rounds - array[index - 1].raceStats.rounds,
			diff: index === 0 ? 0 : rounds - array[0].raceStats.rounds,
			avgTime: 600 / rounds
		}))
		.map(({ fastestLapTime, ...result }, index, array) => ({
			...result,
			fastestLapTime,
			factor: index === array.length - 1 ? 0 : fastestLapTime / array[index + 1].avgTime
		}))
		.map(({ factor, ...result }, index, array) => ({
			...result,
			factor,
			deltaFromFactor:
				index === array.length - 1 ? 0 : Math.ceil(Math.abs(factor * array[index + 1].delta))
		}))
		.map(({ racer }, index, array) => ({
			racer,
			startRound: Math.round(
				array
					.filter((_, i) => index <= i)
					.reverse()
					.reduce((prev, { deltaFromFactor }) => prev + deltaFromFactor, 0) * 1.7
			)
		}))
		.reduce(
			(prev, { racer, startRound }) => ({
				...prev,
				[racer]: startRound
			}),
			{}
		);
};

export const mainRaceStartingOrderConverter = (
	results: CupContentPositionResult,
	participation: CupContentParticipation | undefined
): Record<string, number> | undefined => {
	const startOrderForMainRace = getMainRaceStartingOrder(results, participation ?? {});
	return Object.keys(startOrderForMainRace ?? {}).length ? startOrderForMainRace : undefined;
};
