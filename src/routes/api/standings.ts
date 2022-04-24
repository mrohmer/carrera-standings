import racers from '../../../content/racer.json';
import type {Cup} from '../../lib/models/cups';
import {cupConverter} from '../../lib/converters/cup.converter';
import {readCupFiles} from '../../lib/utils/read-cup-files';
import {calcTotalPoints} from '../../lib/utils/calc-total-points';
import {racerMayStillWin} from '../../lib/utils/racer-may-still-win';
import type {Standings} from '../../lib/models';

export const getStandings = (): Standings => {
  const rawCups = readCupFiles();

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

export const get = () => ({body: getStandings()});
