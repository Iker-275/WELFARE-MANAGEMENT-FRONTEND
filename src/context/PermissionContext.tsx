import { createContext, ReactNode, useEffect, useState } from "react";
import { Permission, CreatePermissionPayload } from "../types/PermissionType";
import { permissionService } from "../api/PermissionApi";


interface PermissionContextType {
    permissions: Permission[];
    loading: boolean;
    message: string;
    setMessage:
    React.Dispatch<
        React.SetStateAction<string>
    >;

    fetchPermissions: () => Promise<void>;


    createPermission: (payload: CreatePermissionPayload) => Promise<boolean>;
}

export const PermissionContext = createContext<PermissionContextType | null>(null);

export const PermissionProvider = ({ children }: { children: ReactNode; }) => {

    const [permissions, setPermissions] = useState<Permission[]>([]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const response = await permissionService.getAll();
            setPermissions(response.data);
        }
        catch (error: any) {
            setMessage(error.response?.data?.message || "Failed to fetch permissions");
        }

        finally {
            setLoading(false);
        }
    };

    const createPermission = async (payload: CreatePermissionPayload) => {

        try {
            setLoading(true);

            const response = await permissionService.create(payload);

            setMessage(response.message || "Permission created successfully");
            await fetchPermissions();
            return response.success;
        }

        catch (error: any) {
            setMessage(error.response?.data?.message || "Failed to create permission");
            return false;
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return (
        <PermissionContext.Provider
            value={{
                permissions,
                loading,
                message,
                setMessage,
                fetchPermissions,
                createPermission
            }}>
            {children}
        </PermissionContext.Provider>
    );

};