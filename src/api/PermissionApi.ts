import api from "./api";

import { CreatePermissionPayload } from "../types/PermissionType";


export const permissionService = {
    create: async (
        payload: CreatePermissionPayload
    ) => {
        const response = await api.post("/permissions", payload);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get("/permissions");
        return response.data;
    },
};