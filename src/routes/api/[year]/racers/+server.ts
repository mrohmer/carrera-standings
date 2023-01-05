import racers from '../../../../../content/racer.json';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => new Response(JSON.stringify(racers));
