import type {Standings} from '../models';
import {Cup} from '../models';
import {cupConverter} from './cup.converter';
import {calcTotalPoints} from '../utils/calc-total-points';
import {racerMayStillWin} from '../utils/racer-may-still-win';
import racers from '../../../content/racer.json';

export const standingsConverter = (rawCups: Record<string, any>[]): Standings => {
  const cups: Cup[] = rawCups
    .map(cup => cupConverter(cup));

  const points = calcTotalPoints(cups);

  return Object.keys(racers)
    .map((name) => ({
      points: points[name],
      name,
      wins: cups.filter(cup => cup.order?.length && cup.order[0] === name).length,
      podiums: cups.filter(cup => cup.order?.length && [0, 1, 2].some(index => cup.order.length >= index + 1 && cup.order[index] === name)).length,
      fastestLaps: cups.filter(cup => cup.fastestLap === name).length,
      mayStillWin: racerMayStillWin(name, cups)
    }))
    .sort((a, b) => a.points < b.points ? 1 : -1);
}
