import { useContext } from "react";

import {
  ContributionRuleContext,
} from "../context/ContributionRuleContext";

export const useContributionRules = () => {

  const context =
    useContext(ContributionRuleContext);

  if (!context) {

    throw new Error(
      "useContributionRules must be used inside ContributionRuleProvider"
    );
  }

  return context;
};

export default useContributionRules;