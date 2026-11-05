import { useContext } from "react";
import { PenaltyAdjustmentContext } from "../context/PenaltyAdjustmentContext";

export const usePenaltyAdjustmentContext = () => {
    const context = useContext(PenaltyAdjustmentContext);

    if (!context) {
        throw new Error(
            "usePenaltyAdjustmentContext must be used within a PenaltyAdjustmentProvider"
        );
    }

    return context;
};



