import type { RequestHandler } from '@sveltejs/kit';
import racers from '../../../../../content/racer.json';
import { readCupFile, readCupFiles } from '$lib/utils/read-cup-files';
import { cupConverter } from '$lib/converters/cup';
import { racerMayStillWin } from '$lib/utils/racer-may-still-win';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import type { Cup } from '$lib/models';

export const validateSlug = ({ params }: Pick<RequestEvent, 'params'>): boolean => {
	const { slug } = params;
	return !!slug?.trim?.()?.length;
};
export const getCup = ({
	params
}: Pick<RequestEvent, 'params'>):
	| (Cup & Record<'mayStillWin', Record<string, boolean>>)
	| undefined => {
	const { slug } = params;
	const cup = readCupFile(slug);

	if (!cup) {
		return undefined;
	}

	const convertedCup = cupConverter(cup);

	const cups = readCupFiles().map((cup) => cupConverter(cup));
	const mayStillWin = Object.keys(racers)
		.map(
			(name) =>
				[name, racerMayStillWin(name, cups, { currentCupSlug: convertedCup.slug })] as [
					string,
					boolean
				]
		)
		.reduce(
			(prev, [key, value]) => ({
				...prev,
				[key]: value
			}),
			{}
		);

	return {
		...convertedCup,
		mayStillWin
	};
};
export const get: RequestHandler = (event) => {
	if (!validateSlug(event)) {
		return {
			status: 400
		};
	}

	const cup = getCup(event);

	if (!cup) {
		return {
			status: 404
		};
	}

	return {
		body: cup as any
	};
};
