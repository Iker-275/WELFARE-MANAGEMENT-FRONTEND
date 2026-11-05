import { useContext } from "react";
import { MemberStatementContext } from "../context/MemberStatementContext";



export const useMemberStatementContext = () => {
    const context = useContext(MemberStatementContext);

    if (!context) {
        throw new Error(
            "useMemberStatementContext must be used within a MemberStatementProvider"
        );
    }

    return context;
};