"use client";
import { createContext, useContext, useState } from "react";

const defaultProvider = {
  showNav: false,
  showDataManual: false,
  showDownloads: false,
  showLayers: false
};

export const GlobalContext = createContext(defaultProvider);

export const useGlobalStorage = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [showNav, setShowNav] = useState(defaultProvider.showNav);
  const [showDataManual, setShowDataManual] = useState(
    defaultProvider.showDataManual
  );
  const [showDownloads, setShowDownloads] = useState(
    defaultProvider.showDownloads
  );
  const [showLayers, setShowLayers] = useState(defaultProvider.showLayers);

  const values = {
    showNav,
    setShowNav,
    showDataManual,
    setShowDataManual,
    showDownloads,
    setShowDownloads,
    showLayers,
    setShowLayers
  };

  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
