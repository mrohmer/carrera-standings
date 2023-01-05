import type { Load, LoadEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { Cup, Racers } from '$lib/models';
import { validateSlug } from '$lib/api/validate-slug';

export const prerender = true;

export const load: Load = ({ parent }) => parent();
