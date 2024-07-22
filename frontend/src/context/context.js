import React, { useContext } from "react";

const context = React.createContext();

export function useApplication() {
  return useContext(context);
}

export default context;
