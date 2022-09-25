import type { CupContent } from '../models/content/cup';

export const filterCupsUntil = <T extends CupContent>(cups: T[], lastCupSlug?: string): T[] => {
	let currentCupIndex = lastCupSlug ? cups.findIndex((cup) => cup.slug === lastCupSlug) : -1;
	currentCupIndex = currentCupIndex === -1 ? cups.length - 1 : currentCupIndex;
	return cups.filter((cup, index) => index <= currentCupIndex);
};
