import PageMeta from "../../components/common/PageMeta";

import {
  RecentOrders,
  NewCustomers,
} from "../../components/customComponents/Recents";

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import SalesVsPaymentsChart from "../../components/ecommerce/StatisticsChart";
import { useDashboard } from "../../hooks/useDashboard";

export default function Home() {
  const { dashboard, loading } = useDashboard();

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <>
      <PageMeta title="Dashboard" description="Restaurant Dashboard" />

      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics data={dashboard} />
          <SalesVsPaymentsChart data={dashboard} />
        </div>

        <div className="col-span-12">
          <RecentOrders orders={dashboard?.recentOrders || []} />
        </div>

        <div className="col-span-12">
          <NewCustomers customers={dashboard?.newCustomers || []} />
        </div>
      </div> */}
    </>
  );
}