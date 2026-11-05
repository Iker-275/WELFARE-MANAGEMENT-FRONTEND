
import { useContext } from "react";

import { PaymentProviderContext } from "../context/PaymentProviderContext";

export const usePaymentProviders = () => {
    const context = useContext(PaymentProviderContext);

    if (!context) {
        throw new Error(
            "usePaymentProviders must be used within a PaymentProviderProvider",
        );
    }

    return context;
};
