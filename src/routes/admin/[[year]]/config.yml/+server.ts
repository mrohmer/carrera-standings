import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { getYear } from '$lib/api/get-year';
import { env } from '$env/dynamic/private';

const getLocalBackend = () => {
	if (env.PROD) {
		return undefined;
	}

	return {
		url: `http://localhost:8082/api/v1`
	};
};

export const GET: RequestHandler = async (event) => {
	const { url } = event;
	const year = getYear(event);
	const raceTypes = {
		timeTrial: 'Zeitfahren',
		mainRace: 'Hauptrennen'
	};

	const racerSelect = {
		name: 'racer',
		label: 'Fahrer',
		widget: 'relation',
		collection: `files`,
		file: `racers`,
		valueField: 'racers.*.key',
		displayFields: ['racers.*.key'],
		searchFields: ['racers.*.key'],
		required: false
	};

	const body = {
		backend: {
			name: 'github',
			repo: 'mrohmer/carrera-standings',
			branch: 'master',
			commit_messages: {
				create: 'content({{collection}}): created {{slug}}',
				update: 'content({{collection}}): updated {{slug}}',
				delete: 'content({{collection}}): deleted {{slug}}',
				uploadMedia: 'content(media): uploaded {{path}}',
				deleteMedia: 'content(media): deleted {{path}}',
				openAuthoring: 'content: {{message}}'
			}
		},
		media_folder: `static/uploads/${year}`,
		public_folder: `/uploads/${year}`,
		collections: [
			{
				name: 'files',
				label: 'Files',
				files: [
					{
						label: 'Settings',
						name: 'settings',
						file: `content/${year}/settings.json`,
						extension: 'json',
						editor: {
							preview: false
						},
						fields: [
							{
								label: 'Has Team Rating',
								name: 'hasTeamRating',
								widget: 'boolean'
							}
						]
					},
					{
						label: 'Manufacturer',
						name: 'manufacturer',
						file: `content/${year}/manufacturer.json`,
						extension: 'json',
						editor: {
							preview: false
						},
						fields: [
							{
								label: 'Manufacturer',
								name: 'manufacturer',
								widget: 'list',
								fields: [
									{
										label: 'Name',
										name: 'name',
										widget: 'string'
									}
								]
							}
						]
					},
					{
						label: 'Racers',
						name: 'racers',
						file: `content/${year}/racer.json`,
						extension: 'json',
						editor: {
							preview: false
						},
						fields: [
							{
								label: 'Racers',
								name: 'racers',
								widget: 'list',
								fields: [
									{
										label: 'Key',
										name: 'key',
										widget: 'string'
									},
									{
										label: 'Manufacturer',
										name: 'manufacturer',
										widget: 'relation',
										collection: `files`,
										file: `manufacturer`,
										valueField: 'manufacturer.*.name',
										displayFields: ['manufacturer.*.name'],
										searchFields: ['manufacturer.*.name']
									},
									{
										label: 'Color',
										name: 'color',
										widget: 'color'
									}
								]
							}
						]
					}
				]
			},
			{
				name: 'cup',
				label: 'Cup',
				folder: `content/${year}/cups`,
				create: true,
				slug: '{{year}}-{{month}}-{{title}}',
				summary: '{{title}} ({{month}}.{{year}})',
				extension: 'json',
				editor: {
					preview: false
				},
				fields: [
					{
						label: 'Titel',
						name: 'title'
					},
					{
						label: 'Datum',
						name: 'date',
						widget: 'date'
					},
					{
						label: 'Datum Fix',
						name: 'dateFixed',
						widget: 'boolean'
					},
					{
						label: 'Streckenlayout',
						name: 'layout',
						widget: 'image',
						required: false,
						allow_multiple: false,
						choose_url: false
					},
					{
						label: 'Live-Session ID',
						name: 'liveSessionId',
						required: false
					},
					{
						name: 'info',
						label: 'Info',
						widget: 'object',
						collapsed: true,
						fields: [
							{
								name: 'trackLength',
								label: 'Streckenlänge',
								widget: 'object',
								collapsed: true,
								fields: [
									{
										label: 'Schnitt',
										name: 'average'
									},
									{
										label: 'Innere Bahn',
										name: 'innerTrack'
									},
									{
										label: 'Außere Bahn',
										name: 'outerTrack'
									}
								].map((field) => ({
									...field,
									required: false,
									widget: 'number',
									min: 0,
									value_type: 'float'
								}))
							},
							{
								label: 'Länge Box',
								name: 'pitLaneLength',
								required: false,
								widget: 'number',
								min: 0,
								value_type: 'float'
							},
							{
								label: 'Bahnrekord',
								name: 'record',
								widget: 'object',
								collapsed: true,
								summary: '{{fields.time}}s {{fields.racer}}',
								fields: [
									{
										...racerSelect,
										required: false
									},
									{
										name: 'time',
										label: 'Rundenzeit',
										widget: 'number',
										required: false,
										min: 0,
										max: 100,
										value_type: 'float'
									},
									{
										name: 'date',
										label: 'Zeitpunkt',
										widget: 'date',
										required: false
									}
								]
							}
						]
					},
					{
						label: 'Fehlende',
						name: 'participation',
						collapsed: true,
						widget: 'list',
						field: {
							label: 'Name',
							name: 'name',
							widget: 'relation',
							collection: `files`,
							file: `racers`,
							valueField: 'racers.*.key',
							displayFields: ['racers.*.key'],
							searchFields: ['racers.*.key']
						}
					},
					{
						label: 'Results',
						name: 'results',
						widget: 'object',
						collapsed: false,
						fields: [
							...Object.entries(raceTypes).map(([name, label]) => ({
								name,
								label,
								collapsed: true,
								widget: 'object',
								fields: Array.from(new Array(8)).map((_, index) => ({
									name: `pos${index + 1}`,
									label: `Position ${index + 1}`,
									widget: 'object',
									summary: '{{fields.racer}}',
									collapsed: true,
									fields: [
										racerSelect,
										name === 'timeTrial' && {
											name: 'raceStats',
											label: 'Race Stats',
											widget: 'object',
											fields: [
												{
													name: 'rounds',
													label: 'Runden',
													widget: 'number',
													required: false,
													min: 0,
													max: 500
												},
												{
													name: 'fastestLapTime',
													label: 'Schnellste Rundenzeit',
													widget: 'number',
													required: false,
													min: 0,
													max: 100,
													value_type: 'float'
												}
											]
										}
									].filter((i) => !!i)
								}))
							})),
							{
								name: 'penalties',
								label: 'Strafpunkte',
								widget: 'list',
								collapsed: true,
								fields: [
									{
										label: 'Racer',
										name: 'racer',
										widget: 'relation',
										collection: `files`,
										file: `racers`,
										valueField: 'racers.*.key',
										displayFields: ['racers.*.key'],
										searchFields: ['racers.*.key'],
										required: false
									},
									{
										name: 'points',
										label: 'Punkte',
										widget: 'number',
										required: false,
										default: 0,
										min: 0,
										max: 100
									}
								]
							},
							{
								...racerSelect,
								name: 'fastestLap',
								label: 'Schnellste Runde',
								required: false
							}
						]
					}
				]
			}
		],
		local_backend: getLocalBackend(),
		display_url: `${url.protocol}//${url.host}`,
		locale: 'de'
	};

	return new Response(JSON.stringify(body));
};
