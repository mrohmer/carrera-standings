export interface Standings {
	hasDiscardedResults: boolean;
	standings: {
		name: string;
		points: number;
		wins: number;
		podiums: number;
		fastestLaps: number;
		mayStillWin: boolean;
		pointsWithDiscardedResults: number;
	}[];
}
