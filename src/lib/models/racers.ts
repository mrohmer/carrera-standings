export interface Racer {
  manufacturer: string;
  color: string;
}
export type Racers = Record<string, Racer>;
