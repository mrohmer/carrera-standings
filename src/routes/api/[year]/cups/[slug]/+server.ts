import type { RequestHandler } from '@sveltejs/kit';
import { readCupFile, readCupFiles, readRacersFile } from '$lib/utils/read-content-files';
import { cupConverter } from '$lib/converters/cup';
import { racerMayStillWin } from '$lib/utils/racer-may-still-win';
import type { RequestEvent } from '@sveltejs/kit';
import type { Cup } from '$lib/models';
import {
	getCupsWithoutDiscardedResults,
	getWorstResultsByRacer
} from '$lib/utils/discarded-results';
import { validateSlug } from '$lib/api/validate-slug';
import { error } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

const getCup = ({
	params
}: Pick<RequestEvent, 'params'>):
	| (Cup & Record<'mayStillWin' | 'discardedResult', string[]>)
	| undefined => {
	const { slug } = params;
	const year = getYear({ params });
	const cup = readCupFile(year, slug!);

	if (!cup) {
		return undefined;
	}

	const racers = readRacersFile(year);

	if (!racers) {
		return undefined;
	}

	const convertedCup = cupConverter(cup, racers);

	const cups = readCupFiles(year).map((cup) => cupConverter(cup, racers));
	const mayStillWin = Object.keys(racers)
		.map((name) =>
			racerMayStillWin(name, getCupsWithoutDiscardedResults(cups, racers), racers, {
				currentCupSlug: convertedCup.slug
			})
				? name
				: undefined!
		)
		.filter((name) => !!name);
	const discardedResult = Object.keys(racers)
		.map((name) => (getWorstResultsByRacer(name, cups).includes(cup.slug) ? name : undefined!))
		.filter((name) => !!name);

	return {
		...convertedCup,
		mayStillWin,
		discardedResult
	};
};
export const GET: RequestHandler = (event) => {
	if (!validateSlug(event)) {
		throw error(400);
	}

	const cup = getCup(event);

	if (!cup) {
		throw error(404);
	}

	return new Response(JSON.stringify(cup));
};
