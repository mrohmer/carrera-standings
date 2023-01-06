import type { Cup, Racers, Standings } from '../models';
import { cupConverter } from './cup';
import { calcTotalPoints } from '../utils/calc-total-points';
import { racerMayStillWin } from '../utils/racer-may-still-win';
import type { CupContent } from '../models/content/cup';
import { getCupsWithoutDiscardedResults, hasDiscardedResults } from '../utils/discarded-results';

export const standingsConverter = (rawCups: CupContent[], racers: Racers): Standings => {
	const cups: Cup[] = rawCups.map((cup) => cupConverter(cup, racers));

	const cupsWithDiscardedResults = getCupsWithoutDiscardedResults(cups, racers);
	const points = calcTotalPoints(getCupsWithoutDiscardedResults(cups, racers), racers);

	const pointsWithDiscardedResults = calcTotalPoints(cups, racers);

	return {
		hasDiscardedResults: hasDiscardedResults(cups),
		standings: Object.keys(racers ?? {})
			.map((name) => ({
				points: points[name],
				pointsWithDiscardedResults: pointsWithDiscardedResults[name],
				hasDiscardedResults,
				name,
				wins: cups.filter((cup) => cup.order?.length && cup.order[0] === name).length,
				podiums: cups.filter(
					(cup) =>
						cup.order?.length &&
						[0, 1, 2].some((index) => cup.order.length >= index + 1 && cup.order[index] === name)
				).length,
				fastestLaps: cups.filter((cup) => cup.fastestLap === name).length,
				mayStillWin: racerMayStillWin(name, cupsWithDiscardedResults)
			}))
			.sort((a, b) => (a.points < b.points ? 1 : -1))
	};
};
