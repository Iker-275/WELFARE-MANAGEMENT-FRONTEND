// import { FormEvent, useState } from "react";

// import {
//   CreatePaymentDto,
//   PaymentMethod,
// } from "../../types/PaymentType";

// import PaymentMemberDropdown from "../customDropdowns/PaymentMemberDropdown";
// import PaymentMethodDropdown from "../customDropdowns/PaymentMethodDropdown";
// import PaymentProviderDropdown from "../customDropdowns/PaymentProviderDropdown";

// interface PaymentFormProps {
//   onSubmit: (data: CreatePaymentDto) => void | Promise<void>;
//   memberId?: string;
//   loading?: boolean;
// }

// const PaymentForm = ({
//   onSubmit,
//   memberId,
//   loading = false,
// }: PaymentFormProps) => {
//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("KES");
//   const [method, setMethod] = useState<PaymentMethod | "">("");
//   const [providerId, setProviderId] = useState("");
//   const [externalReference, setExternalReference] = useState("");
//   const [description, setDescription] = useState("");
//   const [metadata, setMetadata] = useState("");
//   const [metadataError, setMetadataError] = useState("");

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const inputClasses =
//     "w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

//   const labelClasses =
//     "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const newErrors: Record<string, string> = {};

//     const paymentAmount = Number(amount);
//     const paymentMemberId = memberId || selectedMemberId;

//     if (!paymentMemberId) {
//       newErrors.memberId = "Please select a member.";
//     }

//     if (!amount || !Number.isFinite(paymentAmount) || paymentAmount <= 0) {
//       newErrors.amount = "Enter a valid amount greater than zero.";
//     }

//     if (!currency.trim()) {
//       newErrors.currency = "Currency is required.";
//     }

//     if (!method) {
//       newErrors.method = "Please select a payment method.";
//     }

//     if (!providerId) {
//       newErrors.providerId = "Please select a payment provider.";
//     }

//     let parsedMetadata: Record<string, unknown> | undefined;

//     if (metadata.trim()) {
//       try {
//         const parsed: unknown = JSON.parse(metadata);

//         if (
//           typeof parsed !== "object" ||
//           parsed === null ||
//           Array.isArray(parsed)
//         ) {
//           throw new Error("Metadata must be a JSON object.");
//         }

//         parsedMetadata = parsed as Record<string, unknown>;
//         setMetadataError("");
//       } catch {
//         setMetadataError("Enter valid JSON metadata as an object.");
//         newErrors.metadata = "Invalid metadata.";
//       }
//     } else {
//       setMetadataError("");
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       return;
//     }

//     const payload: CreatePaymentDto = {
//       memberId: paymentMemberId,
//       amount: paymentAmount,
//       currency: currency.trim().toUpperCase(),
//       method,
//       providerId,
//       ...(externalReference.trim() && {
//         externalReference: externalReference.trim(),
//       }),
//       ...(description.trim() && {
//         description: description.trim(),
//       }),
//       ...(parsedMetadata && { metadata: parsedMetadata }),
//     };

//     await onSubmit(payload);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//         {!memberId && (
//           <div>
//             <PaymentMemberDropdown
//               value={selectedMemberId}
//               onChange={(value) => {
//                 setSelectedMemberId(value);
//                 setErrors((prev) => ({ ...prev, memberId: "" }));
//               }}
//               label="Member"
//               placeholder="Select member"
//               disabled={loading}
//               required
//               error={errors.memberId}
//             />
//           </div>
//         )}

//         <div>
//           <label className={labelClasses}>
//             Amount <span className="text-error-500">*</span>
//           </label>

//           <input
//             type="number"
//             min="0.01"
//             step="0.01"
//             value={amount}
//             onChange={(event) => {
//               setAmount(event.target.value);
//               setErrors((prev) => ({ ...prev, amount: "" }));
//             }}
//             placeholder="Enter payment amount"
//             className={inputClasses}
//             disabled={loading}
//           />

//           {errors.amount && (
//             <p className="mt-1 text-sm text-error-500">{errors.amount}</p>
//           )}
//         </div>

//         <div>
//           <label className={labelClasses}>
//             Currency <span className="text-error-500">*</span>
//           </label>

//           <input
//             type="text"
//             value={currency}
//             onChange={(event) => {
//               setCurrency(event.target.value);
//               setErrors((prev) => ({ ...prev, currency: "" }));
//             }}
//             placeholder="e.g. KES"
//             className={inputClasses}
//             disabled={loading}
//           />

//           {errors.currency && (
//             <p className="mt-1 text-sm text-error-500">
//               {errors.currency}
//             </p>
//           )}
//         </div>

