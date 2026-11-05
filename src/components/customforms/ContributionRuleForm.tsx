// import {
//   FormEvent,
//   useEffect,
//   useState,
// } from "react";

// import ComponentCard from "../common/ComponentCard";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Button from "../ui/button/Button";

// import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
// import ContributionRuleScopeDropdown from "../customDropdowns/ContributionRuleScopeDropdown";
// import ContributionRuleFrequencyDropdown from "../customDropdowns/ContributionRuleFrequencyDropdown";
// import ContributionRuleDeadlineTypeDropdown from "../customDropdowns/ContributionRuleDeadlineTypeDropdown";
// import ContributionRuleWeekdayDropdown from "../customDropdowns/ContributionRuleWeekdayDropdown";

// import type {
//   ContributionRule,
//   ContributionRuleScope,
//   ContributionRuleFrequency,
//   ContributionRuleDeadlineType,
//   CreateContributionRuleDto,
// } from "../../types/ContributionRuleType";

// interface ContributionRuleFormData {
//   planId: string;
//   name: string;
//   scopeType: ContributionRuleScope;
//   regionId: string;
//   branchId: string;
//   chapterId: string;
//   groupId: string;
//   memberId: string;
//   amount: string;
//   currency: string;
//   frequencyOverride: ContributionRuleFrequency | "";
//   deadlineType: ContributionRuleDeadlineType;
//   deadlineDay: string;
//   deadlineWeekday: string;
//   deadlineWeek: string;
//   deadlineOffsetDays: string;
//   effectiveFrom: string;
//   effectiveTo: string;
//   priority: string;
//   isActive: boolean;
// }

// interface ContributionRuleFormErrors {
//   [key: string]: string;
// }

// interface ContributionRuleFormProps {
//   mode: "create" | "edit";
//   initialData?: ContributionRule;
//   onSubmit: (
//     payload: CreateContributionRuleDto
//   ) => Promise<boolean>;
// }

// const getInitialFormData = (
//   rule?: ContributionRule
// ): ContributionRuleFormData => ({
//   planId: rule?.planId ?? "",
//   name: rule?.name ?? "",
//   scopeType: rule?.scopeType ?? "GLOBAL",
//   regionId: rule?.regionId ?? "",
//   branchId: rule?.branchId ?? "",
//   chapterId: rule?.chapterId ?? "",
//   groupId: rule?.groupId ?? "",
//   memberId: rule?.memberId ?? "",
//   amount: rule ? String(rule.amount) : "",
//   currency: rule?.currency ?? "KES",
//   frequencyOverride: rule?.frequencyOverride ?? "",
//   deadlineType: rule?.deadlineType ?? "FIXED_DAY_OF_MONTH",
//   deadlineDay: rule?.deadlineDay != null
//     ? String(rule.deadlineDay)
//     : "",
//   deadlineWeekday: rule?.deadlineWeekday != null
//     ? String(rule.deadlineWeekday)
//     : "",
//   deadlineWeek: rule?.deadlineWeek != null
//     ? String(rule.deadlineWeek)
//     : "",
//   deadlineOffsetDays: rule?.deadlineOffsetDays != null
//     ? String(rule.deadlineOffsetDays)
//     : "",
//   effectiveFrom: rule?.effectiveFrom?.slice(0, 10) ?? "",
//   effectiveTo: rule?.effectiveTo?.slice(0, 10) ?? "",
//   priority: rule ? String(rule.priority) : "0",
//   isActive: rule?.isActive ?? true,
// });

// export default function ContributionRuleForm({
//   mode,
//   initialData,
//   onSubmit,
// }: ContributionRuleFormProps) {
//   const [formData, setFormData] =
//     useState<ContributionRuleFormData>(
//       () => getInitialFormData(initialData)
//     );

//   const [errors, setErrors] =
//     useState<ContributionRuleFormErrors>({});

//   const [submitting, setSubmitting] =
//     useState(false);

//   useEffect(() => {
//     setFormData(getInitialFormData(initialData));
//     setErrors({});
//   }, [initialData]);

//   const updateField = <
//     K extends keyof ContributionRuleFormData
//   >(
//     field: K,
//     value: ContributionRuleFormData[K]
//   ) => {
//     setFormData((previous) => ({
//       ...previous,
//       [field]: value,
//     }));

