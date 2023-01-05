import { readCupFiles } from '$lib/utils/read-cup-files';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
	const cups = readCupFiles();

	return new Response(JSON.stringify(cups.map(({ title, slug }) => ({ title, slug }))));
};
