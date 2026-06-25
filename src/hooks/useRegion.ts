import { useContext } from "react";
import { RegionContext } from "../context/RegionContext";

export const useRegion = () => {
  const context =
    useContext(RegionContext);

  if (!context) {
    throw new Error(
      "useRegion must be used within RegionProvider"
    );
  }

  return context;
};