//     setErrors((previous) => ({
//       ...previous,
//       [field]: "",
//     }));
//   };

//   const validate = (): boolean => {
//     const validationErrors: ContributionRuleFormErrors = {};

//     if (!formData.planId) {
//       validationErrors.planId =
//         "Contribution plan is required.";
//     }

//     if (!formData.name.trim()) {
//       validationErrors.name =
//         "Rule name is required.";
//     }

//     if (!formData.amount || Number(formData.amount) <= 0) {
//       validationErrors.amount =
//         "Enter a valid contribution amount.";
//     }

//     if (!formData.currency.trim()) {
//       validationErrors.currency =
//         "Currency is required.";
//     }

//     if (!formData.effectiveFrom) {
//       validationErrors.effectiveFrom =
//         "Effective from date is required.";
//     }

//     if (
//       formData.effectiveTo &&
//       formData.effectiveTo < formData.effectiveFrom
//     ) {
//       validationErrors.effectiveTo =
//         "Effective to date cannot be before effective from date.";
//     }

//     if (
//       formData.scopeType === "REGION" &&
//       !formData.regionId
//     ) {
//       validationErrors.regionId =
//         "Region is required for this scope.";
//     }

//     if (
//       formData.scopeType === "BRANCH" &&
//       !formData.branchId
//     ) {
//       validationErrors.branchId =
//         "Branch is required for this scope.";
//     }

//     if (
//       formData.scopeType === "CHAPTER" &&
//       !formData.chapterId
//     ) {
//       validationErrors.chapterId =
//         "Chapter is required for this scope.";
//     }

//     if (
//       formData.scopeType === "GROUP" &&
//       !formData.groupId
//     ) {
//       validationErrors.groupId =
//         "Group is required for this scope.";
//     }

//     if (
//       formData.scopeType === "MEMBER" &&
//       !formData.memberId
//     ) {
//       validationErrors.memberId =
//         "Member is required for this scope.";
//     }

//     if (
//       formData.deadlineType === "FIXED_DAY_OF_MONTH" &&
//       (
//         !formData.deadlineDay ||
//         Number(formData.deadlineDay) < 1 ||
//         Number(formData.deadlineDay) > 31
//       )
//     ) {
//       validationErrors.deadlineDay =
//         "Enter a day between 1 and 31.";
//     }

//     if (
//       formData.deadlineType === "NTH_WEEKDAY"
//     ) {
//       if (
//         !formData.deadlineWeek ||
//         Number(formData.deadlineWeek) < 1 ||
//         Number(formData.deadlineWeek) > 5
//       ) {
//         validationErrors.deadlineWeek =
//           "Enter a valid weekday occurrence.";
//       }

//       if (!formData.deadlineWeekday) {
//         validationErrors.deadlineWeekday =
//           "Select a weekday.";
//       }
//     }

//     if (
//       (
//         formData.deadlineType === "DAYS_AFTER_PERIOD_START" ||
//         formData.deadlineType === "DAYS_BEFORE_PERIOD_END"
//       ) &&
//       (
//         formData.deadlineOffsetDays === "" ||
//         Number(formData.deadlineOffsetDays) < 0
//       )
//     ) {
//       validationErrors.deadlineOffsetDays =
//         "Enter a valid number of days.";
//     }

//     if (
//       formData.priority === "" ||
//       Number(formData.priority) < 0
//     ) {
//       validationErrors.priority =
//         "Priority cannot be negative.";
//     }

//     setErrors(validationErrors);

//     return Object.keys(validationErrors).length === 0;
//   };

//   const handleSubmit = async (
//     event: FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     if (!validate()) {
//       return;
//     }

