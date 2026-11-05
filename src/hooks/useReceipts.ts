import { useContext } from "react";
import { ReceiptContext } from "../context/ReceiptContext";

export const useReceiptContext = () => {
    const context = useContext(ReceiptContext);

    if (!context) {
        throw new Error(
            "useReceiptContext must be used within a ReceiptProvider"
        );
    }

    return context;
};