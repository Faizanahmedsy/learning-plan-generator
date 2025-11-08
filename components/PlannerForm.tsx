import React, { useState, useMemo, useEffect } from 'react';
import { PlanData, DailySchedule, DAYS_OF_WEEK } from '../types';
import { PlusIcon, TrashIcon, CalendarIcon } from './icons';

interface PlannerFormProps {
  onSubmit: (data: PlanData) => void;
}

const LOCAL_STORAGE_KEY = 'plannerFormData';

const getInitialData = (): PlanData => {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed && typeof parsed === 'object') {
                 // Ensure defaults for missing/malformed properties
                return {
                    userName: parsed.userName || '',
                    startDate: parsed.startDate || '',
                    endDate: parsed.endDate || '',
                    habits: Array.isArray(parsed.habits) && parsed.habits.length > 0 ? parsed.habits : [''],
                    dailySchedules: Array.isArray(parsed.dailySchedules) ? parsed.dailySchedules.map((s: any) => ({...s, id: s.id || crypto.randomUUID()})) : [],
                };
            }
        }
    } catch (error) {
        console.error("Failed to parse form data from localStorage", error);
    }
    // Return default structure if no saved data or parsing fails
    return {
        userName: '',
        startDate: '',
        endDate: '',
        habits: [''],
        dailySchedules: [],
    };
};


