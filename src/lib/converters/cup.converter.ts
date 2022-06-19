import type { Cup } from '../models';
import racers from '../../../content/racer.json';
import ms from 'ms';

const MONTHS = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember'
];
type Participation = Record<string, boolean>;
type Penalties = Record<string, number>;
type Result = Record<'racer', string> &
	Partial<Record<'raceStats', Record<'rounds' | 'fastestLapTime', number>>>;
type Results = Record<`pos${number}`, Result>;
type CupRecord = Record<'racer' | 'date', string> & Record<'time', number>;
type CupInfo = Record<'record', CupRecord> & Record<'trackLength' | 'pitLaneLength', number>;
type CupResults = Record<'mainRace' | 'timeTrial', Results> &
	Record<'fastestLap', string> &
	Record<'penalties', Penalties>;
interface CupContent {
	info: CupInfo;
	results: CupResults;
	participation: Participation;
	title: string;
	slug: string;
	date: string;
	liveSessionId: string;
	layout: string;
}

const formatDate = (date: Date | string): string | undefined => {
	if (!date) {
		return undefined;
	}
	if (typeof date === 'string') {
		date = new Date(date);
	}
	return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};
const resultToArr = (results: Results): Result[] =>
	Object.entries(results ?? {})
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, data]) => data);
const getStartOrderForMainRace = (
	results: Results,
	participation: Participation
): Record<string, number> => {
	return resultToArr(results)
		?.filter(
			({ racer, raceStats }) =>
				!!participation[racer] && !!raceStats?.rounds && !!raceStats?.fastestLapTime
		)
		.map(({ raceStats, ...result }) => ({
			...result,
			raceStats: {
				rounds: raceStats?.rounds ?? 0,
				fastestLapTime: raceStats?.fastestLapTime ?? 0
			}
		}))
		.sort((a, b) => {
			if (a.raceStats.rounds === b.raceStats.rounds) {
				return a.raceStats.fastestLapTime > b.raceStats.fastestLapTime ? 1 : -1;
			}
			return a.raceStats.rounds < b.raceStats.rounds ? 1 : -1;
		})
		.map(({ raceStats: { rounds, fastestLapTime }, ...result }, index, array) => ({
			...result,
			rounds,
			fastestLapTime,
			delta: index === 0 ? 0 : rounds - array[index - 1].raceStats.rounds,
			diff: index === 0 ? 0 : rounds - array[0].raceStats.rounds,
			avgTime: 600 / rounds
		}))
		.map(({ fastestLapTime, ...result }, index, array) => ({
			...result,
			fastestLapTime,
			factor: index === array.length - 1 ? 0 : fastestLapTime / array[index + 1].avgTime
		}))
		.map(({ factor, ...result }, index, array) => ({
			...result,
			factor,
			deltaFromFactor:
				index === array.length - 1 ? 0 : Math.ceil(Math.abs(factor * array[index + 1].delta))
		}))
		.map(({ racer }, index, array) => ({
			racer,
			startRound: Math.round(
				array
					.filter((_, i) => index <= i)
					.reverse()
					.reduce((prev, { deltaFromFactor }) => prev + deltaFromFactor, 0) * 1.7
			)
		}))
		.reduce(
			(prev, { racer, startRound }) => ({
				...prev,
				[racer]: startRound
			}),
			{}
		);
};
const getInfo = (cup: CupContent): Cup['info'] => {
	const hasRecord =
		cup.info?.record &&
		(['racer', 'time'] as (keyof CupInfo['record'])[]).some((k) => !!cup.info?.record[k]);
	const record: Cup['info']['record'] = hasRecord
		? {
				racer: cup.info?.record?.racer,
				time: cup.info?.record?.time,
				date: formatDate(cup.info?.record?.date)
		  }
		: undefined;

	return {
		trackLength: cup.info?.trackLength,
		pitLaneLength: cup.info?.pitLaneLength,
		record
	};
};
const getLiveSessionId = ({
	liveSessionId,
	date
}: Pick<CupContent, 'liveSessionId' | 'date'>): string | undefined => {
	if (!liveSessionId || !date) {
		return undefined;
	}

	const dateObj = new Date(date);
	const now = new Date();
	if (+now - ms('3d') > +dateObj || +now + ms('2d') < +dateObj) {
		return undefined;
	}

	return liveSessionId;
};
const getPoints = (
	results: Results,
	participation: Participation,
	points: number[]
): Record<string, number> => {
	const resultsArr = resultToArr(results);
	return (
		Object.keys(racers)
			.map((racer) => {
				let p = 0;

				if (!participation[racer]) {
					const notParticipatingDriverCount = Object.keys(racers).filter(
						(i) => !participation[i]
					).length;
					const sharedPoints = [...points]
						.reverse()
						.filter((_, i) => i < notParticipatingDriverCount)
						.reduce((prev, curr) => prev + curr, 0);

					p = sharedPoints / notParticipatingDriverCount;
				} else {
					const index = resultsArr.findIndex((result) => result.racer === racer);
					if (index >= 0) {
						p = points[index];
					}
				}
				return { racer, points: p };
			})
			.reduce(
				(prev, { racer, points }) => ({
					...prev,
					[racer]: points
				}),
				{}
			) ?? {}
	);
};
const getOrder = (points: Cup['points'][keyof Cup['points']]): string[] =>
	Object.entries(points)
		.filter(([, points]) => !!points)
		.sort(([, a], [, b]) => (a < b ? 1 : -1))
		.map(([key]) => key);

export const cupConverter = (cup: CupContent): Cup => {
	const rawPoints: Omit<Cup['points'], 'total'> = {
		mainRace: getPoints(cup.results?.mainRace, cup.participation ?? {}, [10, 8, 6, 4, 2, 1]),
		timeTrial: getPoints(cup.results?.timeTrial, cup.participation ?? {}, [6, 5, 4, 3, 2, 1]),
		fastestLap: (cup.results?.fastestLap
			? { [cup.results?.fastestLap as string]: 1 }
			: {}) as Record<string, number>,
		penalty: (cup.results?.penalties ?? {}) as Record<string, number>
	};

	const total = Object.keys(racers).reduce(
		(prev, racer) => ({
			...prev,
			[racer]: Object.entries(rawPoints)
				.map(([key, points]) => (points[racer] ?? 0) * (key !== 'penalty' ? 1 : -1))
				.reduce((sum, points) => sum + points, 0)
		}),
		{}
	);

	const orderMainRace = getOrder(rawPoints.mainRace);

	const startOrderForMainRace = getStartOrderForMainRace(
		cup.results?.timeTrial,
		cup.participation ?? {}
	);

	const pointsDone: Cup['pointsDone'] = {
		mainRace: !!resultToArr(cup.results?.mainRace ?? {}).filter(({ racer }) => !!racer).length,
		timeTrial: !!resultToArr(cup.results?.timeTrial ?? {}).filter(({ racer }) => !!racer).length,
		fastestLap: !!cup.results?.fastestLap
	};

	return {
		title: cup.title,
		slug: cup.slug,
		points: {
			...rawPoints,
			total
		},
		pointsDone,
		fastestLap: cup.results?.fastestLap,
		penalties: cup.results?.penalties ?? {},
		order: orderMainRace,
		info: getInfo(cup),
		date: formatDate(cup.date),
		liveSessionId: getLiveSessionId(cup),
		layout: cup.layout,
		startOrderForMainRace: Object.keys(startOrderForMainRace ?? {}).length
			? startOrderForMainRace
			: undefined
	};
};
