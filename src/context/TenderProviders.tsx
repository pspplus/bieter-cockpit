
import React from "react";
import { TenderProvider } from "./TenderContext";
import { MilestoneProvider } from "./MilestoneContext";

type TenderProvidersProps = {
  children: React.ReactNode;
};

export const TenderProviders: React.FC<TenderProvidersProps> = ({ children }) => {
  return (
    <TenderProvider>
      <MilestoneProvider>
        {children}
      </MilestoneProvider>
    </TenderProvider>
  );
};
