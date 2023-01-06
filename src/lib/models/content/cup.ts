export type CupContentParticipation = string[];
export type CupContentPenalties = (Record<'racer', string> & Record<'points', number>)[];
export type CupContentResult = Record<'racer', string> &
	Partial<Record<'raceStats', Record<'rounds' | 'fastestLapTime', number>>>;
export type CupContentPositionResult = Record<`pos${number}`, CupContentResult>;
export type CupContentRecord = Record<'racer' | 'date', string> & Record<'time', number>;

export type CupContentInfo = Record<'record', CupContentRecord> &
	Record<'trackLength' | 'pitLaneLength', number>;
export type CupContentResults = Record<'mainRace' | 'timeTrial', CupContentPositionResult> &
	Record<'fastestLap', string> &
	Record<'penalties', CupContentPenalties>;

export interface CupContent {
	info: CupContentInfo;
	results: CupContentResults;
	participation: CupContentParticipation;
	title: string;
	slug: string;
	date: string;
	liveSessionId: string;
	layout: string;
}
