import type {RequestHandler} from '@sveltejs/kit';
import racers from '../../../../content/racer.json';
import {readCupFile, readCupFiles} from '../../../lib/utils/read-cup-files';
import {cupConverter} from '../../../lib/converters/cup.converter';
import {racerMayStillWin} from '../../../lib/utils/racer-may-still-win';

export const get: RequestHandler = ({params}) => {
  const {slug} = params;

  if (!slug?.trim?.()?.length) {
    return {
      status: 400,
    }
  }

  const cup = readCupFile(slug);

  if (!cup) {
    return {
      status: 404,
    }
  }

  const convertedCup = cupConverter(cup);

  const cups = readCupFiles().map(cupConverter);
  const mayStillWin = Object.keys(racers)
    .map(name => [name, racerMayStillWin(name, cups, {currentCupSlug: convertedCup.slug})])
    .reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]: value,
      }),
      {},
    );

  return {
    body: {
      ...convertedCup,
      mayStillWin,
    },
  }

}
