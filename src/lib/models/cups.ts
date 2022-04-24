export interface Cup {
  slug: string;
  title: string;
  points: Record<'mainRace'|'timeTrial'|'penalty'|'fastestLap'|'total', Record<string, number>>;
  penalties: Record<string, number>;
  fastestLap?: string;
  order: string[];
  date: string;
  layout?: string;
  startOrderForMainRace: Record<string, number>;

  pointsDone: Record<'mainRace'|'timeTrial'|'fastestLap', boolean>;

  info: {
    trackLength?: number;
    pitLaneLength?: number;
    record?: {
      racer?: string;
      time?: number;
      date?: string;
    }
  }
}
