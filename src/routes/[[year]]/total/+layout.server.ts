import type { Load, LoadEvent } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';
import type { Settings } from '$lib/models/settings';

export const prerender = true;

const loadSettings = async ({ fetch, params }: LoadEvent): Promise<Settings> => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/settings`);
	return await response.json();
};
export const load: Load = async (event: LoadEvent) => {
	const settings = await loadSettings(event);

	return { settings };
};
