import type { CupContent } from '../../models/content/cup';
import ms from 'ms';

export const liveSessionIdConverter = ({
	liveSessionId,
	date
}: Pick<CupContent, 'liveSessionId' | 'date'>): string | undefined => {
	if (!liveSessionId || !date) {
		return undefined;
	}

	const dateObj = new Date(date);
	const now = new Date();
	if (+now - ms('3d') > +dateObj || +now + ms('2d') < +dateObj) {
		return undefined;
	}

	return liveSessionId;
};
