export type Points = Record<
	'mainRace' | 'timeTrial' | 'penalty' | 'fastestLap' | 'total',
	Record<string, number>
>;
export interface Cup {
	slug: string;
	title: string;
	points: Points;
	manufacturerPoints?: Points;
	penalties: Record<string, number>;
	fastestLap?: string;
	order: string[];
	manufacturerOrder?: string[];
	date?: string;
	liveSessionId?: string;
	layout?: string;
	startOrderForMainRace?: Record<string, number>;

	pointsDone: Record<'mainRace' | 'timeTrial' | 'fastestLap', boolean>;

	info: {
		trackLength?: Partial<Record<'average' | 'innerTrack' | 'outerTrack', number>>;
		pitLaneLength?: number;
		record?: {
			racer?: string;
			time?: number;
			date?: string;
		};
	};
}
