import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import fs from "fs";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		prerender: {
			entries: [
				'*',
				...fs.readdirSync('./content/cups')
				.map(file => `/api/cups/${path.basename(file, '.json')}`),
			]
		}
	}
};

export default config;
