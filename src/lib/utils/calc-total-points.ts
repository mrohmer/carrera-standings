import type {Cup} from '../models/cups';
import racers from '../../../content/racer.json';

export const calcTotalPoints = (cups: Cup[]): Record<string, number> => cups
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
