
import React, { useState } from 'react';
import { PlanData, GeneratedPlan } from './types';
import PlannerForm from './components/PlannerForm';
import PlannerPreview from './components/PlannerPreview';
import { generatePlanDays } from './utils/dateHelpers';

const App: React.FC = () => {
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  const handleGeneratePlan = (data: PlanData) => {
    const planDays = generatePlanDays(data);
    setGeneratedPlan({
      ...data,
      days: planDays,
    });
  };

  const handleBackToForm = () => {
    setGeneratedPlan(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {generatedPlan ? (
        <PlannerPreview plan={generatedPlan} onBack={handleBackToForm} />
      ) : (
        <PlannerForm onSubmit={handleGeneratePlan} />
      )}
    </div>
  );
};

export default App;
