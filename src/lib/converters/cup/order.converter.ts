import type { Points } from '$lib/models';

export const orderConverter = (points: Points[keyof Points]): string[] =>
	Object.entries(points)
		.filter(([, points]) => typeof points === 'number')
		.sort(([, a], [, b]) => (a < b ? 1 : -1))
		.map(([key]) => key);
