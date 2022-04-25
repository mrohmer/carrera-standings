import {readCupFiles} from '../../lib/utils/read-cup-files';
import type {Standings} from '../../lib/models';
import {standingsConverter} from '../../lib/converters/standings.converter';

export const getStandings = (): Standings => standingsConverter(readCupFiles());

export const get = () => ({body: getStandings()});
