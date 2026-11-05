import { PenaltyContext } from "../context/PenaltyContext";
import { useContext } from "react";

export const usePenaltyContext = () => {
    const context = useContext(PenaltyContext);

    if (!context) {
        throw new Error(
            "usePenaltyContext must be used within a PenaltyProvider",
        );
    }

    return context;
};



