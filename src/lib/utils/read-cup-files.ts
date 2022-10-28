import path from 'path';
import { URL } from 'url';
import fs from 'fs';
import type { CupContent } from '../models/content/cup';

const getCupsDir = () => {
	const rootDir =
		process.env.ROOT_DIR ?? path.resolve(new URL('.', import.meta.url).pathname, '../../..');
	return path.resolve(rootDir, 'content/cups');
};
const processCupFile = (file: string): CupContent => {
	const content = fs.readFileSync(path.resolve(getCupsDir(), file));
	return {
		...JSON.parse(content.toString()),
		slug: path.basename(file, '.json')
	};
};
export const readCupFiles = (): CupContent[] => {
	return fs
		.readdirSync(getCupsDir())
		.filter((file) => file.endsWith('.json'))
		.map((file) => processCupFile(file))
		.sort((a, b) => (+new Date(a.date) < +new Date(b.date) ? -1 : 1));
};
export const readCupFile = (slug: string): CupContent | undefined => {
	const file = fs.readdirSync(getCupsDir()).find((file) => file === `${slug}.json`);

	if (!file) {
		return undefined;
	}
	return processCupFile(file);
};
