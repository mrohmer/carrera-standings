import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const getYear = ({ params }: Pick<RequestEvent, 'params'>): number => {
	const { year } = params;

	if (year && year?.length > 1) {
		throw error(404);
	}

	const singleYear = year?.[0] ?? String(new Date().getFullYear());

	if (!/^\d{4}$/.test(singleYear)) {
		throw error(404);
	}

	const yearNbr = +singleYear;
	if (yearNbr < 2021 || yearNbr > 2050) {
		throw error(404);
	}

	return yearNbr;
};
