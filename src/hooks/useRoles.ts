import { useContext } from "react";

import {
  RoleContext,
} from "../context/RoleContext";


export const useRoles = () => {

  const context =
    useContext(RoleContext);

  if (!context) {

    throw new Error(
      "useRoles must be used inside RoleProvider"
    );
  }

  return context;
};