import {
  useContext,
} from "react";

import {
  GenderContext,
} from "../context/GenderContext";

export const useGenders = () => {

  const context =
    useContext(
      GenderContext
    );

  if (!context) {

    throw new Error(
      "useGenders must be used inside GenderProvider"
    );
  }

  return context;
};