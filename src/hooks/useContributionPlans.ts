
import { useContext } from "react";

import {
  ContributionPlanContext,
} from "../context/ContributionPlanContext";


export const useContributionPlans = () => {

  const context =
    useContext(ContributionPlanContext);

  if (!context) {

    throw new Error(
      "useContributionPlans must be used inside ContributionPlanProvider"
    );

  }

  return context;

};
