import type { RequestHandler } from '@sveltejs/kit';
import { getAvailableYears } from '$lib/utils/read-content-files';

export let GET: RequestHandler = () => new Response(JSON.stringify(getAvailableYears()));