//     const payload: CreateContributionRuleDto = {
//       planId: formData.planId,
//       name: formData.name.trim(),
//       scopeType: formData.scopeType,
//       regionId:
//         formData.scopeType === "REGION"
//           ? formData.regionId
//           : null,
//       branchId:
//         formData.scopeType === "BRANCH"
//           ? formData.branchId
//           : null,
//       chapterId:
//         formData.scopeType === "CHAPTER"
//           ? formData.chapterId
//           : null,
//       groupId:
//         formData.scopeType === "GROUP"
//           ? formData.groupId
//           : null,
//       memberId:
//         formData.scopeType === "MEMBER"
//           ? formData.memberId
//           : null,
//       amount: Number(formData.amount),
//       currency: formData.currency.trim(),
//       frequencyOverride:
//         formData.frequencyOverride || null,
//       deadlineType: formData.deadlineType,
//       deadlineDay:
//         formData.deadlineType === "FIXED_DAY_OF_MONTH"
//           ? Number(formData.deadlineDay)
//           : null,
//       deadlineWeekday:
//         formData.deadlineType === "NTH_WEEKDAY"
//           ? Number(formData.deadlineWeekday)
//           : null,
//       deadlineWeek:
//         formData.deadlineType === "NTH_WEEKDAY"
//           ? Number(formData.deadlineWeek)
//           : null,
//       deadlineOffsetDays:
//         formData.deadlineType === "DAYS_AFTER_PERIOD_START" ||
//         formData.deadlineType === "DAYS_BEFORE_PERIOD_END"
//           ? Number(formData.deadlineOffsetDays)
//           : null,
//       effectiveFrom: formData.effectiveFrom,
//       effectiveTo: formData.effectiveTo || null,
//       priority: Number(formData.priority),
//       isActive: formData.isActive,
//     };

//     setSubmitting(true);

//     try {
//       await onSubmit(payload);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <ComponentCard
//       title={
//         mode === "create"
//           ? "Create Contribution Rule"
//           : "Update Contribution Rule"
//       }
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-6"
//       >
//         {/* BASIC INFORMATION */}

//         <div>
//           <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
//             Basic Information
//           </h3>

//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <ContributionPlanDropdown
//                 value={formData.planId}
//                 onChange={(value) =>
//                   updateField("planId", value)
//                 }
//                 required
//                 error={errors.planId}
//               />
//             </div>

//             <div>
//               <Label>Rule Name</Label>

//               <Input
//                 value={formData.name}
//                 onChange={(event) =>
//                   updateField("name", event.target.value)
//                 }
//                 placeholder="Enter rule name"
//               />

//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             <div>
//               <ContributionRuleScopeDropdown
//                 value={formData.scopeType}
//                 onChange={(value) =>
//                   updateField(
//                     "scopeType",
//                     value as ContributionRuleScope
//                   )
//                 }
//                 required
//               />
//             </div>

//             <div>
//               <Label>Amount</Label>

//               <Input
//                 type="number"
//                 min="0"
//                 // step="0.01"
//                 value={formData.amount}
//                 onChange={(event) =>
//                   updateField("amount", event.target.value)
//                 }
//                 placeholder="Enter contribution amount"
//               />

//               {errors.amount && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.amount}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label>Currency</Label>

//               <Input
//                 value={formData.currency}
//                 onChange={(event) =>
//                   updateField("currency", event.target.value)
//                 }
//                 placeholder="KES"
//               />

//               {errors.currency && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.currency}
//                 </p>
//               )}
//             </div>

//             <div>
//               <ContributionRuleFrequencyDropdown
//                 value={formData.frequencyOverride}
//                 onChange={(value) =>
//                   updateField(
//                     "frequencyOverride",
//                     value as ContributionRuleFrequency | ""
//                   )
//                 }
//                 placeholder="Use plan frequency"
//               />
//             </div>
//           </div>
//         </div>

//         {/* SCOPE INFORMATION */}

