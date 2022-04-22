import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';
import racers from '../../content/racer.json';


export interface Standings {
  cups: Cup[];
  points: {
    name: string;
    points: number;
  }[];
}
export interface Cup {
  title: string;
  points: Record<'mainRace'|'timeTrial', Record<string, number>>;
  fastestLap?: string;
}

const getPoints = (results, points: number[], fastestLapRacer?: string): Record<string, number> => {
  return results?.reduce(
    (prev, {racer, penalty}, index) => ({
      ...prev,
      [racer]: points[index] + +(fastestLapRacer === racer) - (penalty ?? 0),
    }),
    {},
  ) ?? {};
}
const readCupFiles = (): Record<string, any>[] => {
  const rootDir = process.env.ROOT_DIR ?? path.resolve(new URL('.', import.meta.url).pathname, '../..')
  const dir = path.resolve(rootDir, 'content/cups')
  return fs.readdirSync(dir)
    .map(file => path.resolve(dir, file))
    .map(file => fs.readFileSync(file))
    .map(content => JSON.parse(content.toString()));
}
export const getStandings = (): Standings => {
  const rawCups = readCupFiles();

  const cups: Cup[] = rawCups
    .sort((a, b) => +new Date(a.date) < +new Date(b.date) ? -1 : 1)
    .map(cup => ({
      title: cup.title,
      points: {
        mainRace: getPoints(cup.results?.mainRace, [10, 8, 6, 4, 2, 1], cup.results?.fastestLap),
        timeTrial: getPoints(cup.results?.timeTrial, [6, 5, 4, 3, 2, 1]),
      },
      fastestLap: cup.results?.fastestLap,
    }));

  const points = cups
    .reduce(
      (prev, cup) =>
        racers.reduce(
          (points, racer) => ({
            ...points,
            [racer]: (prev[racer] ?? 0) + (cup.points.mainRace[racer] ?? 0) + (cup.points.timeTrial[racer] ?? 0),
          }),
          {},
        )
      ,
      {},
    );

  return {
    cups,
    points: Object.entries(points)
      .map(([name, points]) => ({points, name}))
      .sort((a, b) => a.points < b.points ? 1 : -1),
  }
}

export const get = () => ({body: getStandings()});
