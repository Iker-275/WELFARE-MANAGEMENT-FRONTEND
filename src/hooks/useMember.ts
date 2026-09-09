import { useContext } from "react";

import {
  MemberContext,
} from "../context/MemberContext";

export const useMember = () => {

  const context =
    useContext(MemberContext);

  if (!context) {

    throw new Error(
      "useMember must be used within MemberProvider"
    );
  }

  return context;
};