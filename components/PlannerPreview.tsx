import React, { useState, useEffect } from 'react';
import { GeneratedPlan } from '../types';
import DayPage from './DayPage';
import { formatDate } from '../utils/dateHelpers';
import { ArrowLeftIcon, PrinterIcon } from './icons';

interface PlannerPreviewProps {
  plan: GeneratedPlan;
  onBack: () => void;
}

const PlannerPreview: React.FC<PlannerPreviewProps> = ({ plan, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const totalDays = plan.days.length;
  const totalWeeks = totalDays > 0 ? Math.ceil(totalDays / 7) : 0;

  useEffect(() => {
    // This timeout gives the browser a moment to render the loading indicator
    // before we kick off the heavy render of all the pages.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  // This effect handles hiding the header controls during the print operation
  // for a cleaner PDF output.
  useEffect(() => {
    const controls = document.querySelector('.no-print-header');
    if (!controls) return;

    const handleBeforePrint = () => {
      (controls as HTMLElement).style.visibility = 'hidden';
    };
    const handleAfterPrint = () => {
      (controls as HTMLElement).style.visibility = 'visible';
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handlePrint = () => {
    if (!isLoading) {
      window.print();
    }
  };

  return (
    <div className="bg-slate-200">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between p-4 bg-white/80 backdrop-blur-sm shadow-sm no-print no-print-header">
        <button onClick={onBack} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 flex items-center gap-2 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Form
        </button>
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          <PrinterIcon className="w-5 h-5" />
          {isLoading ? 'Preparing Preview...' : 'Print / Save as PDF'}
        </button>
      </header>

      {isLoading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-40 no-print">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-700">Generating Your Plan...</h2>
            <p className="text-slate-500 mt-2">
              Please wait while we prepare your {totalDays}-page document.
              <br/>
              The app may freeze for a moment during this process.
            </p>
            <div className="mt-4 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Add padding-top to account for fixed header. Pages are only rendered when not loading. */}
      <div className="mx-auto flex flex-col items-center gap-8 py-8 pt-24">
        {!isLoading && (
          <>
            {/* Title Page */}
            <div className="page bg-white shadow-lg flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-5xl font-bold text-slate-800">My Learning Plan</h1>
                <p className="text-3xl mt-4 text-indigo-600">{plan.userName}</p>
                <div className="mt-12 border-t pt-8 w-full max-w-md">
                    <p className="text-xl text-slate-600">{formatDate(new Date(plan.startDate))}</p>
                    <p className="text-lg text-slate-500 my-2">to</p>
                    <p className="text-xl text-slate-600">{formatDate(new Date(plan.endDate))}</p>
                </div>
                <div className="mt-8 text-lg text-slate-500">
                    <p>{totalDays} Days</p>
                    <p>{totalWeeks} Weeks</p>
                </div>
            </div>

            {plan.days.map((day) => (
              <DayPage
                key={day.date.toISOString()}
                day={day}
                habits={plan.habits}
                userName={plan.userName}
                totalPages={totalDays}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlannerPreview;