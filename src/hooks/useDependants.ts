import { useContext } from "react";

import {
  DependantContext,
} from "../context/DependantContext";

export const useDependants = () => {

  const context =
    useContext(DependantContext);

  if (!context) {
    throw new Error(
      "useDependants must be used inside DependantProvider"
    );
  }

  return context;
};