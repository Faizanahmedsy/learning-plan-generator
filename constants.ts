import { PlanData, DailySchedule } from './types';

/**
 * Toggles test mode for the application.
 * When true, the form will be pre-filled with dummy data for easy testing.
 * Set to false for production use.
 */
export const IS_TEST_MODE = true;

/**
 * Dummy data for testing the planner form.
 * This data will be used to pre-fill the form when IS_TEST_MODE is true.
 */
export const DUMMY_DATA: Omit<PlanData, 'dailySchedules'> & { dailySchedules: Omit<DailySchedule, 'id'>[] } = {
  userName: 'Faizan (Test)',
  startDate: '2025-11-08',
  endDate: '2026-02-01',
  habits: [
    'Read for 30 minutes',
    'Drink 8 glasses of water',
    'Morning meditation',
    'Review daily notes'
  ],
  dailySchedules: [
    {
      days: [1, 2, 3, 4], // Mon, Tue, Wed, Thu
      hours: 3,
      tasks: [
        'Study Data Structures',
        'Practice Algorithm Problems',
        'Review Previous Concepts'
      ]
    },
    {
      days: [5], // Fri
      hours: 6,
      tasks: [
        'Work on Personal Project',
        'Learn a new Framework feature',
        'Code Review and Refactoring',
        'Explore advanced documentation',
        'Document project progress',
        'Plan weekend study session'
      ]
    },
    {
      days: [0, 6], // Sun, Sat
      hours: 8,
      tasks: [
        'Full-day project build',
        'Deep dive into a new technology',
        'Pair programming session',
        'Lunch and recharge break',
        'Continue project build',
        'Debug and test features',
        'Weekly progress review',
        'Prepare for the upcoming week'
      ]
    }
  ]
};