//         {formData.scopeType !== "GLOBAL" && (
//           <div>
//             <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
//               Scope Information
//             </h3>

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//               {formData.scopeType === "REGION" && (
//                 <div>
//                   <Label>Region ID</Label>
//                   <Input
//                     value={formData.regionId}
//                     onChange={(event) =>
//                       updateField("regionId", event.target.value)
//                     }
//                     placeholder="Enter region ID"
//                   />
//                   {errors.regionId && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.regionId}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {formData.scopeType === "BRANCH" && (
//                 <div>
//                   <Label>Branch ID</Label>
//                   <Input
//                     value={formData.branchId}
//                     onChange={(event) =>
//                       updateField("branchId", event.target.value)
//                     }
//                     placeholder="Enter branch ID"
//                   />
//                   {errors.branchId && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.branchId}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {formData.scopeType === "CHAPTER" && (
//                 <div>
//                   <Label>Chapter ID</Label>
//                   <Input
//                     value={formData.chapterId}
//                     onChange={(event) =>
//                       updateField("chapterId", event.target.value)
//                     }
//                     placeholder="Enter chapter ID"
//                   />
//                   {errors.chapterId && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.chapterId}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {formData.scopeType === "GROUP" && (
//                 <div>
//                   <Label>Group ID</Label>
//                   <Input
//                     value={formData.groupId}
//                     onChange={(event) =>
//                       updateField("groupId", event.target.value)
//                     }
//                     placeholder="Enter group ID"
//                   />
//                   {errors.groupId && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.groupId}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {formData.scopeType === "MEMBER" && (
//                 <div>
//                   <Label>Member ID</Label>
//                   <Input
//                     value={formData.memberId}
//                     onChange={(event) =>
//                       updateField("memberId", event.target.value)
//                     }
//                     placeholder="Enter member ID"
//                   />
//                   {errors.memberId && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.memberId}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* DEADLINE CONFIGURATION */}

//         <div>
//           <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
//             Deadline Configuration
//           </h3>

//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <ContributionRuleDeadlineTypeDropdown
//                 value={formData.deadlineType}
//                 onChange={(value) =>
//                   updateField(
//                     "deadlineType",
//                     value as ContributionRuleDeadlineType
//                   )
//                 }
//                 required
//               />
//             </div>

//             {formData.deadlineType === "FIXED_DAY_OF_MONTH" && (
//               <div>
//                 <Label>Day of Month</Label>
//                 <Input
//                   type="number"
//                   min="1"
//                   max="31"
//                   value={formData.deadlineDay}
//                   onChange={(event) =>
//                     updateField("deadlineDay", event.target.value)
//                   }
//                   placeholder="1 - 31"
//                 />
//                 {errors.deadlineDay && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.deadlineDay}
//                   </p>
//                 )}
//               </div>
//             )}

//             {formData.deadlineType === "NTH_WEEKDAY" && (
//               <>
//                 <div>
//                   <Label>Week Occurrence</Label>
//                   <Input
//                     type="number"
//                     min="1"
//                     max="5"
//                     value={formData.deadlineWeek}
//                     onChange={(event) =>
//                       updateField("deadlineWeek", event.target.value)
//                     }
//                     placeholder="1 - 5"
//                   />
//                   {errors.deadlineWeek && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.deadlineWeek}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <ContributionRuleWeekdayDropdown
//                     value={formData.deadlineWeekday}
//                     onChange={(value) =>
//                       updateField("deadlineWeekday", value)
//                     }
//                     required
//                     error={errors.deadlineWeekday}
//                   />
//                 </div>
//               </>
//             )}

//             {(
//               formData.deadlineType === "DAYS_AFTER_PERIOD_START" ||
//               formData.deadlineType === "DAYS_BEFORE_PERIOD_END"
//             ) && (
//               <div>
//                 <Label>Offset Days</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={formData.deadlineOffsetDays}
//                   onChange={(event) =>
//                     updateField(
//                       "deadlineOffsetDays",
//                       event.target.value
//                     )
//                   }
//                   placeholder="Enter number of days"
//                 />
//                 {errors.deadlineOffsetDays && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.deadlineOffsetDays}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* EFFECTIVE DATES AND PRIORITY */}

//         <div>
//           <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
//             Effective Dates and Priority
//           </h3>

//           <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//             <div>
//               <Label>Effective From</Label>
//               <Input
//                 type="date"
//                 value={formData.effectiveFrom}
//                 onChange={(event) =>
//                   updateField("effectiveFrom", event.target.value)
//                 }
//               />
//               {errors.effectiveFrom && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.effectiveFrom}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label>Effective To</Label>
//               <Input
//                 type="date"
//                 value={formData.effectiveTo}
//                 onChange={(event) =>
//                   updateField("effectiveTo", event.target.value)
//                 }
//               />
//               {errors.effectiveTo && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.effectiveTo}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label>Priority</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 value={formData.priority}
//                 onChange={(event) =>
//                   updateField("priority", event.target.value)
//                 }
//                 placeholder="Enter priority"
//               />
//               {errors.priority && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.priority}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-3 pt-7">
//               <input
//                 id="isActive"
//                 type="checkbox"
//                 checked={formData.isActive}
//                 onChange={(event) =>
//                   updateField("isActive", event.target.checked)
//                 }
//                 className="h-4 w-4 rounded border-gray-300"
//               />

