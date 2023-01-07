export interface Cup {
	slug: string;
	title: string;
	points: Record<
		'mainRace' | 'timeTrial' | 'penalty' | 'fastestLap' | 'total',
		Record<string, number>
	>;
	penalties: Record<string, number>;
	fastestLap?: string;
	order: string[];
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
