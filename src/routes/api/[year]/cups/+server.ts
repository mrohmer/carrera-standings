import { readCupFiles } from '$lib/utils/read-content-files';
import type { RequestHandler } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';
import type { CupContent } from '$lib/models/content/cup';

const getCups = (year: number, full: boolean): Partial<CupContent>[] => {
	const cups = readCupFiles(year);

	if (full) {
		return cups;
	}

	return cups.map(({ title, slug }) => ({ title, slug }));
};
export const GET: RequestHandler = (event) => {
	const year = getYear(event);
	const cups = getCups(year, event.url?.searchParams?.get('full') === 'true');

	return new Response(JSON.stringify(cups));
};
