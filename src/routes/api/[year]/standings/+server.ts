import { readCupFiles } from '$lib/utils/read-cup-files';
import type { Standings } from '$lib/models';
import { standingsConverter } from '$lib/converters/standings.converter';
import type { RequestHandler } from '@sveltejs/kit';

export const getStandings = (): Standings => standingsConverter(readCupFiles());

export const GET: RequestHandler = () => new Response(JSON.stringify(getStandings()));
