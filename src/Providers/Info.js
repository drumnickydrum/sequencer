import React, { useState } from 'react';

export const Info = React.createContext();
export const InfoProvider = ({ children }) => {
  const [info, setInfo] = useState({ h: '', i: null, p: '', show: false });
  return <Info.Provider value={{ info, setInfo }}>{children}</Info.Provider>;
};