//               <Label>
//                 Active Rule
//               </Label>
//             </div>
//           </div>
//         </div>

//         {/* FORM ACTION */}

//         <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
//           <Button disabled={submitting}>
//             {submitting
//               ? "Saving..."
//               : mode === "create"
//                 ? "Create Contribution Rule"
//                 : "Update Contribution Rule"}
//           </Button>
//         </div>
//       </form>
//     </ComponentCard>
//   );
// }


import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import ContributionPlanDropdown from "../customDropdowns/ContributionPlanDropdown";
import ContributionRuleScopeDropdown from "../customDropdowns/ContributionRuleScopeDropdown";
import ContributionRuleFrequencyDropdown from "../customDropdowns/ContributionRuleFrequencyDropdown";
import ContributionRuleDeadlineTypeDropdown from "../customDropdowns/ContributionRuleDeadlineTypeDropdown";
import ContributionRuleWeekdayDropdown from "../customDropdowns/ContributionRuleWeekdayDropdown";

import type {
  ContributionRule,
  ContributionRuleScope,
  ContributionRuleFrequency,
  ContributionRuleDeadlineType,
  CreateContributionRuleDto,
} from "../../types/ContributionRuleType";

interface ContributionRuleFormData {
  planId: string;
  name: string;
  scopeType: ContributionRuleScope;
  regionId: string;
  branchId: string;
  chapterId: string;
  groupId: string;
  memberId: string;
  amount: string;
  currency: string;
  frequencyOverride: ContributionRuleFrequency | "";
  deadlineType: ContributionRuleDeadlineType;
  deadlineDay: string;
  deadlineWeekday: string;
  deadlineWeek: string;
  deadlineOffsetDays: string;
  effectiveFrom: string;
  effectiveTo: string;
  priority: string;
  isActive: boolean;
}

interface ContributionRuleFormErrors {
  [key: string]: string;
}

interface ContributionRuleFormProps {
  mode: "create" | "edit";
  initialData?: ContributionRule;
  onSubmit: (
    payload: CreateContributionRuleDto
  ) => Promise<boolean>;
}

/*
 * ============================================================
 * INITIAL FORM DATA
 * ============================================================
 */

const getInitialFormData = (
  rule?: ContributionRule
): ContributionRuleFormData => ({
  planId: rule?.planId ?? "",
  name: rule?.name ?? "",
  scopeType: rule?.scopeType ?? "GLOBAL",
  regionId: rule?.regionId ?? "",
  branchId: rule?.branchId ?? "",
  chapterId: rule?.chapterId ?? "",
  groupId: rule?.groupId ?? "",
  memberId: rule?.memberId ?? "",
  amount: rule ? String(rule.amount) : "",
  currency: rule?.currency ?? "KES",
  frequencyOverride: rule?.frequencyOverride ?? "",
  deadlineType: rule?.deadlineType ?? "FIXED_DAY_OF_MONTH",

  deadlineDay:
    rule?.deadlineDay != null
      ? String(rule.deadlineDay)
      : "",

  deadlineWeekday:
    rule?.deadlineWeekday != null
      ? String(rule.deadlineWeekday)
      : "",

  deadlineWeek:
    rule?.deadlineWeek != null
      ? String(rule.deadlineWeek)
      : "",

  deadlineOffsetDays:
    rule?.deadlineOffsetDays != null
      ? String(rule.deadlineOffsetDays)
      : "",

  effectiveFrom: rule?.effectiveFrom?.slice(0, 10) ?? "",
  effectiveTo: rule?.effectiveTo?.slice(0, 10) ?? "",
  priority: rule ? String(rule.priority) : "0",
  isActive: rule?.isActive ?? true,
});

/*
 * ============================================================
 * DATE CONVERSION
 * ============================================================
 */

const toStartOfUtcDay = (date: string): string => {
  return new Date(
    `${date}T00:00:00.000Z`
  ).toISOString();
};

