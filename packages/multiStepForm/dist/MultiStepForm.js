import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
const MultiStepForm = ({ children, onSubmit, formClassName = "", stepIndicatorClassName = "", buttonClassName = "", }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = React.Children.toArray(children);
    const totalSteps = steps.length;
    const isLastStep = currentStep === totalSteps - 1;
    const nextStep = () => {
        if (currentStep < totalSteps - 1)
            setCurrentStep(currentStep + 1);
    };
    const prevStep = () => {
        if (currentStep > 0)
            setCurrentStep(currentStep - 1);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLastStep && onSubmit) {
            onSubmit();
        }
        else {
            nextStep();
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: `multistep-form ${formClassName}`, children: [_jsx("div", { className: `flex justify-center mb-4 ${stepIndicatorClassName}`, children: steps.map((_, index) => (_jsx("div", { className: `w-8 h-8 flex items-center justify-center rounded-full font-bold mx-1 
              ${index === currentStep ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}
            `, children: index + 1 }, index))) }), _jsx("div", { className: "step-content", children: steps[currentStep] }), _jsxs("div", { className: "flex justify-between mt-6", children: [currentStep > 0 && (_jsx("button", { type: "button", onClick: prevStep, className: `px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition ${buttonClassName}`, children: "Previous" })), _jsx("button", { type: "submit", className: `px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ml-auto ${buttonClassName}`, children: isLastStep ? "Submit" : "Next" })] })] }));
};
export default MultiStepForm;
