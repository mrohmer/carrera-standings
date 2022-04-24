import type {RequestHandler, RequestHandlerOutput} from '@sveltejs/kit';
import {getCup, validateSlug} from './api/cups/[slug]';
import {getPreviousCup} from './api/cups/[slug]/previous';

export const get: RequestHandler = (event): RequestHandlerOutput => {
  if (!validateSlug(event)) {
    return {
      status: 400,
    };
  }

  const cup = getCup(event);
  if (!cup) {
    return {
      status: 404,
    }
  }

  const previous = getPreviousCup(event);

  return {
    body: {
      cup,
      previous,
    }
  }
}
