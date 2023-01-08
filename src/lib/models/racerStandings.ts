export interface RacerStandingsStandings {
	name: string;
	points: number;
	wins: number;
	podiums: number;
	fastestLaps: number;
	mayStillWin: boolean;
	pointsWithDiscardedResults: number;
}
export interface RacerStandings {
	hasDiscardedResults: boolean;
	standings: RacerStandingsStandings[];
}

export interface ManufacturerStandingsStandings {
	name: string;
	points: number;
	wins: number;
	podiums: number;
	fastestLaps: number;
	mayStillWin: boolean;
	pointsWithDiscardedResults: number;
}
export interface ManufacturerStandings {
	hasDiscardedResults: boolean;
	standings: ManufacturerStandingsStandings[];
}
