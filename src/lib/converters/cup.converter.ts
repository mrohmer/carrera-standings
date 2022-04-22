import {Cup} from '../models/cups';
import racers from '../../../content/racer.json';

const getPoints = (results, points: number[]): Record<string, number> => {
  return results?.reduce(
    (prev, {racer, penalty}, index) => ({
      ...prev,
      [racer]: points[index],
    }),
    {},
  ) ?? {};
}
export const cupConverter = (cup): Cup => {
  const rawPoints: Omit<Cup['points'], 'total'> = {
    mainRace: getPoints(cup.results?.mainRace, [10, 8, 6, 4, 2, 1]),
    timeTrial: getPoints(cup.results?.timeTrial, [6, 5, 4, 3, 2, 1]),
    fastestLap: (cup.results?.fastestLap ? {[cup.results?.fastestLap as string]: 1} : {}) as Record<string, number>,
    penalty: (cup.results?.mainRace?.reduce(
      (prev, {racer, penalty}) => ({
        ...prev,
        [racer]: penalty ? -penalty: 0,
      }),
      {},
    ) ?? {}) as Record<string, number>
  };

  const total = racers.reduce(
    (prev, racer) => ({
      ...prev,
      [racer]: Object.values(rawPoints)
        .map(points => points[racer] ?? 0)
        .reduce(
          (sum, points) => sum + points,
          0,
        ),
    }),
    {},
  );

  const order = Object.entries(total)
    .filter(([, points]) => !!points)
    .sort(([,a], [,b]) => a < b ? 1 : -1)
    .map(([key]) => key)
  ;

  const pointsDone: Cup['pointsDone'] = {
    mainRace: !!cup.results?.mainRace?.length,
    timeTrial: !!cup.results?.timeTrial?.length,
    fastestLap: !!cup.results?.fastestLap,
  }

  return {
    title: cup.title,
    slug: cup.slug,
    points: {
      ...rawPoints,
      total,
    },
    pointsDone,
    fastestLap: cup.results?.fastestLap,
    penalties: cup.results?.mainRace?.filter(({penalty}) => !!penalty).reduce((prev, {racer, penalty}) => ({...prev, [racer]: penalty}), {}) ?? {},
    order,
  }
}
