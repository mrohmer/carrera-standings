import type {RequestHandler} from '@sveltejs/kit';
import {readCupFile, readCupFiles} from '../../../../lib/utils/read-cup-files';
import {cupConverter} from '../../../../lib/converters/cup.converter';
import {filterCupsUntil} from '../../../../lib/utils/filter-cups-until';
import {validateSlug} from './index';
import type {RequestEvent} from '@sveltejs/kit/types/private';
import type {Cup} from '../../../../lib/models';

export const getPreviousCup = ({params}: Pick<RequestEvent, 'params'>): Cup|undefined => {
  const {slug} = params;
  const cup = readCupFile(slug);

  if (!cup) {
    return undefined;
  }

  const previous = filterCupsUntil(readCupFiles(), slug)
    .reverse()
    .find(c => c.slug !== slug);

  if (!previous) {
    return undefined;
  }
  return cupConverter(previous);
}
export const get: RequestHandler = (event) => {
  if (!validateSlug(event)) {
    return {
      status: 400,
    }
  }

  const previous = getPreviousCup(event);

  if (!previous) {
    return {
      status: 404,
    }
  }

  return {
    body: previous,
  }
}
