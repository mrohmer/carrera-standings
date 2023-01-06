import { readCupFiles } from '$lib/utils/read-content-files';
import type { Standings } from '$lib/models';
import { standingsConverter } from '$lib/converters/standings.converter';
import type { RequestHandler } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

export const GET: RequestHandler = (event) => {
	const year = getYear(event);
	return new Response(JSON.stringify(standingsConverter(readCupFiles(year))));
};