const toEndOfUtcDay = (date: string): string => {
  return new Date(
    `${date}T23:59:59.999Z`
  ).toISOString();
};

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function ContributionRuleForm({
  mode,
  initialData,
  onSubmit,
}: ContributionRuleFormProps) {
  const [formData, setFormData] =
    useState<ContributionRuleFormData>(
      () => getInitialFormData(initialData)
    );

  const [errors, setErrors] =
    useState<ContributionRuleFormErrors>({});

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * ============================================================
   * INITIALIZE FORM
   * ============================================================
   */

  useEffect(() => {
    setFormData(getInitialFormData(initialData));
    setErrors({});
  }, [initialData]);

  /*
   * ============================================================
   * UPDATE FIELD
   * ============================================================
   */

  const updateField = <
    K extends keyof ContributionRuleFormData
  >(
    field: K,
    value: ContributionRuleFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  const validate = (): boolean => {
    const validationErrors: ContributionRuleFormErrors = {};

    if (!formData.planId) {
      validationErrors.planId =
        "Contribution plan is required.";
    }

    if (!formData.name.trim()) {
      validationErrors.name =
        "Rule name is required.";
    }

    if (
      !formData.amount ||
      !Number.isFinite(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      validationErrors.amount =
        "Enter a valid contribution amount.";
    }

    if (!formData.currency.trim()) {
      validationErrors.currency =
        "Currency is required.";
    }

    if (!formData.effectiveFrom) {
      validationErrors.effectiveFrom =
        "Effective from date is required.";
    } else if (
      Number.isNaN(
        new Date(
          `${formData.effectiveFrom}T00:00:00.000Z`
        ).getTime()
      )
    ) {
      validationErrors.effectiveFrom =
        "Enter a valid effective from date.";
    }

    if (
      formData.effectiveTo &&
      formData.effectiveTo < formData.effectiveFrom
    ) {
      validationErrors.effectiveTo =
        "Effective to date cannot be before effective from date.";
    }

    if (
      formData.scopeType === "REGION" &&
      !formData.regionId
    ) {
      validationErrors.regionId =
        "Region is required for this scope.";
    }

    if (
      formData.scopeType === "BRANCH" &&
      !formData.branchId
    ) {
      validationErrors.branchId =
        "Branch is required for this scope.";
    }

    if (
      formData.scopeType === "CHAPTER" &&
      !formData.chapterId
    ) {
      validationErrors.chapterId =
        "Chapter is required for this scope.";
    }

    if (
      formData.scopeType === "GROUP" &&
      !formData.groupId
    ) {
      validationErrors.groupId =
        "Group is required for this scope.";
    }

    if (
      formData.scopeType === "MEMBER" &&
      !formData.memberId
    ) {
      validationErrors.memberId =
        "Member is required for this scope.";
    }

    if (
      formData.deadlineType === "FIXED_DAY_OF_MONTH" &&
      (
        !formData.deadlineDay ||
        Number(formData.deadlineDay) < 1 ||
        Number(formData.deadlineDay) > 31
      )
    ) {
      validationErrors.deadlineDay =
        "Enter a day between 1 and 31.";
    }

    if (formData.deadlineType === "NTH_WEEKDAY") {
      if (
        !formData.deadlineWeek ||
        Number(formData.deadlineWeek) < 1 ||
        Number(formData.deadlineWeek) > 5
      ) {
        validationErrors.deadlineWeek =
          "Enter a valid weekday occurrence.";
      }

      if (!formData.deadlineWeekday) {
        validationErrors.deadlineWeekday =
          "Select a weekday.";
      }
    }

    if (
      (
        formData.deadlineType === "DAYS_AFTER_PERIOD_START" ||
        formData.deadlineType === "DAYS_BEFORE_PERIOD_END"
      ) &&
      (
        formData.deadlineOffsetDays === "" ||
        Number(formData.deadlineOffsetDays) < 0
      )
    ) {
      validationErrors.deadlineOffsetDays =
        "Enter a valid number of days.";
    }

    if (
      formData.priority === "" ||
      Number(formData.priority) < 0
    ) {
      validationErrors.priority =
        "Priority cannot be negative.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /*
   * ============================================================
   * SUBMIT FORM
   * ============================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: CreateContributionRuleDto = {
      planId: formData.planId,
      name: formData.name.trim(),
      scopeType: formData.scopeType,

      regionId:
        formData.scopeType === "REGION"
          ? formData.regionId
          : null,

      branchId:
        formData.scopeType === "BRANCH"
          ? formData.branchId
          : null,

      chapterId:
        formData.scopeType === "CHAPTER"
          ? formData.chapterId
          : null,

      groupId:
        formData.scopeType === "GROUP"
          ? formData.groupId
          : null,

      memberId:
        formData.scopeType === "MEMBER"
          ? formData.memberId
          : null,

      amount: Number(formData.amount),
      currency: formData.currency.trim(),

      frequencyOverride:
        formData.frequencyOverride || null,

      deadlineType: formData.deadlineType,

      deadlineDay:
        formData.deadlineType === "FIXED_DAY_OF_MONTH"
          ? Number(formData.deadlineDay)
          : null,

      deadlineWeekday:
        formData.deadlineType === "NTH_WEEKDAY"
          ? Number(formData.deadlineWeekday)
          : null,

      deadlineWeek:
        formData.deadlineType === "NTH_WEEKDAY"
          ? Number(formData.deadlineWeek)
          : null,

      deadlineOffsetDays:
        formData.deadlineType === "DAYS_AFTER_PERIOD_START" ||
        formData.deadlineType === "DAYS_BEFORE_PERIOD_END"
          ? Number(formData.deadlineOffsetDays)
          : null,

      // Send complete ISO-8601 DateTime values to Prisma.
      effectiveFrom: toStartOfUtcDay(
        formData.effectiveFrom
      ),

      effectiveTo: formData.effectiveTo
        ? toEndOfUtcDay(formData.effectiveTo)
        : null,

      priority: Number(formData.priority),
      isActive: formData.isActive,
    };

    setSubmitting(true);

    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <ComponentCard
      title={
        mode === "create"
          ? "Create Contribution Rule"
          : "Update Contribution Rule"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BASIC INFORMATION */}

        <div>
          <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <ContributionPlanDropdown
                value={formData.planId}
                onChange={(value) =>
                  updateField("planId", value)
                }
                required
                error={errors.planId}
              />
            </div>

            <div>
              <Label>Rule Name</Label>

              <Input
                value={formData.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Enter rule name"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <ContributionRuleScopeDropdown
                value={formData.scopeType}
                onChange={(value) =>
                  updateField(
                    "scopeType",
                    value as ContributionRuleScope
                  )
                }
                required
              />
            </div>

            <div>
              <Label>Amount</Label>

              <Input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(event) =>
                  updateField("amount", event.target.value)
                }
                placeholder="Enter contribution amount"
              />

              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.amount}
                </p>
              )}
            </div>

            <div>
              <Label>Currency</Label>

              <Input
                value={formData.currency}
                onChange={(event) =>
                  updateField("currency", event.target.value)
                }
                placeholder="KES"
              />

              {errors.currency && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.currency}
                </p>
              )}
            </div>

            <div>
              <ContributionRuleFrequencyDropdown
                value={formData.frequencyOverride}
                onChange={(value) =>
                  updateField(
                    "frequencyOverride",
                    value as ContributionRuleFrequency | ""
                  )
                }
                placeholder="Use plan frequency"
              />
            </div>
          </div>
        </div>

        {/* SCOPE INFORMATION */}

        {formData.scopeType !== "GLOBAL" && (
          <div>
            <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
              Scope Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {formData.scopeType === "REGION" && (
                <div>
                  <Label>Region ID</Label>

                  <Input
                    value={formData.regionId}
                    onChange={(event) =>
                      updateField("regionId", event.target.value)
                    }
                    placeholder="Enter region ID"
                  />

                  {errors.regionId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.regionId}
                    </p>
                  )}
                </div>
              )}

              {formData.scopeType === "BRANCH" && (
                <div>
                  <Label>Branch ID</Label>

                  <Input
                    value={formData.branchId}
                    onChange={(event) =>
                      updateField("branchId", event.target.value)
                    }
                    placeholder="Enter branch ID"
                  />

                  {errors.branchId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.branchId}
                    </p>
                  )}
                </div>
              )}

              {formData.scopeType === "CHAPTER" && (
                <div>
                  <Label>Chapter ID</Label>

                  <Input
                    value={formData.chapterId}
                    onChange={(event) =>
                      updateField("chapterId", event.target.value)
                    }
                    placeholder="Enter chapter ID"
                  />

                  {errors.chapterId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.chapterId}
                    </p>
                  )}
                </div>
              )}

              {formData.scopeType === "GROUP" && (
                <div>
                  <Label>Group ID</Label>

                  <Input
                    value={formData.groupId}
                    onChange={(event) =>
                      updateField("groupId", event.target.value)
                    }
                    placeholder="Enter group ID"
                  />

                  {errors.groupId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.groupId}
                    </p>
                  )}
                </div>
              )}

              {formData.scopeType === "MEMBER" && (
                <div>
                  <Label>Member ID</Label>

                  <Input
                    value={formData.memberId}
                    onChange={(event) =>
                      updateField("memberId", event.target.value)
                    }
                    placeholder="Enter member ID"
                  />

                  {errors.memberId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.memberId}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEADLINE CONFIGURATION */}

        <div>
          <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
            Deadline Configuration
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <ContributionRuleDeadlineTypeDropdown
                value={formData.deadlineType}
                onChange={(value) =>
                  updateField(
                    "deadlineType",
                    value as ContributionRuleDeadlineType
                  )
                }
                required
              />
            </div>

            {formData.deadlineType === "FIXED_DAY_OF_MONTH" && (
              <div>
                <Label>Day of Month</Label>

                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.deadlineDay}
                  onChange={(event) =>
                    updateField("deadlineDay", event.target.value)
                  }
                  placeholder="1 - 31"
                />

                {errors.deadlineDay && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.deadlineDay}
                  </p>
                )}
              </div>
            )}

            {formData.deadlineType === "NTH_WEEKDAY" && (
              <>
                <div>
                  <Label>Week Occurrence</Label>

                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.deadlineWeek}
                    onChange={(event) =>
                      updateField("deadlineWeek", event.target.value)
                    }
                    placeholder="1 - 5"
                  />

                  {errors.deadlineWeek && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.deadlineWeek}
                    </p>
                  )}
                </div>

                <div>
                  <ContributionRuleWeekdayDropdown
                    value={formData.deadlineWeekday}
                    onChange={(value) =>
                      updateField("deadlineWeekday", value)
                    }
                    required
                    error={errors.deadlineWeekday}
                  />
                </div>
              </>
            )}

            {(
              formData.deadlineType === "DAYS_AFTER_PERIOD_START" ||
              formData.deadlineType === "DAYS_BEFORE_PERIOD_END"
            ) && (
              <div>
                <Label>Offset Days</Label>

                <Input
                  type="number"
                  min="0"
                  value={formData.deadlineOffsetDays}
                  onChange={(event) =>
                    updateField(
                      "deadlineOffsetDays",
                      event.target.value
                    )
                  }
                  placeholder="Enter number of days"
                />

                {errors.deadlineOffsetDays && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.deadlineOffsetDays}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* EFFECTIVE DATES AND PRIORITY */}

        <div>
          <h3 className="mb-4 text-base font-medium text-gray-800 dark:text-white">
            Effective Dates and Priority
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Effective From</Label>

              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(event) =>
                  updateField("effectiveFrom", event.target.value)
                }
              />

              {errors.effectiveFrom && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.effectiveFrom}
                </p>
              )}
            </div>

            <div>
              <Label>Effective To</Label>

              <Input
                type="date"
                value={formData.effectiveTo}
                onChange={(event) =>
                  updateField("effectiveTo", event.target.value)
                }
              />

              {errors.effectiveTo && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.effectiveTo}
                </p>
              )}
            </div>

            <div>
              <Label>Priority</Label>

              <Input
                type="number"
                min="0"
                value={formData.priority}
                onChange={(event) =>
                  updateField("priority", event.target.value)
                }
                placeholder="Enter priority"
              />

              {errors.priority && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.priority}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(event) =>
                  updateField("isActive", event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300"
              />

              <Label>
                Active Rule
              </Label>
            </div>
          </div>
        </div>

        {/* FORM ACTION */}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
          <Button disabled={submitting}>
            {submitting
              ? "Saving..."
              : mode === "create"
                ? "Create Contribution Rule"
                : "Update Contribution Rule"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
