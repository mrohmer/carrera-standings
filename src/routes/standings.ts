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
}

const getPoints = (results): Record<string, number> => {
  return results?.reduce(
    (prev, {racer}, index) => ({
      ...prev,
      [racer]: racers.length - index,
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
        mainRace: getPoints(cup.results?.mainRace),
        timeTrial: getPoints(cup.results?.timeTrial),
      },
    }));

  const points = cups
    .reduce(
      (prev, cup) =>
        racers.reduce(
          (points, racer) => ({
            ...points,
            [racer]: (prev[racer] ?? 0) + (cup.points.mainRace[racer] ?? 0),
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
