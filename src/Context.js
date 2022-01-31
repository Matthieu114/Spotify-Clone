import React, { useState } from "react";

const Context = React.createContext();

export default Context;

export const Provider = ({ children }) => {
  const [user, setUser] = useState({});

  return <Context.Provider value={user}>{children}</Context.Provider>;
};
