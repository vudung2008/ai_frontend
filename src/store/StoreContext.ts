import { createContext } from "react";
import type { StoreState } from "./StoreProvider";

export const StoreContext = createContext<StoreState | undefined>(undefined);
