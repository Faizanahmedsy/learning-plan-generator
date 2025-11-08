
import { PlanData, GeneratedDay } from '../types';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const generatePlanDays = (data: PlanData): GeneratedDay[] => {
  const { startDate, endDate, dailySchedules } = data;
  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0); // Normalize to start of day in UTC
  const end = new Date(endDate);
  end.setUTCHours(0, 0, 0, 0); // Normalize to end of day in UTC

  const generatedDays: GeneratedDay[] = [];
  let currentDate = new Date(start);
  let dayNumber = 1;

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getUTCDay(); // Sunday = 0, Monday = 1
    const weekNumber = Math.floor((dayNumber - 1) / 7) + 1;

    const schedule = dailySchedules.find(s => s.days.includes(dayOfWeek));
    
    generatedDays.push({
      date: new Date(currentDate),
      dayNumber,
      weekNumber,
      tasks: schedule ? schedule.tasks : [],
    });

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    dayNumber++;
  }

  return generatedDays;
};
