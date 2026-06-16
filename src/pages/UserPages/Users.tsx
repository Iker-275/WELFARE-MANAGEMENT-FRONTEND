import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Users() {
  
  return (
    <>
      <PageMeta
        title="Users"
        description="My users"
      />
       <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          {/* <UsersTable /> */}
          <div></div>
        </ComponentCard>
      </div>
      
    </>
  );
}
