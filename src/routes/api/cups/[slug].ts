import type {RequestHandler} from '@sveltejs/kit';
import {readCupFile} from '../../../lib/utils/read-cup-files';
import {cupConverter} from '../../../lib/converters/cup.converter';

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

  return {
    body: cupConverter(cup),
  }
}
