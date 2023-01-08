import path from 'path';
import { URL } from 'url';
import fs from 'fs';
import type { CupContent } from '../models/content/cup';
import type { Racers } from '$lib/models';
import { env } from '$env/dynamic/private';
import type { Settings } from '$lib/models/settings';

const jsonFileCache: Record<string, any> = {};
const readJsonFileUncached = <T = any>(file: string): T | undefined => {
	if (!fs.existsSync(file)) {
		return undefined;
	}

	const content = fs.readFileSync(file);
	const rawJson = content.toString();

	if (!rawJson?.trim()) {
		return undefined;
	}

	return JSON.parse(rawJson);
};
const readJsonFile = <T = any>(file: string): T | undefined => {
	if (jsonFileCache[file]) {
		return jsonFileCache[file];
	}
	const result = readJsonFileUncached<T>(file);
	result && (jsonFileCache[file] = result);
	return result;
};
const getBaseContentsDir = () => {
	const rootDir = env.ROOT_DIR ?? path.resolve(new URL('.', import.meta.url).pathname, '../../..');
	return path.resolve(rootDir, 'content');
};
const getContentsDir = (year: number) => path.resolve(getBaseContentsDir(), String(year));
const readContentFile = <T = any>(year: number, file: string): T | undefined =>
	readJsonFile<T>(path.resolve(getContentsDir(year), file));
const getCupsDir = (year: number) => path.resolve(getContentsDir(year), 'cups');
const processCupFile = (year: number, file: string): CupContent | undefined => {
	const content = readJsonFile<CupContent>(path.resolve(getCupsDir(year), file));
	if (!content) {
		return undefined;
	}
	return {
		...content,
		slug: path.basename(file, '.json')
	};
};
export const readCupFiles = (year: number): CupContent[] => {
	const dir = getCupsDir(year);
	if (!fs.existsSync(dir)) {
		return [];
	}
	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith('.json'))
		.map((file) => processCupFile(year, file)!)
		.filter((i) => !!i)
		.sort((a, b) => (+new Date(a.date) < +new Date(b.date) ? -1 : 1));
};
export const readCupFile = (year: number, slug: string): CupContent | undefined => {
	const file = fs.readdirSync(getCupsDir(year)).find((file) => file === `${slug}.json`);

	if (!file) {
		return undefined;
	}
	return processCupFile(year, file);
};
export const readRacersFile = (year: number): Racers | undefined =>
	readContentFile<Record<'racers', Record<'key' | 'color' | 'manufacturer', string>[]>>(
		year,
		'racer.json'
	)?.racers?.reduce(
		(prev, curr) => ({
			...prev,
			[curr.key]: {
				...curr
			}
		}),
		{}
	);

export const getAvailableYears = (): number[] => {
	const dir = getBaseContentsDir();
	if (!fs.existsSync(dir)) {
		return [];
	}
	return fs
		.readdirSync(dir)
		.filter((year) => /^\d{4}$/.test(year))
		.map((year) => +year)
		.filter((year) => year > 2021 && year < 2050)
		.filter((year) => readRacersFile(year))
		.sort()
		.reverse();
};
export const readSettingsFile = (year: number): Settings | undefined =>
	readContentFile<Settings>(year, 'settings.json');
