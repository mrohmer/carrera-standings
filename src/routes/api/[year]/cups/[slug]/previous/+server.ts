import type { RequestHandler } from '@sveltejs/kit';
import { readCupFile, readCupFiles } from '$lib/utils/read-cup-files';
import { cupConverter } from '$lib/converters/cup';
import { filterCupsUntil } from '$lib/utils/filter-cups-until';
import type { RequestEvent } from '@sveltejs/kit';
import type { Cup } from '$lib/models';
import { error } from '@sveltejs/kit';
import { validateSlug } from '$lib/api/validate-slug';

export const getPreviousCup = ({ params }: Pick<RequestEvent, 'params'>): Cup | undefined => {
	const { slug } = params;
	const cup = readCupFile(slug!);

	if (!cup) {
		return undefined;
	}

	const previous = filterCupsUntil(readCupFiles(), slug)
		.reverse()
		.find((c) => c.slug !== slug);

	if (!previous) {
		return undefined;
	}
	return cupConverter(previous);
};
export const GET: RequestHandler = (event) => {
	if (!validateSlug(event)) {
		throw error(400);
	}

	const previous = getPreviousCup(event);

	if (!previous) {
		throw error(404);
	}

	return new Response(JSON.stringify(previous));
};
