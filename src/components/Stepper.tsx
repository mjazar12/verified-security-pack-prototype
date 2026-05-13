import { demoSteps, type DemoStepId } from "../data/scenario";

interface StepperProps {
  activeStep: DemoStepId;
  canVisit: (step: DemoStepId) => boolean;
  onStep: (step: DemoStepId) => void;
}

export function Stepper({ activeStep, canVisit, onStep }: StepperProps) {
  return (
    <nav className="stepper" aria-label="Guided demo steps">
      {demoSteps.map((step, index) => {
        const isActive = step.id === activeStep;
        const enabled = canVisit(step.id);
        return (
          <button
            className={`step ${isActive ? "active" : ""}`}
            type="button"
            key={step.id}
            onClick={() => onStep(step.id)}
            disabled={!enabled}
            title={enabled ? step.title : "Locked until the scenario reaches this point"}
          >
            <span>{index + 1}</span>
            <b>{step.label}</b>
          </button>
        );
      })}
    </nav>
  );
}
