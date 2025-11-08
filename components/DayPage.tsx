
import React from 'react';
import { GeneratedDay } from '../types';
import { formatDate } from '../utils/dateHelpers';

interface DayPageProps {
  day: GeneratedDay;
  habits: string[];
  userName: string;
  totalPages: number;
}

const weekColors = [
    'border-sky-200',
    'border-emerald-200',
    'border-amber-200',
    'border-violet-200',
    'border-rose-200',
    'border-cyan-200',
    'border-fuchsia-200',
];

const LinedSection: React.FC<{ title: string; lines: number }> = ({ title, lines }) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2 tracking-wide">{title}</h3>
        <div className="lined border border-slate-200 rounded-md p-2" style={{ height: `${lines * 32}px` }}></div>
    </div>
);


const DayPage: React.FC<DayPageProps> = ({ day, habits, userName, totalPages }) => {
    const colorClass = weekColors[day.weekNumber % weekColors.length];
    
  return (
    <div className={`page bg-white shadow-lg p-8 border-t-8 ${colorClass}`}>
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{formatDate(day.date)}</h2>
          <p className="text-sm text-slate-500">Week {day.weekNumber}</p>
        </div>
        <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">{userName}'s Plan</p>
            <p className="text-sm text-slate-500">Day {day.dayNumber} of {totalPages}</p>
        </div>
      </header>
      
      <main className="grid grid-cols-3 gap-6">
        {/* Left Column: Habits & Summary */}
        <div className="col-span-1 space-y-6">
            {habits.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2 tracking-wide">Habit Tracker</h3>
                    <div className="space-y-2">
                    {habits.map((habit, index) => (
                        <div key={index} className="flex items-center gap-3 bg-slate-50 p-2 rounded-md">
                            <div className="w-5 h-5 border-2 border-slate-400 rounded"></div>
                            <span className="text-slate-700">{habit}</span>
                        </div>
                    ))}
                    </div>
                </div>
            )}
            <LinedSection title="Today's Wins" lines={5} />
            <LinedSection title="Challenges & Learnings" lines={5} />
        </div>

        {/* Right Column: Schedule & Notes */}
        <div className="col-span-2 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2 tracking-wide">Hourly Schedule</h3>
                <div className="border border-slate-200 rounded-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3 font-medium text-slate-600 w-1/4">Time</th>
                                <th className="p-3 font-medium text-slate-600 w-1/2">Task</th>
                                <th className="p-3 font-medium text-slate-600 w-1/4">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.tasks.length > 0 ? day.tasks.map((task, index) => (
                                <tr key={index} className="border-t border-slate-200">
                                    <td className="p-3 align-top font-medium text-slate-500">Hour {index + 1}</td>
                                    <td className="p-3 align-top text-slate-800">{task}</td>
                                    <td className="p-3 align-top">
                                      <div className="h-16 w-full bg-repeat-y" style={{backgroundImage: 'linear-gradient(to bottom, transparent 19px, #e5e7eb 20px)', backgroundSize: '100% 20px', lineHeight: '20px'}}></div>
                                    </td>
                                </tr>
                            )) : (
                                <tr className="border-t border-slate-200">
                                    <td colSpan={3} className="p-3 text-center text-slate-500 h-24">Rest Day / Free Study</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LinedSection title="Daily Journal & Reflections" lines={10} />
        </div>
      </main>
    </div>
  );
};

export default DayPage;
