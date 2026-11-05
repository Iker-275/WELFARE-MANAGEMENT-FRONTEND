import { useContext } from "react";

import {
    ContributionPeriodContext,
} from "../context/ContributionPeriodContext";

export const useContributionPeriods = () => {
    const context = useContext(ContributionPeriodContext);

    if (!context) {
        throw new Error(
            "useContributionPeriods must be used inside ContributionPeriodProvider"
        );
    }

    return context;
};