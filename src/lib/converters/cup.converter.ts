import type {Cup} from '../models';
import racers from '../../../content/racer.json';

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
  'Dezember',
];

const formatDate = (date: Date | string): string | undefined => {
  if (!date) {
    return undefined;
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
const getStartOrderForMainRace = (results): Record<string, number> => {
  return results
    ?.filter(({noParticipation, rounds, fastestLapTime}) => !noParticipation && !!rounds && !!fastestLapTime)
    .sort((a, b) => {
      if (a.rounds === b.rounds) {
        return a.fastestLapTime > b.fastestLapTime ? 1 : -1
      }
      return a.rounds < b.rounds ? 1 : -1
    })
    .map(({rounds, ...result}, index, array) => ({
      ...result,
      rounds,
      delta: index === 0 ? 0 : rounds - array[index - 1].rounds,
      diff: index === 0 ? 0 : rounds - array[0].rounds,
      avgTime: 600 / rounds,
    }))
    .map(({rounds, fastestLapTime, ...result}, index, array) => ({
      ...result,
      rounds,
      fastestLapTime,
      factor: index === array.length - 1 ? 0 : fastestLapTime / array[index + 1].avgTime,
    }))
    .map(({factor, ...result}, index, array) => ({
      ...result,
      factor,
      deltaFromFactor: index === array.length - 1 ? 0 : Math.ceil(Math.abs(factor * array[index + 1].delta)),
    }))
    .map(({racer}, index, array) => ({
      racer,
      startRound: Math.round(array
        .filter((_, i) => index <= i)
        .reverse()
        .reduce(
          (prev, {deltaFromFactor}) => prev + deltaFromFactor,
          0,
        ) * 1.7),
    }))
    .reduce(
      (prev, {racer, startRound}) => ({
        ...prev,
        [racer]: startRound,
      }),
      {}
    )
    ;
}
const getInfo = (cup): Cup['info'] => {
  const record: Cup['info']['record'] = cup.info?.record && ['racer', 'time'].some(k => !!cup.info?.record[k]) ? {
    racer: cup.info?.record?.racer,
    time: cup.info?.record?.time,
    date: formatDate(cup.info?.record?.date),
  } : undefined;

  return {
    trackLength: cup.info?.trackLength,
    pitLaneLength: cup.info?.pitLaneLength,
    record,
  };
}
const getPoints = (results, points: number[]): Record<string, number> => {
  return results?.reduce(
    (prev, {racer, penalty, noParticipation}, index) => ({
      ...prev,
      [racer]: !noParticipation ? points[index] : points[points.length - 1],
    }),
    {},
  ) ?? {};
};
const getOrder = (points: Cup['points'][string]): string[] => Object.entries(points)
  .filter(([, points]) => !!points)
  .sort(([, a], [, b]) => a < b ? 1 : -1)
  .map(([key]) => key);
export const cupConverter = (cup): Cup => {
  const rawPoints: Omit<Cup['points'], 'total'> = {
    mainRace: getPoints(cup.results?.mainRace, [10, 8, 6, 4, 2, 1]),
    timeTrial: getPoints(cup.results?.timeTrial, [6, 5, 4, 3, 2, 1]),
    fastestLap: (cup.results?.fastestLap ? {[cup.results?.fastestLap as string]: 1} : {}) as Record<string, number>,
    penalty: (cup.results?.mainRace?.reduce(
      (prev, {racer, penalty}) => ({
        ...prev,
        [racer]: penalty ? -penalty : 0,
      }),
      {},
    ) ?? {}) as Record<string, number>
  };

  const total = Object.keys(racers).reduce(
    (prev, racer) => ({
      ...prev,
      [racer]: Object.values(rawPoints)
        .map(points => points[racer] ?? 0)
        .reduce(
          (sum, points) => sum + points,
          0,
        ),
    }),
    {},
  );

  const orderMainRace = getOrder(rawPoints.mainRace);

  const startOrderForMainRace = getStartOrderForMainRace(cup.results?.timeTrial);

  const pointsDone: Cup['pointsDone'] = {
    mainRace: !!cup.results?.mainRace?.length,
    timeTrial: !!cup.results?.timeTrial?.length,
    fastestLap: !!cup.results?.fastestLap,
  };

  return {
    title: cup.title,
    slug: cup.slug,
    points: {
      ...rawPoints,
      total,
    },
    pointsDone,
    fastestLap: cup.results?.fastestLap,
    penalties: cup.results?.mainRace?.filter(({penalty}) => !!penalty).reduce((prev, {racer, penalty}) => ({
      ...prev,
      [racer]: penalty
    }), {}) ?? {},
    order: orderMainRace,
    info: getInfo(cup),
    date: formatDate(cup.date),
    layout: cup.layout,
    startOrderForMainRace: Object.keys(startOrderForMainRace ?? {}).length ? startOrderForMainRace : undefined,
  }
}
