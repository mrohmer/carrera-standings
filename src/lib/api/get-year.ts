import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const getYear = ({ params }: Pick<RequestEvent, 'params'>): number => {
	const { year = String(new Date().getFullYear()) } = params;

	if (!/^\d{4}$/.test(year)) {
		throw error(404);
	}

	const yearNbr = +year;
	if (yearNbr < 2021 || yearNbr > 2050) {
		throw error(404);
	}

	return yearNbr;
};
