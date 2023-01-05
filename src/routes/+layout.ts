import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
	const response = await fetch('/api/cups');
	return {
		cups: await response.json()
	};
};
