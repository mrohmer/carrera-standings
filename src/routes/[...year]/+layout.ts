import type { Load } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

export const load: Load = async ({ fetch, params }) => {
	const year = getYear({ params });
	const response = await fetch(`/api/${year}/cups`);
	return {
		cups: await response.json()
	};
};
