import type { Cup, Racers, RacerStandings } from '$lib/models';
import { cupConverter } from '../cup';
import { calcTotalPoints } from '$lib/utils/calc-total-points';
import { racerMayStillWin } from '$lib/utils/racer-may-still-win';
import type { CupContent } from '$lib/models/content/cup';
import { getCupsWithoutDiscardedResults, hasDiscardedResults } from '$lib/utils/discarded-results';
import { compareStandings } from '$lib/converters/standings/utils';

export const racerStandingsConverter = (rawCups: CupContent[], racers: Racers): RacerStandings => {
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
				mayStillWin: racerMayStillWin(name, cupsWithDiscardedResults, racers)
			}))
			.sort(compareStandings)
	};
};
