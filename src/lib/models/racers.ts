export interface Racer {
	key: string;
	manufacturer: string;
	color: string;
}
export type Racers = Record<string, Racer>;
