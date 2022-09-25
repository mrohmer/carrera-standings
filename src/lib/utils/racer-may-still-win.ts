import type { Cup } from '../models';
import { calcTotalPoints } from './calc-total-points';
import { filterCupsUntil } from './filter-cups-until';

interface Extras {
	totalCups: number;
	maxPointsPerTimeTrial: number;
	minPointsPerTimeTrial: number;
	maxPointsPerMainRace: number;
	minPointsPerMainRace: number;
	pointsFastestLap: number;

	currentCupSlug: string;
}

export const racerMayStillWin = (racer: string, cups: Cup[], extras?: Partial<Extras>): boolean => {
	const nonNullableExtras = {
		totalCups: 12,
		maxPointsPerTimeTrial: 6,
		minPointsPerTimeTrial: 1,
		maxPointsPerMainRace: 10,
		minPointsPerMainRace: 1,
		pointsFastestLap: 1,
		...(extras ?? {})
	} as Extras;
	const { currentCupSlug } = nonNullableExtras;
	const evaluatedCups = filterCupsUntil(cups, currentCupSlug).filter((cup) => cup.order?.length);

	const totalPoints = calcTotalPoints(evaluatedCups);
	const leader = Object.entries(totalPoints).reduce(([prevKey, prevValue], [currKey, currValue]) =>
		currValue <= prevValue ? [prevKey, prevValue] : [currKey, currValue]
	)?.[0];

	if (!leader || leader === racer) {
		return true;
	}

	const racerPoints = totalPoints[racer] ?? 0;
	const leaderPoints = totalPoints[leader] ?? 0;

	const cupsFinishedMainRace = evaluatedCups.filter((cups) => cups.pointsDone?.mainRace);
	const cupsFinishedTrialRace = evaluatedCups.filter((cups) => cups.pointsDone?.timeTrial);
	const cupsFinishedFastestLap = evaluatedCups.filter((cups) => cups.pointsDone?.fastestLap);

	const {
		totalCups,
		minPointsPerMainRace,
		maxPointsPerMainRace,
		minPointsPerTimeTrial,
		maxPointsPerTimeTrial,
		pointsFastestLap
	} = nonNullableExtras;
	const unevaluatedCupsMainRace = Math.max(totalCups - cupsFinishedMainRace.length, 0);
	const unevaluatedCupsTrialRace = Math.max(totalCups - cupsFinishedTrialRace.length, 0);
	const unevaluatedCupsFastestLap = Math.max(totalCups - cupsFinishedFastestLap.length, 0);
	const stillReachablePoints =
		unevaluatedCupsMainRace * maxPointsPerMainRace +
		unevaluatedCupsTrialRace * maxPointsPerTimeTrial +
		unevaluatedCupsFastestLap * pointsFastestLap;
	const minPointsForLeader =
		unevaluatedCupsMainRace * minPointsPerMainRace +
		unevaluatedCupsTrialRace * minPointsPerTimeTrial;

	return racerPoints + stillReachablePoints >= leaderPoints + minPointsForLeader;
};
