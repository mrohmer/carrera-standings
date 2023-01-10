import type { Manufacturer, Manufacturers, Points, Racers } from '$lib/models';
import type { Racer } from '$lib/models';

export const manufacturerPointsConverter = (
	racerPoints: Points,
	manufacturers: Manufacturers,
	racers: Racers
): Points => {
	const racersByManufacturer = manufacturers.reduce(
		(prev, curr) => ({
			...prev,
			[curr.name]: Object.values(racers).filter((racer) => racer.manufacturer === curr.name)
		}),
		{} as Record<string, Racer[]>
	);

	return manufacturers
		.filter((manufacturer) => racersByManufacturer[manufacturer.name]?.length)
		.map((manufacturer) => {
			const currentRacers = racersByManufacturer[manufacturer.name]!;
			const sum = createSumForManufacturer(racerPoints, currentRacers);

			return [
				manufacturer,
				{
					mainRace: sum('mainRace') / currentRacers.length,
					timeTrial: sum('timeTrial') / currentRacers.length,
					penalty: sum('penalty') / currentRacers.length,
					fastestLap: sum('fastestLap') / currentRacers.length,
					total: sum('total') / currentRacers.length
				}
			] as [Manufacturer, Points[keyof Points]];
		})
		.reduce(
			(prev, [{ name }, points]) => ({
				mainRace: {
					...(prev.mainRace ?? {}),
					[name]: points.mainRace
				},
				timeTrial: {
					...(prev.timeTrial ?? {}),
					[name]: points.timeTrial
				},
				penalty: {
					...(prev.penalty ?? {}),
					[name]: points.penalty
				},
				fastestLap: {
					...(prev.fastestLap ?? {}),
					[name]: points.fastestLap
				},
				total: {
					...(prev.total ?? {}),
					[name]: points.total
				}
			}),
			{} as Points
		);
};

const sumByKey = <K extends keyof Points>(points: Points, key: K, racers: Racer[]): number =>
	Object.entries(points[key])
		.filter(([name]) => racers.some(({ key }) => key === name))
		.map(([, point]) => (typeof point === 'number' ? point : 0))
		.reduce((prev, curr) => prev + curr, 0);
const createSumForManufacturer =
	<K extends keyof Points>(points: Points, racers: Racer[]) =>
	(key: K) =>
		sumByKey(points, key, racers);
