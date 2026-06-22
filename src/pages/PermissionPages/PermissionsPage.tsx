import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { PermissionsTable } from "../../components/tables/BasicTables/BasicTableOne";
// import { usePermissions } from "../../hooks/usePermission";



export default function PermissionsPage() {
    // const { message } = usePermissions();
    return (
        <>
            <PageMeta title="Permissions" description="System permissions" />
            <PageBreadcrumb pageTitle="Permissions" />
            <ComponentCard title="Permissions">
                {/* {message && <div className="text-sm mb-4">{message}</div>} */}

                <PermissionsTable />
            </ComponentCard>

        </>
    );
}