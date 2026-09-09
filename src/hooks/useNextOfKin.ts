import { useContext } from "react";

import {
  NextOfKinContext,
} from "../context/NextOfKinContext";

export const useNextOfKin = () => {

  const context =
    useContext(NextOfKinContext);

  if (!context) {
    throw new Error(
      "useNextOfKin must be used inside NextOfKinProvider"
    );
  }

  return context;
};