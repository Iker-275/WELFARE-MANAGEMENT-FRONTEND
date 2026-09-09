import api from "./api";

import {
  ImportTypesResponse,
} from "../types/ImportType";

export const importTypeService = {

  /**
   * Get all available import types.
   *
   * GET /imports/types
   */
  getAll: async (): Promise<ImportTypesResponse> => {

    const { data } =
      await api.get<ImportTypesResponse>(
        "/imports/types"
      );

    return data;
  },
};

export default importTypeService;