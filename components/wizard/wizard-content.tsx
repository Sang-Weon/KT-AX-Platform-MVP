"use client";

import { usePlatformStore } from "@/lib/store";
import { Step0Environment } from "./step-0-environment";
import { Step1Goal } from "./step-1-goal";
import { Step2Data } from "./step-2-data";
import { Step3Relation } from "./step-3-relation";
import { Step4Event } from "./step-4-event";
import { Step5Agent } from "./step-5-agent";
import { Step6Verify } from "./step-6-verify";
import { Step7Deploy } from "./step-7-deploy";

export function WizardContent() {
  const { currentStep } = usePlatformStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0Environment />;
      case 1:
        return <Step1Goal />;
      case 2:
        return <Step2Data />;
      case 3:
        return <Step3Relation />;
      case 4:
        return <Step4Event />;
      case 5:
        return <Step5Agent />;
      case 6:
        return <Step6Verify />;
      case 7:
        return <Step7Deploy />;
      default:
        return <Step0Environment />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {renderStep()}
    </div>
  );
}
