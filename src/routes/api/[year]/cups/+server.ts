import { readCupFiles } from '$lib/utils/read-content-files';
import type { RequestHandler } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

export const GET: RequestHandler = (event) => {
	const year = getYear(event);
	const cups = readCupFiles(year);

	return new Response(JSON.stringify(cups.map(({ title, slug }) => ({ title, slug }))));
};
