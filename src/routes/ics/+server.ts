import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { icsBuilder } from '$lib/ics/ics-builder';
import { getAvailableYears, readCupFiles } from '$lib/utils/read-content-files';

export const prerender = true;

const loadCups = (year: number) => readCupFiles(year);
const loadYears = () => getAvailableYears();
export const GET: RequestHandler = async () => {
	const years = loadYears();
	const cups = years
		.map((year) => ({
			year,
			cups: loadCups(year)
		}))
		.sort(({ year: a }, { year: b }) => Math.sign(a - b))
		.map(({ cups }) => cups)
		.flat();

	if (!cups?.length) {
		throw error(404);
	}

	const content = icsBuilder(
		`Carrera Männer Abend`,
		`Hier findest du alle Termine der Rennserie`,
		cups
	);

	return new Response(content, {
		status: 200,
		headers: {
			'content-type': 'text/calendar'
		}
	});
};
