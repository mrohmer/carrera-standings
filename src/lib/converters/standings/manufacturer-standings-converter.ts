import type {
	Manufacturers,
	ManufacturerStandings,
	Racer,
	Racers,
	RacerStandings,
	RacerStandingsStandings
} from '$lib/models';
import type { CupContent } from '$lib/models/content/cup';
import { racerStandingsConverter } from '$lib/converters/standings/racer-standings-converter';
import { compareStandings } from '$lib/converters/standings/utils';

export const manufacturerStandingsConverter = (
	rawCups: CupContent[],
	manufacturers: Manufacturers,
	racers: Racers
): ManufacturerStandings => {
	const racerStandings = racerStandingsConverter(rawCups, racers);

	const racersByManufacturer = manufacturers.reduce(
		(prev, curr) => ({
			...prev,
			[curr.name]: Object.values(racers).filter((racer) => racer.manufacturer === curr.name)
		}),
		{} as Record<string, Racer[]>
	);

	return {
		hasDiscardedResults: racerStandings.hasDiscardedResults,
		standings: manufacturers
			.filter((manufacturer) => racersByManufacturer[manufacturer.name]?.length)
			.map((manufacturer) => {
				const currentRacers = racersByManufacturer[manufacturer.name]!;
				const sum = createSumForManufacturer(racerStandings, currentRacers);
				return {
					points: sum('points') / currentRacers.length,
					pointsWithDiscardedResults: sum('pointsWithDiscardedResults') / currentRacers.length,
					wins: sum('wins'),
					podiums: sum('podiums'),
					fastestLaps: sum('fastestLaps'),
					name: manufacturer.name,
					mayStillWin: true // todo
				};
			})
			.sort(compareStandings)
	};
};

const sumByKey = <K extends keyof RacerStandingsStandings>(
	racerStandings: RacerStandings,
	key: K,
	racers: Racer[]
): number =>
	racerStandings.standings
		.filter(({ name }) => racers.some(({ key }) => key === name))
		.map((standings) => ((typeof standings[key] === 'number' ? standings[key] : 0) ?? 0) as number)
		.reduce((prev, curr) => prev + curr, 0);
const createSumForManufacturer =
	<K extends keyof RacerStandingsStandings>(racerStandings: RacerStandings, racers: Racer[]) =>
	(key: K) =>
		sumByKey(racerStandings, key, racers);
