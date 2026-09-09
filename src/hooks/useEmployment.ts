import { useContext } from "react";

import {
  EmploymentContext,
} from "../context/EmploymentContext";


export const useEmployment = () => {

  const context =
    useContext(EmploymentContext);

  if (!context) {

    throw new Error(
      "useEmployment must be used inside EmploymentProvider"
    );
  }

  return context;
};