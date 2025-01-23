import React from "react";

interface StepperProps {
    steps: string[];
    currentStep: number;
    onStepChange: (step: number) => void;
    className?: string;
    renderStep?: (step: number, label: string, props: {
        isActive: boolean;
        isCompleted: boolean;
        onClick: () => void;
    }) => React.ReactNode;
}

const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    onStepChange,
    className,
    renderStep,
}) => {
    const handleClick = (step: number) => onStepChange(step);

    return (
        <div className={`stepper ${className}`}>
            <ul className="stepper-list">
                {steps.map((label, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    if (renderStep) {
                        return (
                            <li key={index}>
                                {renderStep(index, label, {
                                    isActive,
                                    isCompleted,
                                    onClick: () => handleClick(index),
                                })}
                            </li>
                        );
                    }

                    return (
                        <li
                            key={index}
                            className={`stepper-step ${isActive ? 'active' : ''} ${
                                isCompleted ? 'completed' : ''
                            }`}
                            onClick={() => handleClick(index)}
                        >
                            <div className="stepper-circle">{index + 1}</div>
                            <div className="stepper-label">{label}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Stepper;
