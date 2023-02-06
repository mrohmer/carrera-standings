import type { Cup } from './cups';

export interface CourseCup {
	cup: Pick<Cup, 'title' | 'order' | 'points'>;
	date: string;
	order?: string[];
}
export type Course = CourseCup[];