const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PlanData>(getInitialData);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);
  
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddHabit = () => setFormData(prev => ({ ...prev, habits: [...prev.habits, '']}));

  const handleRemoveHabit = (index: number) => {
    setFormData(prev => ({ ...prev, habits: prev.habits.filter((_, i) => i !== index)}));
  };
  
  const handleHabitChange = (index: number, value: string) => {
    setFormData(prev => {
        const newHabits = [...prev.habits];
        newHabits[index] = value;
        return {...prev, habits: newHabits};
    });
  };

  const handleAddSchedule = () => {
    setFormData(prev => ({
        ...prev, 
        dailySchedules: [...prev.dailySchedules, { id: crypto.randomUUID(), days: [], hours: 1, tasks: [''] }]
    }));
  };
  
  const handleRemoveSchedule = (id: string) => {
    setFormData(prev => ({...prev, dailySchedules: prev.dailySchedules.filter(s => s.id !== id)}));
  };
  
  const handleScheduleChange = <K extends keyof DailySchedule>(id: string, field: K, value: DailySchedule[K]) => {
    setFormData(prev => {
        const newSchedules = prev.dailySchedules.map(s => {
            if (s.id === id) {
                const updatedSchedule = { ...s, [field]: value };
                if (field === 'hours') {
                   const newHours = Math.max(1, Number(value) || 1);
                   updatedSchedule.tasks = Array.from({ length: newHours }, (_, i) => updatedSchedule.tasks[i] || '');
                }
                return updatedSchedule;
            }
            return s;
        });
        return {...prev, dailySchedules: newSchedules};
    });
  };

  const handleTaskChange = (scheduleId: string, taskIndex: number, value: string) => {
     setFormData(prev => {
        const newSchedules = prev.dailySchedules.map(s => {
            if(s.id === scheduleId) {
                const newTasks = [...s.tasks];
                newTasks[taskIndex] = value;
                return {...s, tasks: newTasks};
            }
            return s;
        });
        return {...prev, dailySchedules: newSchedules};
     });
  }
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear the entire form? This action cannot be undone.')) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setFormData({
            userName: '',
            startDate: '',
            endDate: '',
            habits: [''],
            dailySchedules: [],
        });
        setError('');
    }
  };

  const selectedDays = useMemo(() => {
    return new Set(formData.dailySchedules.flatMap(s => s.days));
  }, [formData.dailySchedules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { userName, startDate, endDate, dailySchedules, habits } = formData;

    if (!userName || !startDate || !endDate) {
      setError('Please fill in your name and select a start and end date.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
        setError('End date must be after the start date.');
        return;
    }
    if (dailySchedules.length === 0) {
        setError('Please add at least one daily schedule.');
        return;
    }
    if (selectedDays.size !== 7) {
        setError('Please ensure all 7 days of the week are assigned to a schedule.');
        return;
    }
    if (dailySchedules.some(s => s.days.length === 0)) {
        setError('Each schedule group must have at least one day selected.');
        return;
    }

    const finalHabits = habits.map(h => h.trim()).filter(h => h);
    
    onSubmit({ ...formData, habits: finalHabits });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Custom Learning Planner</h1>
        <p className="text-slate-600 mt-2">Create your personalized, printable journal for learning and growth.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
        
        {/* Section 1: Basic Info */}
        <div className="p-6 border rounded-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Step 1: The Basics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                    <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                    <input type="text" id="userName" value={formData.userName} onChange={handleFieldChange} placeholder="e.g., Faizan" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="startDate" className="flex items-center text-sm font-medium text-slate-700 mb-1"><CalendarIcon className="w-4 h-4 mr-2"/> Start Date</label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleFieldChange} min={today} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="endDate" className="flex items-center text-sm font-medium text-slate-700 mb-1"><CalendarIcon className="w-4 h-4 mr-2"/> End Date</label>
                    <input type="date" id="endDate" value={formData.endDate} onChange={handleFieldChange} min={formData.startDate || today} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
                </div>
            </div>
        </div>

        {/* Section 2: Habits */}
        <div className="p-6 border rounded-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Step 2: Daily Habits</h2>
            <div className="space-y-3">
            {formData.habits.map((habit, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input type="text" value={habit} onChange={e => handleHabitChange(index, e.target.value)} placeholder={`Habit ${index + 1}`} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
                    <button type="button" onClick={() => handleRemoveHabit(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-md disabled:opacity-50" disabled={formData.habits.length <= 1}>
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            ))}
            </div>
            <button type="button" onClick={handleAddHabit} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <PlusIcon className="w-5 h-5"/> Add Another Habit
            </button>
        </div>

        {/* Section 3: Schedules */}
        <div className="p-6 border rounded-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Step 3: Daily Study Schedules</h2>
            <div className="space-y-6">
                {formData.dailySchedules.map(schedule => (
                    <div key={schedule.id} className="p-4 border rounded-md bg-slate-50 relative">
                         <button type="button" onClick={() => handleRemoveSchedule(schedule.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-md">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Days for this Schedule:</label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {DAYS_OF_WEEK.map(day => {
                                    const isSelected = schedule.days.includes(day.id);
                                    const isDisabled = selectedDays.has(day.id) && !isSelected;
                                    return (
                                        <button 
                                            key={day.id} 
                                            type="button"
                                            onClick={() => {
                                                const newDays = isSelected ? schedule.days.filter(d => d !== day.id) : [...schedule.days, day.id].sort((a,b) => a-b);
                                                handleScheduleChange(schedule.id, 'days', newDays);
                                            }}
                                            disabled={isDisabled}
                                            className={`p-2 text-sm border rounded-md transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-indigo-50'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {day.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hours of Study for these days:</label>
                            <input type="number" min="1" max="12" value={schedule.hours} onChange={e => handleScheduleChange(schedule.id, 'hours', parseInt(e.target.value, 10))} className="w-24 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Tasks:</label>
                            <div className="space-y-2">
                                {schedule.tasks.map((task, taskIndex) => (
                                    <div key={taskIndex} className="flex items-center gap-2">
                                        <span className="text-sm text-slate-500 w-16">Hour {taskIndex+1}:</span>
                                        <input type="text" value={task} onChange={e => handleTaskChange(schedule.id, taskIndex, e.target.value)} placeholder={`Task for hour ${taskIndex + 1}`} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddSchedule} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <PlusIcon className="w-5 h-5"/> Add Schedule Group
            </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
                type="button" 
                onClick={handleReset} 
                className="bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-md hover:bg-slate-300 transition-colors text-lg w-full sm:w-auto">
                Reset Form
            </button>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-md hover:bg-indigo-700 transition-colors text-lg w-full sm:w-auto">
                Generate My Plan
            </button>
        </div>
      </form>
    </div>
  );
};

export default PlannerForm;