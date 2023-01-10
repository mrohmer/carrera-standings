import type { Load } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

export const prerender = true;
export const load: Load = (event) => {
	const year = getYear(event);
	throw redirect(301, `${year !== new Date().getFullYear() ? `/${year}` : ''}/total`);
};
