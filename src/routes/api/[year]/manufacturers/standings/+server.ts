import {
	readCupFiles,
	readManufacturerFile,
	readRacersFile,
	readSettingsFile
} from '$lib/utils/read-content-files';
import { manufacturerStandingsConverter, racerStandingsConverter } from '$lib/converters/standings';
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';

export const GET: RequestHandler = (event) => {
	const year = getYear(event);
	const settings = readSettingsFile(year);

	if (!settings?.hasTeamRating) {
		throw error(404);
	}

	const manufacturer = readManufacturerFile(year);
	if (!manufacturer) {
		throw error(404);
	}
	const racers = readRacersFile(year);
	if (!racers) {
		throw error(404);
	}

	return new Response(
		JSON.stringify(
			manufacturerStandingsConverter(readCupFiles(year), manufacturer, racers, settings)
		)
	);
};
