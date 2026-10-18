import { useContext } from "react";
import CPContext from "./CPContextBase";

export function useCP() {
  const context = useContext(CPContext);
  if (!context) throw new Error("useCP must be used within a CPProvider");
  return context;
}
