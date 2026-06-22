import { useContext } from "react";
import { PermissionContext } from "../context/PermissionContext";
export const usePermissions = () => {

    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermissions must be used inside PermissionProvider");
    }
    return context;

};