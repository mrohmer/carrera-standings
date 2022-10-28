import type { Standings } from '../models';
import type { Cup } from '../models';
import { cupConverter } from './cup';
import { calcTotalPoints } from '../utils/calc-total-points';
import { racerMayStillWin } from '../utils/racer-may-still-win';
import racers from '../../../content/racer.json';
import type { CupContent } from '../models/content/cup';
import { getCupsWithoutDiscardedResults, hasDiscardedResults } from '../utils/discarded-results';

export const standingsConverter = (rawCups: CupContent[]): Standings => {
	const cups: Cup[] = rawCups.map((cup) => cupConverter(cup));

	const cupsWithDiscardedResults = getCupsWithoutDiscardedResults(cups);
	const points = calcTotalPoints(getCupsWithoutDiscardedResults(cups));

	const pointsWithDiscardedResults = calcTotalPoints(cups);

	return {
		hasDiscardedResults: hasDiscardedResults(cups),
		standings: Object.keys(racers)
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
