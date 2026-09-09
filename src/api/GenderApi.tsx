import api from "./api";

import {
  GenderResponse,
} from "../types/GenderType";

export const genderApi = {

  async getGenders():
    Promise<GenderResponse> {

    const response =
      await api.get(
        "/genders"
      );

    return response.data;
  },
};

export default genderApi;