//         <div>
//           <PaymentMethodDropdown
//             value={method}
//             onChange={(value) => {
//               setMethod(value);
//               setErrors((prev) => ({ ...prev, method: "" }));
//             }}
//             label="Payment Method"
//             placeholder="Select payment method"
//             disabled={loading}
//             required
//             error={errors.method}
//           />
//         </div>

//         <div>
//           <PaymentProviderDropdown
//             value={providerId}
//             onChange={(value) => {
//               setProviderId(value);
//               setErrors((prev) => ({ ...prev, providerId: "" }));
//             }}
//             label="Payment Provider"
//             placeholder="Select payment provider"
//             disabled={loading}
//             required
//             error={errors.providerId}
//           />
//         </div>

//         <div>
//           <label className={labelClasses}>External Reference</label>

//           <input
//             type="text"
//             value={externalReference}
//             onChange={(event) => setExternalReference(event.target.value)}
//             placeholder="Enter external reference (optional)"
//             className={inputClasses}
//             disabled={loading}
//           />
//         </div>
//       </div>

//       <div>
//         <label className={labelClasses}>Description</label>

//         <textarea
//           value={description}
//           onChange={(event) => setDescription(event.target.value)}
//           placeholder="Enter payment description (optional)"
//           rows={3}
//           className={inputClasses}
//           disabled={loading}
//         />
//       </div>

//       <div>
//         <label className={labelClasses}>Metadata (JSON)</label>

//         <textarea
//           value={metadata}
//           onChange={(event) => {
//             setMetadata(event.target.value);
//             setMetadataError("");
//             setErrors((prev) => ({ ...prev, metadata: "" }));
//           }}
//           placeholder='{"source": "admin"}'
//           rows={4}
//           className={inputClasses}
//           disabled={loading}
//         />

//         {metadataError && (
//           <p className="mt-1 text-sm text-error-500">{metadataError}</p>
//         )}

//         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//           Optional additional payment information in JSON object format.
//         </p>
//       </div>

//       <div className="flex justify-end">
//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {loading ? "Processing..." : "Create Payment"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default PaymentForm;

import { FormEvent, useState } from "react";

import {
  CreatePaymentDto,
  PaymentMethod,
} from "../../types/PaymentType";

import PaymentMethodDropdown from "../customDropdowns/PaymentMethodDropdown";
import PaymentProviderDropdown from "../customDropdowns/PaymentProviderDropdown";

interface PaymentFormProps {
  memberId: string;
  onSubmit: (payload: CreatePaymentDto) => void | Promise<void>;
  loading?: boolean;
}

const PaymentForm = ({
  memberId,
  onSubmit,
  loading = false,
}: PaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [method, setMethod] = useState<PaymentMethod | "">("MPESA");
  const [providerId, setProviderId] = useState("");
  const [externalReference, setExternalReference] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const parsedAmount = Number(amount);

    if (!amount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Enter a valid amount greater than zero.";
    }

    if (!currency.trim()) {
      newErrors.currency = "Currency is required.";
    }

    if (!method) {
      newErrors.method = "Select a payment method.";
    }

    if (!providerId) {
      newErrors.providerId = "Select a payment provider.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const payload: CreatePaymentDto = {
      memberId,
      amount: Number(amount),
      currency: currency.trim().toUpperCase(),
      method: method as PaymentMethod,
      providerId,
      ...(externalReference.trim() && {
        externalReference: externalReference.trim(),
      }),
      ...(description.trim() && {
        description: description.trim(),
      }),
    };

    await onSubmit(payload);
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  const labelClasses =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const errorClasses = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClasses}>Amount</label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Enter payment amount"
          disabled={loading}
          className={inputClasses}
        />

        {errors.amount && (
          <p className={errorClasses}>{errors.amount}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Currency</label>

        <input
          type="text"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          placeholder="KES"
          maxLength={3}
          disabled={loading}
          className={inputClasses}
        />

        {errors.currency && (
          <p className={errorClasses}>{errors.currency}</p>
        )}
      </div>

      <div>
        <PaymentMethodDropdown
          value={method}
          onChange={(value) => {
            setMethod(value);
            setProviderId("");
          }}
          label="Payment Method"
          placeholder="Select payment method"
          disabled={loading}
          required
          error={errors.method}
        />
      </div>

      <div>
        <PaymentProviderDropdown
          value={providerId}
          onChange={setProviderId}
          label="Payment Provider"
          placeholder="Select payment provider"
          disabled={loading}
          required
          error={errors.providerId}
        />
      </div>

      <div>
        <label className={labelClasses}>
          External Reference (Optional)
        </label>

        <input
          type="text"
          value={externalReference}
          onChange={(event) => setExternalReference(event.target.value)}
          placeholder="Enter external payment reference"
          disabled={loading}
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>
          Description (Optional)
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter payment description"
          rows={3}
          disabled={loading}
          className={inputClasses}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;