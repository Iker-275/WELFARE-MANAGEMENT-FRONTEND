import { useNavigate } from "react-router-dom";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import PaymentProviderForm from "../../components/customforms/PaymentProviderForm";

import { usePaymentProviders } from "../../hooks/usePaymentProviders";

import { CreatePaymentProviderDto } from "../../types/PaymentProviderType";

const CreatePaymentProviderPage = () => {
  const navigate = useNavigate();

  const {
    createPaymentProvider,
    loading,
    message,
    clearMessage,
  } = usePaymentProviders();

  const handleSubmit = async (data: CreatePaymentProviderDto) => {
    clearMessage();

    const provider = await createPaymentProvider(data);

    if (provider) {
      navigate("/payment-providers");
    }
  };

  return (
    <>
      <PageMeta
        title="Create Payment Provider"
        description="Create a new payment provider"
      />

      <PageBreadcrumb pageTitle="Create Payment Provider" />

      <div className="space-y-6">
        <ComponentCard
          title="Create Payment Provider"
          desc="Enter the details below to register a new payment provider."
        >
          {message && (
            <div className="mb-5 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-800 dark:bg-error-500/10 dark:text-error-400">
              {message}
            </div>
          )}

          <PaymentProviderForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default CreatePaymentProviderPage;