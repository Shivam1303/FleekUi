import React from "react";
interface MultiStepFormProps {
    children: React.ReactNode;
    onSubmit?: () => void;
    formClassName?: string;
    stepIndicatorClassName?: string;
    buttonClassName?: string;
}
declare const MultiStepForm: React.FC<MultiStepFormProps>;
export default MultiStepForm;
