
import { useEffect, useState, } from "react";
import { useParams, useNavigate, } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { usePermissions, } from "../../hooks/usePermission";
import { useRoles, } from "../../hooks/useRoles";
import RolePermissionGrid from "../../components/customComponents/RolePermissionGrid";


export default function RolePermissionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { permissions, fetchPermissions, } = usePermissions();
    const { fetchRolePermissions, permissions: rolePermissions, syncPermissions, loading, message } = useRoles();

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);


    const [pageLoading, setPageLoading] = useState(true);


    const loadData = async () => {
        try {
            setPageLoading(true);
            await fetchPermissions();
            await fetchRolePermissions(
                id!
            );
        }
        finally {
            setPageLoading(false);
        }
    };
    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);


    useEffect(() => {
        const existingIds = rolePermissions.map(
            permission =>
                permission.permissionId
        );

        setSelectedPermissions(
            existingIds
        )

    }, [
        rolePermissions
    ]);


    const handleSync = async () => {
        const success = await syncPermissions(
            id!,
            selectedPermissions
        );
        if (success) {
            setTimeout(() => {
                navigate("/roles");
            }, 1000);
        }
    };

    if (pageLoading) {
        return (<div className="py-10 text-center">  Loading permissions...</div>);
    }

    return (
        <ComponentCard title="Role Permissions">
            <div className="space-y-6">
                {message && (<div className="text-sm">{message}</div>)}

                <RolePermissionGrid
                    permissions={permissions}
                    selectedPermissions={selectedPermissions}
                    onChange={setSelectedPermissions} />

                <div className="flex justify-end">
                    <Button
                        onClick={handleSync}
                        disabled={loading}>
                        {loading ? "Syncing..." : "Save Permissions"}

                    </Button>
                </div>
            </div>
        </ComponentCard>
    );
}