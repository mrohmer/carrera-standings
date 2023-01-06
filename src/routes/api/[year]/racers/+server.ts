import type { RequestHandler } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';
import { readRacersFile } from '$lib/utils/read-content-files';

export const GET: RequestHandler = (event) => {
	const year = getYear(event);

	return new Response(JSON.stringify(readRacersFile(year) ?? {}));
};
