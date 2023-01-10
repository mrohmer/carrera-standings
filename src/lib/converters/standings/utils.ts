import type { ManufacturerStandingsStandings, RacerStandingsStandings } from '$lib/models';

export const compareStandings = <
	R extends Pick<
		RacerStandingsStandings | ManufacturerStandingsStandings,
		'points' | 'wins' | 'podiums'
	>
>(
	a: R,
	b: R
) => {
	const firstUntied = (['points', 'wins', 'podiums'] as (keyof R)[]).find(
		(key) => a[key] !== b[key]
	);
	if (!firstUntied) {
		return 0;
	}

	return a[firstUntied] < b[firstUntied] ? 1 : -1;
};
