import { useContext } from "react";

import { PenaltyRuleContext } from "../context/PenaltyRuleContext";

export const usePenaltyRules = () => {
    const context = useContext(PenaltyRuleContext);

    if (!context) {
        throw new Error(
            "usePenaltyRules must be used within a PenaltyRuleProvider",
        );
    }

    return context;
};