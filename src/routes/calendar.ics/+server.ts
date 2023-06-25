import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { icsBuilder } from '$lib/ics/ics-builder';

const loadCups = async (year: number, { fetch }: RequestEvent) => {
	const response = await fetch(`/api/${year}/cups?full=true`);
	return await response.json();
};
const loadYears = async ({ fetch }: RequestEvent): Promise<number[]> => {
	const response = await fetch(`/api/years`);
	return await response.json();
};
export const GET: RequestHandler = async (event) => {
	const years = await loadYears(event);
	const cups = (
		await Promise.all(
			years.map(async (year) => ({
				year,
				cups: await loadCups(year, event)
			}))
		)
	)
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
