// export interface Employment {
//   id: string;
//   memberId: string;

//   employeeNumber: string;
//   employmentStatus: string;

//   employerName: string;
//   jobTitle: string;

//   employmentStartAt: string | null;
//   employmentEndAt: string | null;

//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateEmploymentPayload {
//   employeeNumber: string;
//   employerName: string;
//   jobTitle: string;
// }

// export interface UpdateEmploymentPayload {
//   employeeNumber: string;
//   employerName: string;
//   jobTitle: string;
// }

// export interface EmploymentResponse {
//   success: boolean;
//   message: string;
//   data: Employment | null;
// }

// export interface EmploymentActionResponse {
//   success: boolean;
//   message: string;
//   data: null;
// }

/* =====================================================
 * EMPLOYMENT
 * ===================================================== */

export interface Employment {
  id: string;

  memberId: string;

  employeeNumber: string;

  employmentStatus: string;

  employerName: string;

  jobTitle: string;

  employmentStartAt: string | null;

  employmentEndAt: string | null;

  createdAt: string;

  updatedAt: string;
}

/* =====================================================
 * PAYLOADS
 * ===================================================== */

export interface CreateEmploymentPayload {
  employeeNumber: string;

  employerName: string;

  jobTitle: string;
}

export interface UpdateEmploymentPayload {
  employeeNumber: string;

  employerName: string;

  jobTitle: string;
}

/* =====================================================
 * RESPONSES
 * ===================================================== */

export interface EmploymentResponse {
  success: boolean;

  message: string;

  data: Employment | null;
}

export interface EmploymentActionResponse {
  success: boolean;

  message: string;

  data: null;
}