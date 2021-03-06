import type { Cup } from '../../lib/models/cups';
import { cupConverter } from '../../lib/converters/cup.converter';
import { readCupFiles } from '../../lib/utils/read-cup-files';
import type { Course, Standings } from '../../lib/models';
import { standingsConverter } from '../../lib/converters/standings.converter';

export const getCourse = (): Course => {
	const rawCups = readCupFiles();

	return rawCups
		.map(
			(cup, index, arr) =>
				[cup, cupConverter(cup), arr.filter((__, i) => index >= i)] as [
					Record<string, any>,
					Cup,
					Record<string, any>[]
				]
		)
		.map(([rawCup, cup, cups]) => {
			const hasStandings = (['mainRace', 'timeTrial'] as (keyof Cup['pointsDone'])[]).some(
				(key) => cup.pointsDone[key]
			);
			const standings: Standings | undefined = hasStandings ? standingsConverter(cups) : undefined;

			const order = standings?.map(({ name }) => name);

			const origDate = new Date(rawCup.date);
			return {
				cup: {
					title: cup.title,
					order: cup.order
				},
				date: `${origDate.getFullYear()}-${String(origDate.getMonth() + 1).padStart(
					2,
					'0'
				)}-01 12:00:00Z`,
				order
			};
		});
};

export const get = () => ({ body: getCourse() });
