import type { Cup } from '../../models';

export const orderConverter = (points: Cup['points'][keyof Cup['points']]): string[] =>
	Object.entries(points)
		.filter(([, points]) => !!points)
		.sort(([, a], [, b]) => (a < b ? 1 : -1))
		.map(([key]) => key);
