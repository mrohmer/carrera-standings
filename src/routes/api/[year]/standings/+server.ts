import { readCupFiles, readRacersFile } from '$lib/utils/read-content-files';
import { standingsConverter } from '$lib/converters/standings.converter';
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

export const GET: RequestHandler = (event) => {
	const year = getYear(event);
	const racers = readRacersFile(year);
	if (!racers) {
		throw error(404);
	}
	return new Response(JSON.stringify(standingsConverter(readCupFiles(year), racers)));
};
