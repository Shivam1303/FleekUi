import React, { useState } from "react";

interface MultiStepFormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  formClassName?: string;
  stepIndicatorClassName?: string;
  buttonClassName?: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  children,
  onSubmit,
  formClassName = "",
  stepIndicatorClassName = "",
  buttonClassName = "",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = React.Children.toArray(children);
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`multistep-form ${formClassName}`}>
      {/* Step Indicator */}
      <div className={`flex justify-center mb-4 ${stepIndicatorClassName}`}>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mx-1 
              ${index === currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}
            `}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="step-content">{steps[currentStep]}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={prevStep}
            className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition ${buttonClassName}`}
          >
            Previous
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ml-auto ${buttonClassName}`}
        >
          {isLastStep ? "Submit" : "Next"}
        </button>
      </div>
    </form>
  );
};

export default MultiStepForm;
