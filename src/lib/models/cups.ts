export interface Cup {
  slug: string;
  title: string;
  points: Record<'mainRace'|'timeTrial'|'penalty'|'fastestLap'|'total', Record<string, number>>;
  penalties: Record<string, number>;
  fastestLap?: string;
  order: string[];

  pointsDone: Record<'mainRace'|'timeTrial'|'fastestLap', boolean>;
}
