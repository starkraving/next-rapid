import React, { createContext, useContext, useReducer, Dispatch } from "react";
import appReducer, { getInitialState } from "./reducer";
import { ProjectState, ProjectAction } from "../data/types";

// Define the shape of the context
interface RapidContextType {
  state: ProjectState;
  dispatch: Dispatch<ProjectAction>;
}

// Create the context with an undefined initial value
const RapidContext = createContext<RapidContextType | undefined>(undefined);

// Provider component
export const RapidContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  // Pass both state and dispatch as the context value
  const providerValue: RapidContextType = { state, dispatch };

  return <RapidContext.Provider value={providerValue}>{children}</RapidContext.Provider>;
};

// Custom hook for consuming the context
export const useRapidContext = (): RapidContextType => {
  const context = useContext(RapidContext);

  if (!context) {
    throw new Error("useRapidContext must be used within a RapidContextProvider");
  }

  return context;
};
