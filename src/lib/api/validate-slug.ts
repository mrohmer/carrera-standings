import type { RequestEvent } from '@sveltejs/kit';

export const validateSlug = ({ params }: Pick<RequestEvent, 'params'>): boolean => {
	const { slug } = params;
	return !!slug?.trim?.()?.length;
};
