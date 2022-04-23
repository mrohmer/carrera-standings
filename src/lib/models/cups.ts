export interface Cup {
  slug: string;
  title: string;
  points: Record<'mainRace'|'timeTrial'|'penalty'|'fastestLap'|'total', Record<string, number>>;
  penalties: Record<string, number>;
  fastestLap?: string;
  order: string[];
  date: string;

  pointsDone: Record<'mainRace'|'timeTrial'|'fastestLap', boolean>;

  info: {
    trackLength?: number;
    pitLaneLength?: number;
    rounds?: number;
  }
}
