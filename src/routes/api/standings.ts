import racers from '../../../content/racer.json';
import {Cup} from '../../lib/models/cups';
import {cupConverter} from '../../lib/converters/cup.converter';
import {readCupFiles} from '../../lib/utils/read-cup-files';


export type Standings = {
    name: string;
    points: number;
    wins: number;
    podiums: number;
    fastestLaps: number;
  }[];

export const getStandings = (): Standings => {
  const rawCups = readCupFiles();

  const cups: Cup[] = rawCups
    .map(cup => cupConverter(cup));

  const points = cups
    .reduce(
      (prev, cup) =>
        racers.reduce(
          (points, racer) => ({
            ...points,
            [racer]: (prev[racer] ?? 0) + (cup.points.total[racer] ?? 0),
          }),
          {},
        )
      ,
      {},
    );

  return racers
    .map((name) => ({
      points: points[name],
      name,
      wins: cups.filter(cup => cup.order?.length && cup.order[0] === name).length,
      podiums: cups.filter(cup => cup.order?.length && [0, 1, 2].some(index => cup.order.length >= index + 1 && cup.order[index] === name)).length,
      fastestLaps: cups.filter(cup => cup.fastestLap === name).length,
    }))
    .sort((a, b) => a.points < b.points ? 1 : -1);
}

export const get = () => ({body: getStandings()});
