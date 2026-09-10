export interface MembershipMetadata {
  code: string;
  name: string;
  description: string | null;
}

export interface MembershipMetadataResponse {
  success: boolean;
  message: string;
  data: MembershipMetadata[];
}

export type MembershipStatus =
  | MembershipMetadata;

export type EmploymentStatus =
  | MembershipMetadata;

export type DependantRelationship =
  | MembershipMetadata;