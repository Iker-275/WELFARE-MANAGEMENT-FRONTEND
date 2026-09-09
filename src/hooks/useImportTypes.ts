import { useContext } from "react";

import {
  ImportTypeContext,
} from "../context/ImportTypeContext";

export const useImportTypes = () => {

  const context =
    useContext(ImportTypeContext);

  if (!context) {
    throw new Error(
      "useImportTypes must be used inside ImportTypeProvider"
    );
  }

  return context;
};