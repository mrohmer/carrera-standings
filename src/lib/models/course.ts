interface CourseCup {
  cupTitle: string;
  date: string;
  points?: Record<string, number>;
  order?: string[];
}
export type Course = CourseCup[];
