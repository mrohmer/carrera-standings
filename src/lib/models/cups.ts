export interface Cup {
  title: string;
  points: Record<'mainRace'|'timeTrial'|'penalty'|'fastestLap'|'total', Record<string, number>>;
  penalties: Record<string, number>;
  fastestLap?: string;
  order: string[];
}
