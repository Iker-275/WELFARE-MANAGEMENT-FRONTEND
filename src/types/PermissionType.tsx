export interface CreatePermissionPayload {
  name:string;
  description:string;
}



export interface Permission {
  id:string;
  name:string;
  description:string;
  createdAt:string;
}



export interface PermissionResponse {
  success:boolean;
  message?:string;
  data?:Permission;
}



export interface PermissionsResponse {
  success:boolean;
  data:Permission[];
}