import { useContext } from "react";
import { MemberContributionContext } from "../context/MemberContributionContext";

export const useMemberContributions = () => {
    const context = useContext(MemberContributionContext);

    if (!context) {
        throw new Error(
            "useMemberContributions must be used within a MemberContributionProvider",
        );
    }

    return context;
};