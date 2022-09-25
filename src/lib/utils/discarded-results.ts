import type { Cup } from '../models';
import racers from '../../../content/racer.json';

const AMOUNT_OF_DISCARDED_RESULTS = 2;

export const hasDiscardedResults = (cups: Cup[]): boolean =>
	cups.length > AMOUNT_OF_DISCARDED_RESULTS * 2;

export const getCupsWithoutDiscardedResults = (cups: Cup[]): Cup[] => {
	if (!hasDiscardedResults(cups)) {
		return cups;
	}

	const cupsWithDiscards = Object.keys(racers)
		.map((racer) => [racer, getWorstResultsByRacer(racer, cups)] as [string, Cup['slug'][]])
		.reduce((prev, [racer, slugs]) => {
			slugs.forEach((cup) => (prev[cup] = [...(prev[cup] ?? []), racer]));
			return prev;
		}, {} as Record<Cup['slug'], string[]>);

	return cups.map((cup) => {
		if (cupsWithDiscards[cup.slug]?.length) {
			return {
				...cup,
				points: {
					...cup.points,
					total: Object.entries(cup.points.total)
						.filter(([key]) => !cupsWithDiscards[cup.slug].includes(key))
						.reduce(
							(prev, [key, value]) => ({
								...prev,
								[key]: value
							}),
							{}
						)
				}
			};
		}
		return cup;
	});
};
export const getWorstResultsByRacer = (
	racer: string,
	cups: Pick<Cup, 'points' | 'slug' | 'order'>[]
): Cup['slug'][] =>
	cups
		.reduce((prev, curr) => {
			const points = curr.points.total[racer] ?? 0;
			if (!curr.order.length) {
				return prev;
			}

			if (prev.length < AMOUNT_OF_DISCARDED_RESULTS || prev.some(([, v]) => v > points)) {
				return [...prev, [curr.slug, points] as [string, number]]
					.sort(([, a], [, b]) => (a < b ? -1 : 1))
					.slice(0, AMOUNT_OF_DISCARDED_RESULTS);
			}

			return prev;
		}, [] as [string, number][])
		.map(([slug]) => slug);
