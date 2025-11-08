
export interface DailySchedule {
  id: string;
  days: number[]; // 0 for Sunday, 1 for Monday, etc.
  hours: number;
  tasks: string[];
}

export interface PlanData {
  userName: string;
  startDate: string;
  endDate: string;
  habits: string[];
  dailySchedules: DailySchedule[];
}

export interface GeneratedDay {
  date: Date;
  dayNumber: number;
  weekNumber: number;
  tasks: string[];
}

export interface GeneratedPlan extends PlanData {
  days: GeneratedDay[];
}

export const DAYS_OF_WEEK = [
  { id: 1, name: 'Mon' },
  { id: 2, name: 'Tue' },
  { id: 3, name: 'Wed' },
  { id: 4, name: 'Thu' },
  { id: 5, name: 'Fri' },
  { id: 6, name: 'Sat' },
  { id: 0, name: 'Sun' },
];
