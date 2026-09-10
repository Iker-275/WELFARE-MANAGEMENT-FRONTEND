import {
  useContext,
} from "react";

import {
  MembershipMetadataContext,
} from "../context/MembershipMetadataContext";


export const useMembershipMetadata = () => {

  const context =
    useContext(
      MembershipMetadataContext
    );


  if (!context) {

    throw new Error(
      "useMembershipMetadata must be used inside MembershipMetadataProvider"
    );

  }


  return context;
};