import type { Cup } from '$lib/models/cups';
import { cupConverter } from '$lib/converters/cup';
import { readCupFiles, readRacersFile } from '$lib/utils/read-content-files';
import type { Course, Standings } from '$lib/models';
import { racerStandingsConverter } from '$lib/converters/standings';
import type { CupContent } from '$lib/models/content/cup';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';
import { error } from '@sveltejs/kit';

export const getCourse = (event: RequestEvent): Course => {
	const year = getYear(event);
	const racers = readRacersFile(year);
	if (!racers) {
		throw error(404);
	}

	const rawCups = readCupFiles(year);

	return rawCups
		.map(
			(cup, index, arr) =>
				[cup, cupConverter(cup, racers), arr.filter((__, i) => index >= i)] as [
					CupContent,
					Cup,
					CupContent[]
				]
		)
		.map(([rawCup, cup, cups]) => {
			const hasStandings = (['mainRace', 'timeTrial'] as (keyof Cup['pointsDone'])[]).some(
				(key) => cup.pointsDone[key]
			);
			const standings: Standings | undefined = hasStandings
				? racerStandingsConverter(cups, racers)
				: undefined;

			const order = standings?.standings?.map(({ name }) => name);

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

export const GET: RequestHandler = (event) => new Response(JSON.stringify(getCourse(event)));
